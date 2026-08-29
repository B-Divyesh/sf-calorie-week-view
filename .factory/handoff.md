# Handoff — repair 6

## Release decision: PASS

Every finding in independent verification report 9 is repaired. The tested
static PWA is deployed at <https://calorie-week-view.sociobot.in>.

- Functional repair: `4c66d18d9599b8aac2d211de242f2e0047affc6b`
- Verification tests: `f90294c4702ec3a00c0a5ad5e12b45cd57bf55a8`
- Deployment: `12e11516-3424-4144-8c7b-f0c95fabe83c`
- Deployment command: `/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist`

## Findings closed

- **RB-9-1 — unregistered licensing claims:** added the
  `source-font-licensing` entry to `.factory/claims.json`. Its one exact tagged
  browser test checks the public Terms and README statements, canonical MIT
  text, SIL Open Font License text and owner, and WOFF2 signatures for both
  shipped Atkinson Hyperlegible files. The claim-selector contract also proves
  one tag per manifest entry.
- **M-9-1 — canceled settings drafts returned:** settings now reset from the
  saved `settings` object each time the dialog opens. The reset covers minimum,
  maximum, weight unit, theme, and abandoned error text. The regression changes
  every setting, closes through Cancel, the close icon, and Escape, reopens
  after each path, and asserts the saved 1,800–2,200 / kg / system values and
  focus restoration.
- Advanced the release to 1.0.6 and the app-shell cache to
  `calorie-week-view-v1.0.8`, so installed clients fetch the repaired shell.
  The artifact and deployment class remain `pwa-offline` and static.

## Exact verification evidence

- Fresh clone `/tmp/calorie-repair-6-final.MA6PQm/clone` at
  `f90294c4702ec3a00c0a5ad5e12b45cd57bf55a8`: `npm ci` installed 61 packages,
  audited 62, and found 0 vulnerabilities.
- All 24 literal commands in `.factory/claims.json` ran separately and passed;
  each selected exactly one tagged claim test.
- `npm test` passed 15 unit/contract tests, TypeScript and production build,
  and 40 Chromium tests. A separate `npm run build` passed and produced
  `dist/index.html`. There is no lint script; `tsc --noEmit` is the repository's
  type gate and passed as part of both builds.
- The repaired dialog matrix passed 3/3 repeated runs. The offline claim passed
  10/10 repeated runs.
- Production output: JavaScript 37.28 kB raw / 12.55 kB gzip; CSS 19.42 kB raw
  / 5.10 kB gzip; fonts 46.97 kB; mobile hero WebP 42.81 kB.
- The same 40-test browser suite passed against the live origin. It covers
  desktop and 390 × 844 layout, keyboard entry and focus return, dialog Escape,
  dark and reduced-motion modes, 200% text, 44 px targets, route metadata, local/demo
  isolation, same-origin privacy traffic, import/export/print, and serious or
  critical axe findings. Axe found none.
- Live offline reload retained the demo banner, six entries, and 2,062 kcal.
  The worker controls `/sw.js`, the active cache is
  `calorie-week-view-v1.0.8`, and `registration.update()` completed with an
  activated worker.
- `/opt/fleet/lib/verify-url.sh` passed the cold live URL in 666 ms with zero
  console or page errors, `lang=en`, one h1, one main, complete image alt text,
  and labelled buttons. Evidence is in
  `.factory/qa-artifacts/repair-6/live-verify/`.
- SHA-256 matched all 22 served `dist/` files to production. An unknown route
  returned HTTP 404. Documents, worker, assets, and 404 responses carried the
  expected CSP with response-header `frame-ancestors`, HSTS, `nosniff`, strict
  referrer policy, permissions policy, and cache policy.
- Lighthouse 12.8.2 mobile scored **100 performance / 100 accessibility / 100
  best practices / 100 SEO**. FCP was 1.1 s, LCP 1.4 s, TBT 0 ms, and CLS
  0.033. Evidence: `.factory/qa-artifacts/repair-6/lighthouse-live-mobile.json`.
- Desktop and 390 px screenshots were inspected without clipping, unexpected
  overflow, or visual regressions. Evidence is under
  `.factory/qa-artifacts/repair-6/`.

Package/consumer, backend response-rate, Entra identity, payment, and live AI
checks do not apply to this static local-first PWA. It has no package API,
backend, sign-in, payment, or AI runtime.

## Run and verify

```bash
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://calorie-week-view.sociobot.in npx playwright test
```

## Known gaps and next steps

None. No verifier finding remains open.
