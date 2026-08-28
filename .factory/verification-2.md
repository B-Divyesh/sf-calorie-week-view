# Independent verification 2 — candidate `ce47a4961f6e1977aa7afeff66e65d258c70306a`

## Verdict: FAIL

**Tested commit:** `ce47a4961f6e1977aa7afeff66e65d258c70306a`  
**Tested deployment:** <https://calorie-week-view.sociobot.in>  
**Date:** 2026-08-28 UTC  
**Verifier changes to product code:** none

The deployed static files are byte-identical to this candidate, and the required
claim tests, build, PWA, privacy, accessibility, and normal product flows pass.
The candidate is nevertheless not releasable because its advertised JSON-backup
import accepts invalid user input as a success and persists corrupt records and
settings. That makes a weekly review unreliable after a malformed backup is
selected.

## First-read gate: PASS

Cold-opening the live home page at 1440px and 390px answers all three required
questions in plain words without scrolling:

- **What it does:** “Review your calories by week.”
- **For whom:** “For food loggers who want the weekly pattern without streaks,
  scores, or automatic targets.”
- **What to click first:** the visible primary button is “Try it with sample
  data,” with adjacent copy saying it opens a complete week before personal
  entries.

One click opens `/demo`, immediately showing six realistic daily entries, a
missing Saturday, calorie/macro summaries, and an optional weight trend. The
banner says “Demo — sample data, nothing is saved to your log” and provides both
**Reset demo** and **Start for real**. The demo used only the
`demo:calorie-week-view` IndexedDB namespace.

## Release-blocking finding

### High — V2-01: JSON import silently persists invalid backups

`importJSON` validates only that `records` is an array, the date *matches a
numeric-looking pattern*, and calories are finite. It does not validate actual
calendar dates; non-negative numeric optional fields; note type/length;
`updatedAt`; settings range; or the declared weight-unit/theme values.

Fresh live `/demo` reproduction, using the visible **Import JSON backup**
control:

1. Imported a JSON file containing the impossible date `2026-02-31`, calories
   `2300`, and otherwise ordinary settings.
2. The app announced **“Imported 1 entry from the backup.”**
3. The selected week displayed **“0 of 7 days logged”** while IndexedDB retained
   the invisible record `{date: "2026-02-31", calories: 2300, ...}`.

A second fresh live reproduction imported a structurally similar JSON file with
reversed range `2500–2000`, `weightUnit: "stone"`, `theme: "chartreuse"`, and
negative/non-numeric macro and weight values. It again announced success and
rendered, verbatim, `range 2,500–2,000`, `P -5g · C not-a-numberg · F
999999999g`, and `-2 stone`.

The regular settings form and CSV parser reject these values, so JSON backup
import is an inconsistent and unsafe recovery path. A malformed backup can be
selected by an ordinary user; the app offers no warning before committing it.
Validate the complete backup before any IndexedDB write, reject it with a
row/field-specific message, and add a tagged regression claim/test for invalid
JSON input. Re-test this candidate after repair.

## Mandatory claims gate: PASS

From the clean tracked checkout at the candidate commit, `npm ci` completed
successfully (61 packages added; zero vulnerabilities). Before broader QA, I
ran every exact `test` command from `.factory/claims.json` separately via the
product's `/demo` entry point. All 13 passed:

| Claim ID | Result |
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
| `json-import` | PASS for a valid backup; does not cover invalid input |
| `delete-log` | PASS |
| `logged-day-average` | PASS |

For additional regression confidence, `npx playwright test --grep
'@claim:offline-reload' --repeat-each=10` passed 10/10 in 37.1 seconds.

## Local quality gates: PASS

- `npm test`: **PASS** — 8 Vitest unit/deployment tests and 17 Playwright tests.
- `npm run build`: **PASS** — `tsc --noEmit` and Vite both completed; `dist/`
  was created.
- Repository lint/type scripts: no separate lint or typecheck script exists;
  TypeScript checking is part of the build.
- `npm pack --dry-run`: **PASS**. This is a static PWA, not a published library
  or CLI, so consumer-package installation is not applicable.
- Production bundle: JS 32.03 kB raw / 10.96 kB gzip and CSS 19.20 kB raw /
  5.08 kB gzip; both are within the static-product budget.

## Product, accessibility, and PWA checks

Normal paths passed on the live product at desktop and 390px mobile:

- Demo/reset/start-real separation, manual entry (including optional macros,
  weight, note), zero-calorie boundary, CSV/JSON export, CSV import, print,
  range/theme/unit settings, and clear-demo behavior all worked.
- Negative calories were blocked by native validation with “Value must be
  greater than or equal to 0.” Correcting to zero saved successfully. A CSV
  negative protein value was rejected with the row/field-specific recovery
  message and no import occurred.
- Independent axe-core scans of live home, desktop demo, and 390px demo had no
  serious or critical violations. Mobile had no page overflow; keyboard focus
  was visibly solid on the scrollable chart and visible CSV import label;
  measured wordmark/footer controls were at least 44px high.
- The factory `verify-url.sh` passed against the live home page: 200 response,
  title/lang, one h1, main landmark, image alt text, labeled buttons, and zero
  console/page errors. Its measured cold load was 631 ms in the verifier
  environment.
- Five fresh live browser contexts each loaded `/demo`, waited for service
  worker control/cache readiness, went offline, and reloaded successfully with
  the review heading and `2,062 kcal` sample average. A controlled service
  worker script revision raised “An update is ready. Reload to use it.”

## Privacy, deployment identity, and HTTP policy

- The live demo flow's outgoing request log contained only the product origin
  (HTML, self-hosted fonts, JS, CSS, and original art). No ads, analytics,
  third-party scripts, runtime AI, account, or payment requests were observed.
- Live responses include CSP restricted to `'self'`, HSTS, `nosniff`, strict
  referrer policy, and a restrictive permissions policy. HTML, service worker,
  and manifest revalidate at 30 seconds; hashed JS/CSS and fonts are
  one-year immutable.
- `/not-a-real-route` returns HTTP **404**. `/privacy`, `/terms`, sitemap, and
  robots endpoints returned 200.
- This PWA has no application server/API endpoint, product-unlock endpoint, or
  sign-in flow. Rate-limit/429 and Entra-tenant checks are not applicable.
- SHA-256 matched local candidate `dist/` against live for `index.html`,
  `sw.js`, `manifest.webmanifest`, `assets/index-Bxq-MrxY.js`, and
  `assets/index-Bf9MsYVr.css`. The live deployment is therefore the candidate
  under review.

## Acceptance result

**FAIL** until V2-01 is repaired and independently re-verified. All other
checks above are evidence of what already works; they do not make unsafe backup
import acceptable.
