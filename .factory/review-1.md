# Adversarial first-read review 1

## Verdict: FAIL

No blocking defect was reproduced. The first-read, demo, functional, privacy,
offline, routing, accessibility, and declared-claim gates pass. The review still
fails because the acceptance rule requires zero findings: seven visitor-facing
claims are absent from `.factory/claims.json`, route-specific social metadata is
stale, and twelve copy units violate the supplied plain-words rules.

- Reviewed URL: <https://calorie-week-view.sociobot.in>
- Reviewed repository commit: `3bbfc7c4bf2a0e9829335b82cba3b2a12017839c`
- Review date: August 29, 2026 UTC
- Product code changed by reviewer: no

## 1. Cold first read

Fresh browser contexts were opened at 390×844 and 1440×900 before scrolling.

| Question | First-read answer | Exact supporting copy | Result |
| --- | --- | --- | --- |
| What does it do? | It compares calorie totals across a week instead of scoring each day. | “Review your calories by week” | PASS |
| For whom? | People who already log food and want a weekly view. | “For food loggers who want the weekly pattern without streaks, scores, or automatic targets.” | PASS |
| What should I click first? | Open the sample week. | “Try it with sample data” and “See a complete week before adding your own entries.” | PASS, with the inaccurate “complete week” claim in F-1-1 |

All three answers and the primary action were visible without scrolling at both
sizes. There was no horizontal overflow and no console or page error on the
successful cold loads.

## 2. Copy audit

Counts treat a hyphenated term as one word. Headings, labels, links, buttons,
and fragments are included so the audit is stricter than sentence-only prose.
No unit exceeds 22 words and no supplied banned word appears.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| A weekly reflection tool | 4 | F-1-9: vague category label |
| Review your calories by week | 5 | — |
| For food loggers who want the weekly pattern without streaks, scores, or automatic targets. | 14 | F-1-6: “without streaks” is an unlisted claim |
| Try it with sample data | 6 | — |
| See a complete week before adding your own entries. | 9 | F-1-1: inaccurate and unlisted demo claim |
| Start with a blank week | 6 | — |
| Your log stays in this browser. | 6 | — |
| Works offline after the first visit. | 6 | — |
| Free. | 1 | — |
| No account or ads. | 4 | — |
| Read the shape of a week, not a daily score. | 10 | F-1-10: metaphor |
| The weekly map | 3 | F-1-11: metaphorical label |
| Seven days stay in context | 5 | F-1-12: heading does not name the section |
| Missing days stay blank. | 4 | — |
| Averages use only the days you logged. | 7 | — |
| Logged-day average | 2 | — |
| Inside range | 2 | — |
| How it works | 3 | — |
| Turn entries into one review | 5 | — |
| Add daily totals | 3 | — |
| Type calories and optional macros or weight. | 7 | — |
| You can also import CSV. | 5 | — |
| Read the week | 3 | — |
| Compare your logged-day average with the range you chose. | 9 | — |
| Keep your copy | 3 | F-1-13: vague heading |
| Export CSV or JSON. | 4 | — |
| Print one week for your own records. | 7 | — |
| A quiet boundary | 3 | F-1-14: mood heading |
| You choose the range | 4 | — |
| This tool does not set calorie targets, diagnose health, or judge a day. | 13 | — |
| It does not include food search or coaching. | 8 | — |
| Delete or export your whole log from the review screen. | 10 | — |
| See your calorie week without a daily score. | 9 | — |
| Original generated map art | 4 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calorie Week View | 3 | — |
| Review seven days of calories, macros, and weight without a daily score. | 12 | — |
| Calorie Week View is for people who already log food. | 10 | — |
| It turns manual totals or CSV rows into a calm weekly review. | 12 | F-1-15: unmeasured marketing adjective |
| You choose the calorie range. | 5 | — |
| Missing days stay blank and do not lower the logged-day average. | 11 | — |
| The app is free, needs no account, and stores its data in IndexedDB on the current device. | 17 | F-1-18: unexplained implementation jargon |
| It sends no log data to another service. | 8 | — |
| After the first visit, the installed service worker can reload the app offline. | 13 | F-1-19: implementation jargon obscures the result |
| Try the sandbox | 3 | F-1-16: inconsistent term |
| Open `/demo` or `https://calorie-week-view.sociobot.in/demo`. | 8 | — |
| It loads six realistic entries in an isolated `demo:calorie-week-view` database. | 11 | F-1-17: subjective adjective; F-1-20: implementation detail in user instructions |
| The banner can reset the sample. | 6 | F-1-2: unlisted claim |
| Choosing Start for real discards that demo database without copying it. | 11 | F-1-3: unlisted claim |
| Features | 1 | — |
| Add calories, optional macros, optional weight, and a note for each date. | 12 | — |
| Import CSV files with required `date` and `calories` columns. | 9 | F-1-5: unlisted schema claim |
| Read a seven-day calorie chart, logged-day average, macros, and weight trend. | 11 | F-1-4: unlisted display claim |
| Export all entries to CSV or export entries and settings to JSON. | 12 | — |
| Invalid JSON backups are rejected before they change your log. | 10 | — |
| Print the selected week. | 4 | — |
| Choose a light, dark, or device theme. | 7 | — |
| Delete the whole local log from the review screen. | 9 | — |
| Public product claims and their sandbox tests live in `.factory/claims.json`. | 12 | —; “sandbox” is correct here because this is developer-facing test documentation |
| CSV format | 2 | — |
| Dates use `YYYY-MM-DD`. | 3 | F-1-5: unlisted schema claim |
| Only `date` and `calories` are required. | 6 | F-1-5: unlisted schema claim |
| Weight uses the unit selected in settings. | 7 | — |
| Changing units converts existing values for display while preserving their stored meaning. | 12 | — |
| Run and test | 3 | — |
| Requires Node.js 20 or newer. | 6 | — |
| `npm test` runs unit tests, builds the production bundle, and runs Playwright in Chromium. | 14 | —; developer context |
| The claim tests use only `/demo` and bundled sample data. | 10 | — |
| The exact deploy command is `npm run build`. | 8 | — |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 12 | — |
| Routes | 1 | — |
| `/` — product overview and live preview | 5 | — |
| `/app` — real local log | 4 | — |
| `/demo` — isolated sample log | 4 | — |
| `/privacy` — storage and privacy details | 5 | — |
| `/terms` — terms and health boundary | 5 | — |
| Privacy and scope | 3 | — |
| There is no account, analytics, ad script, food search, coaching, diagnosis, or automatic target. | 14 | — |
| The app makes no health recommendation. | 6 | — |
| Export a backup before clearing browser storage or moving devices. | 10 | — |
| See `.factory/design.md` for the topographic visual system, `.factory/demo.md` for sandbox details, and `.factory/handoff.md` for verification notes. | 22 | — |
| License | 1 | — |
| Source code is MIT licensed. | 5 | — |
| Atkinson Hyperlegible is distributed under the SIL Open Font License; its license ships beside the font files. | 17 | — |
| Generated map art is original to this product, with its prompt and review in `assets/src/`. | 16 | — |

