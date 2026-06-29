"use client";

import { useSound } from "./SoundEngine";
import { useState } from "react";

/* Discreet sound toggle for the nav — top-right.
   Extremely minimal: a label "SOUND" + state, with a subtle pulsing dot
   when enabled. No large icons, no colorful buttons, no music player. */

export function SoundToggle() {
  const sound = useSound();
  const [hovered, setHovered] = useState(false);
  if (!sound) return null;
  const { enabled, toggle } = sound;

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-2.5 label-track text-bone-dim hover:text-bone transition-colors duration-700"
      aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      aria-pressed={enabled}
    >
      {/* subtle pulsing dot — only animates when enabled */}
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        <span
          className={`block w-1.5 h-1.5 rounded-full transition-colors duration-700 ${
            enabled ? "bg-rouge-bright" : "bg-bone/30"
          }`}
        />
        {enabled && (
          <span
            className="absolute inset-0 rounded-full bg-rouge-bright animate-sound-pulse"
            aria-hidden
          />
        )}
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className={hovered ? "text-bone" : ""}>Sound</span>
        <span
          className={`transition-colors duration-700 ${
            enabled ? "text-bone" : "text-bone-faint"
          }`}
        >
          {enabled ? "On" : "Off"}
        </span>
      </span>
    </button>
  );
}
