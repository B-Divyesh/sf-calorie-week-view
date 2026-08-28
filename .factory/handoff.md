# Handoff — Calorie Week View v1

## What shipped

- A Vite + TypeScript offline PWA at `/`, with the real local log at `/app` and
  the isolated one-click sample at `/demo`.
- Manual daily entries for calories, optional protein/carbs/fat, optional
  weight, and notes. Entries use IndexedDB and survive reloads.
- A Monday-to-Sunday review with a logged-day average, user-chosen range,
  missing-day labels, macro averages, an accessible calorie chart, and an
  optional weight trend.
- CSV import with row-level errors, CSV export, JSON backup import/export,
  selected-week printing, settings, individual deletion, and full-log deletion.
- Separate `demo:calorie-week-view` and `calorie-week-view` databases. Demo
  reset/clear actions never read or write the real database.
- A hand-written service worker, versioned app-shell cache, runtime cache,
  offline fallback, update notice, install manifest, maskable icons, and
  standalone app colors.
- `/privacy`, `/terms`, and styled 404/offline pages; canonical/Open Graph/
  Twitter metadata; sitemap, robots, CSP, security headers, and cache headers.
- A product-specific topographic cartography system with light/dark treatments,
  reduced-motion behavior, original generated hero art, and self-hosted
  Atkinson Hyperlegible fonts.

## Run and deploy

```bash
npm install
npm test
npm run build
```

The required build command is exactly `npm run build`. It writes `dist/` and
places `index.html` at `dist/index.html`.

Demo URL: `/demo` or `?demo=1`. See `.factory/demo.md` for sample and storage
details. Public claims and exact isolated test commands are in
`.factory/claims.json`.

## Verification

Completed locally on August 28, 2026:

- `npm test`: 6 unit tests and 13 Chromium tests passed.
- Every `@claim:*` test passed from a fresh `/demo` context.
- Offline test passed three consecutive runs with two parallel workers after
  the service worker cache was made resistant to conditional 304 responses.
- Playwright axe scan: no serious or critical findings on home, demo, or dark
  mode.
- 390×844 keyboard path: add/edit dialog, save action, and no page overflow.
- Factory `verify-url.sh`: HTTP 200; title, `lang`, one `h1`, `main`, image alt,
  and button labels present; zero console errors; measured load 575 ms locally.
- Lighthouse 12.8.2, mobile defaults, production preview:
  - Performance 100
  - Accessibility 100
  - Best practices 100
  - SEO 100
  - LCP 1.8 s, FCP 1.1 s, CLS 0, TBT 0 ms
- Production bundle: 10.84 KB gzip JS and 5.04 KB gzip CSS. Fonts total 47 KB.
  Hero WebP is 42 KB. These are below the 200/50/120/300 KB budgets.
- `npm audit`: zero vulnerabilities.
- Generated art reviewed at desktop and 390 px. Source, prompt, factory model,
  date, and review notes are in `assets/src/` and `.factory/design.md`.
- Landing copy read aloud and audited in `.factory/copy-audit.md`; no sentence
  exceeds 22 words and no banned word remains.

## Known gaps and next steps

- Data is intentionally device-local. There is no account or cross-device sync.
- CSV dates must use `YYYY-MM-DD`; calories are required. The importer supports
  common macro headings but does not map every vendor-specific export format.
- Weight units are labels, not automatic converters. Changing the unit does not
  alter saved numeric values.
- Browser storage can be removed by browser settings. Users should export JSON
  before clearing site data or changing devices.
- A deployed smoke test should confirm the host applies
  `staticwebapp.config.json` headers and its 404 response override.
