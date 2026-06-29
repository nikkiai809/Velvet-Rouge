"use client";

import { RevealLines } from "./Reveal";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative min-h-[100svh] flex items-center bg-ink py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1500px] w-full px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="label-track text-rouge-bright">I — The Thread</p>
            <div className="hairline w-16 mt-6" />
          </div>

          <div className="lg:col-span-9">
            <RevealLines
              className="font-display text-bone"
              lines={[
                <span
                  key="0"
                  style={{ fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)" }}
                  className="leading-[1.15] tracking-[-0.01em]"
                >
                  There is something quietly happening
                </span>,
                <span
                  key="1"
                  style={{ fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)" }}
                  className="leading-[1.15] tracking-[-0.01em] text-bone-dim italic"
                >
                  across the world&apos;s most creative cities.
                </span>,
                <span
                  key="2"
                  style={{ fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)" }}
                  className="leading-[1.15] tracking-[-0.01em]"
                >
                  An invisible thread connects them.
                </span>,
                <span
                  key="3"
                  style={{ fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)" }}
                  className="leading-[1.15] tracking-[-0.01em] text-bone-dim italic"
                >
                  We do not explain the thread.
                </span>,
                <span
                  key="4"
                  style={{ fontSize: "clamp(1.7rem, 4.6vw, 3.6rem)" }}
                  className="leading-[1.15] tracking-[-0.01em]"
                >
                  We only hold it.
                </span>,
              ]}
            />

            <div className="mt-16 sm:mt-24 max-w-2xl">
              <p className="text-bone-dim font-light leading-relaxed text-sm sm:text-base">
                Velvet Rouge is not a brand, not an event, not a place. It is a
                private network drawn between six cities — a single
                coordinate of culture that moves, once a year, across the
                globe. Nothing is announced. Everything is implied.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
