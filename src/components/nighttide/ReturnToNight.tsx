"use client";

import { motion } from "framer-motion";
import { useAudio } from "./AudioEngine";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ReturnToNight() {
  const audio = useAudio();
  return (
    <section
      id="return"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* faint breathing rouge glow */}
      <div
        aria-hidden
        className="breathe absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(94,16,24,0.1), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 2.4, ease: EASE }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <p className="label-track text-rouge-bright mb-10">Return</p>

        <p
          className="font-display text-bone leading-snug max-w-2xl"
          style={{ fontSize: "clamp(1.5rem, 3.8vw, 2.8rem)" }}
        >
          The night is not empty.
          <span className="text-bone-dim italic"> It is full of longing.</span>
        </p>

        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.4 }}
          className="block h-px w-28 bg-rouge-bright mt-14 origin-center"
        />

        <p
          className="font-display text-bone mt-14 tracking-[0.3em]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
        >
          11 · 11 · 2026
        </p>

        <p className="label-track text-bone-faint mt-8">Nighttide OS</p>

        <p className="label-track text-bone-faint mt-2">
          Noel Nichols — Founder
        </p>
      </motion.div>

      {/* audio mute toggle */}
      {audio && (
        <button
          onClick={audio.toggleMute}
          className="absolute bottom-8 right-6 sm:right-10 z-20 label-track text-bone-faint hover:text-bone transition-colors duration-700 flex items-center gap-3"
          aria-label={audio.muted ? "Unmute ambient sound" : "Mute ambient sound"}
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{
              background: audio.muted ? "#6b6862" : "#5e1018",
              opacity: audio.unlocked ? 1 : 0.4,
            }}
          />
          {audio.muted ? "Sound off" : "Sound on"}
        </button>
      )}
    </section>
  );
}
