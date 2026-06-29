"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

export type City = {
  index: string;
  name: string;
  region: string;
  coord: string;
  image: string;
};

export const CITIES: City[] = [
  {
    index: "01",
    name: "Mexico City",
    region: "North America",
    coord: "19.43°N · 99.13°W",
    image: "/images/cities/mexico-city.webp",
  },
  {
    index: "02",
    name: "Tokyo",
    region: "East Asia",
    coord: "35.68°N · 139.69°E",
    image: "/images/cities/tokyo.webp",
  },
  {
    index: "03",
    name: "Seoul",
    region: "East Asia",
    coord: "37.56°N · 126.97°E",
    image: "/images/cities/seoul.webp",
  },
  {
    index: "04",
    name: "Berlin",
    region: "Europe",
    coord: "52.52°N · 13.40°E",
    image: "/images/cities/berlin.webp",
  },
  {
    index: "05",
    name: "Los Angeles",
    region: "North America",
    coord: "34.05°N · 118.24°W",
    image: "/images/cities/los-angeles.webp",
  },
  {
    index: "06",
    name: "Shanghai",
    region: "East Asia",
    coord: "31.23°N · 121.47°E",
    image: "/images/cities/shanghai.webp",
  },
];

const HOLD = 5000; // per-city hold

export function Network() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // preload
  useEffect(() => {
    CITIES.forEach((c) => {
      const img = new Image();
      img.src = c.image;
    });
  }, []);

  // auto-advance — always rotating when not hovered (pause-on-hover lets users dwell)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((p) => (p + 1) % CITIES.length);
    }, HOLD);
    return () => clearInterval(t);
  }, [paused]);

  const select = useCallback((i: number) => {
    setActive(i);
  }, []);

  const city = CITIES[active];

  return (
    <section
      id="network"
      ref={sectionRef}
      className="relative bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* opener */}
      <div className="min-h-[70svh] flex items-center">
        <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-10">
          <Reveal>
            <p className="label-track text-rouge-bright">II — The Network</p>
            <div className="hairline w-16 mt-6" />
          </Reveal>
          <Reveal delay={0.15}>
            <h2
              className="font-display text-bone mt-10 leading-[1.05] max-w-4xl"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)" }}
            >
              Six cities.
              <span className="text-bone-dim italic"> One coordinate.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-bone-dim font-light max-w-xl mt-8 leading-relaxed text-sm sm:text-base">
              The network rotates slowly between six of the world&apos;s most
              creative capitals. Each belongs to the same invisible whole. The
              connection is never explained — only felt.
            </p>
          </Reveal>
        </div>
      </div>

      {/* rotating cinematic showcase */}
      <div className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* crossfading skylines */}
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.16 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              scale: { duration: HOLD / 1000 + 1.8, ease: "easeOut" },
            }}
            className="absolute inset-0 z-0"
          >
            <img
              src={city.image}
              alt={`${city.name} skyline — Velvet Rouge network`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/30" />
          </motion.div>
        </AnimatePresence>

        {/* left: connected city index */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center px-6 sm:px-10 lg:px-16">
          <nav aria-label="Network cities" className="hidden sm:block">
            <ul className="flex flex-col gap-3 sm:gap-4">
              {CITIES.map((c, i) => (
                <li key={c.name}>
                  <button
                    onClick={() => select(i)}
                    className="group flex items-center gap-4 text-left"
                    aria-current={i === active}
                  >
                    <span
                      className={`block h-px transition-all duration-700 ${
                        i === active
                          ? "w-10 bg-rouge-bright"
                          : "w-5 bg-bone/30 group-hover:bg-bone/60"
                      }`}
                    />
                    <span
                      className={`label-track transition-colors duration-700 ${
                        i === active
                          ? "text-bone"
                          : "text-bone-faint group-hover:text-bone-dim"
                      }`}
                    >
                      {c.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* bottom-right: active city name + coord */}
        <div className="absolute bottom-10 right-6 sm:right-10 lg:right-16 z-10 text-right max-w-[60vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={city.index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <p className="label-track text-rouge-bright mb-4">
                {city.index} — {city.region}
              </p>
              <h3
                className="font-display text-bone leading-[0.95]"
                style={{ fontSize: "clamp(2.4rem, 6.5vw, 5rem)" }}
              >
                {city.name}
              </h3>
              <p className="label-track text-bone-faint mt-5">
                {city.coord}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* mobile city dots selector */}
        <div className="sm:hidden absolute bottom-10 left-6 z-10 flex flex-col gap-2.5">
          {CITIES.map((c, i) => (
            <button
              key={c.name}
              onClick={() => select(i)}
              aria-label={c.name}
              className="block w-6 h-px"
            >
              <span
                className={`block h-px transition-all duration-500 ${
                  i === active ? "w-6 bg-rouge-bright" : "w-3 bg-bone/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