Every landing action uses a verb and names its result well enough to predict the
next state. Navigation labels are nouns, appropriately, rather than action
buttons.

## 3. Demo

PASS.

From the landing page, one click on **Try it with sample data** opened `/demo`.
The first rendered screen showed six filled days, one missing day, a 2,062 kcal
logged-day average, macro averages, three weight points, and daily notes. The
persistent banner read “Demo — sample data, nothing is saved to your log” and
provided **Reset demo** and **Start for real**.

An adversarial live isolation flow first wrote a `1,777` calorie entry with note
“Real storage sentinel” into `calorie-week-view`, then entered the demo. Changing
the demo range to 1,900–2,300 and choosing **Reset demo** restored 1,800–2,200
and the 2,062 sample average. **Start for real** removed
`demo:calorie-week-view`, retained `calorie-week-view`, and rendered the unchanged
1,777-calorie sentinel. No demo write reached the real database.

The wording next to the landing action is still inaccurate: the sample covers a
complete seven-day date range but does not contain a complete set of seven
entries. That is F-1-1, not a demo-function blocker.

## 4. Declared claims

Each command was run separately, in manifest order, after `npm ci` in a fresh
clone at `/tmp/tmp.tdJppi7Nel/clone`. Each command selected exactly one tagged
browser test.

