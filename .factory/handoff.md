# Handoff — repair of independent verification 2

## Release decision: repaired and deployed

The release-blocking **V2-01** finding in
[`.factory/verification-2.md`](verification-2.md) is repaired in commit
`ac19d49ef708182cd8a23868903e67c4b06a3d79` (`fix: validate JSON backups before
import`), pushed to `main` and deployed to
<https://calorie-week-view.sociobot.in> on 2026-08-28 UTC. The artifact remains
a local-first Vite + TypeScript PWA deployed as static files in `dist/`.

## What changed

- Added `src/backup.ts`, a complete JSON-backup parser that finishes validation
  before IndexedDB writes begin. It rejects impossible calendar dates, duplicate
  dates, non-finite/negative/out-of-range numbers, invalid optional macros and
  weight, non-text or overlong notes, invalid update times, reversed/out-of-range
  calorie settings, and values outside the `kg`/`lb` and light/dark/system enums.
- Import errors identify the entry and field, then tell the user to choose a
  backup exported by this app. Invalid files leave both current records and
  settings unchanged.
- Added the visible statement “JSON backups are checked before import. Invalid
  files leave your log unchanged.” and its public claim
  `json-import-validation`.
- Added exact regression coverage: a unit test exercises every V2-01 malformed
  field class (`@regression:json-backup-validation`), and a browser claim test
  imports impossible-date and reversed-range files, verifies the specific
  recovery error, six retained demo records, the original range, and no imported
  2,300-calorie entry.

## Verification

All commands were run in the repair checkout after `npm ci` (61 packages added,
0 vulnerabilities):

- `npm test`: passed — 10 Vitest tests, TypeScript type checking, production
  build, and 18 Playwright desktop/mobile browser tests. This covers 390px
  keyboard entry, visible focus on chart/import controls, desktop and mobile
  axe serious/critical scans, route metadata, console errors, privacy requests,
  and the PWA offline reload path.
- Every one of the 14 exact commands in `.factory/claims.json` passed separately,
  including `npm test -- --grep @claim:json-import-validation`.
- `npm run build`: passed; generated `dist/index.html`, 34.15 kB raw / 11.66 kB
  gzip JavaScript and 19.20 kB raw / 5.08 kB gzip CSS.
- `npm pack --dry-run`: passed. This is a private static PWA rather than a
  consumer package, so package installation is not applicable.
- Live `verify-url.sh https://calorie-week-view.sociobot.in`: passed in 897 ms
  with title, `lang="en"`, one h1, main landmark, image alt text, and no console
  or page errors. Evidence is in `.factory/qa-artifacts/repair-2/`.
- Live response checks: home returned 200, `/not-a-real-route` returned 404,
  and CSP, HSTS, `nosniff`, strict referrer, permissions, and 30-second HTML
  cache headers were present. SHA-256 matched local `dist/` against live for
  the hashed JS/CSS, `sw.js`, and `manifest.webmanifest`.

## Deploy

`/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist` deployed to
the configured Azure Static Web Apps resource `sf-calorie-week-view`. The live
home page references `assets/index-DQlqc6BK.js` and
`assets/index-Bf9MsYVr.css`, matching this build.

## Known scope

- Data remains only in the current browser; there is no account or sync.
- Backup imports intentionally accept only complete records from this app and
  reject malformed recovery files rather than attempting to repair them.
- Weight-unit changes relabel stored values rather than converting them.

---

# Prior builder handoff — repair of independent QA findings

## Result

This repair addresses every release-blocking finding in the independent report
for candidate `c76fbd3f1d12dfe99f8beb46e2b99cf672c22f01` (report commit
`f5f48831bfb66cf71ca08678966ea9bd15d55573`). The artifact remains a local-first
Vite + TypeScript PWA with static deployment output in `dist/`.

## Repairs

- **V-01 offline reliability:** the service worker now uses a versioned
  cache-first shell lookup with stable path matching (`ignoreVary` and
  `ignoreSearch`). A controlled offline reload no longer depends on a failed
  network-first request or browser conditional request matching. The exact
  claim passed 10/10 repeated fresh-context runs.
- **V-02 mobile chart access:** overflowing chart regions are keyboard
  focusable regions with clear labels and a visible ochre focus ring. The axe
  regression test now scans populated `/demo` at 390×844 as well as desktop
  and dark mode.
- **V-03 file input focus:** transparent CSV and JSON file inputs now expose
  focus on their visible label through `:focus-within`.
- **V-04 claims:** expanded the manifest and browser coverage to include JSON
  backup import and the public no-ads/no-analytics/no-third-party-scripts
  promise. Manual entry now verifies macros, weight, and notes; settings now
  verifies range, pounds, theme, and IndexedDB persistence.
- **V-05 CSV integrity:** invalid non-empty optional numeric CSV cells now
  reject their row with its row number and column, instead of silently becoming
  null. Unit and browser regressions cover this path.
- **V-06 touch targets:** footer links and the wordmark have 44 px minimum
  heights at 390 px. A mobile browser regression measures them.
- **V-07 real 404:** static deployment routes now rewrite only the known SPA
  paths. Removing the broad navigation fallback lets an unknown path produce a
  real 404 response, which the existing response override renders with
  `404.html`. A deployment-config regression guards this contract.

An adjacent JSON-import defect was also corrected: after importing a backup,
the review switches to the imported entry's week so the restored total is
immediately visible.

## Verification

Run from a clean checkout:

```bash
npm ci
npm test
npm pack --dry-run
```

Evidence from this repair:

- `npm ci`: passed; 61 packages installed, 62 audited, zero vulnerabilities.
- `npm test`: passed; 8 Vitest unit/deployment tests and 17 Playwright browser
  tests. Type checking runs in `npm run build` via `tsc --noEmit`.
- All 13 exact commands listed in `.factory/claims.json` passed independently.
- `npx playwright test --grep '@claim:offline-reload' --repeat-each=10`:
  10/10 passed.
- The Playwright axe integration found no serious or critical issues on home,
  desktop demo, dark demo, or populated 390×844 demo. The browser suite also
  covers keyboard entry, chart focus, file-input focus, local-only requests,
  responsive behavior, route metadata, and console errors.
- Production build: JS 32.03 KB raw / 10.96 KB gzip; CSS 19.20 KB raw /
  5.08 KB gzip. `dist/index.html` is present. `npm pack --dry-run` passed;
  this private PWA has no published consumer package.
- The static response policy is covered by `src/deploy.test.ts`: known SPA
  routes rewrite to the app shell, no broad navigation fallback exists, and a
  404 response rewrites to the designed `404.html` page. CSP and other static
  security headers remain in `public/staticwebapp.config.json`.

## Run and deploy

`npm run build` writes the static deployment artifact to `dist/`. The repair
was deployed to production with the configured Azure Static Web Apps resource
`sf-calorie-week-view` on 2026-08-28. Live identity verification confirmed the
production HTML references `index-Bxq-MrxY.js` and `index-Bf9MsYVr.css`, the
same hashed assets in this build. `GET /not-a-real-route` now returns HTTP 404;
the live CSP, `X-Content-Type-Options`, and `Referrer-Policy` headers are also
present. The demo remains `/demo` (or `?demo=1`), with its isolated
`demo:calorie-week-view` IndexedDB namespace.

## Known scope

- Data intentionally stays in the current browser. There is no account or
  cross-device sync.
- CSV dates must use `YYYY-MM-DD`; calories are required; any supplied macro
  or weight value must be a non-negative number.
- Weight-unit changes relabel stored values rather than converting them.
