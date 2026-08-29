# Adversarial first-read review 2

## Verdict: FAIL

The product clears the cold-read, demo, declared-claim, isolation, privacy, offline, routing, accessibility, and visual-identity checks. One unlisted public claim remains in the README, so the required zero-findings threshold is not met.

- Reviewed live URL: <https://calorie-week-view.sociobot.in>
- Reviewed commit: `bbbf51e95c7469f59094eec633efb188e0bc4839`
- Review date: 2026-08-29 UTC
- Product code changed by reviewer: no

## 1. Cold first read

Fresh browser contexts opened the landing page before scrolling at 390 x 844 and 1440 x 900. The visible first screen gives all three required answers.

| Question | First-read answer | Exact copy | Result |
| --- | --- | --- | --- |
| What does it do? | It reviews calorie totals across a seven-day week. | “Review your calories by week” | PASS |
| For whom? | Food loggers who do not want day-by-day scoring or suggested targets. | “For food loggers who want to compare seven days without daily scores or suggested targets.” | PASS |
| What should I click first? | Open the populated sample week. | “Try it with sample data” and “See six sample days and one missing day before adding your own entries.” | PASS |

At 390 px the primary action measured 350 x 51.5 px and was visible without scrolling. The page had no horizontal overflow, console error, or page error on successful cold loads.

## 2. Copy audit

Counts treat a hyphenated word as one word. The audit includes visible labels, headings, links, and buttons as well as prose. No unit exceeds 22 words. No banned marketing word, jargon problem, inconsistent product term, vague heading, metaphor heading, or non-result-naming button was found.

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
| What this tool does not do | 6 | — |
| You choose the range | 4 | — |
| This tool does not set calorie targets, diagnose health, or judge a day. | 13 | — |
| It does not include food search or coaching. | 8 | — |
| Delete or export your whole log from the review screen. | 10 | — |
| See your calorie week without a daily score. | 9 | — |
| Terms | 1 | — |
| Built by Param Factory | 4 | — |
| Version 1.0.3 | 2 | — |
| Original generated map art | 4 | — |

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
| Open `/demo` or `https://calorie-week-view.sociobot.in/demo`. | 8 | — |
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
| Demo storage uses IndexedDB namespace `demo:calorie-week-view`; real storage uses `calorie-week-view`. | 8 | — |
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
| Generated map art is original to this product, with its prompt and review in `assets/src/`. | 16 | F-2-1 |

## 3. Demo and sandbox

PASS.

One landing-page click on **Try it with sample data** opened `/demo`. Its first screen already rendered the weekly review: six logged days, one missing day, a 2,062 kcal logged-day average, 119 g protein, 228 g carbs, 70 g fat, three weight values, and notes. The persistent banner read “Demo — sample data, nothing is saved to your log.” and exposed **Reset demo** and **Start for real**.

In a fresh browser context, a real `/app` entry with the note “Real storage sentinel” was saved, `/demo` showed the six-day sample, and **Start for real** returned to `/app` with the sentinel intact. The demo database was gone; only `calorie-week-view` remained. A direct `?demo=1` visit also opened the banner and sample. After service-worker control, a fully offline reload retained the sample. All observed demo-flow requests were same-origin.

This is a PWA, not a CLI or library; temp-directory CLI and playground checks do not apply.

## 4. Declared claims

PASS. In a clean clone after `npm ci`, each of the 22 exact commands from `.factory/claims.json` was run separately in manifest order. Every command passed and selected its tagged browser test. A subsequent `npm test` passed 15 unit/contract tests and 33 Chromium tests; `npm run build` passed and produced `dist/`.

| Claim ID | Result |
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

The landing and README claims map to these entries except F-2-1 below.

## 5. Earlier findings

Every earlier review and polish record was read. The prior finding IDs were rechecked live and in the current source rather than accepted from their status labels.

| Earlier findings | Current result and evidence |
| --- | --- |
| V-01 through V-07; V2-01; V3-01 through V3-02; V4-01 through V4-05; V5-01 through V5-02 | Fixed. The fresh offline claim passed; mobile chart regions and file labels are keyboard-focusable; current controls meet the tested mobile target contract; CSV/JSON validation is atomic; real 404 is HTTP 404 with the shared shell; scope claims and selector isolation pass; dialog cancellation and successor focus work; demo exit preserves a seeded real record; unit conversion preserves stored meaning. |
| F-1-1 through F-1-7 | Fixed. The landing names six samples and one missing day, and the reset, exit, display, CSV-schema, no-score/target, and CSV-text statements now have claim entries and passing exact tests. |
| F-1-8 | Fixed. `/app`, `/demo`, `/privacy`, `/terms`, and 404 have their own observed title, description, canonical URL, Open Graph URL/title/description, Twitter title, favicon, and Apple touch icon. |
| F-1-9 through F-1-20 | Fixed. The live landing/README now use “Weekly calorie review,” literal chart/export/limits headings, “demo” consistently, concrete sample copy, browser-facing storage/offline wording, and move the IndexedDB namespace to developer instructions. |

No earlier finding is reopened under its former ID.

## 6. Structure, accessibility, and identity

PASS.

`/`, `/app`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned a designed 404 response. All crawled internal links returned 200; the external Param Factory link returned 200 and the privacy address is an explicit `mailto:` link. Browser Back restored the app route and focused its h1. Every tested route had one h1 and main, `lang=\"en\"`, a route-specific title, meta description, canonical URL, Open Graph/Twitter metadata, favicon, consistent header/footer, and a skip link. The sitemap and robots file list the public routes. The unknown-route response and live routes send the expected self-only CSP, `frame-ancestors` response directive, `nosniff`, referrer policy, and permissions policy.

At 390 px, axe found zero serious or critical violations on home, app, demo, privacy, terms, and 404. There was no horizontal overflow. The self-hosted Atkinson font, field-paper palette, contour art, survey-stamp controls, and topographic charts are visibly specific to the weekly-review product and match `.factory/design.md`; this is not a generic SaaS template.

## 7. Missed leverage

No missing feature was found. The brief calls for manual and CSV entry, seven-day calorie/macro bands, optional weight trend, missing-day handling, print/export, and offline use; all are present. JSON backup import/export is a useful extra. Account sync conflicts with the stated local-only privacy model. AI would not improve this deterministic weekly review and would add a key/network dependency, so its absence is appropriate.

## Findings

### Minor

#### F-2-1 — README makes an unlisted provenance claim

- Location/quote: README, License section: “Generated map art is original to this product, with its prompt and review in `assets/src/`.”
- Why: this is an externally verifiable promise about the product asset, but it has no entry or exact test in `.factory/claims.json`. The claims contract requires a listed test for every public claim a reader could rely on. The design document can retain provenance without putting an untested promise in visitor-facing README copy.
- Concrete fix: remove this sentence from README and retain the provenance in `.factory/design.md`; or add an `art-provenance` claim with a clean-clone test that asserts the referenced source, prompt, and review assets exist and are the source for the published art.

## What would make this perfect

Remove or test the single README provenance promise in F-2-1, then rerun this entire review. A perfect result has no unlisted public statement, no untested claim, and no remaining finding; no AI, sync, or additional tracking feature is needed for this product.
