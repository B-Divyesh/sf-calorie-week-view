# Independent verification 4 — candidate `4a129b5eca1ac9d243ee2b7192ec7349afe14880`

## Verdict: FAIL

**Tested commit:** `4a129b5eca1ac9d243ee2b7192ec7349afe14880`  
**Tested URL:** <https://calorie-week-view.sociobot.in>  
**Date:** 2026-08-28 UTC  
**Verifier product-code changes:** none

The candidate is deployed, fast, private by default, and substantially functional.
The first-read gate and all 18 declared claim tests pass. It is not ready to
release because fresh live testing found one high-severity form-action defect and
four medium-severity contract/correctness defects.

## Release-blocking findings

### High — V4-01: Cancel and close controls submit and save form changes

Both forms put their Cancel and × buttons inside a form without
`type="button"`. The submit handlers do not inspect the submitter and therefore
process those controls as Save.

Fresh live reproductions on `/demo`:

- Open the one missing day's **Add** form with calories empty and choose
  **Cancel**. The dialog stays open and reports “Please fill out this field.”
  The × control behaves the same way because native required-field validation
  blocks the submit.
- Enter `2111` calories, then choose **Cancel**. The dialog closes and the daily
  table contains `2,111`; the unwanted entry was saved. Focus then falls to
  `<body>` instead of returning to the invoking Add button.
- Change settings to `1111–2222`, then choose **Cancel**. The review changes to
  `range 1,111–2,222`. A separate run changing to `1234–2345` and choosing ×
  also saved that range.

This breaks normal recovery, keyboard use, and the meaning of two prominently
labelled controls. Make all non-save dialog controls explicit non-submit buttons,
close without writing, restore trigger focus, and add browser regressions that
assert IndexedDB remains unchanged.

### Medium — V4-02: leaving the demo does not discard demo changes

The supplied demo contract requires leaving demo mode to discard demo state (or
to offer an explicit one-time keep action). In a fresh live context I changed the
demo range to `1234–2345`, chose **Start for real**, waited for the blank real-log
screen, and reopened `/demo`. The changed `range 1,234–2,345` remained. Both
`calorie-week-view` and `demo:calorie-week-view` databases existed at that point.

The real log remained blank, so storage isolation itself passes. The defect is
that the sandbox is retained after the explicit exit action. Clear/reset the demo
namespace when leaving it, or offer the contract's explicit keep choice.

### Medium — V4-03: mobile touch targets do not all meet 44×44 px

At a 390×844 CSS viewport, measured live bounding boxes include:

- **Start with a blank week:** `186 × 25.5 px`.
- Footer **Terms:** `40 × 44 px`.

The supplied accessibility and design contracts require every touch/click target
to be at least 44×44 CSS px. Axe does not flag target sizing, so the existing axe
checks do not cover this failure. Add padding/minimum dimensions without reducing
the required spacing between adjacent targets, then regress all interactive
elements at 390 px.

### Medium — V4-04: CSV import bypasses the product's numeric upper bounds

Manual entry and JSON backup validation cap calories at 20,000, protein/fat at
1,000 g, carbs at 2,000 g, and weight at 1,500. Live CSV import accepted this row
and displayed every value:

```csv
date,calories,protein,carbs,fat,weight
2026-08-17,20001,1001,2001,1001,1501
```

The resulting weekly view showed `20,001` calories, `P 1001g · C 2001g · F
1001g`, and `1501 lb`. CSV currently rejects negative/non-numeric values but has
no corresponding upper-bound checks. Apply the same record validation to every
input path and reject the whole file without partial writes.

### Medium — V4-05: changing weight units relabels historical values

The sample record displayed `72.8 kg`. Changing the setting to pounds caused the
same stored number to be presented as `72.8 lb`; it was not converted to about
`160.5 lb`, nor was the person warned that existing values would be reinterpreted.
That makes the optional weight trend materially incorrect after a normal settings
change. Store the unit with each value and convert for display, migrate existing
values on an explicit confirmed action, or make the unit immutable once weights
exist.

## First-read gate: PASS

I opened the live home page cold in a fresh 1440×900 context before inspecting
implementation copy. The first screen plainly answers all three required points:

- **What it does:** “Review your calories by week.”
- **Who it is for:** “For food loggers who want the weekly pattern without
  streaks, scores, or automatic targets.”
- **What to click first:** **Try it with sample data**, with “See a complete week
  before adding your own entries.” beside it.

The primary action is also above the fold at 390×844. One click opens `/demo`
with six realistic records, a missing Saturday, a weekly average, macro summaries,
and a weight trend. The persistent demo banner provides **Reset demo** and
**Start for real**. See
`qa-artifacts/verification-4/verify-url-live/screenshot-desktop.png` and
`qa-artifacts/verification-4/live-home-mobile-390.png`.

## Mandatory claims gate: PASS

After `npm ci` from the clean candidate checkout, I ran every manifest command
separately in manifest order. Each command rebuilt the production artifact and
selected exactly one Playwright test through `/demo`.

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

