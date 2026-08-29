# Handoff — perfection-loop polish round 3

## Release decision: PASS

Functional repair `744381d303b9a97e9d31b4d8b0b59264a17cdc8f` was
pushed to `main`. Release 1.0.5 was deployed with the configured static work
order command:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

Azure Static Web Apps deployment
`9a9b1c56-3e85-41fa-b1f9-4af2de0dbd1c` succeeded. The cold-checked production
URL is <https://calorie-week-view.sociobot.in>.

## What changed

- Closed F-3-1 / reopened F-1-9: the Terms h1 is now “Terms for Calorie Week
  View.” A route-copy regression checks every h1 and forbids “reflection tool.”
- Closed F-3-2: the landing boundary h2 is now “What Calorie Week View does not
  do.” “You choose the range.” is the following paragraph. An exact landing h2
  outline regression prevents a semantic rollback.
- Rechecked and retained every V-, V2–V5-, F-1-, and F-2-series repair. The
  complete finding-to-change-to-evidence map is `.factory/polish-3.md`.
- Rewrote the latent metaphorical offline fallback with literal copy, full
  metadata, the shared shell, legal links, and its own browser regression.
- Advanced the app, install start URL, static fallback footers, and service
  worker cache to release 1.0.5 / `calorie-week-view-v1.0.7`.
- Updated `.factory/catalog-description.txt` to the 75-character verb-first
  sentence: “Review calories, macros, and weight across seven days without
  daily scores.”

The topographic-cartography visual system and `pwa-offline` artifact class are
unchanged.

## Exact verification

- Final fresh clone: `/tmp/calorie-polish3-final.eXcYXg/clone` at `744381d303b9`.
  `npm ci` installed 61 packages with 0 vulnerabilities.
- Every one of the 23 exact commands in `.factory/claims.json` ran separately.
  Every command selected one tagged test and passed, including one-click and
  `?demo=1` entry, reset, real/demo isolation, privacy traffic, offline reload,
  import/export, and provenance.
- `npm test` passed 15 unit/contract tests, the production TypeScript/Vite
  build, and 37 Chromium tests. A separate `npm run build` passed and produced
  `dist/index.html`.
- Build budgets pass: initial JavaScript is 36.89 kB raw / 12.45 kB gzip; CSS
  is 19.42 kB raw / 5.10 kB gzip; fonts total 46.97 kB; the served hero WebP is
  42.81 kB. Live and local JS/CSS SHA-256 values match.
- Local `verify-url.sh` passed in 555 ms. A final cold live `verify-url.sh`
  run passed in 630 ms
  with the correct title, `lang=en`, one h1, one main, alt text on every image,
  labelled buttons, and no console or page errors. Evidence:
  `.factory/qa-artifacts/polish-3/{local-verify,live-verify,live-verify-final}/`.
- Fresh live 390 × 844 measurement kept the headline, audience, primary action,
  and all three facts above the fold. The primary action occupied 350 × 51.5
  px. Evidence: `.factory/qa-artifacts/polish-3/live-home-mobile.png`.
- The live one-click action and direct `/?demo=1` path each opened six sample
  days and one missing day with the persistent banner, Reset demo, and Start
  for real. Reset restored 1,800–2,200. A seeded 1,999-calorie real marker
  survived demo exit; the demo database was removed. All 10 observed requests
  were same-origin. Evidence:
  `.factory/qa-artifacts/polish-3/live-demo-mobile.png`.
- After service-worker control, live `/?demo=1` reloaded fully offline with
  cache `calorie-week-view-v1.0.7`, its banner, six days, and 2,062 kcal.
  Evidence: `.factory/qa-artifacts/polish-3/live-demo-offline-mobile.png`.
- Browser checks passed for `/`, `/app`, `/demo`, `/privacy`, `/terms`,
  `/offline.html`, and an unknown route: exact titles, descriptions, canonical,
  Open Graph/Twitter metadata, one h1/main, link targets, route/Back focus, and
  mobile layout. The unknown URL returned HTTP 404. Evidence includes
  `.factory/qa-artifacts/polish-3/live-terms-mobile.png`,
  `live-offline-mobile.png`, and `live-404-mobile.png`.
- The final post-deploy cold audit repeated the seven-route mobile, focus,
  axe, target-size, demo reset/exit isolation, same-origin request, asset-hash,
  and offline checks. Its machine-readable summary is
  `.factory/qa-artifacts/polish-3/live-final-audit.json`.
- Playwright axe checks found zero serious/critical violations across the live
  route set. The live 390 px sweep found no horizontal overflow and no visible
  target below 44 × 44 px. Dark mode and reduced-motion regressions passed in
  the full suite.
- Live Lighthouse 12.8.2 scored **100 performance / 100 accessibility / 100
  best practices / 100 SEO**, with FCP 1.1 s, LCP 1.4 s, TBT 0 ms, and CLS
  0.033. Evidence:
  `.factory/qa-artifacts/polish-3/lighthouse-live-mobile.json`.
- Security headers on production include self-only CSP with response-header
  `frame-ancestors`, `nosniff`, strict-origin referrer policy, and disabled
  camera, microphone, and geolocation.

## How to run and verify

```bash
npm ci
npm test
npm run build
```

Claim commands are listed in `.factory/claims.json`. The direct clean demo URL
is <https://calorie-week-view.sociobot.in/?demo=1>.

## Known gaps and next steps

None. No finding of any severity remains unresolved. Accounts, sync, payments,
backend storage, and AI remain intentionally outside this deterministic,
local-first weekly review.
