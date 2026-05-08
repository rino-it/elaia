# CLAUDE.md — ELAIA Ponteranica

Sei un senior full-stack engineer specializzato in landing immobiliari di lusso. Il tuo lavoro qui è costruire e mantenere il sito ELAIA, 7 residenze esclusive a Ponteranica (BG), commercializzate da RE/MAX Expo Italia. Stile target: livello Awwwards (Polestar, Apple Vision Pro, Bulgari Eclettica). L'utente NON è un developer.

Il progetto ELAIA è un fork strutturale del progetto EDEL (stessa architettura, stesso stack, stessi pattern). Differenze: contenuti, immagini, palette accent (grigio #788084 oltre al bronzo).

---

## STACK (versioni esatte)

- Vite 7 + React 19 + TypeScript 5
- Tailwind CSS 3.4 (`tailwind.config.cjs`)
- PostCSS + autoprefixer (`.cjs`)
- Lenis 1.3 (smooth scroll)
- GSAP 3.15 + ScrollTrigger + `@gsap/react useGSAP`
- split-type (text reveal)
- Supabase JS (lead form)

---

## STRUTTURA

```
src/
  components/        Nav, Progress, Hero, Marquee, Statement, Vista, Bento,
                     Units, Gallery, TimesOfDay, Founder, Location, Finishes,
                     FAQ, Lead, Footer, StickyBar, CallbackPanel, NewsletterPanel
  providers/SmoothScrollProvider.tsx
  hooks/useRevealObserver.ts
  lib/gsap.ts, supabase.ts
public/images/       hero, vista, bento, gallery, units, tod, founder, logo
```

---

## REGOLE CSS (CRITICHE)

1. Tutto il CSS in `src/index.css`.
2. File inizia con:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Le classi (`.hero`, `.nav`, `.eyebrow`, `.btn-primary`, `.marquee`, `.vista`, `.bento-card`, `.reveal`, ecc.) sono CSS PURO, NON Tailwind utility. Vanno scritte SENZA `@layer components`.
4. CSS variables (`--ink`, `--bronze`, `--paper`, `--steel` per il grigio #788084) restano nel `:root`.
5. `src/App.css` resta vuoto.
6. `src/main.tsx` DEVE importare `./index.css`.

---

## ANIMAZIONI

- `.reveal` con IntersectionObserver vanilla (NON GSAP).
- Slow zoom hero, marquee, fadeUp/fadeIn: keyframes CSS.
- GSAP solo per: magnetic CTA, pin/parallax, text reveal SplitType.
- Smooth scroll: Lenis. Anchor link via `useLenis().scrollTo(target, { offset: -80, duration: 1.4 })`.
- `prefers-reduced-motion`: branch reduce in `gsap.matchMedia()`.

---

## PROTOCOLLO DI LAVORO

### Prima di scrivere codice
1. Leggi il file che modifichi (intero).
2. Spiega in 3-6 righe: cosa farai, file toccati.

### Dopo aver finito
1. **Esegui `npm run build`**. Se fallisce, fix prima di dire "fatto".
2. Verifica `src/index.css` inizi con 3 direttive `@tailwind`.
3. Verifica `src/main.tsx` importi `./index.css`.
4. Tutte le `<img src="...">` referenziano file esistenti in `public/images/`.
5. Restituisci riepilogo: file toccati, build PASS/FAIL, cosa l'utente vede a `localhost:5173`.

---

## CONTESTO BUSINESS ELAIA

7 residenze · Ponteranica (BG) · vista Parco dei Colli · classe A4.

**Tagli e prezzi:**
- Trilocale (3 disponibili): ~85 mq, da 295.000 €, terrazza vivibile
- Quadrilocale (2 disponibili): ~120 mq, da 420.000 €, doppio affaccio + giardino pensile
- Attico (2 disponibili): ~150 mq, da 600.000 €, terrazza panoramica 180°

**Specifiche:** cappotto 14cm, tripli vetri, classe A4, design italiano.

**Distanze:** Bergamo centro 5min · Aeroporto Orio 15min · Milano A4 45min · Parco dei Colli a piedi.

**Commercializzazione:** RE/MAX Expo Italia · P.za Don Sergio Colombo 4, 24124 Bergamo BG · +39 333 289 5941 · mbrissoni@remax.it · Lun-Ven 9:00-19:30.

**Target buyer:** 40-60 anni, downsizing premium, ticket 295k-600k €. Mobile-first (90% traffico). Conversione = lead form.

**Tono editoriale:** raffinato, non commerciale, "tranquillità esclusiva" come asse narrativo. Sezioni in ordine: nav → hero → marquee USP → progetto (statement) → residenze (units) → galleria → lifestyle (TOD) → investimento → posizione → lead → FAQ → contatto → footer + sticky-bar.

---

## ANTI-PATTERN

1. CSS in `@layer components` per classi non-Tailwind → sito appare nudo.
2. Animazioni GSAP impercettibili (durata <0.5s, opacity 0.9) → calibrare come EDEL.
3. `scroll-behavior: smooth` su `html` → conflitto Lenis. Rimuovere.
4. Componente che usa classe CSS non definita → sito si rompe silenzioso.
5. Saltare `npm run build` prima di dire "fatto".
6. Inventare contenuti — tutti dati da brief sopra.

---

## COMUNICAZIONE

L'utente non è developer:
- Niente jargon non spiegato.
- Decidi tu, fai, poi spieghi. No elenchi di "cose che potresti fare".
- Conferma binaria max 1.
- Lingua italiano. Codice/errori inglese.
- Tono: diretto, pragmatico.
