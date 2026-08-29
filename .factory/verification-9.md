# Independent product verification 9

## Verdict: FAIL

Candidate `57915100c917e1c83622d2f201e199a4d578f3db` was independently
verified on 2026-08-29 UTC against
<https://calorie-week-view.sociobot.in>. The checkout was clean and at the
exact candidate commit before verification. No product code was changed.

The previously reported deployment problem is not present: production is
available and its served product bytes match this candidate. The release still
fails the acceptance contract because public licensing claims are absent from
`.factory/claims.json`, and because canceled settings return when the dialog is
reopened.

## Release-blocking finding

### RB-9-1 — Public licensing claims have no claim entry or sandbox test

The live `/terms` page says, “The source code is available under the MIT
License.” README says, “Source code is MIT licensed” and “Atkinson Hyperlegible
is distributed under the SIL Open Font License; its license ships beside the
font files.” These are statements a visitor can rely on, but none of the 23
entries in `.factory/claims.json` covers licensing and there is no
`@claim:<licensing-id>` test. The `art-provenance` claim checks generated art,
not source or font licensing.

`LICENSE` does contain the MIT text and `public/fonts/LICENSE.txt` is present,
so no false-license allegation is made. The release blocker is the missing
claim registration and required sandbox test. The supplied claims contract
explicitly makes every unlisted public claim a failed review.

## Medium finding

### M-9-1 — Cancel and Close settings retain discarded draft values

Fresh production reproduction:

1. Open `/demo`; the saved range is 1,800–2,200.
2. Open **Change settings**, enter 1,111 and 2,222, then choose **Cancel**.
3. The review correctly continues to show 1,800–2,200.
4. Reopen **Change settings**. The form incorrectly shows the canceled
   1,111–2,222 draft instead of the saved 1,800–2,200 values.
5. The close icon behaves the same way with a 1,234–2,345 draft. Reloading
   restores the saved values.

This makes Cancel misleading and lets a later Save apply a range the person
already discarded. The range controls the core weekly interpretation. The
existing `@regression:dialog-cancel` test checks that IndexedDB and the visible
summary are unchanged, but it does not reopen the dialog and therefore misses
the stale draft.

## Mandatory first-read and demo gate

PASS. A fresh cold live page plainly shows:

- what it does: **Review your calories by week**;
- for whom: food loggers comparing seven days without scores or suggested
  targets;
- what to do first: **Try it with sample data**, beside an explanation that it
  opens six sample days and one missing day.

At 390 × 844, the headline, audience, primary action, explanation, blank-week
alternative, and all three privacy/offline/price facts remain on the first
screen. One keyboard-activated action opens `/demo`, immediately showing the
persistent **Demo — sample data, nothing is saved to your log** banner, Reset
demo, Start for real, six populated days, a missing Saturday, macros, weight,
and notes. Direct `/?demo=1` also works.

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every literal `test` command was
run separately in manifest order. All 23 listed claim tests passed:

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
| art-provenance | PASS |

The manifest-to-copy cross-check nevertheless fails because of RB-9-1. Passing
all listed tests does not excuse an unlisted public claim.

## Clean checkout and build gates

- `npm ci`: PASS — 61 packages installed, 62 audited, zero vulnerabilities.
- Every exact `.factory/claims.json` command: PASS — 23/23.
- `npm test`: PASS — 15 Vitest unit/contract tests, the TypeScript production
  build, and 37 Chromium tests.
- `npm run build`: PASS — creates `dist/index.html`.
- No separate lint script exists. `tsc --noEmit` is part of the exact build.
- Initial output: JavaScript 36.89 kB raw / 12.45 kB gzip; CSS 19.42 kB raw /
  5.10 kB gzip; self-hosted fonts total 46.97 kB; loaded hero WebP 42.81 kB.
  These are within the static-PWA budgets.

## Independent functional and accessibility evidence

- Normal live save flow passed. On the missing day, 20,001 calories was
  rejected with “Value must be less than or equal to 20000.” The 20,000
  boundary plus maximum protein, carbs, fat, weight, and a 200-character note
  saved and rendered. Focus returned to that row's Edit action.
- An inverted 2,300–1,800 range stayed in the dialog and announced, “The
  maximum must be higher than the minimum. Change one value.” Correcting it to
  0–20,000 saved and returned focus to Change settings.
