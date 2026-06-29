"use client";

import { Reveal } from "./Reveal";
import { CITIES } from "./Network";

export function Coordinates() {
  return (
    <section
      id="coordinates"
      className="relative bg-ink-soft py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 sm:mb-24">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="label-track text-rouge-bright">III — Coordinates</p>
              <div className="hairline w-16 mt-6" />
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <Reveal delay={0.1}>
              <h2
                className="font-display text-bone leading-[1.05]"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)" }}
              >
                The map is not drawn.
                <span className="text-bone-dim italic"> It is implied.</span>
              </h2>
            </Reveal>
          </div>
        </div>

        {/* editorial index of all cities */}
        <Reveal delay={0.15}>
          <div className="border-t border-bone/10">
            {CITIES.map((c) => (
              <div
                key={c.name}
                className="group grid grid-cols-12 items-baseline gap-4 py-6 sm:py-8 border-b border-bone/10 transition-colors duration-500 hover:bg-ink/40"
              >
                <span className="col-span-2 sm:col-span-1 label-track text-rouge-bright">
                  {c.index}
                </span>
                <span
                  className="col-span-10 sm:col-span-5 font-display text-bone transition-transform duration-500 group-hover:translate-x-2"
                  style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
                >
                  {c.name}
                </span>
                <span className="hidden sm:block sm:col-span-3 label-track text-bone-faint">
                  {c.region}
                </span>
                <span className="col-span-12 sm:col-span-3 label-track text-bone-dim text-right">
                  {c.coord}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
