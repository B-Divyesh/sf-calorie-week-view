# Adversarial first-read review 4

## Verdict: PASS

No finding remains. The cold read, one-click demo, sandbox isolation, all 24
declared claims, offline reload, privacy request log, prior-finding regression
checks, routes, metadata, links, accessibility, and product-specific visual
identity pass on the live deployment and current source.

- Reviewed URL: <https://calorie-week-view.sociobot.in>
- Reviewed repository commit: `a9763afd54070e31e05e950ec71db0c5af07eb30`
- Review date: August 29, 2026 UTC
- Product code changed by reviewer: no

## 1. Cold first read

Fresh browser contexts opened `/` at 390 × 844 and 1440 × 900. Nothing was
scrolled before recording these answers.

| Question | First-read answer in the reviewer's words | Exact visible copy | Result |
| --- | --- | --- | --- |
| What does this do? | It compares calorie totals across one week. | “Review your calories by week” | PASS |
| For whom? | Food loggers who want a seven-day comparison without scores or suggested targets. | “For food loggers who want to compare seven days without daily scores or suggested targets.” | PASS |
| What should I click first? | Open the populated sample week. | “Try it with sample data” and “See six sample days and one missing day before adding your own entries.” | PASS |

The headline, audience sentence, primary action, action explanation, blank-week
alternative, and three product facts were above the fold at both sizes. The
mobile action measured 350 px wide. Neither viewport overflowed horizontally.
The successful cold loads produced no console or page error.

## 2. Copy audit

Counts treat a hyphenated term, path, URL, or code identifier as one word. The
tables include headings, controls, labels, captions, and fragments so that
button and out-of-context heading checks are explicit. Data values and code
examples are not prose. No unit exceeds 22 words, no banned marketing word is
present, and no rewrite is required.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Calorie Week View | 3 | — |
| Calorie Week View home | 4 | — |
| Review | 1 | — |
| Demo | 1 | — |
| Privacy | 1 | — |
| Weekly calorie review | 3 | — |
| Review your calories by week | 5 | — |
| For food loggers who want to compare seven days without daily scores or suggested targets. | 15 | — |
| Try it with sample data | 6 | — |
| See six sample days and one missing day before adding your own entries. | 13 | — |
| Start with a blank week | 6 | — |
| Product facts | 2 | — |
| Your log stays in this browser. | 6 | — |
| Works offline after the first visit. | 6 | — |
| Free. | 1 | — |
| No account or ads. | 4 | — |
| Layered paper contour lines show a seven-ridge weekly landscape. | 9 | — |
| Compare all seven days without a daily score. | 8 | — |
| Example calorie chart | 3 | — |
| Example seven-day calorie review | 4 | — |
| Missing days stay blank. | 4 | — |
| Averages use only the days you logged. | 7 | — |
| Example week: six days logged, 2,062 calorie average, inside range | 10 | — |
| Logged-day average | 2 | — |
| Inside range | 2 | — |
| How it works | 3 | — |
| Turn entries into one review | 5 | — |
| Add daily totals | 3 | — |
| Type calories and optional macros or weight. | 7 | — |
| You can also import CSV. | 5 | — |
| Read the week | 3 | — |
| Compare your logged-day average with the range you chose. | 9 | — |
| Export or print the week | 5 | — |
| Export CSV or JSON. | 4 | — |
| Print one week for your own records. | 7 | — |
| What Calorie Week View does not do | 7 | — |
| You choose the range. | 4 | — |
| This tool does not set calorie targets, diagnose health, or judge a day. | 13 | — |
| It does not include food search or coaching. | 8 | — |
| Delete or export your whole log from the review screen. | 10 | — |
| See your calorie week without a daily score. | 8 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| external site | 2 | — |
| Version 1.0.6 | 2 | — |
| Original generated map art | 4 | — |

