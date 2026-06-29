"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Evolution Layer 03 — Editorial Archive.
   A curated archive of editorial objects — Field Notes, Creative Fragments,
   Collected Thoughts, Night Collections. Everything feels collected, never
   generated. Asymmetric, like a printed archive page. */

type ArchiveObject = {
  index: string;
  kind: string;
  title: string;
  excerpt: string;
  date: string;
  span: string;
  featured?: boolean;
};

const OBJECTS: ArchiveObject[] = [
  {
    index: "A—01",
    kind: "Field Note",
    title: "On the architecture of waiting",
    excerpt:
      "Every city has a building where people wait for something that has already happened. We collect them.",
    date: "MMXXVI · 03",
    span: "lg:col-span-7",
    featured: true,
  },
  {
    index: "A—02",
    kind: "Creative Fragment",
    title: "The 03:00 interval",
    excerpt:
      "Between three and four, a city stops performing and begins remembering. This is the hour we publish for.",
    date: "MMXXVI · 02",
    span: "lg:col-span-5",
  },
  {
    index: "A—03",
    kind: "Collected Thought",
    title: "Density as a form of silence",
    excerpt:
      "Shanghai taught us that the future is loudest just before it decides to be quiet.",
    date: "MMXXVI · 02",
    span: "lg:col-span-5",
  },
  {
    index: "A—04",
    kind: "Night Collection",
    title: "Windows still lit",
    excerpt:
      "A running collection — one window, per city, per night, still burning past midnight. The inventory of the unfinished.",
    date: "Ongoing",
    span: "lg:col-span-7",
    featured: true,
  },
  {
    index: "A—05",
    kind: "Observation",
    title: "What the river keeps",
    excerpt:
      "Berlin, Shanghai, Tokyo — the river is the part of the city that never sleeps because it is always leaving.",
    date: "MMXXVI · 01",
    span: "lg:col-span-6",
  },
  {
    index: "A—06",
    kind: "Letter",
    title: "To the visitor, after midnight",
    excerpt:
      "You are not late. You are exactly on time for the part of the city that only opens to those who stayed.",
    date: "MMXXVI · 01",
    span: "lg:col-span-6",
  },
];

export function EditorialArchive() {
  return (
    <section
      id="archive"
      className="relative bg-ink py-40 sm:py-52 overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 mb-24 sm:mb-32">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label-track text-rouge-bright">— The Archive</p>
              <div className="hairline w-16 mt-7" />
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-display text-bone leading-[1.05]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                Collected, never
                <span className="text-bone-dim italic"> generated.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="text-bone-dim font-light max-w-xl mt-10 leading-relaxed text-sm sm:text-base">
                The archive grows slowly — one observation at a time. These are
                not posts. They are objects, gathered the way a publication
                gathers its quietest pages.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {OBJECTS.map((obj, i) => (
            <motion.article
              key={obj.index}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 1.5, ease: EASE, delay: (i % 2) * 0.12 }}
              className={`group relative ${obj.span} border border-bone/10 p-10 sm:p-12 transition-colors duration-700 hover:border-bone/25 ${
                obj.featured ? "bg-ink-soft" : "bg-ink"
              }`}
            >
              <div className="flex items-baseline justify-between mb-8">
                <span className="label-track text-rouge-bright">{obj.kind}</span>
                <span className="label-track text-bone-faint">{obj.index}</span>
              </div>

              <h3
                className="font-display text-bone leading-[1.1] transition-transform duration-700 group-hover:translate-x-1"
                style={{
                  fontSize: obj.featured
                    ? "clamp(1.6rem, 3.4vw, 2.6rem)"
                    : "clamp(1.3rem, 2.6vw, 1.9rem)",
                }}
              >
                {obj.title}
              </h3>

              <p
                className={`font-display italic text-bone-dim leading-snug mt-5 ${
                  obj.featured ? "max-w-md" : "max-w-sm"
                }`}
                style={{
                  fontSize: obj.featured
                    ? "clamp(1rem, 1.8vw, 1.25rem)"
                    : "clamp(0.9rem, 1.4vw, 1.05rem)",
                }}
              >
                {obj.excerpt}
              </p>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-bone/5">
                <span className="label-track text-bone-faint">{obj.date}</span>
                <span className="label-track text-bone-faint group-hover:text-bone-dim transition-colors duration-700 flex items-center gap-2">
                  <span className="block w-4 h-px bg-current" />
                  Open
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <Reveal>
          <div className="mt-20 sm:mt-28 flex items-center justify-between">
            <p className="label-track text-bone-faint">
              The archive is not indexed. It is wandered.
            </p>
            <p className="label-track text-bone-faint">Vol. II — Ongoing</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
