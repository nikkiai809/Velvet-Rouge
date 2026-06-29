import type { MoodId } from "./GlobalState";
import type { CityId } from "./AudioEngine";

export type CityConfig = {
  id: CityId;
  index: string;
  name: string;
  region: string;
  coord: string;
  image: string;
  mood: MoodId;
  /* color grading */
  grade: string; // css filter on the image
  glow: string; // rgba for ambient glow overlay
  accent: string; // hex for signal accents
  /* shader layer id */
  shader: "rain" | "pulse" | "haze" | "glow" | "depth";
  tagline: string;
};

export const CITIES: CityConfig[] = [
  {
    id: "tokyo",
    index: "01",
    name: "Tokyo",
    region: "East Asia",
    coord: "35.68°N · 139.69°E",
    image: "/editorial/city-tokyo.png",
    mood: "ambition",
    grade: "hue-rotate(190deg) saturate(1.15) brightness(0.9)",
    glow: "rgba(40, 90, 160, 0.42)",
    accent: "#5b8ef",
    shader: "rain",
    tagline: "Blue neon rain over wet asphalt.",
  },
  {
    id: "seoul",
    index: "02",
    name: "Seoul",
    region: "East Asia",
    coord: "37.56°N · 126.97°E",
    image: "/editorial/city-seoul.png",
    mood: "memory",
    grade: "hue-rotate(285deg) saturate(1.2) brightness(0.92)",
    glow: "rgba(160, 30, 120, 0.42)",
    accent: "#d451a8",
    shader: "pulse",
    tagline: "Magenta glow pulsing through glass.",
  },
  {
    id: "paris",
    index: "03",
    name: "Paris",
    region: "Europe",
    coord: "48.85°N · 2.35°E",
    image: "/editorial/city-paris.png",
    mood: "memory",
    grade: "sepia(0.38) saturate(1.15) hue-rotate(-12deg) brightness(0.95)",
    glow: "rgba(190, 130, 45, 0.42)",
    accent: "#e0a94e",
    shader: "haze",
    tagline: "Warm amber light on Haussmann stone.",
  },
  {
    id: "la",
    index: "04",
    name: "Los Angeles",
    region: "North America",
    coord: "34.05°N · 118.24°W",
    image: "/editorial/city-la.png",
    mood: "drift",
    grade: "hue-rotate(-22deg) saturate(1.25) brightness(0.95)",
    glow: "rgba(205, 95, 30, 0.42)",
    accent: "#ef8a36",
    shader: "glow",
    tagline: "Orange dusk dissolving into palms.",
  },
  {
    id: "shanghai",
    index: "05",
    name: "Shanghai",
    region: "East Asia",
    coord: "31.23°N · 121.47°E",
    image: "/editorial/city-shanghai.png",
    mood: "silence",
    grade: "hue-rotate(165deg) saturate(1.1) brightness(0.92)",
    glow: "rgba(30, 150, 160, 0.42)",
    accent: "#36c2bb",
    shader: "depth",
    tagline: "Teal industrial futurism on the river.",
  },
];

export const CITY_MAP: Record<CityId, CityConfig> = CITIES.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<CityId, CityConfig>
);
