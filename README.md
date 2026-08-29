# Calorie Week View

Review seven days of calories, macros, and weight without a daily score.

Calorie Week View is for people who already log food. It turns manual totals or
CSV rows into a weekly review. You choose the calorie range. Missing days
stay blank and do not lower the logged-day average.

The app is free, needs no account, and stores its data in this browser. It sends
no log data to another service. After the first visit, the app can reload offline.

## Try the demo

Open `/demo` or
<https://calorie-week-view.sociobot.in/demo>. It loads six sample entries with
calories, macros, weights, and notes. **Reset demo** restores the sample.
Choosing **Start for real** discards demo data without copying it to your log.

## Features

- Add calories, optional macros, optional weight, and a note for each date.
- Import CSV files with required `date` and `calories` columns in `YYYY-MM-DD` format.
- Read a seven-day calorie chart, logged-day average, macros, and weight trend.
- Export all entries to CSV or export entries and settings to JSON. Invalid JSON backups are rejected before they change your log.
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

Weight uses the unit selected in settings. Changing units converts existing
values for display while preserving their stored meaning.

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
Demo storage uses IndexedDB namespace `demo:calorie-week-view`; real storage uses
`calorie-week-view`.

The exact deploy command is `npm run build`. Static output lands in `dist/`,
with `dist/index.html` at its root.

## Routes

- `/` — product overview and live preview
- `/app` — real local log
- `/demo` — isolated sample log
- `/privacy` — storage and privacy details
- `/terms` — terms and health boundary

## Privacy and scope

There is no account, analytics, ad script, food search, coaching, diagnosis,
or automatic target. The app makes no health recommendation. Export a backup
before clearing browser storage or moving devices.

See [`.factory/design.md`](.factory/design.md) for the topographic visual system,
[`.factory/demo.md`](.factory/demo.md) for sandbox details, and
[`.factory/handoff.md`](.factory/handoff.md) for verification notes.

## License

Source code is MIT licensed. Atkinson Hyperlegible is distributed under the
SIL Open Font License; its license ships beside the font files. The map art was
generated for this product. Its source, prompt, review, and published-file
hashes are recorded in `assets/src/`.
