# Adversarial first-read review 3

## Verdict: FAIL

The cold read, demo, all 23 declared claims, privacy isolation, offline use,
functional suite, routes, metadata, links, accessibility checks, and visual
identity pass. The zero-findings threshold is not met. One earlier plain-words
finding is only partly fixed and is therefore reopened as blocking; one new
landing-page heading defect remains.

- Reviewed live URL: <https://calorie-week-view.sociobot.in>
- Reviewed repository commit: `989c5c41cc8527ad1e9800c0ef36c087028a030c`
- Review date: 2026-08-29 UTC
- Product code changed by reviewer: no

## 1. Cold first read

Fresh browser contexts opened `/` at 390 x 844 and 1440 x 900. Nothing was
scrolled before these answers were recorded.

| Question | First-read answer in the reviewer's words | Exact visible copy | Result |
| --- | --- | --- | --- |
| What does this do? | It reviews calorie totals across a seven-day week. | “Review your calories by week” | PASS |
| For whom? | Food loggers who want a weekly comparison without scores or suggested targets. | “For food loggers who want to compare seven days without daily scores or suggested targets.” | PASS |
| What should I click first? | Open the populated sample week. | “Try it with sample data” and “See six sample days and one missing day before adding your own entries.” | PASS |

All three answers and the primary action were above the fold at both sizes. The
successful cold loads had no horizontal overflow, console error, or page error.

## 2. Copy audit

Counts treat hyphenated terms, paths, URLs, and code identifiers as one word.
The tables include headings, controls, navigation, labels, and fragments in
addition to every sentence. Day names and numeric chart values are data, not
copy, and are not repeated below. No unit exceeds 22 words, and no supplied
banned marketing word appears.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Calorie Week View | 3 | — |
| Review | 1 | — |
| Demo | 1 | — |
| Privacy | 1 | — |
| Weekly calorie review | 3 | — |
| Review your calories by week | 5 | — |
| For food loggers who want to compare seven days without daily scores or suggested targets. | 15 | — |
| Try it with sample data | 6 | — |
| See six sample days and one missing day before adding your own entries. | 13 | — |
| Start with a blank week | 6 | — |
| Your log stays in this browser. | 6 | — |
| Works offline after the first visit. | 6 | — |
| Free. | 1 | — |
| No account or ads. | 4 | — |
| Compare all seven days without a daily score. | 8 | — |
| Example calorie chart | 3 | — |
| Example seven-day calorie review | 4 | — |
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
| Export or print the week | 5 | — |
| Export CSV or JSON. | 4 | — |
| Print one week for your own records. | 7 | — |
| What this tool does not do | 6 | —; useful label, but it is a paragraph rather than the section heading |
| You choose the range | 4 | F-3-2: the h2 does not name all of the section's contents |
| This tool does not set calorie targets, diagnose health, or judge a day. | 13 | — |
| It does not include food search or coaching. | 8 | — |
| Delete or export your whole log from the review screen. | 10 | — |
| See your calorie week without a daily score. | 8 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| external site | 2 | — |
| Version 1.0.4 | 2 | — |
| Original generated map art | 4 | — |

The landing actions use verbs and name their outcomes. Terminology is stable:
the isolated sample is always the **demo**, a saved day is an **entry**, the
seven-day result is a **review**, and the user-set bounds are a **range**.

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
| Public product claims and their sandbox tests live in `.factory/claims.json`. | 12 | —; developer documentation |
| CSV format | 2 | — |
| Dates use `YYYY-MM-DD`. | 3 | — |
| Only `date` and `calories` are required. | 6 | — |
| Weight uses the unit selected in settings. | 7 | — |
| Changing units converts existing values for display while preserving their stored meaning. | 12 | — |
| Run and test | 3 | — |
| Requires Node.js 20 or newer. | 6 | —; developer requirement |
| `npm test` runs unit tests, builds the production bundle, and runs Playwright in Chromium. | 14 | —; developer instruction |
| The claim tests use only `/demo` and bundled sample data. | 10 | —; developer test description |
| Demo storage uses IndexedDB namespace `demo:calorie-week-view`; real storage uses `calorie-week-view`. | 10 | —; exact developer verification detail |
| The exact deploy command is `npm run build`. | 8 | —; developer instruction |
| Static output lands in `dist/`, with `dist/index.html` at its root. | 12 | —; developer instruction |
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
| Source code is MIT licensed. | 5 | —; license notice |
| Atkinson Hyperlegible is distributed under the SIL Open Font License; its license ships beside the font files. | 17 | —; license notice |
| The map art was generated for this product. | 8 | — |
| Its source, prompt, review, and published-file hashes are recorded in `assets/src/`. | 12 | — |