| Claim ID | Result | Observable check |
| --- | --- | --- |
| `offline-reload` | PASS | Populated demo rendered after Chromium went offline and reloaded |
| `csv-export` | PASS | Header and six sample rows downloaded |
| `csv-import` | PASS | Imported row, totals, and note rendered |
| `json-export` | PASS | Six records and settings parsed from download |
| `print-week` | PASS | Print action invoked the browser print function |
| `local-private` | PASS | Same-origin traffic and demo-only database asserted |
| `no-ads-tracking-third-party` | PASS | Requests and loaded resources stayed same-origin |
| `free-no-account` | PASS | No password, purchase, subscription, or payment gate |
| `manual-entry` | PASS | Keyboard save included calories, macros, weight, and note at 390 px |
| `settings-choice` | PASS | Range, pounds, and dark theme persisted; weights converted |
| `user-chosen-range` | PASS | Entered range was used and no target was suggested |
| `no-daily-score` | PASS | Rows exposed no score, grade, or judgment control/value |
| `no-food-search-or-coaching` | PASS | Public and review routes exposed neither flow |
| `no-medical-advice` | PASS | Health boundary present; no advice control exposed |
| `json-import` | PASS | Backup restored record and settings |
| `json-import-validation` | PASS | Invalid backups produced recovery errors without changing the sample |
| `delete-log` | PASS | Clear action reduced logged days to zero |
| `logged-day-average` | PASS | Six days averaged to 2,062 and the missing day stayed blank |

The declared tests all pass, but the cross-check found claim-like copy that is
not declared. Those are F-1-1 through F-1-7.

## 5. Sandbox, privacy, and offline behavior

PASS.

- The live demo flow made 11 requests, all to
  `https://calorie-week-view.sociobot.in`; no third-party request, console error,
  or page error occurred.
- The service worker populated `calorie-week-view-v1.0.4`. With Chromium fully
  offline, `/demo` reloaded with the banner, six logged days, and 2,062 kcal.
- Demo edits and Reset touched `demo:calorie-week-view`; the seeded real entry
  remained byte-for-byte equivalent before and after leaving the demo.
- This is a PWA, not a CLI or library, so temp-directory and playground checks
  do not apply.

## 6. Earlier findings

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The
repository handoff and verification history contains the findings below. The
fresh build's hashed JS and CSS filenames and SHA-256 digests match production,
so local regression results apply to the live code; representative live flows
were also repeated.

| Earlier ID | Fresh result | Live/code evidence |
| --- | --- | --- |
| V-01 | Fixed | Exact offline claim passed; live cached demo reloaded offline |
| V-02 | Fixed | Live 390px axe scans returned zero serious/critical violations |
| V-03 | Fixed | `.file-button:focus-within` supplies a visible 3 px outline; keyboard regression passed |
| V-04 | Fixed | Manifest now has 18 unique exact selectors; full claim contract passed |
| V-05 | Fixed | Invalid optional CSV regression rejects the row and preserves six records |
| V-06 | Fixed | Live measurement found no visible target below 44×44 px |
| V-07 | Fixed | Unknown live URL returned HTTP 404 with the designed shell |
| V2-01 | Fixed | Invalid JSON browser claim and complete unit validation passed before writes |
| V3-01 | Fixed for the original scope claims | Target, score, food-search/coaching, and medical-boundary claims are now declared and tested; new unrelated omissions are F-1-1 through F-1-7 |
| V3-02 | Fixed | Every manifest command selected exactly one test; selector-isolation contract passed |
| V4-01 | Fixed | Cancel/close buttons are `type="button"`; dialog cancellation regression passed |
| V4-02 | Fixed | Demo-exit regression and seeded-real-data live flow both passed |
| V4-03 | Fixed | Live mobile target sweep found no undersized control |
| V4-04 | Fixed | Shared bounds and no-partial-write regressions passed |
| V4-05 | Fixed | 72.8 kg displays as 160.5 lb while stored meaning remains kg |
| V5-01 | Fixed | Week, entry, and settings successor-focus regression passed |
| V5-02 | Fixed | Live 404 has literal “Page not found,” header, navigation, main, footer, and no mobile overflow |

No earlier finding is being reopened under its old ID.

## 7. Structure, routes, accessibility, and identity

The required routes `/`, `/app`, `/demo`, `/privacy`, and `/terms` returned 200.
An unknown route returned 404. All crawled HTTP(S) links returned 200 except the
deliberately unknown URL used to verify the 404. Address-bar deep links worked;
client navigation and Back moved focus to the new h1 and updated the title.

Every route has `lang="en"`, one h1, one main, the standard header/footer, a skip
link, a route title, description, canonical URL, and favicon. Heading order is
valid. The home title follows “Product — what it does.” The 404 is designed in
the same topographic system and provides **Return home**. F-1-8 records the one
metadata defect: SPA routes retain home-page Open Graph and Twitter values, and
the static 404 omits part of the required social/icon set.

