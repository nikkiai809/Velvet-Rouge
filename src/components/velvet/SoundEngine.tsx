"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/*  Velvet Rouge — Luxury Ambient Sound Engine                         */
/*  Procedural Web Audio: no files, seamless by design, loads on       */
/*  enable. Future-ready: add soundscapes to SOUNDSCAPES below.        */
/* ------------------------------------------------------------------ */

export type SoundscapeId =
  | "night-skyline"
  | "rain"
  | "studio"
  | "ocean"
  | "city-lights";

type SoundApi = {
  enabled: boolean;
  ready: boolean;
  soundscape: SoundscapeId;
  toggle: () => void;
  setSoundscape: (id: SoundscapeId) => void;
};

const Ctx = createContext<SoundApi | null>(null);
export function useSound() {
  return useContext(Ctx);
}

const PREF_KEY = "velvet-rouge-sound";
const DEFAULT_VOLUME = 0.2; // 20%
const FADE_MS = 2600; // 2–3s fade
const DUCK_LEVEL = 0.35; // when tab hidden, multiply target by this

/* ---- Soundscape synthesis configs ----
   Each is a layer recipe. Swap/add here to extend the library. */
type Layer = {
  type: OscillatorType;
  freq: number;
  gain: number;
  detune?: number;
  lfoHz?: number; // slow gain modulation
  lfoDepth?: number;
  filterType: BiquadFilterType;
  filterFreq: number;
  filterQ?: number;
};

type Soundscape = {
  label: string;
  layers: Layer[];
  noise?: { type: BiquadFilterType; freq: number; gain: number; q?: number };
};

const SOUNDSCAPES: Record<SoundscapeId, Soundscape> = {
  "night-skyline": {
    label: "Night Skyline",
    layers: [
      { type: "sine", freq: 55, gain: 0.5, lfoHz: 0.05, lfoDepth: 0.04, filterType: "lowpass", filterFreq: 220, filterQ: 0.6 },
      { type: "sine", freq: 82.5, gain: 0.32, detune: 4, lfoHz: 0.07, lfoDepth: 0.03, filterType: "lowpass", filterFreq: 300, filterQ: 0.5 },
      { type: "sine", freq: 110, gain: 0.22, detune: -3, lfoHz: 0.04, lfoDepth: 0.02, filterType: "lowpass", filterFreq: 400 },
      { type: "triangle", freq: 220, gain: 0.08, lfoHz: 0.09, lfoDepth: 0.05, filterType: "lowpass", filterFreq: 800, filterQ: 0.7 },
    ],
    noise: { type: "bandpass", freq: 600, gain: 0.03, q: 0.6 },
  },
  rain: {
    label: "Rain",
    layers: [
      { type: "sine", freq: 49, gain: 0.4, lfoHz: 0.05, lfoDepth: 0.03, filterType: "lowpass", filterFreq: 200 },
      { type: "sine", freq: 73, gain: 0.2, filterType: "lowpass", filterFreq: 260 },
    ],
    noise: { type: "highpass", freq: 1400, gain: 0.12, q: 0.4 },
  },
  studio: {
    label: "Studio Atmosphere",
    layers: [
      { type: "sine", freq: 65, gain: 0.42, lfoHz: 0.06, lfoDepth: 0.03, filterType: "lowpass", filterFreq: 240 },
      { type: "triangle", freq: 130, gain: 0.14, lfoHz: 0.08, lfoDepth: 0.04, filterType: "lowpass", filterFreq: 600 },
    ],
    noise: { type: "bandpass", freq: 400, gain: 0.02, q: 0.5 },
  },
  ocean: {
    label: "Ocean",
    layers: [
      { type: "sine", freq: 44, gain: 0.45, lfoHz: 0.08, lfoDepth: 0.08, filterType: "lowpass", filterFreq: 200 },
      { type: "sine", freq: 88, gain: 0.2, lfoHz: 0.06, lfoDepth: 0.05, filterType: "lowpass", filterFreq: 300 },
    ],
    noise: { type: "lowpass", freq: 500, gain: 0.08, q: 0.3 },
  },
  "city-lights": {
    label: "City Lights",
    layers: [
      { type: "sine", freq: 58, gain: 0.42, lfoHz: 0.05, lfoDepth: 0.03, filterType: "lowpass", filterFreq: 240 },
      { type: "triangle", freq: 175, gain: 0.1, lfoHz: 0.1, lfoDepth: 0.05, filterType: "lowpass", filterFreq: 900 },
      { type: "sine", freq: 233, gain: 0.06, detune: 6, lfoHz: 0.12, lfoDepth: 0.04, filterType: "bandpass", filterFreq: 1000, filterQ: 1 },
    ],
    noise: { type: "bandpass", freq: 800, gain: 0.04, q: 0.5 },
  },
};

