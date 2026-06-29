"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Evolution Layer 02 — Global Creative Culture.
   Creative Dispatches: cultural signals from across the network's cities.
   Editorial fragments — not analytics, not a dashboard. */

type Dispatch = {
  city: string;
  edition: string;
  time: string;
  fragment: string;
  accent: boolean;
};

const DISPATCHES: Dispatch[] = [
  {
    city: "Tokyo",
    edition: "Tonight in Tokyo",
    time: "02:11",
    fragment:
      "The signage has thinned to its true alphabet — red, rain, and the long pause between two reflections. The city is most itself at this hour.",
    accent: false,
  },
  {
    city: "Seoul",
    edition: "Late Night in Seoul",
    time: "04:48",
    fragment:
      "Gangnam has thinned to its true shape — glass, signage, and the long pause between two reflections. The city is most itself at this hour.",
    accent: true,
  },
  {
    city: "Berlin",
    edition: "Berlin Notes",
    time: "01:32",
    fragment:
      "Concrete keeps the cold the way memory keeps a voice. The creative district is not sleeping — it is listening.",
    accent: false,
  },
  {
    city: "Mexico City",
    edition: "City Observation",
    time: "23:07",
    fragment:
      "Reforma holds its altitude. The warm windows count upward like a slow inventory of everyone still awake and still building.",
    accent: false,
  },
  {
    city: "Los Angeles",
    edition: "Night Edition",
    time: "22:14",
    fragment:
      "The dusk has not finished leaving. Palms hold the last of it in their silhouettes; the hills switch on, one window at a time.",
    accent: false,
  },
  {
    city: "Shanghai",
    edition: "Creative Dispatch",
    time: "05:22",
    fragment:
      "The river is a mirror the towers have not yet stepped out of. Fog makes the future quieter, the way density always does before it speaks.",
    accent: true,
  },
];

export function CreativeDispatch() {
  return (
    <section
      id="dispatch"
      className="relative bg-ink-soft py-40 sm:py-52 overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 mb-24 sm:mb-32">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label-track text-rouge-bright">— Global Culture</p>
              <div className="hairline w-16 mt-7" />
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-display text-bone leading-[1.05]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                Dispatches from the
                <span className="text-bone-dim italic"> hours the world is asleep.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-bone-dim font-light max-w-xl mt-10 leading-relaxed text-sm sm:text-base">
                Cultural signals filed from across the network — not as data, but
                as observation. Each is a fragment of a city thinking aloud in the
                dark.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-bone/10">
          {DISPATCHES.map((d, i) => (
            <motion.article
              key={d.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 1.4, ease: EASE, delay: (i % 2) * 0.1 }}
              className="group grid grid-cols-12 gap-4 sm:gap-6 items-baseline py-10 sm:py-12 border-b border-bone/10 transition-colors duration-700 hover:bg-bone/[0.015]"
            >
              <span className="col-span-3 sm:col-span-2 label-track text-bone-faint">
                {d.time}
              </span>
              <span
                className="col-span-9 sm:col-span-4 font-display transition-transform duration-700 group-hover:translate-x-2"
                style={{
                  fontSize: "clamp(1.2rem, 2.6vw, 2rem)",
                  color: d.accent ? "#f5f2ed" : "#a8a39b",
                }}
              >
                {d.edition}
              </span>
              <p className="col-span-12 sm:col-span-5 font-display italic text-bone-dim leading-snug text-sm sm:text-base mt-2 sm:mt-0">
                {d.fragment}
              </p>
              <span className="hidden sm:flex sm:col-span-1 justify-end">
                <span
                  className="block w-1.5 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    background: d.accent ? "#5e1018" : "#3a3733",
                    opacity: d.accent ? 0.9 : 0.5,
                  }}
                />
              </span>
            </motion.article>
          ))}
        </div>

        <Reveal>
          <p
            className="font-display italic text-bone-dim mt-20 sm:mt-28 max-w-2xl leading-snug"
            style={{ fontSize: "clamp(1.2rem, 2.6vw, 1.9rem)" }}
          >
            The network does not report. It observes — and lets you overhear.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
