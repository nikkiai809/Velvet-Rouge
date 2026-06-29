"use client";

import { create } from "zustand";
import type { CityId } from "@/components/nighttide/AudioEngine";

export type GlobalState = "night" | "city" | "return";
export type Mood = "longing" | "drift" | "ambition" | "memory" | "silence";

export type UserMemory = {
  visits: number;
  lastCity: CityId | null;
  timeSpent: number; // seconds in system (accumulated)
  lastVisitISO: string | null;
};

type NighttideStore = {
  globalState: GlobalState;
  mood: Mood;
  intensity: number; // 0..1
  activeCity: CityId | null;
  memory: UserMemory;
  entered: boolean;

  setEntered: (v: boolean) => void;
  setMood: (m: Mood) => void;
  setIntensity: (n: number) => void;
  enterCity: (c: CityId) => void;
  exitToNight: () => void;
  recordVisit: () => void;
  addTime: (seconds: number) => void;
  loadMemory: () => void;
};

const DEFAULT_MEMORY: UserMemory = {
  visits: 0,
  lastCity: null,
  timeSpent: 0,
  lastVisitISO: null,
};

const MEM_KEY = "nighttide.memory.v1";

function readMemory(): UserMemory {
  if (typeof window === "undefined") return DEFAULT_MEMORY;
  try {
    const raw = window.localStorage.getItem(MEM_KEY);
    if (!raw) return DEFAULT_MEMORY;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MEMORY, ...parsed };
  } catch {
    return DEFAULT_MEMORY;
  }
}

function writeMemory(m: UserMemory) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEM_KEY, JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

export const useNighttide = create<NighttideStore>((set, get) => ({
  globalState: "night",
  mood: "longing",
  intensity: 0.7,
  activeCity: null,
  memory: DEFAULT_MEMORY,
  entered: false,

  setEntered: (v) => set({ entered: v }),

  setMood: (m) => set({ mood: m }),

  setIntensity: (n) =>
    set({ intensity: Math.max(0, Math.min(1, n)) }),

  enterCity: (c) => {
    const mem = get().memory;
    const next: UserMemory = { ...mem, lastCity: c };
    writeMemory(next);
    set({ activeCity: c, globalState: "city", memory: next });
  },

  exitToNight: () =>
    set({ activeCity: null, globalState: "night" }),

  recordVisit: () => {
    const mem = readMemory();
    const next: UserMemory = {
      ...mem,
      visits: mem.visits + 1,
      lastVisitISO: new Date().toISOString(),
    };
    writeMemory(next);
    set({ memory: next });
  },

  addTime: (seconds) => {
    const mem = get().memory;
    const next: UserMemory = { ...mem, timeSpent: mem.timeSpent + seconds };
    writeMemory(next);
    set({ memory: next });
  },

  loadMemory: () => {
    set({ memory: readMemory() });
  },
}));

/* Helpers ----------------------------------------------------------- */

export function isFirstVisit(memory: UserMemory) {
  return memory.visits <= 1;
}

/* Map an active city to its dominant mood (used to tint the manifesto). */
export const CITY_MOOD: Record<CityId, Mood> = {
  tokyo: "ambition",
  seoul: "memory",
  paris: "memory",
  la: "ambition",
  shanghai: "silence",
};
