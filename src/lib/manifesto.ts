import type { CityId } from "@/components/nighttide/AudioEngine";
import type { Mood, UserMemory } from "./nighttide-store";

/* ====================================================================
   NIGHTTIDE — Manifesto Engine
   A combinatorial prose generator. The manifesto is never static:
   it composes from mood × city × memory, producing subtle variation
   on every read while staying on-brand.
   ==================================================================== */

const OPENERS: Record<Mood, string[]> = {
  longing: [
    "The night carries a tide of hopes and unfinished dreams.",
    "Something in the dark keeps asking to be remembered.",
    "Longing is the night rehearsing a name it cannot say.",
  ],
  drift: [
    "We drift between cities the way thought drifts between languages.",
    "Nothing arrives. Everything is always almost here.",
    "The hours loosen and the streets begin to breathe.",
  ],
  ambition: [
    "Ambition is just longing that learned to keep walking.",
    "Every lit window is a small refusal of the dark.",
    "We build because the night will not build itself.",
  ],
  memory: [
    "Memory is the only architecture the night cannot demolish.",
    "What you avoid, the night remembers for you.",
    "A city is a thousand memories pretending to be a place.",
  ],
  silence: [
    "Silence is not absence. It is the night listening to itself.",
    "The quietest streets carry the loudest interior weather.",
    "In the silence between cities, the system rests.",
  ],
};

const MIDDLES: Record<Mood, string[]> = {
  longing: [
    "In that uncertainty, people believe.",
    "We mistake the uncertainty for emptiness.",
    "The not-yet is its own kind of room.",
  ],
  drift: [
    "We move without moving, and the city moves for us.",
    "To drift is to let the night choose the next thought.",
    "Direction is a luxury the dark does not require.",
  ],
  ambition: [
    "Tonights become tomorrows by the weight of wanting.",
    "We carry the unfinished into the next lit window.",
    "What we build at night is what the day will inherit.",
  ],
  memory: [
    "Longing is memory without direction.",
    "We return not to the place, but to the version of ourselves it held.",
    "The past does not repeat. It hums.",
  ],
  silence: [
    "We stop speaking, and the city begins.",
    "What is unsaid holds the room together.",
    "The system pauses, and the pause becomes the music.",
  ],
};

const CLOSERS: Record<Mood, string[]> = {
  longing: [
    "I am interested in the what if.",
    "Tonight is the night, the night always says.",
    "The night is not empty. It is full of longing.",
  ],
  drift: [
    "Every city is an unfinished thought.",
    "We let the current decide what stays.",
    "Drift is faith in a direction you cannot see.",
  ],
  ambition: [
    "We are interested in the what could be.",
    "The night keeps the blueprint until morning.",
    "We build the bridge by walking it.",
  ],
  memory: [
    "We keep the what was, in case it returns.",
    "Memory is the night's slowest river.",
    "Everything we loved becomes a coordinate.",
  ],
  silence: [
    "We are interested in the what is not said.",
    "The night is not empty. It is full of listening.",
    "Stillness is the system's deepest signal.",
  ],
};

const CITY_REFLECTIONS: Record<CityId, string[]> = {
  tokyo: [
    "In Tokyo the rain keeps a ledger of every lit sign.",
    "Neon is just longing that learned to glow.",
    "The city hums at a frequency only the late hours can hear.",
  ],
  seoul: [
    "Seoul remembers a future it has not yet built.",
    "The glow pulses like a held breath.",
    "Digital longing, old streets, the same quiet weight.",
  ],
  paris: [
    "Paris keeps its warmth in amber and stone.",
    "Every rooftop holds a letter never sent.",
    "Romance is memory with warm light on it.",
  ],
  la: [
    "Los Angeles pours its dreams onto the dusk.",
    "The hills hold the day's last argument with the dark.",
    "Motion is the city's oldest prayer.",
  ],
  shanghai: [
    "Shanghai builds silence out of glass and density.",
    "The river carries the future's reflection.",
    "Industry dreams in teal and steel.",
  ],
};

/* deterministic pseudo-random so a given seed is stable per render */
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

export type ManifestoLine = { text: string; emphasis?: boolean };

export function generateManifesto(opts: {
  mood: Mood;
  city?: CityId | null;
  memory: UserMemory;
}): ManifestoLine[] {
  const { mood, city, memory } = opts;
  // seed shifts per visit so returning visitors see variation,
  // but a single render is stable.
  const seed = memory.visits + Math.floor(memory.timeSpent / 30);

  const lines: ManifestoLine[] = [
    { text: pick(OPENERS[mood], seed) },
    { text: pick(MIDDLES[mood], seed + 1) },
  ];

  if (city) {
    lines.push({ text: pick(CITY_REFLECTIONS[city], seed + 2), emphasis: true });
  }

  lines.push({ text: pick(CLOSERS[mood], seed + 3), emphasis: true });

  // returning visitors get a quieter, shorter manifesto
  if (memory.visits > 1 && seed % 2 === 0) {
    // trim the middle for subtlety
    return [lines[0], ...lines.slice(2)];
  }

  return lines;
}

/* City signal engine — emotional fragments per city, varying by mood */
const SIGNAL_POOL: Record<CityId, string[]> = {
  tokyo: [
    "late night thoughts",
    "neon solitude",
    "infinite drift",
    "silent ambition",
    "rain as ledger",
    "blue frequency",
  ],
  seoul: [
    "emotional static",
    "digital longing",
    "after-hours",
    "future nostalgia",
    "held breath",
    "magenta memory",
  ],
  paris: [
    "amber reverie",
    "unfinished letters",
    "slow rain",
    "warm stone",
    "romance of memory",
    "golden quiet",
  ],
  la: [
    "dusk obsession",
    "neon haze",
    "what if",
    "motion prayer",
    "hill argument",
    "orange dream",
  ],
  shanghai: [
    "industrial dreams",
    "signal noise",
    "concrete tide",
    "future silence",
    "teal depth",
    "glass river",
  ],
};

export function generateSignals(city: CityId, seed: number): string[] {
  const pool = SIGNAL_POOL[city];
  // rotate selection by seed for variation
  const start = Math.abs(seed) % pool.length;
  const out: string[] = [];
  for (let i = 0; i < 3; i++) out.push(pool[(start + i) % pool.length]);
  return out;
}
