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

export type CityId = "tokyo" | "seoul" | "paris" | "la" | "shanghai";

type AudioApi = {
  unlocked: boolean;
  unlock: () => void;
  setCity: (c: CityId | null) => void;
  setMoodIntensity: (intensity: number) => void;
  hover: () => void;
  click: () => void;
  muted: boolean;
  toggleMute: () => void;
};

const Ctx = createContext<AudioApi | null>(null);

export function useAudio() {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/*  City sound layer configs                                           */
/* ------------------------------------------------------------------ */
type LayerCfg = {
  oscs: { type: OscillatorType; freq: number; gain: number; detune?: number }[];
  filter: { type: BiquadFilterType; freq: number; q?: number };
  noise?: { type: BiquadFilterType; freq: number; gain: number; q?: number };
  pulseHz?: number; // slow tremolo
  level: number;
};

const CITY_LAYERS: Record<CityId, LayerCfg> = {
  // Tokyo — blue neon rain: high shimmer + rain noise + tremolo
  tokyo: {
    oscs: [
      { type: "sine", freq: 660, gain: 0.5 },
      { type: "sine", freq: 880, gain: 0.35 },
    ],
    filter: { type: "lowpass", freq: 2400 },
    noise: { type: "highpass", freq: 3200, gain: 0.25 },
    pulseHz: 0.6,
    level: 0.05,
  },
  // Seoul — magenta digital glow: pulsing low triangle
  seoul: {
    oscs: [
      { type: "triangle", freq: 220, gain: 0.6 },
      { type: "triangle", freq: 220.5, gain: 0.5, detune: 8 },
    ],
    filter: { type: "lowpass", freq: 900, q: 1 },
    pulseHz: 0.45,
    level: 0.06,
  },
  // Paris — warm amber film tone: low sine fifth, slow swell
  paris: {
    oscs: [
      { type: "sine", freq: 130, gain: 0.6 },
      { type: "sine", freq: 196, gain: 0.45 },
    ],
    filter: { type: "lowpass", freq: 500 },
    level: 0.07,
  },
  // Los Angeles — orange dusk neon haze: warm pad w/ gentle vibrato
  la: {
    oscs: [
      { type: "sine", freq: 110, gain: 0.6 },
      { type: "sine", freq: 165, gain: 0.45, detune: 4 },
    ],
    filter: { type: "lowpass", freq: 700 },
    pulseHz: 0.25,
    level: 0.065,
  },
  // Shanghai — teal industrial futurism: metallic ring + industrial noise
  shanghai: {
    oscs: [
      { type: "sawtooth", freq: 330, gain: 0.3 },
      { type: "sawtooth", freq: 333, gain: 0.3 },
    ],
    filter: { type: "highpass", freq: 900, q: 0.8 },
    noise: { type: "highpass", freq: 1200, gain: 0.18 },
    level: 0.045,
  },
};

const RAMP = 2.4; // crossfade seconds

function makeNoiseBuffer(ctx: AudioContext) {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const cityGainsRef = useRef<Record<CityId, GainNode> | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const mutedRef = useRef(false);
  const unlockedRef = useRef(false);

  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMuted] = useState(false);

  // build the graph once (browser only)
  const build = useCallback(() => {
    if (ctxRef.current) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    const noiseBuf = makeNoiseBuffer(ctx);
    noiseBufferRef.current = noiseBuf;

    /* ---- global ambient night drone (always active) ---- */
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.1;
    droneGain.connect(master);
    droneGainRef.current = droneGain;

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 220;
    droneFilter.Q.value = 0.6;
    droneFilter.connect(droneGain);

    [55, 55.3, 110].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(droneFilter);
      o.start();
    });

    // slow LFO on drone gain — breathing
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);
    lfo.start();

    /* ---- night air (filtered noise) ---- */
    const airGain = ctx.createGain();
    airGain.gain.value = 0.022;
    airGain.connect(master);

    const airSrc = ctx.createBufferSource();
    airSrc.buffer = noiseBuf;
    airSrc.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "bandpass";
    airFilter.frequency.value = 500;
    airFilter.Q.value = 0.7;
    airSrc.connect(airFilter);
    airFilter.connect(airGain);
    airSrc.start();

    /* ---- per-city layers (all built, gain 0 until selected) ---- */
    const cityGains = {} as Record<CityId, GainNode>;

    (Object.keys(CITY_LAYERS) as CityId[]).forEach((id) => {
      const cfg = CITY_LAYERS[id];
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(master);
      cityGains[id] = g;

      const filter = ctx.createBiquadFilter();
      filter.type = cfg.filter.type;
      filter.frequency.value = cfg.filter.freq;
      if (cfg.filter.q) filter.Q.value = cfg.filter.q;
      filter.connect(g);

      cfg.oscs.forEach((o) => {
        const osc = ctx.createOscillator();
        osc.type = o.type;
        osc.frequency.value = o.freq;
        if (o.detune) osc.detune.value = o.detune;
        const og = ctx.createGain();
        og.gain.value = o.gain;
        osc.connect(og);
        og.connect(filter);
        osc.start();
      });

      if (cfg.noise) {
        const ns = ctx.createBufferSource();
        ns.buffer = noiseBuf;
        ns.loop = true;
        const nf = ctx.createBiquadFilter();
        nf.type = cfg.noise.type;
        nf.frequency.value = cfg.noise.freq;
        if (cfg.noise.q) nf.Q.value = cfg.noise.q;
        const ng = ctx.createGain();
        ng.gain.value = cfg.noise.gain;
        ns.connect(nf);
        nf.connect(ng);
        ng.connect(filter);
        ns.start();
      }

      if (cfg.pulseHz) {
        const p = ctx.createOscillator();
        p.frequency.value = cfg.pulseHz;
        const pg = ctx.createGain();
        pg.gain.value = cfg.level * 0.5;
        p.connect(pg);
        pg.connect(g.gain);
        p.start();
      }
    });

    cityGainsRef.current = cityGains;
  }, []);

  const unlock = useCallback(() => {
    build();
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(mutedRef.current ? 0 : 1, now + 3);
    unlockedRef.current = true;
    setUnlocked(true);
  }, [build]);

  const setCity = useCallback((c: CityId | null) => {
    const ctx = ctxRef.current;
    const gains = cityGainsRef.current;
    if (!ctx || !gains) return;
    const now = ctx.currentTime;
    (Object.keys(gains) as CityId[]).forEach((id) => {
      const g = gains[id];
      const target = id === c ? CITY_LAYERS[id].level : 0;
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(target, now + RAMP);
    });
  }, []);

  // mood intensity modulates the global drone — calm longing vs. intense ambition
  const setMoodIntensity = useCallback((intensity: number) => {
    const ctx = ctxRef.current;
    const drone = droneGainRef.current;
    if (!ctx || !drone) return;
    const now = ctx.currentTime;
    // 0.06 (calm) .. 0.14 (intense)
    const target = 0.06 + intensity * 0.08;
    drone.gain.cancelScheduledValues(now);
    drone.gain.setValueAtTime(drone.gain.value, now);
    drone.gain.linearRampToValueAtTime(target, now + 3);
  }, []);

  const hover = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || !unlockedRef.current) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 180;
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(master);
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.03, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    o.start(now);
    o.stop(now + 0.45);
  }, []);

  const click = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || !unlockedRef.current) return;
    const now = ctx.currentTime;
    [90, 135].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(master);
      const peak = i === 0 ? 0.05 : 0.03;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      o.start(now);
      o.stop(now + 0.65);
    });
  }, []);

  const toggleMute = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      if (ctx && master) {
        const now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(next ? 0 : 1, now + 1.2);
      }
      return next;
    });
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx) ctx.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        unlocked,
        unlock,
        setCity,
        setMoodIntensity,
        hover,
        click,
        muted,
        toggleMute,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
