# Calorie Week View

Review seven days of calories, macros, and weight without a daily score.

Calorie Week View is for people who already log food. It turns manual totals or
CSV rows into a calm weekly review. You choose the calorie range. Missing days
stay blank and do not lower the logged-day average.

The app is free, needs no account, and stores its data in IndexedDB on the
current device. It sends no log data to another service. After the first visit,
the installed service worker can reload the app offline.

## Try the sandbox

Open `/demo` or
<https://calorie-week-view.sociobot.in/demo>. It loads six realistic entries in
an isolated `demo:calorie-week-view` database. The banner can reset the sample
or leave it without copying anything into the real log.

## Features

- Add calories, optional macros, optional weight, and a note for each date.
- Import CSV files with required `date` and `calories` columns.
- Read a seven-day calorie chart, logged-day average, macros, and weight trend.
- Export all entries to CSV or export entries and settings to JSON.
- Print the selected week.
- Choose a light, dark, or device theme.
- Delete the whole local log from the review screen.

Public product claims and their sandbox tests live in
[`.factory/claims.json`](.factory/claims.json).

## CSV format

Dates use `YYYY-MM-DD`. Only `date` and `calories` are required.

```csv
date,calories,protein_g,carbs_g,fat_g,weight,note
2026-08-24,1980,112,221,68,72.8,Lunch out
```

Weight uses the unit selected in settings.

## Run and test

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
npm test
npm run build
```

`npm test` runs unit tests, builds the production bundle, and runs Playwright in
Chromium. The claim tests use only `/demo` and bundled sample data.

The exact deploy command is `npm run build`. Static output lands in `dist/`,
with `dist/index.html` at its root.

## Routes

- `/` — product overview and live preview
- `/app` — real local log
- `/demo` — isolated sample log
- `/privacy` — storage and privacy details
- `/terms` — terms and health boundary

## Privacy and scope

There is no account, analytics, ad script, food database, coaching, diagnosis,
or automatic target. The app makes no health recommendation. Export a backup
before clearing browser storage or moving devices.

See [`.factory/design.md`](.factory/design.md) for the topographic visual system,
[`.factory/demo.md`](.factory/demo.md) for sandbox details, and
[`.factory/handoff.md`](.factory/handoff.md) for verification notes.

## License

Source code is MIT licensed. Atkinson Hyperlegible is distributed under the
SIL Open Font License; its license ships beside the font files. Generated map
art is original to this product, with its prompt and review in `assets/src/`.
