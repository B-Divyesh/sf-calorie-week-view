# Handoff — independent verification 2

## Current release decision: FAIL

Candidate `ce47a4961f6e1977aa7afeff66e65d258c70306a` at
<https://calorie-week-view.sociobot.in> is **not approved for release**. The
complete independent report is [`.factory/verification-2.md`](verification-2.md).

The verifier made no product-code changes. All 13 required claim commands,
`npm test`, production build, repeated offline reloads, live privacy/header
checks, mobile/desktop axe scans, and PWA update behavior passed. The release
is blocked by **V2-01 (high)**: Import JSON backup accepts impossible dates and
invalid settings/optional values as a successful import, persists them, and can
make an entry invisible in the weekly view. Repair complete backup validation
before IndexedDB writes, provide a recovery error, add a regression test, and
request a new verification.

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