The README's product claims map to the manifest. Its implementation terms occur
only in the developer run/test section where their exact names are needed.

## 3. Demo and sandbox behavior

PASS.

One click on **Try it with sample data** opened `/demo`. Its first screen
already showed six populated days, one missing Saturday, a 2,062 kcal average,
macro averages, weight values, and notes. The persistent banner said “Demo —
sample data, nothing is saved to your log.” and exposed **Reset demo** and
**Start for real**. Direct `/?demo=1` produced the same populated view.

A fresh live context first saved a 1,999-calorie real record with note “REAL
DATA MARKER.” Editing the demo's Monday to 999 changed only
`demo:calorie-week-view`. **Reset demo** restored Monday to 1,980 and the six
original entries. **Start for real** deleted the demo database and returned to
the unchanged 1,999-calorie real record. Every request during the flow used
`https://calorie-week-view.sociobot.in`.

This is a web PWA, so CLI temp-directory and library-playground checks do not
apply.

## 4. Claims

PASS. The repository was cloned at the reviewed commit into
`/tmp/calorie-review-3-clone.8YWotx`. After `npm ci`, every command below was
run separately and selected its exact tagged browser test.

| Claim ID | Result | Observed evidence |
| --- | --- | --- |
| `offline-reload` | PASS | Demo reloaded offline with banner, six days, and 2,062 kcal |
| `csv-export` | PASS | Download contained the declared header and six sample rows |
| `csv-import` | PASS | Valid row imported; missing columns and invalid dates were rejected |
| `json-export` | PASS | Download parsed with sample entries and settings |
| `print-week` | PASS | Print action invoked the browser print function |
| `local-private` | PASS | Save traffic stayed same-origin and used only demo storage |
| `no-ads-tracking-third-party` | PASS | No third-party request, script, frame, image, ad, or analytics resource |
| `free-no-account` | PASS | No password, purchase, subscription, or payment gate |
| `manual-entry` | PASS | Keyboard flow saved calories, macros, weight, and note at 390 px |
| `settings-choice` | PASS | Range, unit, and theme persisted; stored weight meaning remained intact |
| `user-chosen-range` | PASS | Review used the entered range and suggested no target |
| `no-daily-score` | PASS | Daily rows had no score, grade, or judgment value/control |
| `no-food-search-or-coaching` | PASS | No search or coaching flow appeared on public/review routes |
| `no-medical-advice` | PASS | Terms boundary appeared and no advice control existed |
| `json-import` | PASS | Backup restored an entry and settings |
| `json-import-validation` | PASS | Invalid backups produced recovery errors without changing the sample |
| `delete-log` | PASS | Clear action reduced the demo log to zero entries |
| `logged-day-average` | PASS | Six logged days averaged to 2,062; Saturday stayed blank |
| `demo-sample` | PASS | One click and direct query entry both opened the full sample |
| `demo-reset` | PASS | Edited entries and settings returned to the original sample |
| `demo-exit-isolation` | PASS | Demo storage was removed and seeded real data was unchanged |
| `weekly-display` | PASS | Seven chart days, macro summaries, and weight trend appeared |
| `art-provenance` | PASS | Recorded source/prompt/review hashes matched published art and rendered hero |

The live landing page and README were then cross-checked sentence by sentence.
All visitor-facing behavioral claims have a corresponding manifest entry. The
build instructions and license notices are developer/legal facts rather than
runtime product promises. No unlisted product claim was found.

## 5. Offline and privacy

PASS.

