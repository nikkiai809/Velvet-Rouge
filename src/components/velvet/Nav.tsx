"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { SoundToggle } from "./SoundToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Thread", href: "#manifesto" },
  { label: "Network", href: "#network" },
  { label: "Coordinates", href: "#coordinates" },
  { label: "Index", href: "#index" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-[70] transition-all duration-700",
        scrolled
          ? "bg-ink/75 backdrop-blur-md py-5"
          : "bg-transparent py-8"
      )}
    >
      <div className="mx-auto max-w-[1500px] px-6 sm:px-12 flex items-center justify-between">
        <a href="#top" className="group" aria-label="Velvet Rouge — home">
          <Wordmark small className="group-hover:text-bone/80 transition-colors duration-700" />
        </a>

        <nav className="hidden md:flex items-center gap-12">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-track text-bone-dim hover:text-bone transition-colors duration-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* discreet sound toggle — top-right, integrates naturally into nav */}
        <SoundToggle />
      </div>
    </header>
  );
}
