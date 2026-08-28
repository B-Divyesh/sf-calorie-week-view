# Independent verification 5 — candidate `9a449dabb5ef069968a95fb69ffb63830bca060e`

## Verdict: FAIL

**Tested commit:** `9a449dabb5ef069968a95fb69ffb63830bca060e`

**Tested URL:** <https://calorie-week-view.sociobot.in>

**Date:** 2026-08-28 UTC

**Verifier product-code changes:** none

The live deployment is byte-identical to the candidate. The mandatory first-read
gate and all 18 claim commands pass, and the product is functional, private,
fast, installable, and offline-capable. It is not release-ready because fresh
keyboard testing found a focus-management failure in ordinary successful actions.
The direct 404 also violates the required site skeleton and plain-language policy.

## Release-blocking findings

### Medium — V5-01: successful review actions drop keyboard focus onto `<body>`

The repaired Cancel and Escape paths restore focus correctly, but successful
actions replace the review DOM without moving focus to a logical successor.
Fresh live reproductions at 390×844, using only the keyboard:

- Focus **Previous week** and press Enter: the week changes, then
  `document.activeElement.tagName` is `BODY`.
- Focus the missing day's **Add**, enter `2000`, focus **Save daily totals**, and
  press Enter: the row is saved and the count becomes 7 of 7, then focus is
  `BODY`.
- Open **Change settings**, save `1900–2300`, and wait for the updated range:
  focus is again `BODY`.

The next Tab therefore restarts at the skip link instead of continuing from the
changed week, saved entry, or settings control. This violates the attached
keyboard and dialog-focus baseline. Preserve focus across `refreshReview()`—for
example on the corresponding week control, the saved row's Edit button, or the
settings trigger—and add keyboard regressions for successful actions.

### Medium — V5-02: the direct 404 drops the standard shell and uses metaphorical copy

`GET /not-a-route` correctly returns HTTP 404, but the rendered document has zero
`header`, `nav`, and `footer` elements. Its heading is “This trail ends here” and
its decorative label is “ELEVATION — 404”. The site-structure contract requires
the consistent header and footer on every route; the plain-words contract bans
metaphorical headings and decorative lore. The page does include one h1, one
main landmark, a Return home link, and zero serious/critical axe findings.

Render the shared product shell in `404.html` and use a literal heading such as
“This page does not exist.”

## First-read gate: PASS

I opened the live home page cold in a fresh 1440×900 browser context before the
rest of the inspection. The first viewport answers all three required questions:

- **What it does:** “Review your calories by week.”
- **Who it is for:** “For food loggers who want the weekly pattern without
  streaks, scores, or automatic targets.”
- **What to click first:** **Try it with sample data**, alongside “See a complete
  week before adding your own entries.”

The primary action is also above the fold at 390×844. One click opens `/demo`
with six realistic records, the 2,062 kcal logged-day average, a missing Saturday,
macros, and a weight trend. The persistent banner exposes **Reset demo** and
**Start for real**. Evidence:
`.factory/verification-artifacts/live-first-read-desktop.png`,
`.factory/verification-artifacts/live-demo-desktop.png`, and
`.factory/verification-artifacts/live-demo-mobile-390.png`.

## Mandatory claims gate: PASS

`.factory/claims.json` exists and contains 18 unique claims. After `npm ci` from
the clean candidate, I ran every listed `test` command separately, in manifest
order. Each command ran the unit suite, type-checked and rebuilt the production
artifact, then selected exactly one tagged browser test through `/demo`.

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
| `user-chosen-range` | PASS |
| `no-daily-score` | PASS |
| `no-food-search-or-coaching` | PASS |
| `no-medical-advice` | PASS |
| `json-import` | PASS |
| `json-import-validation` | PASS |
| `delete-log` | PASS |
| `logged-day-average` | PASS |

The manifest's exact-selector contract test also passes. I found no unlisted
claim in the live landing page or README.

## Clean local quality gates

- `npm ci`: PASS — 61 packages installed, 62 audited, 0 vulnerabilities.
- `npm test`: PASS — 14 Vitest unit/contract tests and 27 Chromium browser tests.
- `npm run build`: PASS — TypeScript checking and the exact Vite production build.
- No lint command is available. Type checking is included in the build.
- `dist/index.html` exists. Initial JavaScript is 36.41 kB raw / 12.37 kB gzip;
  CSS is 19.42 kB raw / 5.10 kB gzip; fonts total 46.97 kB; the mobile hero WebP
  is 42.81 kB. All supplied static budgets pass.
- `npm pack --dry-run`: PASS. Consumer installation is not applicable because
  this is a private static PWA, not a library or CLI.

## Independent end-to-end and recovery evidence

Fresh live contexts covered the smallest useful product and representative
recovery paths:

- The isolated demo starts with six logged days, one explicitly missing day,
  the 2,062 kcal average inside the chosen 1,800–2,200 range, macro averages,
  and three weight points.
