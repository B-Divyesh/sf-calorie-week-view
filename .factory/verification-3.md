# Independent verification 3 — candidate `9d50dff5a33d0ebe6d6675452ea699fa22fdc561`

## Verdict: FAIL

**Tested commit:** `9d50dff5a33d0ebe6d6675452ea699fa22fdc561`  
**Tested URL:** <https://calorie-week-view.sociobot.in>  
**Date:** 2026-08-28 UTC  
**Verifier product-code changes:** none

This is a functional, deployed, local-first PWA. Fresh evidence shows that the
live deployment is byte-identical to this candidate and that all declared
claim commands pass. It nevertheless fails the supplied acceptance contract
because the landing page makes product claims that are not in
`.factory/claims.json`, and one declared claim command runs two tests rather
than the required exactly one. The claims skill says either condition fails
review until corrected.

## First-read gate: PASS

I cold-opened the live home page in a new browser context. Its first screen
plainly answers all three questions without scrolling:

- **What:** “Review your calories by week.”
- **For whom:** “For food loggers who want the weekly pattern without streaks,
  scores, or automatic targets.”
- **First action:** the visible primary button is **Try it with sample data**,
  with adjacent text: “See a complete week before adding your own entries.”

Clicking it opens `/demo` to six realistic daily records, a deliberately
missing Saturday, weekly calorie and macro summaries, and a weight trend. The
persistent banner says “Demo — sample data, nothing is saved to your log” and
has both **Reset demo** and **Start for real**. A fresh browser save flow used
only IndexedDB `demo:calorie-week-view`, not the real-log database.

## Release-blocking findings

### Medium — V3-01: visitor-facing scope claims are unlisted and untested

The landing page says: “This tool does not set calorie targets, diagnose
health, or judge a day. It does not include food search or coaching.” The
same no-diagnosis/no-target scope is repeated on `/terms` and in `README.md`.
None of these claims appears in `.factory/claims.json`; no sandbox test proves
them. The claims acceptance contract expressly requires a claim-like public
sentence to have a manifest entry and observable sandbox test, or be removed.

Add specific claim entries and tests for the intended scope (for example, that
the settings/review flow never suggests a target and that the product exposes
no food-search or coaching flow), or remove/reword the promises as necessary.

### Medium — V3-02: `json-import` claim command does not select exactly one test

The manifest declares:

```text
npm test -- --grep @claim:json-import
```

Fresh execution reports **“Running 2 tests using 1 worker”**. Playwright's
unanchored grep also selects the distinct
`@claim:json-import-validation` test. The skill requires every claim to have
exactly one tagged test and every manifest command to run that observable
test. Make the tag selection unambiguous (for example, an anchored/exact
pattern that continues to work through `npm test`) or rename the overlapping
tag. The valid-import test itself passed; this is a claims-contract isolation
defect, not a product-flow failure.

## Mandatory claims gate

`npm ci` from the clean checkout added 61 packages and reported zero
vulnerabilities. Before broader QA, I ran every `test` command listed in
`.factory/claims.json`, separately and in manifest order. Every command exited
0 and exercised `/demo` through the configured production-preview entry point.

| Claim | Result |
| --- | --- |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `csv-import` | PASS |
| `json-export` | PASS |
| `print-week` | PASS |
| `local-private` | PASS |
| `no-ads-tracking-third-party` | PASS |
| `free-no-account` | PASS |
| `manual-entry` | PASS |
| `settings-choice` | PASS |
| `json-import` | PASS, but command selected two tests (V3-02) |
| `json-import-validation` | PASS |
| `delete-log` | PASS |
| `logged-day-average` | PASS |

The exact-run log showed thirteen executions with one Playwright test and the
`json-import` execution with two; all passed. The unfiltered suite below also
passed all claim coverage.

## Local build and regression results: PASS

- `npm test`: **PASS** — 10 Vitest unit/deployment tests, TypeScript checking,
  production build, and 18 Playwright tests passed.
- `npm run build`: **PASS** — generated `dist/`.
- No separate lint/typecheck script is defined; `tsc --noEmit` is part of the
  build.
- Production output: JS **34.15 kB raw / 11.66 kB gzip** and CSS **19.20 kB
  raw / 5.08 kB gzip**, comfortably below the static-PWA JS/CSS budgets.
- This is a private static PWA, not a library or CLI; consumer pack/install
  testing is not applicable.

## End-to-end, accessibility, and PWA results: PASS

Fresh live browser checks covered normal use and recovery at desktop and
390×844 mobile:

- Opened the demo, edited daily totals with calories, optional macros, weight,
  and a note; changed range, unit, and theme; imported/exported CSV and JSON;
  printed; reset/cleared the demo; and left the demo for the real-log route.
- The lower boundary works: `-1` calories is natively rejected with “Value
  must be greater than or equal to 0.” Correcting to `0` saves successfully.
  The browser suite additionally verifies invalid CSV optional values and
  malformed JSON backup recovery without changing the log.
- Live axe-core scans found **zero serious or critical** violations on `/`,
  desktop `/demo`, 390px `/demo`, and dark-mode `/demo`.
- At 390px there was no horizontal overflow. Keyboard focus on the primary
  action had a visible solid 3px ochre outline. Keyboard entry is covered by
  the passing browser suite. Under `prefers-reduced-motion: reduce`, the sole
  chart trace reduces to `0.00001s`; there is no substantive animation.
- Product-page console/page errors were absent on `/`, `/demo`, `/app`,
  `/privacy`, and `/terms`. An expected browser resource error accompanies a
  direct HTTP-404 navigation; no app error was emitted.
- A fresh live context gained service-worker control from `/sw.js`, cache
  `calorie-week-view-v1.0.2`, then successfully reloaded `/demo` offline with
  the review heading and `2,062 kcal` sample. The worker implements
  `skipWaiting` and `clients.claim`; the client listens for `updatefound` and
  presents an update-ready reload message. No newer live worker revision was
  available during this check to trigger that message.

## Privacy, security, deployment identity, and routes: PASS

- During a fresh live demo/save flow, every network request was same-origin:
  the demo HTML, self-hosted JS, CSS, and two self-hosted fonts. No analytics,
  ads, third-party scripts, account requests, or log-data requests occurred.
- Responses carry CSP restricted to `'self'`, HSTS, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a
  restrictive permissions policy. HTML, service worker, and manifest use
  30-second revalidation; hashed JS/CSS use `max-age=31536000, immutable`.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, and
  the manifest returned 200. `/not-a-route` returned an actual HTTP 404 with
  the designed 404 page. Internal site links returned 200.
- The live home references `assets/index-DQlqc6BK.js` and
  `assets/index-Bf9MsYVr.css`, exactly matching the fresh local build.
  SHA-256 also matched live `/sw.js` to `public/sw.js` and live JS to local
  `dist/`. The live deployment is this candidate, so the prior
  deployment-only concern is not reproduced.
- There is no application API/product-unlock endpoint or sign-in flow. The
  rate-limit/429 and Entra External ID checks therefore do not apply.

## Required repair and re-verification

1. Bring every public scope promise into `.factory/claims.json` with a
   meaningful demo-sandbox test, or remove it from public copy.
2. Make `json-import` test selection exact so its manifest command executes
   exactly one test.
3. Re-run every claim command, `npm test`, build, and the live identity/privacy
   checks after deployment.
