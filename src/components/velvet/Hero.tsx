"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 28, damping: 22, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 28, damping: 22, mass: 0.8 });
  // almost imperceptible — ±5px
  const tx = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const ty = useTransform(sy, [-0.5, 0.5], [-4, 4]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden vignette"
    >
      {/* faint velvet glow at center */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(94,16,24,0.14), transparent 70%)",
        }}
      />

      <motion.div
        style={{ x: tx, y: ty }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: EASE, delay: 0.2 }}
          className="label-track text-bone-faint mb-10 sm:mb-14"
        >
          Est. MMXXV — A Private Network
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.45 }}
          className="wordmark text-bone leading-none"
          style={{ fontSize: "clamp(2rem, 7.5vw, 6rem)" }}
        >
          Velvet&nbsp;Rouge
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 1.5 }}
          className="h-px w-24 sm:w-40 bg-bone/30 mt-12 sm:mt-16 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 1.8 }}
          className="label-track text-bone mt-12 sm:mt-14"
          style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)" }}
        >
          Global Creative Network
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: EASE, delay: 2.2 }}
          className="font-display italic text-bone-dim mt-5 max-w-md"
          style={{ fontSize: "clamp(1rem, 2.2vw, 1.45rem)", letterSpacing: "0.02em" }}
        >
          Connecting culture through cities.
        </motion.p>
      </motion.div>

      {/* scroll cue — minimal cinematic line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        aria-hidden
      >
        <span className="block w-px h-12 bg-gradient-to-b from-transparent via-bone/50 to-transparent" />
        <span className="cue block w-1 h-1 rounded-full bg-bone/60" />
      </motion.div>

      {/* bottom meta row */}
      <div className="absolute bottom-8 inset-x-0 z-10 hidden sm:flex items-center justify-between px-10 max-w-[1500px] mx-auto">
        <span className="label-track text-bone-faint text-[0.6rem]">Vol. II</span>
        <span className="label-track text-bone-faint text-[0.6rem]">
          11 · 11 · 2026
        </span>
      </div>
    </section>
  );
}