- A fresh live `/demo` was brought under service-worker control, Chromium was
  set fully offline, and reload retained the banner, six logged days, and
  2,062 kcal.
- The end-to-end demo mutation/reset/exit request log contained only the live
  product origin.
- IndexedDB snapshots showed that demo changes never altered the seeded
  `calorie-week-view` database.
- No analytics, tracking, ad, remote font, or third-party script request was
  observed.

## 6. Earlier findings

Every earlier review, both polish reports, and the complete accumulated handoff
were read. Each finding below was checked against current source and live
behavior rather than accepted from its status label.

| Earlier ID | Review-3 result | Fresh evidence |
| --- | --- | --- |
| V-01 | Fixed | Live service-worker-controlled demo reloaded fully offline. |
| V-02 | Fixed | Mobile chart regions remain named/focusable; live axe found no serious/critical issue. |
| V-03 | Fixed | `.file-button:focus-within` retains the designed 3 px outline; keyboard regression passed. |
| V-04 | Fixed | Manifest has 23 unique exact selectors; every exact command passed. |
| V-05 | Fixed | Invalid optional CSV cells remain an atomic rejection in the full suite. |
| V-06 | Fixed | Live 390 px sweep found no visible control below 44 x 44 px. |
| V-07 | Fixed | Unknown live URL returned HTTP 404 with the designed shared shell. |
| V2-01 | Fixed | Invalid JSON claim and full validation regressions passed without writes. |
| V3-01 | Fixed | Range, score, food-search/coaching, and medical boundaries remain listed and tested. |
| V3-02 | Fixed | Each of 23 manifest commands selected exactly one tagged test. |
| V4-01 | Fixed | Cancel and close remain non-submit controls and dialog focus regression passed. |
| V4-02 | Fixed | Live Start for real deleted demo storage and preserved a seeded real record. |
| V4-03 | Fixed | Live and regression target measurements meet 44 x 44 px. |
| V4-04 | Fixed | Shared numeric bounds and no-partial-write CSV regression passed. |
| V4-05 | Fixed | Weight conversion regression preserved the stored unit and meaning. |
| V5-01 | Fixed | Full suite confirms logical successor focus after week, entry, and settings changes. |
| V5-02 | Fixed | Live 404 has literal “Page not found,” header, navigation, main, footer, and recovery link. |
| F-1-1 | Fixed | First-screen help names six sample days and one missing day. |
| F-1-2 | Fixed | Declared reset restored the original live sample. |
| F-1-3 | Fixed | Declared exit deleted demo data and retained the real sentinel. |
| F-1-4 | Fixed | Declared weekly display showed chart, averages, macros, and weight. |
| F-1-5 | Fixed | CSV schema is declared; valid and rejection cases passed. |
| F-1-6 | Fixed | The landing lede makes no streak claim. |
| F-1-7 | Fixed | Live export help says “comma-separated text”; claim passed. |
| F-1-8 | Fixed | Every route exposes its own title, description, canonical, OG/Twitter fields, and icons. |
| F-1-9 | **Not fully fixed; BLOCKING** | Landing wording changed, but live `/terms` and `src/main.ts` still use “Use it as a reflection tool” as the h1. See F-3-1/F-1-9 below. |
| F-1-10 | Fixed | Hero caption literally says “Compare all seven days without a daily score.” |
| F-1-11 | Fixed | Preview label says “Example calorie chart.” |
| F-1-12 | Fixed | Preview heading says “Example seven-day calorie review.” |
| F-1-13 | Fixed | Third step says “Export or print the week.” |
| F-1-14 | Fixed for its original wording | “A quiet boundary” is gone. The separate semantic-heading defect is F-3-2. |
| F-1-15 | Fixed | README removed “calm.” |
| F-1-16 | Fixed | README and interface consistently use “demo.” |
| F-1-17 | Fixed | README gives concrete sample contents, not “realistic.” |
| F-1-18 | Fixed | Reader-facing summary says “this browser”; IndexedDB appears in developer details. |
| F-1-19 | Fixed | Offline copy states the result without service-worker jargon. |
| F-1-20 | Fixed | Database namespace appears only in developer/demo documentation. |
| F-2-1 | Fixed | `art-provenance` and its SHA-256/browser test passed. |

