# The Descent

A browser-based fantasy-league roguelite idle dungeon crawler. It includes manager/class/buff setup, deterministic serializable auto-combat with per-class abilities, 18 data-driven floors, four distinct boss checks, checkpoint rewards with reward rerolls and a between-period gold shop, equipment, autosave/continue, an unlocked-achievement gallery, a fail-soft League Hub, run summaries, and live balance telemetry.

## Run locally

```bash
npm install
npm run dev
```

Build with `npm run build`. Netlify uses `netlify.toml` to publish `dist`; no environment variables are required for the offline-first slice.

## Balance

Edit `src/data.ts`: `BALANCE` contains floor HP/attack growth, boss multipliers, healing and loot curves, reward cadence, encounters per floor, and the expected clear duration. The in-game telemetry panel exposes effective DPS, TTK, survival time, recent damage/healing, and current difficulty.

Combat state is plain serializable data in `src/types.ts`; transitions live in `src/engine.ts`. Content lives in `src/data.ts` for now and can be split by domain as it grows.

## Current limits / next phase

The full run loop, shop/rerolls, achievements, and the League Hub UI are all in. Interactive shrines, crafting, expanded item/enemy pools, and live Supabase persistence remain next-phase work. Saves, runs, and unlocked achievements currently stay in localStorage; the League Hub and run/achievement submission call Netlify Functions that fail soft when no backend is configured. A locked-down Supabase schema scaffold lives in `supabase/`, and `netlify/functions/achievement-feed.ts` + `netlify/lib/supabase.ts` show the wired pattern — no backend is required to play.