Live axe scans at 390 px found zero serious or critical violations on home,
demo, privacy, terms, and 404. No tested route overflowed horizontally and no
visible interactive target measured below 44×44 px. The full local suite passed
15 unit/contract tests and 29 Chromium tests. `npm run build` produced `dist/`;
initial JS is 36.59 kB raw / 12.34 kB gzip and CSS is 19.42 kB raw / 5.11 kB
gzip. Reduced-motion CSS is present. Security headers include a self-only CSP,
`frame-ancestors 'none'`, `nosniff`, a strict-origin referrer policy, and disabled
camera/microphone/geolocation.

The topographic-paper identity is recognizably product-specific: custom contour
art, field-paper palette, survey marks, map-sheet panels, and restrained motion
match `.factory/design.md`. It is not a generic centered-gradient SaaS template.

## 8. Missed leverage

No missed product feature was found. The brief calls for manual entry, CSV,
seven-day calorie/macro bands, optional weight trend, missing-day handling,
print, export, and offline use; all are present. JSON backup import/export is an
appropriate extra. Sync would conflict with the current local-only privacy model
unless the product added accounts and conflict handling. An AI feature would not
improve the core weekly calculation and would add network/key complexity, so its
absence is correct.

## Findings

### Moderate

#### F-1-1 — The primary-action explanation promises a complete week that the demo does not contain

- Location/quote: landing first screen, “See a complete week before adding your own entries.”
- Why: the demo intentionally has six entries and one missing Saturday. A first-time visitor is promised a complete week, then sees “6 of 7 days logged.” The sentence is also absent from `claims.json`.
- Fix: replace it with “See a realistic week with one missing day before adding your own entries.” Add a `demo-sample` claim whose exact test clicks the landing action once and asserts the banner, six logged days, missing Saturday, macro averages, weight trend, and notes.

#### F-1-2 — README reset behavior is an unlisted claim

- Location/quote: README, “The banner can reset the sample.”
- Why: Reset is a user-visible promise, but no claim entry names it and no `@claim` test verifies it.
- Fix: add a `demo-reset` claim and exact test that changes an entry and settings, chooses **Reset demo**, and verifies the original six records and 1,800–2,200 range.

#### F-1-3 — README demo-exit behavior is not represented in the claims manifest

- Location/quote: README, “Choosing Start for real discards that demo database without copying it.”
- Why: a regression test exists, but the public promise has no `claims.json` entry, and the current regression does not seed and confirm preservation of real data.
- Fix: add a `demo-exit-isolation` claim and exact test that seeds the real database, changes demo data, exits, confirms the demo database is gone, and confirms the real record is unchanged.

#### F-1-4 — The chart/macro/weight-display capability is unlisted

- Location/quote: README Features, “Read a seven-day calorie chart, logged-day average, macros, and weight trend.”
- Why: existing tests incidentally inspect parts of this UI, but no manifest claim states the complete capability.
- Fix: add one claim with an exact demo test that verifies seven chart dates, the calculated calorie average, all three macro summaries, and the plotted weight values; or narrow the sentence to capabilities already named in existing claims.

#### F-1-5 — The documented CSV schema is not covered by a declared claim test

- Location/quotes: README, “Import CSV files with required `date` and `calories` columns.”, “Dates use `YYYY-MM-DD`.”, and “Only `date` and `calories` are required.”
- Why: `csv-import` proves one valid import, but it does not assert rejection when either required column is absent or when a date violates the documented format.
- Fix: expand the declared CSV claim to include the schema and extend its one tagged test with missing-`date`, missing-`calories`, and invalid-date cases that leave the log unchanged.

#### F-1-6 — “Without streaks” is an unlisted first-screen claim

- Location/quote: landing lede, “For food loggers who want the weekly pattern without streaks, scores, or automatic targets.”
- Why: no-streak behavior is not in `claims.json`; `no-daily-score` does not inspect streak labels or controls.
- Fix: either rewrite to “For food loggers who want to compare seven days without daily scores or suggested targets.” or add “streak” to the no-score claim and its exact negative-UI assertions.

#### F-1-7 — Spreadsheet compatibility is an unlisted live claim

- Location/quote: `/app` and `/demo`, export help, “CSV works in spreadsheets.”
- Why: the export test checks rows and headers but does not establish the broad compatibility promise.
- Fix: use the precise sentence “CSV downloads as comma-separated text.” and make that wording part of the existing export claim, or add a parser-based compatibility assertion and list the claim.

