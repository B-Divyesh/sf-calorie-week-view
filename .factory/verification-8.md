# Independent product verification 8

## Verdict: PASS

Candidate `3b6134d077f0221d2cb21f1dec36f24b8a8335d6` was independently verified on
2026-08-29 UTC against <https://calorie-week-view.sociobot.in>. The checkout
was at that exact commit before verification. No product code was changed.

No release-blocking, high, medium, or low-severity defect was found. The live
release matches the candidate build byte-for-byte for the checked deployment
files, including HTML, hashed CSS/JS, worker, manifest, 404, fonts, icons, and
art.

## Mandatory first-read and demo gate

A fresh cold live load at 390 px passed the first-read gate. Its first screen
plainly says **Review your calories by week**, identifies **food loggers** who
want to compare seven days without daily scores or suggested targets, and puts
**Try it with sample data** beside a plain explanation of what opens.

One keyboard-activated click opened `/demo`. It immediately showed the
persistent **Demo — sample data, nothing is saved to your log** banner, Reset
demo and Start for real, six useful sample days, a missing Saturday, 2,062 kcal
logged-day average, macro averages, weight points, and notes. This passes the
one-click isolated-demo requirement.

## Claims

`.factory/claims.json` exists and contains 23 claims. After `npm ci` from the
clean checkout, I ran every literal `test` command in manifest order. The final
Playwright result was `passed` with no failed tests. I also ran
`npm run test:e2e -- --grep '@claim'`: all 23 tagged claim tests passed.

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

The landing page and README were cross-checked with the manifest. No unlisted
material product claim was found.

## Clean checkout and build gates

- `npm ci`: PASS — 61 packages installed; 62 audited; zero vulnerabilities.
- `npm test`: PASS — 15 Vitest unit/contract tests, TypeScript production build,
  and 34 Chromium tests.
- `npm run build`: PASS — creates `dist/index.html`.
- No separate lint script exists; `tsc --noEmit` runs in the production build.
- Initial bundle: JS 36.90 kB raw / 12.46 kB gzip; CSS 19.42 kB raw / 5.10 kB
  gzip; self-hosted WOFF2 fonts total 46.97 kB; hero WebP is 42.81 kB. All
  applicable static-PWA budgets pass.

## Independent live product checks

- Desktop and 390 px mobile checks passed. Mobile `/demo` had no horizontal
  overflow (`scrollWidth == clientWidth == 390`), and the first screen stayed
  clear and usable.
- Keyboard-only use passed for skip link, demo entry, dialog open/cancel, and
  form interaction. The primary action has a computed 3 px ochre focus outline
  with a 3 px offset. Dialog focus entered the labelled Calories field; Escape
  restored focus to **Add daily totals**.
- Reduced-motion emulation left only a completed 0.01 ms animation. There was
  no continuing or flashing animation.
- Invalid settings (minimum 2,300, maximum 1,800) stayed in the dialog,
  preserved the 1,800–2,200 range, and announced: “The maximum must be higher
  than the minimum. Change one value.” Claim tests additionally cover malformed
  CSV/JSON, invalid dates/settings, boundary values, reset, and data isolation.
- Axe (`@axe-core/playwright`) found zero serious or critical findings on live
  desktop home, 390 px demo, dark-mode demo, privacy, and terms. All had zero
  console errors or page errors.
- Route checks passed for `/`, `/app`, `/demo`, `/privacy`, `/terms`, and a
  missing path. Each has `lang="en"`, one h1, one main, an appropriate title,
  description, canonical URL, and Open Graph title. The missing path returns
  the designed HTTP 404. Crawled internal links and the labelled Param Factory
  external link returned 200 (the privacy mail link is intentionally `mailto:`).

## Privacy, headers, PWA, and deployment identity

In a fresh live demo context, a save flow issued only five same-origin GET
requests: document, two self-hosted fonts, hashed script, and stylesheet. No
request failed and the only IndexedDB database was `demo:calorie-week-view`.
There were no analytics, ads, external scripts, frames, API calls, or third
party connections.

Normal, demo, privacy, terms, worker, manifest, asset, and 404 responses send
the expected CSP (`'self'` sources and `frame-ancestors 'none'` as a response
header), HSTS, `nosniff`, strict-origin referrer policy, and denied
camera/microphone/geolocation permissions. Documents revalidate at 30 seconds;
hashed JS/CSS is `max-age=31536000, immutable`.

The fresh live worker controlled `/demo`, used cache
`calorie-week-view-v1.0.6`, and retained the demo banner, populated sample, and
2,062 kcal value after a fully offline reload. The manifest has standalone
display, a versioned start URL, and 192/512/maskable icons. The worker registers
an update listener that announces a ready update; its active live bytes match
the candidate.

SHA-256 matched local `dist/` and live responses for `index.html`, both hashed
assets, `sw.js`, manifest, offline and 404 pages, hero and social art, 192/512
icons, and the regular font. The live hashed assets are
`index-BEpsDyFL.js` and `index-CEsbQIcF.css`, exactly as built.

This is a static local-first PWA: it has no server-side product or unlock
endpoint, backend, account, payment, AI call, package API, CLI, or sign-in.
Rate-limit/429/Retry-After, concurrency, server persistence/health identity,
consumer-install, and Entra authority checks are therefore not applicable.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.