The aggregate result is `CLAIM_FAILURE_COUNT 0`. Raw output is in
`qa-artifacts/verification-4/claims-results.txt` and the 18 adjacent
`claim-*.log` files. The landing page and README claim-like copy maps to these
manifest entries; I found no new unlisted public claim.

## Local quality gates

- `npm ci`: PASS — 61 packages installed, 62 audited, 0 vulnerabilities.
- `npm test`: PASS — 11 Vitest tests, TypeScript checking, a production build,
  and 22 Chromium tests passed.
- `npm run build`: PASS — `dist/` contains `index.html` and the full static PWA.
- No separate lint command exists. Type checking is part of `npm run build`.
- `npm pack --dry-run`: PASS. Consumer installation is not applicable because
  this is a private static PWA, not a library or CLI.
- Output budgets: JS 34.15 kB raw / 11.66 kB gzip; CSS 19.20 kB raw / 5.08 kB
  gzip; fonts 46.97 kB total; mobile hero WebP 42.81 kB. All are within the
  supplied budgets.

## Independent end-to-end and recovery coverage

Fresh browser contexts exercised the candidate and byte-identical live build:

- Loaded sample data, navigated weeks, edited a daily record, saved optional
  macros/weight/note, changed range and theme, imported valid CSV/JSON, exported
  CSV/JSON, invoked print, cleared/reset records, and entered the real blank log.
- `-1` calories was rejected with “Value must be greater than or equal to 0.”
  Correcting to `0` saved. A note containing `<img ...>` rendered as text and
  created no injected image.
- A reversed range kept the settings dialog open and announced “The maximum must
  be higher than the minimum. Change one value.” Correcting to `0–20,000` saved.
- A CSV without calories produced actionable recovery copy and left the six-day
  sample unchanged. A quoted comma round-tripped. Malformed JSON left the prior
  imported record intact.
- The additional adversarial paths found V4-01, V4-04, and V4-05 above.

## Accessibility and responsive checks

- Live axe-core: 0 serious/critical findings on home, populated desktop demo,
  and populated 390 px demo. The byte-identical local suite also passed dark
  mode. V4-03 remains because automated axe did not enforce the supplied 44 px
  target rule.
- One `<h1>`, `<main>`, `lang="en"`, titles, image alt text, and labelled buttons
  passed the supplied `verify-url.sh`; its report records a 938 ms load and no
  console/page errors.
- Keyboard smoke test: first Tab exposes the skip link with a 3 px ochre outline;
  Enter moves focus to the page h1. The primary action also has a 3 px visible
  outline. Native dialogs receive initial focus and Escape returns to the trigger.
  V4-01 breaks the visible cancel path and post-save focus.
- No horizontal page overflow occurred at 390 px. At reduced motion, the weight
  trace duration and transitions computed to `0.00001s`.

## Privacy, headers, routes, and deployment identity

- A live home → demo → edit/import → real-log → demo → offline flow made 16
  requests across seven unique URLs. Every request was same-origin. There were
  no analytics, ads, third-party scripts, log-data requests, failed responses,
  console errors, or page errors.
- Live responses include a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a
  restrictive camera/microphone/geolocation permissions policy.
- HTML, service worker, and manifest use 30-second revalidation. Hashed JS/CSS
  use `Cache-Control: public, max-age=31536000, immutable`.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, manifest, robots, sitemap, icons,
  and the external factory link returned 200. `/not-a-route` returned a real 404.
- SHA-256 is identical live versus the fresh `dist/` build for `index.html`, JS,
  CSS, `sw.js`, manifest, robots, sitemap, and `404.html`. The deployed site is
  candidate `4a129b5`; the previously mentioned deployment-only concern is not
  reproduced.
- This static PWA has no application API, product-unlock call, backend, or sign-in
  flow. Request-allowance/429, `Retry-After`, concurrency, server persistence,
  health/build endpoint, and Entra authority checks are therefore not applicable.

## PWA and performance

- A fresh live context gained control from `/sw.js`, populated cache
  `calorie-week-view-v1.0.2`, and reloaded `/demo` offline with its entries.
- In a controlled server using the exact production build, changing the served
  worker caused the visible “An update is ready. Reload to use it.” message,
  activated a new versioned cache, and preserved offline reload after refresh.
- The manifest has standalone display, versioned `/app?v=1.0.0` start URL, theme
  and background colors, 192/512 icons, and a 512 maskable icon.
- Fresh live Lighthouse mobile:
  **96 performance / 100 accessibility / 100 best practices / 100 SEO**;
  FCP 1.1 s, LCP 1.4 s, TBT 230 ms, CLS 0.032, interactive 1.4 s, total transfer
  108 KiB. Evidence: `qa-artifacts/verification-4/lighthouse-live-mobile.json`.

## Required repair and re-verification

1. Make Cancel and × close without submitting or writing, and restore focus.
2. Discard/reset demo state on **Start for real**, or add the explicit keep flow.
3. Bring every mobile target to at least 44×44 CSS px.
4. Apply one numeric validation policy to manual, CSV, and JSON entry paths.
5. Preserve weight meaning across unit changes.
6. Add regression tests for each reproduction, then rerun every claim command,
   the full suite/build, live identity/privacy, axe, and PWA offline/update checks.
