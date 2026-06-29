"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useAudio, type CityId } from "./AudioEngine";
import { CITIES, type CityConfig } from "./cities";
import { useSystem } from "./GlobalState";
import { buildCitySignals } from "./ManifestoEngine";
import { CityShader } from "./CityShader";

const EASE = [0.22, 1, 0.36, 1] as const;

export function NightNetwork({
  onSelect,
}: {
  onSelect: (c: CityConfig) => void;
}) {
  const audio = useAudio();
  const setActiveCity = useSystem((s) => s.setActiveCity);
  const setMoodIntensity = useSystem((s) => s.setMoodIntensity);
  const visits = useSystem((s) => s.userMemory.visits);
  const [active, setActive] = useState<CityId | null>(null);

  const activate = useCallback(
    (c: CityConfig) => {
      setActive(c.id);
      setActiveCity(c.id);
      audio?.setCity(c.id);
      setMoodIntensity(0.85);
    },
    [audio, setActiveCity, setMoodIntensity]
  );

  const clear = useCallback(() => {
    setActive(null);
    setActiveCity(null);
    audio?.setCity(null);
    setMoodIntensity(0.7);
  }, [audio, setActiveCity, setMoodIntensity]);

  const activeCity = active ? CITIES.find((c) => c.id === active) : null;

  return (
    <section
      id="network"
      className="relative min-h-[100svh] w-full overflow-hidden night-bg"
      onMouseLeave={clear}
    >
      {/* crossfading city backdrop */}
      <AnimatePresence>
        {activeCity && (
          <motion.div
            key={activeCity.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, ease: EASE }}
            className="absolute inset-0 z-0"
          >
            <img
              src={activeCity.image}
              alt=""
              aria-hidden
              className="drift city-grade h-full w-full object-cover"
              style={{ filter: `${activeCity.grade} brightness(0.7)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/55 to-[#050506]/70" />
            {/* ambient city glow */}
            <div
              className="breathe absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 55% 45% at 50% 55%, ${activeCity.glow}, transparent 70%)`,
              }}
            />
            {/* reactive city shader */}
            <CityShader
              shader={activeCity.shader}
              accent={activeCity.accent}
              intensity={0.85}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* base night glow when no city active */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(94,16,24,0.08), transparent 70%)",
        }}
      />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 sm:px-10 py-32 sm:py-40">
        {/* opener */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.6, ease: EASE }}
          className="mb-20 sm:mb-28"
        >
          <p className="label-track text-rouge-bright">I — Global Night Network</p>
          <div className="hairline w-16 mt-6" />
          <h2
            className="font-display text-bone mt-10 leading-[1.05] max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)" }}
          >
            Five cities, behaving as
            <span className="text-bone-dim italic"> emotional states.</span>
          </h2>
          <p className="text-bone-dim font-light max-w-xl mt-8 leading-relaxed text-sm sm:text-base">
            Each node is not a destination but a feeling. Move through them and
            the night changes colour. Nothing is explained. Everything is felt.
          </p>
        </motion.div>

        {/* city nodes */}
        <div className="flex flex-col">
          {CITIES.map((c, i) => {
            const isActive = active === c.id;
            const signals = buildCitySignals(c.id, visits + i);
            return (
              <motion.button
                key={c.id}
                onMouseEnter={() => {
                  audio?.hover();
                  activate(c);
                }}
                onFocus={() => activate(c)}
                onClick={() => {
                  audio?.click();
                  onSelect(c);
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 1.3, ease: EASE, delay: i * 0.12 }}
                className="group relative grid grid-cols-12 items-center gap-4 py-8 sm:py-10 text-left border-b border-bone/10"
                aria-label={`Enter ${c.name}`}
              >
                {/* index */}
                <span
                  className="col-span-2 sm:col-span-1 label-track transition-colors duration-700"
                  style={{ color: isActive ? c.accent : "#6b6862" }}
                >
                  {c.index}
                </span>

                {/* name */}
                <span
                  className="col-span-10 sm:col-span-6 font-display transition-all duration-700"
                  style={{
                    fontSize: "clamp(1.8rem, 5vw, 3.6rem)",
                    color: isActive ? "#f5f2ed" : "#a8a39b",
                    transform: isActive ? "translateX(0.5rem)" : "translateX(0)",
                  }}
                >
                  {c.name}
                </span>

                {/* tagline (desktop) */}
                <span className="hidden sm:block sm:col-span-3 font-display italic text-bone-dim text-base">
                  {c.tagline}
                </span>

                {/* coord */}
                <span className="col-span-12 sm:col-span-2 label-track text-bone-faint text-right">
                  {c.coord}
                </span>

                {/* signals — appear when active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 1.2, ease: EASE }}
                      className="col-span-12 mt-3 flex flex-wrap gap-x-6 gap-y-2"
                    >
                      {signals.map((s) => (
                        <span
                          key={s}
                          className="label-track"
                          style={{ color: c.accent, opacity: 0.85 }}
                        >
                          {s}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