The action controls name their results: **Try it with sample data**, **Add daily
totals**, **Export CSV**, **Export JSON**, and **Print this week**. Navigation
labels are nouns because they name destinations. Terminology remains stable:
**daily entry**, **week**, **logged-day average**, **range**, **missing day**,
**demo**, and **log** each refer to one concept.

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calorie Week View | 3 | — |
| Review seven days of calories, macros, and weight without a daily score. | 12 | — |
| Calorie Week View is for people who already log food. | 10 | — |
| It turns manual totals or CSV rows into a weekly review. | 11 | — |
| You choose the calorie range. | 5 | — |
| Missing days stay blank and do not lower the logged-day average. | 11 | — |
| The app is free, needs no account, and stores its data in this browser. | 14 | — |
| It sends no log data to another service. | 8 | — |
| After the first visit, the app can reload offline. | 9 | — |
| Try the demo | 3 | — |
| Open `/?demo=1` or `https://calorie-week-view.sociobot.in/?demo=1`. | 4 | — |
| The `/demo` route works too. | 5 | — |
| It loads six sample entries with calories, macros, weights, and notes. | 11 | — |
| Reset demo restores the sample. | 5 | — |
| Choosing Start for real discards demo data without copying it to your log. | 13 | — |
| Features | 1 | — |
| Add calories, optional macros, optional weight, and a note for each date. | 12 | — |
| Import CSV files with required `date` and `calories` columns in `YYYY-MM-DD` format. | 12 | — |
| Read a seven-day calorie chart, logged-day average, macros, and weight trend. | 11 | — |
| Export all entries to CSV or export entries and settings to JSON. | 12 | — |
| Invalid JSON backups are rejected before they change your log. | 10 | — |
| Print the selected week. | 4 | — |
| Choose a light, dark, or device theme. | 7 | — |
| Delete the whole local log from the review screen. | 9 | — |
| Public product claims and their sandbox tests live in `.factory/claims.json`. | 12 | — |
| CSV format | 2 | — |
| Dates use `YYYY-MM-DD`. | 3 | — |
| Only `date` and `calories` are required. | 6 | — |
| Weight uses the unit selected in settings. | 7 | — |
| Changing units converts existing values for display while preserving their stored meaning. | 12 | — |
| Run and test | 3 | — |
| Requires Node.js 20 or newer. | 6 | — |
| `npm test` runs unit tests, builds the production bundle, and runs Playwright in Chromium. | 14 | — |
| The claim tests use only `/demo` and bundled sample data. | 10 | — |
| Demo storage uses IndexedDB namespace `demo:calorie-week-view`; real storage uses `calorie-week-view`. | 10 | —; exact developer verification detail |
| The exact deploy command is `npm run build`. | 8 | — |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 12 | — |
| Routes | 1 | — |
| `/` — product overview and live preview | 6 | — |
| `/app` — real local log | 4 | — |
| `/?demo=1` or `/demo` — isolated sample log | 6 | — |
| `/privacy` — storage and privacy details | 5 | — |
| `/terms` — terms and health boundary | 5 | — |
| Privacy and scope | 3 | — |
| There is no account, analytics, ad script, food search, coaching, diagnosis, or automatic target. | 14 | — |
| The app makes no health recommendation. | 6 | — |
| Export a backup before clearing browser storage or moving devices. | 10 | — |
| See `.factory/design.md` for the topographic visual system, `.factory/demo.md` for sandbox details, and `.factory/handoff.md` for verification notes. | 16 | — |
| License | 1 | — |
| Source code is MIT licensed. | 5 | — |
| Atkinson Hyperlegible is distributed under the SIL Open Font License; its license ships beside the font files. | 17 | — |
| The map art was generated for this product. | 8 | — |
| Its source, prompt, review, and published-file hashes are recorded in `assets/src/`. | 12 | — |

Developer terms such as IndexedDB occur only where an exact storage namespace
is needed to reproduce the isolation check. The public product copy uses
“browser,” “demo,” and “log.”

## 3. Demo

PASS.

One click on **Try it with sample data** opened `/demo`. The first rendered
screen already showed six logged days, one missing Saturday, the 2,062 kcal
logged-day average, macro averages, four displayed weight values, and notes.
The banner read “Demo — sample data, nothing is saved to your log.” and exposed
**Reset demo** and **Start for real**.

Changing the range and selecting **Reset demo** restored the original
1,800–2,200 range and six entries. The isolated-exit test seeded a real record,
changed the demo, selected **Start for real**, and confirmed that the demo
database was discarded while the real record stayed unchanged. Direct
`/?demo=1` entry produced the same populated demo. This is a PWA, so CLI
temp-directory and library-playground checks do not apply.

## 4. Claims

