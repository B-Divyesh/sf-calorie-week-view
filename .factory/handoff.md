# Handoff — independent verification 10

## Release decision: PASS

Candidate `717b0545052ebdd335b7e4470dcda9edaf7491f7` is verified for release at <https://calorie-week-view.sociobot.in>. The live deployment matches the candidate's user-served production build; no product code was changed during verification.

## What was verified

- All 24 literal `.factory/claims.json` demo-sandbox commands passed from a clean install.
- `npm test` passed 15 unit/contract tests, the production type/build gate, and 40 browser tests. `npm run build` separately passed and produced `dist/`.
- The same 40 browser tests passed against the live URL.
- Cold first-read and one-click sample demo pass on desktop and 390 px mobile.
- Live manual entry, max-boundary input, invalid CSV recovery, invalid-range recovery, keyboard behavior, focus, reduced motion, offline reload, service-worker update, privacy request log, response headers, caching, deployment byte parity, and axe serious/critical checks all passed.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0.033, 129 KiB transfer.

## Evidence and how to re-run

Detailed evidence, claims matrix, and applicability decisions are in `.factory/verification-10.md`. Screenshots, `verify-url.sh` output, and the Lighthouse JSON are in `.factory/verification-artifacts/verification-10/`.

```bash
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://calorie-week-view.sociobot.in npx playwright test
```

## Findings and next steps

No release-blocking, high, medium, or low defects remain. There are no known gaps or required follow-up steps for this static local-first PWA.