## 7. Structure, accessibility, and identity

The required `/`, `/app`, `/demo`, `/privacy`, and `/terms` routes returned
200; an unknown URL returned the designed 404. Every route has one h1, one
main, `lang="en"`, a route-specific title no longer than 60 characters, a meta
description, canonical URL, Open Graph/Twitter metadata, SVG favicon, Apple
touch icon, skip link, and the shared header/footer. `robots.txt` and
`sitemap.xml` expose the expected routes. Every crawled internal link and the
external Param Factory link returned 200; the privacy email is an explicit
`mailto:` link.

Client link navigation, Back, and Forward moved focus to the new h1 after the
route render and restored the prior scroll position. Security headers include
the self-only CSP, response-header `frame-ancestors`, `nosniff`, referrer
policy, and disabled camera/microphone/geolocation.

Live axe scans at 390 px found zero serious or critical violations on all five
routes and the 404. The full suite also passed desktop, dark-theme, keyboard,
dialog, and target-size checks. `verify-url.sh` passed with zero home-page
console/page errors. No route overflowed horizontally. Reduced-motion rules
and visible 3 px focus styles are present.

The live JS and CSS SHA-256 values match the clean build. Initial JS is 36.90
kB raw / 12.46 kB gzip and CSS is 19.42 kB raw / 5.10 kB gzip. The full clean
suite passed 15 unit/contract tests and 34 Chromium tests; a separate build
produced `dist/index.html`.

The field-paper palette, self-hosted Atkinson type, original contour art,
survey marks, map-sheet panels, and chart hatching match `.factory/design.md`.
The site is recognizably specific to this weekly calorie review and is not a
generic SaaS template.

The structure does not pass overall because of the two heading findings below.

## 8. Missed leverage

No missing feature is implied by the brief. Manual entry, CSV import,
calorie/macro review, optional weight trend, missing-day handling, print, CSV
export, and JSON backup are present. Sync would contradict the current
local-only promise unless accounts and conflict handling were added. The core
job is deterministic arithmetic and review; an AI action would add network,
key, cost, and privacy complexity without improving that job. Its absence is
appropriate.

## Findings

### Blocking

#### F-3-1 / F-1-9 reopened — the rejected “reflection tool” wording remains as the Terms h1

- Exact location/quote: live `/terms` h1 and `src/main.ts`, “Use it as a
  reflection tool.”
- Why this fails: F-1-9 previously rejected “A weekly reflection tool” as a
  vague category label. The repair removed it only from the landing eyebrow;
  the same non-specific phrase remains in the most prominent heading on the
  Terms route. Read alone in a screen-reader heading list, it neither names the
  page as Terms nor explains a concrete job. The history rule makes a
  half-fixed earlier finding blocking and requires the same earlier ID to be
  reopened.
- Concrete fix: change the h1 to **“Terms for Calorie Week View”**. Keep the
  existing plain sentence “Use Calorie Week View for personal record keeping”
  below it. Add a route-copy regression asserting that every h1 names its page
  or product job and that “reflection tool” is absent from rendered copy.

### Minor

#### F-3-2 — the landing limits section has the wrong semantic heading

- Exact location/quote: landing page h2, “You choose the range.” The text below
  also covers no diagnosis, no daily judgment, no food search, no coaching,
  deletion, and export. “What this tool does not do” is only a styled paragraph.
- Why this fails: a visitor or screen-reader user scanning headings hears a
  range section, not the product-boundary section actually present. The
  supplied plain-words and site-structure rules require the heading itself to
  name the section.
- Concrete fix: make the h2 **“What Calorie Week View does not do”** and move
  **“You choose the range.”** into the following paragraph. Add an outline test
  that checks the exact landing h2 list.

## What would make this perfect

Replace the Terms h1 and the landing limits h2 as specified, add the two narrow
heading-copy regressions, deploy, and rerun the full cold-read review. No new
feature, AI integration, sync service, or visual redesign is needed. Perfect
means both findings are gone and the final heading list is literal in every
route and section.