function makeNoiseBuffer(ctx: AudioContext) {
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Array<OscillatorNode | AudioBufferSourceNode>>([]);
  const noiseBufRef = useRef<AudioBuffer | null>(null);
  const enabledRef = useRef(false);
  const soundscapeRef = useRef<SoundscapeId>("night-skyline");
  const targetVolRef = useRef(DEFAULT_VOLUME);

  const [enabled, setEnabled] = useState(false);
  // hydrate synchronously during init (lazy initializer avoids setState-in-effect)
  const [ready, setReady] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return typeof parsed?.enabled === "boolean";
      }
    } catch {
      /* noop */
    }
    return false;
  });
  const [soundscape, setSoundscapeState] = useState<SoundscapeId>(() => {
    if (typeof window === "undefined") return "night-skyline";
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.soundscape && SOUNDSCAPES[parsed.soundscape as SoundscapeId]) {
          return parsed.soundscape;
        }
      }
    } catch {
      /* noop */
    }
    return "night-skyline";
  });

  // sync refs from hydrated state (no setState in effect body)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.enabled === "boolean") {
          enabledRef.current = parsed.enabled;
        }
        if (parsed?.soundscape && SOUNDSCAPES[parsed.soundscape as SoundscapeId]) {
          soundscapeRef.current = parsed.soundscape;
        }
      }
    } catch {
      /* noop */
    }
  }, []);

  const persist = useCallback((en: boolean, sc: SoundscapeId) => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ enabled: en, soundscape: sc }));
    } catch {
      /* noop */
    }
  }, []);

  // build the audio graph for the current soundscape
  const buildGraph = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    // tear down existing nodes
    nodesRef.current.forEach((n) => {
      try {
        (n as OscillatorNode).stop?.();
      } catch {
        /* noop */
      }
      try {
        n.disconnect();
      } catch {
        /* noop */
      }
    });
    nodesRef.current = [];

    const cfg = SOUNDSCAPES[soundscapeRef.current];
    if (!cfg) return;

    if (!noiseBufRef.current) noiseBufRef.current = makeNoiseBuffer(ctx);

    cfg.layers.forEach((l) => {
      const osc = ctx.createOscillator();
      osc.type = l.type;
      osc.frequency.value = l.freq;
      if (l.detune) osc.detune.value = l.detune;

      const filter = ctx.createBiquadFilter();
      filter.type = l.filterType;
      filter.frequency.value = l.filterFreq;
      if (l.filterQ) filter.Q.value = l.filterQ;

      const g = ctx.createGain();
      g.gain.value = l.gain;

      osc.connect(filter);
      filter.connect(g);
      g.connect(master);

      if (l.lfoHz) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = l.lfoHz;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = l.lfoDepth ?? 0.03;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        lfo.start();
        nodesRef.current.push(lfo);
      }

      osc.start();
      nodesRef.current.push(osc);
    });

    if (cfg.noise) {
      const ns = ctx.createBufferSource();
      ns.buffer = noiseBufRef.current;
      ns.loop = true;
      const nf = ctx.createBiquadFilter();
      nf.type = cfg.noise.type;
      nf.frequency.value = cfg.noise.freq;
      if (cfg.noise.q) nf.Q.value = cfg.noise.q;
      const ng = ctx.createGain();
      ng.gain.value = cfg.noise.gain;
      ns.connect(nf);
      nf.connect(ng);
      ng.connect(master);
      ns.start();
      nodesRef.current.push(ns);
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
  }, []);

  const rampTo = useCallback((target: number, ms: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + ms / 1000);
  }, []);

  const enable = useCallback(() => {
    ensureContext();
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    buildGraph();
    // fade in to target volume
    rampTo(targetVolRef.current, FADE_MS);
    enabledRef.current = true;
    setEnabled(true);
    persist(true, soundscapeRef.current);
  }, [ensureContext, buildGraph, rampTo, persist]);

  const disable = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) {
      enabledRef.current = false;
      setEnabled(false);
      persist(false, soundscapeRef.current);
      return;
    }
    // fade out then stop nodes
    rampTo(0, FADE_MS);
    enabledRef.current = false;
    setEnabled(false);
    persist(false, soundscapeRef.current);
    window.setTimeout(() => {
      nodesRef.current.forEach((n) => {
        try {
          (n as OscillatorNode).stop?.();
        } catch {
          /* noop */
        }
        try {
          n.disconnect();
        } catch {
          /* noop */
        }
      });
      nodesRef.current = [];
    }, FADE_MS + 100);
  }, [rampTo, persist]);

  const toggle = useCallback(() => {
    if (enabledRef.current) disable();
    else enable();
  }, [enable, disable]);

  const setSoundscape = useCallback(
    (id: SoundscapeId) => {
      soundscapeRef.current = id;
      setSoundscapeState(id);
      persist(enabledRef.current, id);
      // if currently enabled, rebuild graph live (quick crossfade)
      if (enabledRef.current && ctxRef.current) {
        const ctx = ctxRef.current!;
        const master = masterRef.current!;
        // quick duck then rebuild
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(targetVolRef.current * 0.3, now + 0.4);
        window.setTimeout(() => {
          buildGraph();
          rampTo(targetVolRef.current, 1.2);
        }, 450);
      }
    },
    [persist, buildGraph, rampTo]
  );

  // restore preference after first user interaction (never autoplay on load)
  useEffect(() => {
    if (!ready) return; // only if we have a stored preference
    if (!enabledRef.current) return; // only if they left it on
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      enable();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", restore);
      window.removeEventListener("keydown", restore);
      window.removeEventListener("scroll", restore, true);
      window.removeEventListener("touchstart", restore);
    };
    window.addEventListener("pointerdown", restore, { once: false });
    window.addEventListener("keydown", restore, { once: false });
    window.addEventListener("scroll", restore, { once: false, capture: true });
    window.addEventListener("touchstart", restore, { once: false });
    return cleanup;
  }, [ready, enable]);

  // page visibility ducking
  useEffect(() => {
    const onVisibility = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        rampTo(targetVolRef.current * DUCK_LEVEL, 1200);
      } else {
        rampTo(targetVolRef.current, 1400);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [rampTo]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx) ctx.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return (
    <Ctx.Provider value={{ enabled, ready, soundscape, toggle, setSoundscape }}>
      {children}
    </Ctx.Provider>
  );
}

export const SOUNDSCAPE_OPTIONS: { id: SoundscapeId; label: string }[] = [
  { id: "night-skyline", label: "Night Skyline" },
  { id: "rain", label: "Rain" },
  { id: "studio", label: "Studio Atmosphere" },
  { id: "ocean", label: "Ocean" },
  { id: "city-lights", label: "City Lights" },
];
