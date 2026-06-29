# VELVET ROUGE — Global Creative Network

> *A private global creative network connecting the world's most creative cities.*

**Est. MMXXV · By Invitation**

**Five cities, one coordinate.** Velvet Rouge is not a brand, not an event, not a place. It is a private network drawn between five cities — a single coordinate of culture that moves, once a year, across the globe. Nothing is announced. Everything is implied.

---

## Live

🌐 **https://velvetrouge.space-z.ai**

---

## The Network

| # | City | Region | Coordinates |
|---|------|--------|-------------|
| — | Mexico City | North America | 19.43°N · 99.13°W |
| 01 | Tokyo | East Asia | 35.68°N · 139.69°E |
| 02 | Seoul | East Asia | 37.56°N · 126.97°E |
| 03 | Paris | Europe | 48.85°N · 2.35°E |
| 04 | Los Angeles | North America | 34.05°N · 118.24°W |
| 05 | Shanghai | East Asia | 31.23°N · 121.47°E |

---

## Sections

| Section | Description |
|---------|-------------|
| **Nav** | Persistent navigation with city index |
| **Scroll Progress** | Ambient scroll indicator |
| **Hero** | Full-screen entrance with emblem and reveal |
| **Manifesto** | The Thread — the invisible connection |
| **Night Notes** | Living editorial — observations from the network |
| **Network** | City showcase with full-bleed photography + mood shader |
| **Creative Dispatch** | Cultural signals filed from across the network |
| **Editorial Archive** | Collected observations, field notes, fragments |
| **Coordinates** | The five cities with their geographic positions |
| **Index** | Network statistics: 5 cities, 3 continents, 1 network |
| **Film** | Cinematic full-screen viewing experience |
| **Footer** | Emblem, timezone, cypher |

---

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | TailwindCSS v4 + shadcn/ui |
| **Animation** | Framer Motion (scroll, reveal, transitions) |
| **Sound** | Procedural Web Audio (dual engine: SoundEngine + Nighttide AudioEngine) |
| **Database** | Prisma + SQLite (local) |
| **Deployment** | space-z.ai (Alibaba Cloud · Hong Kong) |

### Sound System

Two procedural audio engines:
- **SoundEngine** (Velvet tier) — ambient soundscapes (night-skyline, rain, studio, ocean, city-lights)
- **Nighttide AudioEngine** (Night tier) — per-city sound layers with oscillators, filters, noise, pulse
- Never autoplays — requires explicit user toggle
- Page-visibility ducking (35% volume when tab hidden)
- Full `prefers-reduced-motion` support
- localStorage preference persistence + soundscape selection

### Assets

City photography in `/public/editorial/`:
- `city-tokyo.png` · `city-seoul.png` · `city-paris.png` · `city-la.png` · `city-shanghai.png`
- `city-mexico.png` · `city-berlin.png` (present in assets, not yet activated in code)

---

## Project Structure

```
velvet-rouge/
├── src/
│   ├── app/                    → Next.js App Router pages + API
│   │   ├── page.tsx            → Main page (all sections)
│   │   ├── layout.tsx          → Root layout (Manrope + Inter fonts)
│   │   ├── globals.css         → Tailwind v4 + custom CSS
│   │   └── api/                → API routes
│   ├── components/
│   │   ├── velvet/             → Velvet Rouge components (16)
│   │   │   ├── Nav.tsx, Hero.tsx, Manifesto.tsx, NightNotes.tsx
│   │   │   ├── Network.tsx, CreativeDispatch.tsx, EditorialArchive.tsx
│   │   │   ├── Coordinates.tsx, IndexSection.tsx, Film.tsx, Footer.tsx
│   │   │   ├── SoundEngine.tsx, SoundToggle.tsx
│   │   │   ├── ScrollProgress.tsx, Wordmark.tsx, Reveal.tsx
│   │   └── nighttide/         → Nighttide immersive layer (10)
│   │   │   ├── AudioEngine.tsx, CityImmersion.tsx, CityShader.tsx
│   │   │   ├── GlobalState.tsx, ManifestoEngine.ts
│   │   │   ├── MemoryPanel.tsx, NightEntry.tsx, NightNetwork.tsx
│   │   │   ├── ReturnToNight.tsx, cities.ts
│   │   └── ui/                → shadcn/ui components (48)
│   ├── hooks/                  → Custom hooks (use-mobile, use-toast)
│   └── lib/                    → Utilities, DB, stores
│       ├── nighttide-store.ts  → Zustand store (global state, memory)
│       ├── manifesto.ts, db.ts, utils.ts
├── public/
│   ├── editorial/              → City photography (11 assets)
│   └── images/cities/          → Additional city images
├── prisma/                     → Prisma schema + migrations
├── db/                         → SQLite database
├── BRAND-STRATEGY.md           → Brand positioning, voice, visual direction
├── BUILD-LOG-ZAI.md            → Build log from z.ai
└── README.md                   → This file
```

---

## Brand

The complete brand strategy is documented in [`BRAND-STRATEGY.md`](./BRAND-STRATEGY.md), covering:
- Emotional strategy and arc
- Positioning and voice
- Visual direction (colors, typography, animation)
- Immersive features
- Creative references (Wong Kar-wai, Sofia Coppola, Ryuichi Sakamoto)

---

## Repository

This repository contains the **complete source code** of Velvet Rouge, migrated from the z.ai development environment to GitHub for version control and collaboration.

**Upstream:** Development continues on z.ai — this repo is synced periodically.

## License

© MMXXVI — Velvet Rouge. By Invitation.
