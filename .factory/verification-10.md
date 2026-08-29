# Independent product verification 10

## Verdict: PASS

Candidate `717b0545052ebdd335b7e4470dcda9edaf7491f7` was independently verified on 2026-08-29 UTC against <https://calorie-week-view.sociobot.in>. The checkout was clean at that exact commit before verification. No product code was changed.

The previously reported deployment-only failure is not present. Production is available and the public build artifacts match the fresh production build from this candidate. No release-blocking, high, medium, or low defects were found.

## Mandatory cold first-read and demo gate

**PASS.** A fresh, unauthenticated desktop visit returned HTTP 200 with no console or page errors. Its first screen plainly says:

- **What it does:** “Review your calories by week.”
- **For whom:** “For food loggers who want to compare seven days without daily scores or suggested targets.”
- **What to do first:** the one-click **Try it with sample data** button, immediately followed by “See six sample days and one missing day before adding your own entries.”

The same headline, audience, primary demo action, explanation, blank-week alternative, and three privacy/offline/free facts were all visible in the 390 × 844 cold first viewport. Activating the action opened `/demo` and showed the persistent “Demo — sample data, nothing is saved to your log” banner, **Reset demo**, **Start for real**, six populated days, a blank Saturday, macro averages, weight trend, and notes. Direct `/?demo=1` also works.

## Claims gate

`.factory/claims.json` exists and contains 24 entries. After `npm ci`, every literal `test` command was run separately, in manifest order, against the product demo entry point from fresh browser state. All 24 passed:

| Claim | Result |
| --- | --- |
| offline-reload | PASS |
| csv-export | PASS |
| csv-import | PASS |
| json-export | PASS |
| print-week | PASS |
| local-private | PASS |
| no-ads-tracking-third-party | PASS |
| free-no-account | PASS |
| manual-entry | PASS |
| settings-choice | PASS |
| user-chosen-range | PASS |
| no-daily-score | PASS |
| no-food-search-or-coaching | PASS |
| no-medical-advice | PASS |
| json-import | PASS |
| json-import-validation | PASS |
| delete-log | PASS |
| logged-day-average | PASS |
| demo-sample | PASS |
| demo-reset | PASS |
| demo-exit-isolation | PASS |
| weekly-display | PASS |
| source-font-licensing | PASS |
| art-provenance | PASS |

The manifest contract test also passed, including one matching tagged test per claim. Landing, review, privacy, terms, and README copy were cross-checked: the public privacy, offline, export/import, free/no-account, health-boundary, licensing, and generated-art statements are covered by those entries.

## Clean build and functional verification

- `npm ci`: PASS — installed 61 packages; audited 62; zero vulnerabilities.
- `npm test`: PASS — 15 Vitest unit/contract tests, TypeScript type check and production build, then all 40 Chromium browser tests.
- `npm run build`: PASS — generated `dist/`; no separate lint script exists.
- `PLAYWRIGHT_BASE_URL=https://calorie-week-view.sociobot.in npx playwright test`: PASS — all 40 browser tests passed against production, not a local preview.

Independent live end-to-end checks passed as well. A missing day accepted a valid boundary record at 20,000 calories, 1,000 g protein, 2,000 g carbs, 1,000 g fat, 1,500 kg, and a note; the weekly total updated to 4,624 kcal. The browser rejected 20,001 calories with “Value must be less than or equal to 20000.” An invalid CSV protein value of 1,001 produced a specific recovery error and retained all seven records. An inverted 2,300–1,800 range remained in the settings dialog with “The maximum must be higher than the minimum. Change one value.” Correcting it to 0–20,000 saved successfully.

The live suite covers manual keyboard entry at 390 px, visible focus, skip link, dialog focus management and Escape/cancel behavior, Back navigation, all mobile target sizes, 200% text, reduced motion, settings persistence, weight-unit preservation, import/export/print, demo reset and real/demo isolation, route metadata, 404, and offline fallback. Axe found zero serious or critical violations on desktop and 390 px home/demo, including dark demo. `/opt/fleet/lib/verify-url.sh` also passed the cold live URL in 643 ms: one h1, one main landmark, `lang=en`, complete image alt text, labeled buttons, and zero console/page errors. Evidence is under `.factory/verification-artifacts/verification-10/verify-url-live/`.

## Privacy, PWA, headers, performance, and deployment identity

A fresh live demo settings-and-entry flow made five unique requests: document, two self-hosted fonts, hashed JavaScript, and hashed CSS. Every request was a same-origin GET; there were no API, analytics, ads, tracking, frames, or third-party requests. IndexedDB contained only `demo:calorie-week-view`.

The worker controls the live page from `/sw.js`; `registration.update()` completed with an activated worker and cache `calorie-week-view-v1.0.8`. After first visit, offline reload retained the demo heading and banner. The separate offline claim test additionally verified the original sample average (2,062 kcal) on offline reload. The manifest has standalone display, a versioned start URL, and 192, 512, and maskable icons.

Documents, manifest, worker, 404, and assets send self-only CSP with response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and denied camera/microphone/geolocation. Documents and the worker use `max-age=30, must-revalidate`; hashed JS/CSS and fonts use one-year immutable caching.

Fresh Lighthouse mobile results were **100 performance / 100 accessibility / 100 best practices / 100 SEO**. FCP was 1.1 s, LCP 1.4 s, TBT 30 ms, CLS 0.033, and transfer 129 KiB. Evidence: `.factory/verification-artifacts/verification-10/lighthouse-live-mobile.json`. The fresh build's initial JS is 37.28 kB raw / 12.55 kB gzip and CSS is 19.42 kB raw / 5.10 kB gzip, within static-PWA budgets.

SHA-256 comparison matched all 22 publicly served build files in fresh `dist/` to production (HTML, hashed JS/CSS and source map, worker, manifest, 404, offline page, fonts, icons, art, robots, and sitemap). The deployment-only `staticwebapp.config.json` correctly returns HTTP 404 when requested directly; the headers observed on live documents and assets match its rules. This is therefore not a deployment mismatch. Desktop and 390 px screenshots, with no horizontal overflow, are retained in `.factory/verification-artifacts/verification-10/`.

This is a static local-first PWA with no server-side product or unlock endpoint, sign-in, payment, package API, CLI, or AI runtime. Rate-limit/429, backend concurrency/persistence/health, consumer-install, Entra, and billing checks are not applicable. AI would not improve the deterministic weekly calculation in the researched brief, so no missed-leverage finding applies.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
