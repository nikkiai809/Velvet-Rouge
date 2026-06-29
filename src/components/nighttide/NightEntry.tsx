"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAudio } from "./AudioEngine";
import { useSystem, useIsReturningVisitor } from "./GlobalState";
import { buildManifesto } from "./ManifestoEngine";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Char-by-char fade-reveal line — "type + fade hybrid" */
function TypeLine({
  text,
  delay,
  start,
}: {
  text: string;
  delay: number;
  start: boolean;
}) {
  const chars = Array.from(text);
  const perChar = 0.045;
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={start ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: EASE, delay }}
      className="font-display text-bone/95"
      style={{
        fontSize: "clamp(1.4rem, 4vw, 2.7rem)",
        lineHeight: 1.32,
        letterSpacing: "-0.005em",
      }}
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span key={i} className="char-mask">
          <motion.span
            className="char-inner"
            initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }}
            animate={
              start
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: "0.5em", filter: "blur(6px)" }
            }
            transition={{
              duration: 0.9,
              ease: EASE,
              delay: delay + i * perChar,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

export function NightEntry() {
  const audio = useAudio();
  const enterSystem = useSystem((s) => s.enterSystem);
  const markManifestoSeen = useSystem((s) => s.markManifestoSeen);
  const visits = useSystem((s) => s.userMemory.visits);
  const seenManifesto = useSystem((s) => s.userMemory.seenManifesto);
  const mood = useSystem((s) => s.mood);
  const intensity = useSystem((s) => s.intensity);
  const isReturning = useIsReturningVisitor();

  const [entered, setEntered] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  // Build manifesto from global state — dynamic per visit/mood
  const lines = useMemo(
    () =>
      buildManifesto({
        globalState: "night",
        mood,
        city: null,
        visits: seenManifesto ? visits : 0,
      }),
    [mood, visits, seenManifesto]
  );

  // reveal manifesto lines sequentially after entering
  useEffect(() => {
    if (!entered) return;
    // returning visitors get faster pacing (subtle variation)
    const baseDelay = isReturning ? 900 : 1600;
    const stepDelay = isReturning ? 2400 : 3200;
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setLineIdx(i + 1), baseDelay + i * stepDelay)
      );
    });
    // mark manifesto as seen once fully revealed
    timers.push(
      setTimeout(() => markManifestoSeen(), baseDelay + lines.length * stepDelay)
    );
    return () => timers.forEach(clearTimeout);
  }, [entered, lines, isReturning, markManifestoSeen]);

  const handleEnter = () => {
    audio?.unlock();
    audio?.click();
    audio?.setMoodIntensity(intensity);
    enterSystem();
    setEntered(true);
  };

  const entryLabel = isReturning ? "Return to the night" : "Enter Nighttide";

  return (
    <section
      id="entry"
      className="relative min-h-[100svh] w-full overflow-hidden night-bg vignette"
    >
      {/* night skyline reveal — fades in after enter */}
      <AnimatePresence>
        {entered && (
          <motion.div
            key="night"
            initial={{ opacity: 0 }}
            animate={{ opacity: isReturning ? 0.32 : 0.42 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: EASE }}
            className="absolute inset-0 z-0"
          >
            <img
              src="/editorial/city-tokyo.png"
              alt=""
              aria-hidden
              className="drift city-grade h-full w-full object-cover"
              style={{ filter: "brightness(0.45) saturate(0.9)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/60 to-[#050506]/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* grain + bloom overlay */}
      <div className="pointer-events-none absolute inset-0 z-30 bloom opacity-100" />

      {/* ENTER PORTAL */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: EASE }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6"
          >
            <motion.button
              onClick={handleEnter}
              onMouseEnter={() => audio?.hover()}
              className="group flex flex-col items-center gap-8"
              aria-label={entryLabel}
            >
              <span className="portal block w-16 h-16 rounded-full border border-bone/30" />
              <span className="label-track text-bone-dim group-hover:text-bone transition-colors duration-700">
                {entryLabel}
              </span>
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: EASE, delay: 1 }}
              className="absolute bottom-10 label-track text-bone-faint text-[0.6rem]"
            >
              Sound recommended · Headphones
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MANIFESTO */}
      <div className="relative z-20 min-h-[100svh] flex flex-col items-center justify-center px-6">
        <AnimatePresence>
          {entered && (
            <motion.div
              key="manifesto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: EASE }}
              className="flex flex-col items-center text-center gap-9 sm:gap-11 max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
                className="label-track text-rouge-bright"
              >
                Nighttide OS
              </motion.p>

              {lines.map((line, i) => (
                <TypeLine
                  key={i}
                  text={line}
                  delay={1.4 + i * 0.2}
                  start={lineIdx > i}
                />
              ))}

              {/* scroll cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={
                  lineIdx >= lines.length
                    ? { opacity: 1 }
                    : { opacity: 0 }
                }
                transition={{ duration: 1.6, ease: EASE, delay: 1.2 }}
                className="mt-6 flex flex-col items-center gap-3"
                aria-hidden
              >
                <span className="label-track text-bone-faint text-[0.6rem]">
                  Continue into the night
                </span>
                <span className="cue block w-px h-8 bg-bone/40" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SIGNATURE — bottom right, minimal fade-in */}
      <AnimatePresence>
        {entered && lineIdx >= lines.length && (
          <motion.div
            key="signature"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, ease: EASE, delay: 0.6 }}
            className="absolute bottom-8 right-6 sm:bottom-10 sm:right-10 z-30 flex flex-col items-end gap-2"
          >
            <span className="font-display text-bone text-base sm:text-lg tracking-wide">
              Noel Nichols
            </span>
            <span className="label-track text-bone-faint">Founder</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
