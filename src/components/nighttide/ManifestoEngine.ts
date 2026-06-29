import type { MoodId } from "./GlobalState";

/* ------------------------------------------------------------------ */
/*  Manifesto Engine — generative lines from mood × city × state       */
/*  Deterministic-feeling but varies by seed (visit count + city).     */
/* ------------------------------------------------------------------ */

type ManifestoLine = string;

const NIGHT_LINES: ManifestoLine[] = [
  "The night carries a tide of hopes and unfinished dreams.",
  "In that uncertainty, people believe.",
  "\u201CTonight is the night.\u201D",
  "The night is not empty. It is full of longing.",
  "I am interested in the what if.",
];

// Mood-flavored closing lines (state/mood-reactive)
const MOOD_LINES: Record<MoodId, ManifestoLine[]> = {
  longing: [
    "Longing is memory without direction.",
    "What you avoid, the night remembers.",
    "Every distance is also a door.",
  ],
  ambition: [
    "Ambition is the quiet between two thoughts.",
    "The city does not wait. It listens.",
    "What if is the only honest question.",
  ],
  memory: [
    "Memory is the longest street in any city.",
    "We do not return. We recognise.",
    "The past is not behind. It is beneath.",
  ],
  drift: [
    "Drift is attention without an anchor.",
    "Nothing is lost. Only unattended.",
    "The tide does not hurry. It arrives.",
  ],
  silence: [
    "Silence is the loudest architecture.",
    "Density teaches you what to remove.",
    "The future is quiet until it speaks.",
  ],
};

// City-specific fragments (appended when a city is active)
const CITY_LINES: Record<string, ManifestoLine> = {
  tokyo: "Every city is an unfinished thought.",
  seoul: "Neon is just longing with better light.",
  paris: "Romance is the courage to remember slowly.",
  la: "A dream is motion that refuses to stop.",
  shanghai: "Density is the future rehearsing its silence.",
};

export type ManifestoConfig = {
  globalState: "night" | "city";
  mood: MoodId;
  city: string | null;
  visits: number;
};

/* pick from array by seed (stable per seed) */
function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

export function buildManifesto(cfg: ManifestoConfig): ManifestoLine[] {
  const { globalState, mood, city, visits } = cfg;

  // First visit at night = the full canonical manifesto.
  // Returning visitors get a compressed, mood-shifted version.
  if (globalState === "night" && visits <= 1) {
    return NIGHT_LINES;
  }

  const seed = visits + (city ? city.length : 0) + mood.length;

  if (globalState === "city" && city && CITY_LINES[city]) {
    // City-immersion manifesto: mood line + city line + canonical echo
    return [
      pick(MOOD_LINES[mood], seed),
      CITY_LINES[city],
      "The night is not empty. It is full of longing.",
    ];
  }

  // Returning night visitor — compressed + mood-reactive
  return [
    "The night remembers what you avoid.",
    pick(MOOD_LINES[mood], seed),
    "I am interested in the what if.",
  ];
}

/* City signal engine — generates emotional fragments per city.
   Rotates with seed so they feel generative across visits. */
type CitySignals = Record<string, string[]>;

const SIGNAL_POOL: CitySignals = {
  tokyo: [
    "late night thoughts",
    "silent ambition",
    "neon solitude",
    "isolation",
    "blue frequency",
    "what if",
  ],
  seoul: [
    "future nostalgia",
    "emotional static",
    "digital longing",
    "after-hours",
    "magenta drift",
    "remembering forward",
  ],
  paris: [
    "amber reverie",
    "unfinished letters",
    "slow rain",
    "romance of distance",
    "memory in amber",
    "the long return",
  ],
  la: [
    "dusk obsession",
    "neon haze",
    "motion without arrival",
    "dream in transit",
    "orange longing",
    "the what if",
  ],
  shanghai: [
    "industrial dreams",
    "signal noise",
    "concrete tide",
    "future silence",
    "density",
    "the quiet tower",
  ],
};

export function buildCitySignals(city: string, seed: number): string[] {
  const pool = SIGNAL_POOL[city] ?? [];
  if (pool.length <= 3) return pool;
  // pick 3 distinct, rotated by seed
  const start = seed % pool.length;
  const out: string[] = [];
  for (let i = 0; i < 3; i++) out.push(pool[(start + i) % pool.length]);
  return out;
}
