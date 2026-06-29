"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Evolution Layer 01 — Living Editorial.
   Night Notes: a quiet editorial column that drifts in while scrolling.
   Curated fragments — Editor's Journal, Featured Observation, Curator's Note.
   Feels like a magazine margin, not a feed. */

type Note = {
  kind: string;
  date: string;
  body: string;
  attribution: string;
};

const NOTES: Note[] = [
  {
    kind: "Editor's Journal",
    date: "Vol. II — No. 003",
    body: "The night does not arrive. It accumulates — first in the windows, then in the streets, then in the way a city begins to listen to itself.",
    attribution: "— N.N.",
  },
  {
    kind: "Featured Observation",
    date: "Field Note · 03:14",
    body: "Tokyo, somewhere past midnight: a single window still lit on the forty-second floor. Someone is still building something no one will see tonight.",
    attribution: "— The Editors",
  },
  {
    kind: "Curator's Note",
    date: "From the Archive",
    body: "We collect cities the way others collect objects — for the feeling they leave in the room after you have left. Velvet Rouge is the room.",
    attribution: "— V.R.",
  },
];

export function NightNotes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const labelY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="night-notes"
      ref={ref}
      className="relative bg-ink py-40 sm:py-52 overflow-hidden"
    >
      <div className="absolute left-6 sm:left-12 top-0 bottom-0 w-px bg-bone/5 hidden md:block" />

      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24">
          <div className="lg:col-span-3">
            <motion.div style={{ y: labelY }}>
              <Reveal>
                <p className="label-track text-rouge-bright">— Living Editorial</p>
                <div className="hairline w-16 mt-7" />
                <h3
                  className="font-display text-bone mt-8 leading-[1.1]"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
                >
                  Night Notes
                </h3>
                <p className="font-display italic text-bone-dim mt-4 text-sm sm:text-base">
                  The margin of the publication — where the editors think aloud.
                </p>
              </Reveal>
            </motion.div>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-20 sm:gap-28">
            {NOTES.map((note, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <article className="group max-w-2xl">
                  <div className="flex items-baseline gap-5 mb-6">
                    <span className="label-track text-rouge-bright">
                      {note.kind}
                    </span>
                    <span className="h-px flex-1 bg-bone/10" />
                    <span className="label-track text-bone-faint">
                      {note.date}
                    </span>
                  </div>
                  <p
                    className="font-display text-bone leading-[1.4] transition-colors duration-700"
                    style={{ fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)" }}
                  >
                    {note.body}
                  </p>
                  <p className="label-track text-bone-faint mt-6">
                    {note.attribution}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