- Manual entry accepts `0` and the documented maxima: 20,000 calories, 1,000 g
  protein, 2,000 g carbs, 1,000 g fat, and 1,500 kg. Negative and 20,001-calorie
  values remain in the dialog with browser recovery messages; correcting them
  saves successfully.
- A two-row CSV whose second row exceeds every bound reports the row and 20,000
  limit and leaves the record count unchanged. Invalid JSON settings report the
  range problem and leave the rendered log unchanged.
- Markup entered in a note is rendered as text and creates no injected image.
- The real `/app` empty state explains that no weight values exist and offers
  **Add weight with a daily entry**. A zero-calorie record persists after reload.
- Previous/next week navigation, reversed-range recovery, boundary settings,
  cancelled deletion, confirmed whole-log deletion, and reset-on-reload pass.
- **Start for real** opens an empty real log, removes the demo IndexedDB namespace,
  and a later `/demo` visit reseeds the default sample and range.
- All HTTP(S) links crawled from `/`, `/demo`, `/app`, `/privacy`, and `/terms`
  returned 200; `mailto:` was excluded. History back/forward restores the route,
  title, scroll position, and h1 focus.

## Accessibility and responsive checks

- Playwright axe-core found 0 serious/critical issues on live home, demo,
  privacy, terms, dark demo, and 390 px mobile demo pages.
- The supplied `verify-url.sh` passed on retry in 673 ms: correct title and
  `lang="en"`, one h1, one main, no missing image alt, no unnamed button, and
  no console/page error. The first attempt timed out waiting for `networkidle`;
  the retry and independent request/error logs completed normally. Evidence:
  `.factory/verification-artifacts/verify-url-live/`.
- At 390×844 there is no horizontal page overflow and every visible link,
  button, input, select, textarea, and keyboard-scrollable chart measures at
  least 44×44 CSS px.
- First Tab reveals **Skip to main content** with a 3 px focus outline; Enter
  moves focus to the h1. The focus color is 4.27:1 against light paper and
  8.22:1 against dark paper.
- Entry dialogs receive focus in the required calories field. Escape and visible
  Cancel close without saving and return focus to the invoking Add button.
  V5-01 remains for successful actions and week navigation.
- With `prefers-reduced-motion: reduce`, the observed maximum transition and
  animation duration is 0.00001 seconds. A 640 px layout (the 1280 px desktop
  reflow equivalent at 200% zoom) retains its heading, banner, controls, and has
  no horizontal page overflow.

## Privacy, headers, routes, and deployment identity

- A live home/demo/edit/navigation/exit flow made 55 requests across 15 unique
  URLs. Every request was same-origin; there were no analytics, ads, third-party
  scripts, failed responses, console errors, or page errors. Source inspection
  found no application fetch, XHR, WebSocket, AI, auth, billing, or unlock call.
- The live HTML sends a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and disabled
  camera/microphone/geolocation permissions.
- HTML, the service worker, manifest, and 404 revalidate after 30 seconds.
  Hashed JS/CSS use `public, max-age=31536000, immutable`.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, the manifest, robots, sitemap, and
  install icon return 200. `/not-a-route` returns a real 404.
- SHA-256 matches live versus the fresh `dist/` build for `index.html`, the
  hashed JS and CSS, `sw.js`, manifest, robots, sitemap, and `404.html`.
  The live deployment therefore matches candidate `9a449da` byte for byte.
- This is a static PWA with no server-side application endpoint, unlock call,
  backend, or sign-in. Rate-limit/429/`Retry-After`, concurrency, health/build
  endpoint, server persistence, and Entra authority checks are not applicable.

## PWA and performance

- A fresh live context became controlled by `/sw.js`, created cache
  `calorie-week-view-v1.0.3`, and cached the shell, built JS/CSS, and `/demo`.
  The populated sample reloaded successfully after Chromium went offline.
- In a controlled server using the exact production `dist/`, serving a changed
  worker produced the visible “An update is ready. Reload to use it.” message,
  activated `calorie-week-view-v1.0.4`, removed the old cache, and preserved an
  offline demo reload.
- The manifest has standalone display, versioned `/app?v=1.0.1` start URL,
  matching theme/background colors, 192×192 and 512×512 icons, and a 512×512
  maskable icon.
- Fresh live Lighthouse mobile:
  **100 performance / 100 accessibility / 100 best practices / 100 SEO**;
  FCP 1.1 s, LCP 1.4 s, TBT 60 ms, CLS 0.033, total transfer 128 KiB. Evidence:
  `.factory/verification-artifacts/lighthouse-live-mobile.json`.

## Required repair and re-verification

1. Preserve useful keyboard focus after successful entry/settings saves and
   week navigation; regress those paths rather than only cancel/close.
2. Give the direct 404 the shared header/footer and literal plain-language copy.
3. Rerun every claim command, aggregate suite/build, live parity, keyboard,
   axe, request-log, offline/update, and performance checks after deployment.