### Minor

#### F-1-8 — Non-home routes publish home-page social metadata

- Location: `<head>` on `/app`, `/demo`, `/privacy`, and `/terms`.
- Exact values: `og:title` and `twitter:title` remain “Calorie Week View — Review a week at once”; `og:url` remains the home URL; descriptions also remain the home description. The static 404 omits `og:url`, Twitter title/description/image, and the apple-touch icon.
- Why: shared links misidentify the route, and the route metadata set is incomplete.
- Fix: extend `setMetadata` to update Open Graph and Twitter title, description, and URL for every route. Complete the same fields and apple-touch icon in `404.html`. Add route-level metadata assertions.

#### F-1-9 — “A weekly reflection tool” is a vague category label

- Location/quote: landing eyebrow, “A weekly reflection tool”.
- Why: it does not name calories or the concrete weekly comparison and could describe many unrelated products.
- Fix: “Weekly calorie review”.

#### F-1-10 — The hero caption uses a metaphor

- Location/quote: landing image caption, “Read the shape of a week, not a daily score.”
- Why: “shape of a week” requires interpretation and violates the no-metaphor rule.
- Fix: “Compare all seven days without a daily score.”

#### F-1-11 — “The weekly map” is a metaphorical section label

- Location/quote: landing preview eyebrow, “The weekly map”.
- Why: the section shows a calorie chart, not a map.
- Fix: “Example calorie chart”.

#### F-1-12 — “Seven days stay in context” does not name the section

- Location/quote: landing preview h2, “Seven days stay in context”.
- Why: heard alone in a heading list, it does not identify a chart, calories, or a weekly example.
- Fix: “Example seven-day calorie review”.

#### F-1-13 — “Keep your copy” hides the available actions

- Location/quote: landing How it works step 3, “Keep your copy”.
- Why: the heading does not say whether the result is saved, downloaded, or printed.
- Fix: “Export or print the week”.

#### F-1-14 — “A quiet boundary” is a mood heading

- Location/quote: landing limits eyebrow, “A quiet boundary”.
- Why: it carries no usable information and conflicts with the required literal section naming.
- Fix: “What this tool does not do”.

#### F-1-15 — “Calm” is unmeasured marketing copy

- Location/quote: README, “It turns manual totals or CSV rows into a calm weekly review.”
- Why: “calm” describes a mood rather than a usable behavior.
- Fix: “It turns manual totals or CSV rows into a weekly review.”

#### F-1-16 — The README changes the user-facing term from demo to sandbox

- Location/quote: README heading, “Try the sandbox”.
- Why: the interface, route, banner, and terminology table all call this mode “demo.”
- Fix: “Try the demo”. Keep “sandbox” only in developer-facing test documentation.

#### F-1-17 — “Realistic” is subjective where concrete sample contents are available

- Location/quote: README, “It loads six realistic entries in an isolated `demo:calorie-week-view` database.”
- Why: the adjective is not useful or measurable.
- Fix: “It loads six sample entries with calories, macros, weights, and notes.”

#### F-1-18 — IndexedDB is unexplained in the reader-facing product summary

- Location/quote: README, “The app is free, needs no account, and stores its data in IndexedDB on the current device.”
- Why: a non-developer does not need the storage API name to understand the privacy result.
- Fix: “The app is free, needs no account, and stores its data in this browser.” Put “Storage uses IndexedDB” in a separate developer note.

#### F-1-19 — The offline sentence leads with an implementation detail

- Location/quote: README, “After the first visit, the installed service worker can reload the app offline.”
- Why: “service worker” is browser-platform jargon and weakens the direct result.
- Fix: “After the first visit, the app can reload offline.”

#### F-1-20 — The demo instructions expose an internal database name

- Location/quote: README, “It loads six realistic entries in an isolated `demo:calorie-week-view` database.”
- Why: the namespace is useful for verification, not for a person deciding how to try the product.
- Fix: use the F-1-17 sentence in the Try the demo section, then move “Demo storage uses IndexedDB namespace `demo:calorie-week-view`” to Run and test.

## What would make this perfect

Resolve F-1-1 through F-1-20, then rerun the complete review rather than only
the changed areas. Perfect means the first action describes the six-of-seven
sample honestly, every public behavior is represented by one exact claim test,
every route publishes its own complete social metadata, and every heading or
sentence is literal, consistent, and useful. No additional AI, sync, or paid
feature is needed for the researched job.
