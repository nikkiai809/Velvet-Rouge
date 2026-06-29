"use client";

import { useEffect, useRef } from "react";
import type { CityId } from "./AudioEngine";

/* ------------------------------------------------------------------ */
/*  Cinematic city shader layers — lightweight canvas particles.        */
/*  Each city has a distinct visual behaviour. All slow, all film-like. */
/* ------------------------------------------------------------------ */

type Shader = CityId[""] extends never ? never : "rain" | "pulse" | "haze" | "glow" | "depth";

type Props = {
  shader: Shader;
  accent: string;
  intensity: number; // 0..1
};

export function CityShader({ shader, accent, intensity }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // hex -> rgb
    const hex = accent.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const count = Math.round(
      shader === "rain" ? 90 * intensity : shader === "depth" ? 40 : 55
    );

    // particle init
    type P = { x: number; y: number; vx: number; vy: number; s: number; a: number };
    const ps: P[] = [];
    for (let i = 0; i < count; i++) ps.push(spawn());

    function spawn(): P {
      const x = Math.random() * w;
      const y = Math.random() * h;
      switch (shader) {
        case "rain":
          return { x, y, vx: -0.3, vy: 2.4 + Math.random() * 2.2, s: 1, a: 0.2 + Math.random() * 0.5 };
        case "pulse":
          return { x, y, vx: 0, vy: 0, s: 1 + Math.random() * 2.5, a: 0.1 + Math.random() * 0.3 };
        case "haze":
          return {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.15,
            vy: -0.12 - Math.random() * 0.15,
            s: 30 + Math.random() * 60,
            a: 0.03 + Math.random() * 0.05,
          };
        case "glow":
          return {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.2,
            s: 1.5 + Math.random() * 3,
            a: 0.15 + Math.random() * 0.4,
          };
        case "depth":
          return {
            x,
            y,
            vx: -0.08 - Math.random() * 0.12,
            vy: 0,
            s: 1 + Math.random() * 2.5,
            a: 0.1 + Math.random() * 0.3,
          };
      }
    }

    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;

        // recycle
        if (shader === "rain") {
          if (p.y > h + 4) {
            p.y = -4;
            p.x = Math.random() * w;
          }
          if (p.x < -4) p.x = w + 4;
          ctx.strokeStyle = `rgba(${r},${g},${b},${p.a})`;
          ctx.lineWidth = p.s;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 3);
          ctx.stroke();
        } else if (shader === "pulse") {
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + p.x * 0.01);
          const aa = p.a * pulse;
          ctx.fillStyle = `rgba(${r},${g},${b},${aa})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
          ctx.fill();
          if (p.s > 0.5) {
            p.s += 0.002;
            if (p.s > 4) p.s = 1;
          }
        } else if (shader === "haze") {
          if (p.y < -p.s) {
            p.y = h + p.s;
            p.x = Math.random() * w;
          }
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s);
          grad.addColorStop(0, `rgba(${r},${g},${b},${p.a})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
          ctx.fill();
        } else if (shader === "glow") {
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4;
          if (p.y > h + 4) p.y = -4;
          const aa = p.a * (0.6 + 0.4 * Math.sin(t * 0.8 + p.x * 0.02));
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 4);
          grad.addColorStop(0, `rgba(${r},${g},${b},${aa})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s * 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (shader === "depth") {
          if (p.x < -4) {
            p.x = w + 4;
            p.y = Math.random() * h;
          }
          ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
          ctx.fillRect(p.x, p.y, p.s * 8, p.s);
        }
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [shader, accent, intensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ mixBlendMode: "screen", opacity: 0.8 }}
    />
  );
}
