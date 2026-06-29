"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GlobalStateId = "night" | "city";
export type MoodId = "longing" | "ambition" | "memory" | "drift" | "silence";

export type UserMemory = {
  visits: number;
  lastCity: string | null;
  timeSpent: number; // ms accumulated in-system
  lastVisit: number | null; // epoch ms
  seenManifesto: boolean;
};

export type SystemState = {
  globalState: GlobalStateId;
  mood: MoodId;
  intensity: number; // 0..1
  activeCity: string | null;
  userMemory: UserMemory;
  /* actions */
  setActiveCity: (city: string | null) => void;
  setMood: (m: MoodId) => void;
  setIntensity: (n: number) => void;
  enterSystem: () => void; // called on Enter — increments visits, sets lastVisit
  registerCityTime: (city: string, ms: number) => void;
  markManifestoSeen: () => void;
  tickTime: (ms: number) => void;
};

export const CITY_MOODS: Record<string, MoodId> = {
  tokyo: "ambition",
  seoul: "memory",
  paris: "memory",
  la: "drift",
  shanghai: "silence",
};

export const MOOD_LABELS: Record<MoodId, string> = {
  longing: "Longing",
  ambition: "Ambition",
  memory: "Memory",
  drift: "Drift",
  silence: "Silence",
};

const NIGHT_MOOD: MoodId = "longing";

export const useSystem = create<SystemState>()(
  persist(
    (set) => ({
      globalState: "night",
      mood: NIGHT_MOOD,
      intensity: 0.7,
      activeCity: null,
      userMemory: {
        visits: 0,
        lastCity: null,
        timeSpent: 0,
        lastVisit: null,
        seenManifesto: false,
      },
      setActiveCity: (city) =>
        set((s) => ({
          activeCity: city,
          globalState: city ? "city" : "night",
          mood: city ? CITY_MOODS[city] ?? NIGHT_MOOD : NIGHT_MOOD,
          intensity: city ? 0.85 : 0.7,
          userMemory: city
            ? { ...s.userMemory, lastCity: city }
            : s.userMemory,
        })),
      setMood: (m) => set({ mood: m }),
      setIntensity: (n) =>
        set({ intensity: Math.max(0, Math.min(1, n)) }),
      enterSystem: () =>
        set((s) => ({
          userMemory: {
            ...s.userMemory,
            visits: s.userMemory.visits + 1,
            lastVisit: Date.now(),
          },
        })),
      registerCityTime: (city, ms) =>
        set((s) => ({
          userMemory: { ...s.userMemory, lastCity: city, timeSpent: s.userMemory.timeSpent + ms },
        })),
      markManifestoSeen: () =>
        set((s) => ({
          userMemory: { ...s.userMemory, seenManifesto: true },
        })),
      tickTime: (ms) =>
        set((s) => ({
          userMemory: { ...s.userMemory, timeSpent: s.userMemory.timeSpent + ms },
        })),
    }),
    {
      name: "nighttide-os-memory",
      // only persist the memory, not transient runtime state
      partialize: (s) => ({ userMemory: s.userMemory }),
    }
  )
);

/* Selectors / helpers */
export function useIsReturningVisitor() {
  return useSystem((s) => s.userMemory.visits > 1);
}