PASS. A clean local clone at the reviewed commit was created at
`/tmp/calorie-review4.twa9Yy/clone`, followed by `npm ci`. Every literal command
in `.factory/claims.json` was then run separately in manifest order. Each
selected exactly one tagged browser test.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | PASS | The populated demo reloaded after Chromium went offline. |
| `csv-export` | PASS | The download contained the declared header and six sample rows. |
| `csv-import` | PASS | A valid row rendered; missing columns and invalid dates were rejected. |
| `json-export` | PASS | The downloaded backup parsed with entries and settings. |
| `print-week` | PASS | The action invoked the browser print function. |
| `local-private` | PASS | Traffic stayed same-origin and writes used only demo storage. |
| `no-ads-tracking-third-party` | PASS | No third-party request, script, frame, image, ad, or analytics resource loaded. |
| `free-no-account` | PASS | No password, purchase, subscription, or payment gate appeared. |
| `manual-entry` | PASS | A 390 px keyboard flow saved calories, macros, weight, and a note. |
| `settings-choice` | PASS | Range, unit, and theme persisted; recorded weight meaning remained intact. |
| `user-chosen-range` | PASS | The review used the entered bounds and suggested no target. |
| `no-daily-score` | PASS | Daily rows exposed no score, grade, or judgment value/control. |
| `no-food-search-or-coaching` | PASS | No food-search or coaching flow appeared. |
| `no-medical-advice` | PASS | The health boundary appeared and no advice control existed. |
| `json-import` | PASS | The backup restored an entry and settings. |
| `json-import-validation` | PASS | Invalid backups produced recovery errors without changing the sample. |
| `delete-log` | PASS | Clear reduced the isolated log to zero entries. |
| `logged-day-average` | PASS | Six logged days averaged to 2,062; Saturday remained blank. |
| `demo-sample` | PASS | One click and direct query entry opened the detailed sample. |
| `demo-reset` | PASS | Edited entries and settings returned to their original values. |
| `demo-exit-isolation` | PASS | Demo storage disappeared and the seeded real record was unchanged. |
| `weekly-display` | PASS | Seven chart days, calorie/macro summaries, and the weight trend rendered. |
| `source-font-licensing` | PASS | MIT and SIL license files and public statements matched. |
| `art-provenance` | PASS | Source, prompt, review, hashes, derivatives, and rendered hero matched. |

The same clean clone passed `npm test` with 15 unit/contract tests and 40
Chromium tests. A separate `npm run build` produced `dist/`; initial JavaScript
was 37.28 kB raw and 12.55 kB gzip. All 40 browser tests also passed against
the live URL. The landing page and README were cross-checked after the tests;
every behavioral or provenance claim maps to one manifest entry. No claim is
untested or unlisted.

## 5. Sandbox, offline, and privacy behavior

PASS.

- The live demo context contained only `demo:calorie-week-view` before exit.
- Demo mutations, reset, and exit did not read or change the real database.
- Eleven observed demo-flow requests all used
  `https://calorie-week-view.sociobot.in`; no provider, analytics, font CDN, or
  other third-party origin appeared.
- With the browser fully offline, `/demo` reloaded with the banner, six logged
  days, the 2,062 kcal average, and the original 1,800–2,200 range.
- **Start for real** discarded demo storage and retained the seeded real record.

## 6. Earlier findings

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the accumulated
handoff was read. Each prior ID was rechecked in both current code and the live
site rather than accepted from its recorded status.

