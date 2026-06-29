"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Cinematic vertical "video" — cities only, no people.
   Cycles through city verticals with slow push-in crossfades,
   then resolves to a black frame that slowly reveals
   11 · 11 · 2026 + a single thin velvet-red line,
   holds, fades, and loops. */
const FRAMES = [
  "/images/cities/tokyo.webp",
  "/images/cities/shanghai.webp",
  "/images/cities/mexico-city.webp",
  "/images/cities/seoul.webp",
  "/images/cities/los-angeles.webp",
];

const CITY_HOLD = 3800;
const FADE = 1500;
const DATE_REVEAL = 2600;
const DATE_HOLD = 2200;
const BLACK_HOLD = 1200;

type Phase = "cities" | "black";

export function Film() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("cities");
  const [showDate, setShowDate] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // preload
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // observe section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // state machine
  useEffect(() => {
    if (!inView) return;
    if (phase === "black") {
      // black -> reveal date -> hold -> fade out -> loop
      const t1 = setTimeout(() => setShowDate(true), 300);
      const t2 = setTimeout(() => {}, DATE_REVEAL);
      const t3 = setTimeout(() => setFadeOut(true), DATE_REVEAL + DATE_HOLD);
      const t4 = setTimeout(() => {
        // reset to loop
        setI(0);
        setPhase("cities");
        setShowDate(false);
        setFadeOut(false);
      }, DATE_REVEAL + DATE_HOLD + BLACK_HOLD);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
    // cities phase — advance through frames
    const t = setInterval(() => {
      setI((p) => {
        if (p + 1 >= FRAMES.length) {
          setPhase("black");
          return 0;
        }
        return p + 1;
      });
    }, CITY_HOLD);
    return () => clearInterval(t);
  }, [inView, phase]);

  return (
    <section
      ref={sectionRef}
      aria-label="Velvet Rouge — 11 · 11 · 2026"
      className="relative min-h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* faint rouge glow behind the frame */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(94,16,24,0.12), transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "cities" ? (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="relative z-10 flex items-center justify-center w-full"
          >
            {/* vertical frame — 90% mobile, ~40% desktop */}
            <div
              className="relative vignette aspect-[9/16] w-[90vw] sm:w-auto sm:h-[88svh] rounded-none overflow-hidden bg-black"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={i}
                  src={FRAMES[i]}
                  alt=""
                  aria-hidden
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1.18 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: FADE / 1000, ease: "easeInOut" },
                    scale: { duration: CITY_HOLD / 1000, ease: "easeOut" },
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* film grain over the frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.12] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: "200px 200px",
                }}
              />
              {/* letterbox crop */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[6%] bg-black z-30" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[6%] bg-black z-30" />
              <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-bone/5" />
            </div>
          </motion.div>
        ) : (
          /* FINAL FRAME — black, slowly reveal date + velvet line */
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            transition={{ duration: 2.2, ease: EASE }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={
                showDate
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 10, filter: "blur(6px)" }
              }
              transition={{ duration: 2.6, ease: EASE }}
              className="font-display text-bone text-center"
              style={{
                fontSize: "clamp(1.1rem, 2.4vw, 1.9rem)",
                letterSpacing: "0.32em",
              }}
            >
              11 · 11 · 2026
            </motion.p>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={showDate ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 2, ease: EASE, delay: 0.6 }}
              className="block h-px w-24 sm:w-32 bg-rouge-bright mt-10 origin-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
