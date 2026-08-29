# Independent product verification 7

## Verdict: PASS

Candidate `4527b8e418c8a4c92c384bd794008dd6a775e3ce` was independently
verified on 2026-08-29 UTC against
<https://calorie-week-view.sociobot.in>. The checkout was exactly the named
commit before verification. No product code was changed.

No release-blocking, high, medium, or low-severity product defect was found.
The live site is byte-identical to the candidate production build for the HTML,
hashed JavaScript and CSS, worker, manifest, robots, sitemap, install icons,
hero art, and real 404 response.

## Mandatory gates

### First read and one-click demo

The cold 390 px first screen answers all three questions in plain words:

- What it does: **Review your calories by week**.
- Who it is for: food loggers comparing seven days without daily scores or
  suggested targets.
- What to click first: **Try it with sample data**, next to an explanation that
  it opens six sample days and one missing day.

One keyboard-activated click opened `/demo`, with the persistent
**Demo — sample data, nothing is saved to your log** banner, Reset demo and
Start for real actions, a 2,062 kcal logged-day average, six populated days,
Saturday missing, macro averages, four weight points, and notes. The mandatory
first-read/demo gate passes.

### Claims

`.factory/claims.json` exists and contains 22 entries. From the clean checkout,
the first literal pre-install invocation could not start Vitest because a clean
clone had no `node_modules`. After the required `npm ci`, every manifest command
was rerun independently and passed through `/demo`. This is the clean-clone
install/test sequence, not a product-test failure.

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
| `demo-sample` | PASS |
| `demo-reset` | PASS |
| `demo-exit-isolation` | PASS |
| `weekly-display` | PASS |

Landing-page and README promises were cross-checked against the manifest. No
unlisted product claim was found.

## Clean checkout and production gates

- `git rev-parse HEAD`: exact candidate hash above.
- `npm ci`: PASS; 61 packages installed, 62 audited, zero vulnerabilities.
- `npm test`: PASS; 15 Vitest unit/contract tests, TypeScript production build,
  and 33 Chromium tests.
- `npm run build`: PASS and creates `dist/index.html`.
- There is no separate lint script. `tsc --noEmit` is part of every build.
- Output: JavaScript 36.90 kB raw / 12.46 kB gzip; CSS 19.42 kB raw /
  5.10 kB gzip; WOFF2 fonts 46.97 kB total; mobile hero WebP 42.81 kB.
  All static-product budgets pass.
- Local and live `verify-url.sh`: PASS. Both report the correct title,
  `lang="en"`, one h1, a main landmark, complete image alternatives, labelled
  buttons, and no console/page errors.

This is a private static PWA, not a package or CLI. Consumer pack/install and a
public API/CLI exercise do not apply.

## Independent end-to-end exercises

Fresh live contexts covered representative use, hard boundaries, bad input, and
recovery beyond merely locating controls:

- Saved the missing day using only focus plus Enter at the allowed maximums:
  20,000 calories, 1,000 g protein, 2,000 g carbs, 1,000 g fat, 1,500 kg, and a
  200-character note. The week changed from 6/7 to 7/7 and focus moved to its
  Edit action.
- 20,001 calories was rejected by the labelled field with the 20,000 maximum and
  a native validation message.
- Equal 20,000/20,000 range endpoints stayed in the dialog with the explicit
  “maximum must be higher” recovery message. Correcting them to 0–20,000 saved,
  restored focus to Change settings, and survived reload.
- A two-row CSV whose second row had 1,001 g protein reported the exact row and
  left the existing log unchanged. A corrected CSV with zero calories and a
  quoted comma in its note then imported successfully.
- Clearing demo records produced the useful 0/7, **No average yet** empty state.
  Reset demo restored all six original records and default settings.
- Week navigation, browser back/forward, route titles, canonical and Open Graph
  URLs all updated. Route changes focused and announced the new h1.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, manifest, robots, sitemap, and the
  install icon return 200. A missing path returns the designed 404. Every real
  internal link and the labelled external Param Factory link resolves.

## Accessibility and responsive behavior

- Axe found zero serious/critical findings on live desktop, 390 px mobile, and
  dark mode.
- At 390 px, the first Tab focuses **Skip to main content** with a computed
  3 px solid focus outline. Every visible interactive target measured at least
  44 by 44 CSS pixels. There was no page-level horizontal overflow.
- Keyboard activation works for demo entry, week navigation, record entry,
  settings, save/cancel, and route navigation. Dialog cancellation restores
  focus; successful replacements focus the corresponding new control.
- Semantic checks pass: one h1, ordered headings, labels, landmarks, chart text
  alternatives, and route announcements. Text resized to 200% without page-level
  clipping; the two charts remain intentionally horizontally scrollable.
- Reduced-motion media emulation matched. The largest computed animation or
  transition duration was 0.01 ms, with no flashing or continuing motion.
- No console error, page error, failed request, or keyboard trap was observed.

## Privacy, headers, and deployment

A full live demo save flow made five requests: the document, two self-hosted
fonts, the hashed script, and the hashed stylesheet. All were same-origin GETs.
The only database was `demo:calorie-week-view`; the real database was absent.
There were no analytics, ads, third-party scripts, frames, API calls, or failed
requests.

Browser response headers and direct checks confirm:

- CSP allows only self-hosted scripts, styles, fonts, connections and frames;
  `frame-ancestors 'none'` is delivered as a response header.
- HSTS, `nosniff`, strict-origin referrer policy, and camera/microphone/location
  denial are present on normal and 404 responses.
- HTML, the service worker, and the 404 use 30-second revalidation. Hashed assets
  and fonts use `max-age=31536000, immutable`.
- SHA-256 matched live and `dist/` for every compared release file, including the
  exact 404 body. Hashed assets are `index-D3zCEUYx.js` and
  `index-CEsbQIcF.css` on both sides.

The app has no server-side product/unlock endpoint, backend, account, payment,
AI call, or sign-in. Rate-limit/429/Retry-After, concurrency, server persistence,
health/build identity, and Entra authority tests do not apply.

## PWA, offline, and performance

- A fresh live worker controlled `/demo`; only cache
  `calorie-week-view-v1.0.5` existed. With Chromium fully offline, reload retained
  the URL, 2,062 kcal average, six logged days, and demo IndexedDB data.
- A controlled local server changed the worker bytes after activation. The new
  worker installed and the app displayed **An update is ready. Reload to use
  it.** with no console/page errors.
- Manifest name, standalone display, versioned `/app?v=1.0.3` start URL, 192/512
  icons, and the 512 maskable icon are present.
- Live mobile Lighthouse: 96 performance, 100 accessibility, 100 best practices,
  100 SEO; FCP 1.1 s, LCP 1.4 s, TBT 220 ms, CLS 0.033, 108 KiB transferred.
  A live interaction-timing sample across week and settings actions measured a
  32 ms maximum interaction duration, below the 200 ms interaction budget.

Evidence is in `.factory/verification-artifacts/verify7-local/` and
`.factory/verification-artifacts/verify7-live/`, including local/live baseline
captures, mobile/dark/200%-text captures, and the Lighthouse JSON report.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

