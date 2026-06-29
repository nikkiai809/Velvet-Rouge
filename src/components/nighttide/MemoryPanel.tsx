"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSystem, MOOD_LABELS } from "./GlobalState";
import { CITY_MAP } from "./cities";
import type { CityId } from "./AudioEngine";

const EASE = [0.22, 1, 0.36, 1] as const;

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

export function MemoryPanel() {
  const [open, setOpen] = useState(false);
  const mood = useSystem((s) => s.mood);
  const intensity = useSystem((s) => s.intensity);
  const activeCity = useSystem((s) => s.activeCity);
  const globalState = useSystem((s) => s.globalState);
  const visits = useSystem((s) => s.userMemory.visits);
  const lastCity = useSystem((s) => s.userMemory.lastCity);
  const timeSpent = useSystem((s) => s.userMemory.timeSpent);

  // live ticking time — derive from a tick counter + base timeSpent (no setState in effect body)
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTicks((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const liveTime = timeSpent + ticks * 1000;

  const lastCityName = lastCity
    ? CITY_MAP[lastCity as CityId]?.name ?? lastCity
    : null;

  return (
    <>
      {/* toggle dot */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[90] flex items-center gap-3 group"
        aria-label={open ? "Close system state" : "Open system state"}
        aria-expanded={open}
      >
        <span
          className="block w-2 h-2 rounded-full transition-all duration-700"
          style={{
            background: activeCity
              ? CITY_MAP[activeCity as CityId]?.accent ?? "#5e1018"
              : "#5e1018",
            boxShadow: "0 0 8px 1px rgba(94,16,24,0.6)",
            opacity: open ? 0.4 : 1,
          }}
        />
        <span className="label-track text-bone-faint group-hover:text-bone-dim transition-colors duration-700">
          {open ? "" : "State"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="fixed bottom-16 left-6 sm:bottom-20 sm:left-8 z-[90] w-[min(280px,calc(100vw-3rem))] bg-black/60 backdrop-blur-[3px] border border-bone/10 p-6"
            aria-label="System state"
          >
            <p className="label-track text-rouge-bright mb-5">System State</p>

            <dl className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Phase</dt>
                <dd className="label-track text-bone">
                  {globalState === "city" ? "City" : "Night"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Mood</dt>
                <dd className="label-track text-bone">{MOOD_LABELS[mood]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Intensity</dt>
                <dd className="label-track text-bone">
                  {Math.round(intensity * 100)}
                </dd>
              </div>
              <div className="h-px bg-bone/10 my-1" />
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Active</dt>
                <dd className="label-track text-bone">
                  {activeCity
                    ? CITY_MAP[activeCity as CityId]?.name
                    : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Visits</dt>
                <dd className="label-track text-bone">{visits}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Last city</dt>
                <dd className="label-track text-bone">{lastCityName ?? "—"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="label-track text-bone-faint">Time</dt>
                <dd className="label-track text-bone">{formatTime(liveTime)}</dd>
              </div>
            </dl>

            <p className="label-track text-bone-faint text-[0.55rem] mt-6 leading-relaxed">
              The system remembers. Repeated visits subtly alter the experience.
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
