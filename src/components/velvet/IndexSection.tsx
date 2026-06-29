"use client";

import { Reveal } from "./Reveal";

const STATS = [
  { value: "06", label: "Cities" },
  { value: "04", label: "Continents" },
  { value: "01", label: "Network" },
  { value: "MMXXVI", label: "Chapter" },
];

export function IndexSection() {
  return (
    <section
      id="index"
      className="relative min-h-[100svh] flex items-center bg-ink py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="label-track text-rouge-bright">IV — Index</p>
              <div className="hairline w-16 mt-6" />
              <h2
                className="font-display text-bone mt-10 leading-[1.05]"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                Nothing is announced.
                <br />
                <span className="text-bone-dim italic">Everything is felt.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8 lg:pl-12 lg:border-l lg:border-bone/10">
            <div className="grid grid-cols-2 gap-y-16 sm:gap-y-20 gap-x-8">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.1}>
                  <div>
                    <p
                      className="font-display text-bone leading-none"
                      style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                    >
                      {s.value}
                    </p>
                    <p className="label-track text-bone-faint mt-5">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-24 sm:mt-28 max-w-xl">
                <p className="text-bone-dim font-light leading-relaxed text-sm sm:text-base">
                  The network is not open. It is extended, coordinate by
                  coordinate, between those who already hold the thread. If your
                  city belongs to the conversation, you will be found.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