- An invalid third CSV row (`protein_g=1001`) reported its 0–1,000 bound and
  left all seven existing records unchanged.
- Keyboard-only checks passed for the skip link, primary demo action, demo
  entry, forms, and history navigation. The first Tab reaches the skip link;
  Enter focuses the h1; the primary action has a 3 px ochre outline and 3 px
  offset. Entry-dialog focus starts on Calories. Browser Back restores and
  announces the demo h1.
- Desktop route checks passed for `/`, `/demo`, `/privacy`, `/terms`,
  `/offline.html`, and a real HTTP 404. Each has `lang="en"`, one h1, one main,
  correct titles, alt text, and no horizontal overflow.
- Fresh axe runs found zero serious or critical violations on all six desktop
  surfaces and on 390 px dark-mode home, demo, privacy, and terms.
- At 390 px, all checked interactive targets were at least 44 × 44 CSS pixels
  and `scrollWidth == clientWidth == 390`. A 200% text-size check on home and
  demo had no page-level horizontal overflow.
- Reduced-motion emulation matched and left only a completed 0.01 ms
  animation. Normal product routes produced no console or page errors. Chrome
  reports the expected failed-document console message when deliberately
  requesting the HTTP 404.
- `/opt/fleet/lib/verify-url.sh` passed the cold live URL in 777 ms with one h1,
  a main landmark, `lang=en`, image alt text, labelled buttons, and no console
  or page errors.

## Privacy, headers, PWA, performance, and deployment identity

A fresh production demo save-and-settings flow made five unique requests:
document, two self-hosted fonts, hashed JavaScript, and hashed CSS. Every
request was a same-origin GET; none failed. No analytics, ad, API, frame, or
third-party request occurred. The only IndexedDB database was
`demo:calorie-week-view`.

Documents, worker, manifest, assets, and the 404 response send a self-only CSP
with `frame-ancestors 'none'` as a response header, HSTS, `nosniff`,
strict-origin referrer policy, and denied camera/microphone/geolocation.
Documents and the worker use `max-age=30, must-revalidate`; hashed JS/CSS and
fonts use one-year immutable caching.

The live worker controlled the page from `/sw.js`. `registration.update()`
completed with the worker active, and the live cache was
`calorie-week-view-v1.0.7`. After the first online visit, a fully offline reload
of `/?demo=1` returned 200 and retained the demo banner, 2,062 kcal average,
six logged days, and the isolated demo database. The manifest uses standalone
display, a versioned `/app?v=1.0.5` start URL, and 192, 512, and maskable icons.

A fresh Lighthouse 12.8.2 mobile run scored 99 performance, 100 accessibility,
100 best practices, and 100 SEO. FCP was 1.1 s, LCP 1.4 s, TBT 140 ms, CLS
0.033, and initial transfer 129 KiB.

SHA-256 comparison matched local `dist/` to production for all 22 served build
files, including HTML, hashed JS/CSS and source map, worker, manifest, 404,
offline page, fonts, icons, art, robots, and sitemap. This establishes that the
deployed product matches candidate `57915100...`; the candidate itself changes
only factory documentation after the product build commit.

This is a static local-first PWA. It has no product, unlock, AI, billing, or
other server-side endpoint, so concurrency, health identity, persistence
boundary, and 429/Retry-After allowance checks are not applicable. It has no
sign-in, package API, or CLI, so Entra and consumer-install checks are also not
applicable. AI would not improve the deterministic weekly calculation required
by the brief, so there is no missed-AI-leverage finding.

## Findings by severity

- Release-blocking: RB-9-1, unlisted public licensing claims.
- High: none.
- Medium: M-9-1, canceled settings drafts reappear on reopen.
- Low: none.

## Required next steps

1. Add a licensing entry to `.factory/claims.json` and one matching tagged test
   that proves the root MIT license and shipped font license, or remove public
   claims that are not required. Keep the mandatory license files.
2. Reinitialize every settings field from saved settings whenever the dialog
   opens. Add a regression that changes values, cancels with each close path,
   reopens, and expects the saved values.
3. Re-run every manifest command, the full suite, exact build, and live checks
   after deploying the repaired candidate.
