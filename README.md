# ELAIA — Residenza Ponteranica

Landing page di lusso per ELAIA, 7 residenze esclusive in classe A4 a Ponteranica (Bergamo), commercializzate da RE/MAX Expo Italia.

## Stack

- Vite 7 + React 19 + TypeScript
- Tailwind CSS 3.4 (config in `.cjs`)
- Lenis 1.3 (smooth scroll) + GSAP 3.15 + ScrollTrigger
- Supabase JS (lead form)
- split-type (text reveal)

## Comandi

```bash
npm install       # installa dipendenze
npm run dev       # dev server su localhost:5173
npm run build     # build production in dist/
npm run preview   # preview build locale
npm run lint      # eslint
```

## Struttura

```
src/
  components/         # un componente per sezione
  providers/          # SmoothScrollProvider (Lenis)
  hooks/              # useRevealObserver
  lib/                # gsap.ts, supabase.ts
public/
  images/             # foto/render del progetto
  logo-*.svg          # loghi ELAIA + RE/MAX
  privacy.html        # informativa privacy
```

## Env vars (`.env.local`)

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## Deploy

Vercel — collegato al branch `main`. Build command: `npm run build`, output `dist/`.

## Contesto progetto

- 7 unità (3 trilocali · 2 quadrilocali · 2 attici)
- Classe A4, vista Parco dei Colli
- Prezzi da 295k / 420k / 600k €
- Indirizzo agenzia: P.za Don Sergio Colombo 4, Bergamo
- Tel: +39 333 289 5941 · mbrissoni@remax.it
