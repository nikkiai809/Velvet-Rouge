"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { CityConfig } from "./cities";
import { useSystem } from "./GlobalState";
import { buildManifesto, buildCitySignals } from "./ManifestoEngine";
import { CityShader } from "./CityShader";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CityImmersion({
  city,
  onClose,
}: {
  city: CityConfig | null;
  onClose: () => void;
}) {
  const visits = useSystem((s) => s.userMemory.visits);
  const registerCityTime = useSystem((s) => s.registerCityTime);
  const setActiveCity = useSystem((s) => s.setActiveCity);

  // dynamic manifesto + signals for the active city
  const manifesto = useMemo(
    () =>
      city
        ? buildManifesto({
            globalState: "city",
            mood: city.mood,
            city: city.id,
            visits,
          })
        : [],
    [city, visits]
  );
  const signals = useMemo(
    () => (city ? buildCitySignals(city.id, visits) : []),
    [city, visits]
  );

  // Esc to close + scroll lock + time tracking
  useEffect(() => {
    if (!city) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const start = Date.now();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      const elapsed = Date.now() - start;
      if (elapsed > 400) registerCityTime(city.id, elapsed);
    };
  }, [city, onClose, registerCityTime]);

  // clear active city in global state on close
  const handleClose = () => {
    setActiveCity(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {city && (
        <motion.section
          key={city.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: EASE }}
          className="fixed inset-0 z-[60] overflow-hidden bg-black"
          aria-label={`${city.name} — immersion`}
        >
          {/* city image with color grade */}
          <motion.img
            src={city.image}
            alt={`${city.name} at night`}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 22, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: `${city.grade} brightness(0.62)` }}
          />

          {/* darkening + glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/40" />
          <div
            className="breathe absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 50% 55%, ${city.glow}, transparent 72%)`,
            }}
          />

          {/* reactive city shader */}
          <CityShader
            shader={city.shader}
            accent={city.accent}
            intensity={0.9}
          />

          {/* grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-[0.1] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
          />

          {/* close affordance */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 sm:top-8 sm:right-10 z-30 label-track text-bone-dim hover:text-bone transition-colors duration-700 flex items-center gap-3"
            aria-label="Return to the night"
          >
            <span className="block w-6 h-px bg-current" />
            Close
          </button>

          {/* content */}
          <div className="relative z-30 h-full flex flex-col items-center justify-center px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
              className="label-track mb-6"
              style={{ color: city.accent }}
            >
              {city.index} — {city.region}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 2.2, ease: EASE, delay: 0.6 }}
              className="font-display text-bone leading-[0.95]"
              style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
            >
              {city.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: EASE, delay: 1.2 }}
              className="font-display italic text-bone-dim mt-8 max-w-md"
              style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)" }}
            >
              {city.tagline}
            </motion.p>

            {/* dynamic manifesto lines (city-reactive) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: EASE, delay: 1.7 }}
              className="mt-12 flex flex-col items-center gap-4 max-w-2xl"
            >
              {manifesto.map((line, i) => (
                <p
                  key={i}
                  className="font-display text-bone-dim leading-snug"
                  style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
                >
                  {line}
                </p>
              ))}
            </motion.div>

            {/* signals */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: EASE, delay: 2.2 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 max-w-lg"
            >
              {signals.map((s, i) => (
                <span key={s} className="flex items-center gap-8">
                  <span
                    className="label-track"
                    style={{ color: city.accent, opacity: 0.9 }}
                  >
                    {s}
                  </span>
                  {i < signals.length - 1 && (
                    <span className="text-bone-faint">·</span>
                  )}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: EASE, delay: 2.6 }}
              className="label-track text-bone-faint mt-14"
            >
              {city.coord}
            </motion.p>

            <motion.button
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: EASE, delay: 3 }}
              className="mt-12 label-track text-bone-dim hover:text-bone transition-colors duration-700 flex items-center gap-3"
            >
              <span className="block w-px h-8 bg-bone/40" />
              Return to the night
            </motion.button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