| Earlier ID | Review-4 result | Fresh confirmation |
| --- | --- | --- |
| V-01 | Fixed | The versioned service worker reloaded the populated live demo offline. |
| V-02 | Fixed | Calorie and weight charts remain named, keyboard-focusable regions with text alternatives. |
| V-03 | Fixed | File controls retain the designed 3 px `:focus-within` outline. |
| V-04 | Fixed | All 24 manifest IDs are unique and each exact selector runs one tagged test. |
| V-05 | Fixed | Invalid optional CSV values are rejected atomically. |
| V-06 | Fixed | The 390 px regression found no visible target below 44 × 44 CSS px. |
| V-07 | Fixed | An unknown live URL returned HTTP 404 with the designed shell. |
| V2-01 | Fixed | Full JSON validation occurs before database writes; invalid backups preserve the log. |
| V3-01 | Fixed | Range, score, search/coaching, and medical boundaries remain declared and tested. |
| V3-02 | Fixed | Claim-selector isolation passed for all 24 entries. |
| V4-01 | Fixed | Cancel and close remain non-submit controls; drafts are discarded and focus returns. |
| V4-02 | Fixed | Demo exit deletes only demo storage and preserves a seeded real record. |
| V4-03 | Fixed | The live and local mobile target checks meet 44 × 44 CSS px. |
| V4-04 | Fixed | Manual and CSV inputs share numeric bounds; oversized CSV rows produce no partial write. |
| V4-05 | Fixed | Weight unit conversion changes display while retaining the recorded unit and meaning. |
| V5-01 | Fixed | Week, entry, and settings actions focus their logical successor. |
| V5-02 | Fixed | The 404 has “Page not found,” shared header/footer, one main, and a recovery link. |
| F-1-1 | Fixed | First-action help names six sample days and one missing day. |
| F-1-2 | Fixed | Reset is declared and restores sample entries and settings. |
| F-1-3 | Fixed | Demo exit is declared and preserves real data. |
| F-1-4 | Fixed | The weekly chart, calorie average, macros, and weight trend are declared and tested. |
| F-1-5 | Fixed | The CSV schema and `YYYY-MM-DD` requirement are declared and exercised. |
| F-1-6 | Fixed | The landing audience sentence makes no streak claim. |
| F-1-7 | Fixed | Export help says that CSV is comma-separated text, and the file content is tested. |
| F-1-8 | Fixed | Every route has its own title, description, canonical, Open Graph, Twitter, and icon metadata. |
| F-1-9 | Fixed | “Weekly calorie review” is literal; “reflection tool” is absent from all rendered routes and source copy. |
| F-1-10 | Fixed | The hero caption says “Compare all seven days without a daily score.” |
| F-1-11 | Fixed | The preview label says “Example calorie chart.” |
| F-1-12 | Fixed | The preview h2 says “Example seven-day calorie review.” |
| F-1-13 | Fixed | Step three says “Export or print the week.” |
| F-1-14 | Fixed | The limits h2 says “What Calorie Week View does not do.” |
| F-1-15 | Fixed | README uses the factual “weekly review,” with no “calm” adjective. |
| F-1-16 | Fixed | Interface and README consistently call the sample mode “demo.” |
| F-1-17 | Fixed | README names the six sample entries and fields without “realistic.” |
| F-1-18 | Fixed | Reader copy says “this browser”; IndexedDB appears only in developer details. |
| F-1-19 | Fixed | Offline copy states the result without service-worker jargon. |
| F-1-20 | Fixed | The demo namespace appears only in developer/demo verification details. |
| F-2-1 | Fixed | `art-provenance` binds the source, prompt, review, derivatives, hashes, and live hero. |
| F-3-1 / F-1-9 reopened | Fixed | Live `/terms` and source use the h1 “Terms for Calorie Week View.” |
| F-3-2 | Fixed | The landing h2 names the complete limits section; “You choose the range.” is body copy. |

No earlier finding is reopened.

## 7. Structure, accessibility, and visual identity

PASS.

`/`, `/app`, `/demo`, `/privacy`, and `/terms` returned 200. The unknown route
returned 404 with the shared shell and **Return home**. Every crawled internal
link returned 200, the Param Factory external link returned 200, and the only
non-HTTP link was the explicit privacy `mailto:` address.

Every route has `lang="en"`, one h1, one main, a meaningful heading outline,
route-specific title, description, canonical, Open Graph/Twitter metadata,
favicon, Apple touch icon, skip link, and consistent header/footer. The home
title follows “Product — what it does”; named subroutes use “Route — Product.”
`robots.txt` and `sitemap.xml` expose all public routes. The response CSP is
self-only and carries `frame-ancestors` as a header. `nosniff`, referrer, and
permissions headers are present.

Client navigation, Back, and Forward moved focus to the newly rendered h1.
The live 390 px route sweep had no horizontal overflow. Playwright axe found
zero serious or critical violations on all routes; the full suite also passed
dark-theme, keyboard, dialog, target-size, reduced-motion, and 200% text checks.
`verify-url.sh` reported the correct title, language, one h1/main, complete alt
text, labelled buttons, and no console/page errors.

The field-paper palette, original cut-paper contour art, self-hosted Atkinson
type, survey-stamp controls, offset map-sheet panels, hatching, and direct chart
labels match `.factory/design.md`. The result is recognizably a topographic
weekly review, not a generic SaaS template.

## 8. Missed leverage

No missing high-value feature is implied by the brief. Manual entry, CSV
import, seven-day calorie and macro review, optional weight trend, missing-day
handling, print, CSV export, JSON backup import/export, offline use, and full
local deletion are present. Account sync would contradict the current
local-only promise unless the product added identity, conflict handling, and a
new privacy model. The core job is deterministic calculation and review; an AI
step would add key, cost, network, and privacy requirements without improving
that job. No runtime provider key or decorative AI feature exists.

## Findings

None.

## What would make this perfect

Nothing remains to change for the reviewed brief and acceptance checklist.
Future scope should be driven by new user evidence, not added to this release:
the present product is clear, tryable, isolated, test-backed, accessible, and
honest.
