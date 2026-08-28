# Independent verification — candidate c76fbd3

## Verdict: FAIL

Candidate `c76fbd3f1d12dfe99f8beb46e2b99cf672c22f01` is not releasable.
The required offline claim test failed, the failure reproduced 7 times in 10
repeated clean-clone runs, and the 390 px app has serious axe findings. The live
deployment does match the candidate, so this is not a stale-deployment result.

- Tested commit: `c76fbd3f1d12dfe99f8beb46e2b99cf672c22f01`
- Tested URL: <https://calorie-week-view.sociobot.in>
- Verification date: 2026-08-28 UTC
- Repository state before QA: tracked tree clean at the candidate; only evidence
  from the interrupted verification attempt was untracked
- Product code changed by verifier: no

## First-read gate

PASS.

- What it does: “Review your calories by week.”
- For whom: food loggers who want the weekly pattern without streaks, scores,
  or automatic targets.
- What to click first: “Try it with sample data.” The nearby text says it opens
  a complete week before the visitor adds entries.
- One click opened `/demo`, immediately showing six realistic logged days, a
  missing Saturday, calorie/macro averages, and weight. The persistent banner
  read “Demo — sample data, nothing is saved to your log” and exposed both
  “Reset demo” and “Start for real.”
- The required information and action were visible without scrolling at both
  1440×900 and 390×844.

Evidence:

- `qa-artifacts/live-first-read-1440.png`
- `qa-artifacts/live-demo-one-click-1440.png`
- `qa-artifacts/first-read-mobile.png`
- `qa-artifacts/demo-first-click.log`

## Release-blocking and material findings

### Critical — V-01: required offline claim test is unreliable and failed

The first required command, run before general QA, failed:

```text
npm test -- --grep @claim:offline-reload
1 failed: expected heading “Review your calorie week” after offline reload;
element not found
```

The offline reload produced a blank document. A second independent stress run
from a fresh detached clone used:

```text
npx playwright test --grep '@claim:offline-reload' --repeat-each=10
```

Result: **3 passed, 7 failed**. Failure traces showed the offline document's JS,
CSS, and font requests ending in `ERR_INTERNET_DISCONNECTED`; the page never
rendered even though the test had observed a controller and cached JS/CSS before
disconnecting. This violates the core `pwa-offline` artifact contract and the
explicit “Works offline after the first visit” claim.

For comparison, the deployed host passed 10/10 sequential offline reloads after
waiting for service-worker control and cache population. That does not rescue
the candidate: its mandated clean-clone claim command failed and the supplied
test is demonstrably nondeterministic.

Evidence: `qa-artifacts/claims-current/offline-reload.log` and
`qa-artifacts/claims-current/results.txt`.

### High — V-02: serious mobile axe violations in the core app

At 390×844, axe-core 4.10.2 reported `scrollable-region-focusable` with serious
impact:

- `/demo`: two nodes, `.chart-section > .chart-scroll` and
  `.weight-section > .chart-scroll`
- `/app`: one node, `.chart-scroll`

The charts are wider than the mobile viewport and require horizontal scrolling,
but the scroll regions have no authored keyboard focus treatment. The repository
axe test only uses its desktop viewport, where these regions are not overflowing,
so it misses the mobile defect.

### High — V-03: file-import controls have no visible keyboard focus

Keyboard tabbing reaches `#csv-input`, but the focused input covers the visual
label with `opacity: 0`. It has no visible `:focus-within` treatment on the label;
the measured focused input remained fully transparent. A keyboard user cannot
see that focus is on “Import CSV.” The JSON input uses the same pattern.

Evidence: `qa-artifacts/live-csv-focus-mobile.png`.

### High — V-04: the claims manifest does not fully prove public capabilities

Every listed claim has one tag, but several tests do not assert the whole claim:

- `settings-choice` claims range, weight unit, and theme, but its test changes
  and asserts only range and theme.
- `manual-entry` claims optional macros, weight, and notes, but its test enters
  and asserts only calories.
- The live app presents “Import JSON backup,” but there is no corresponding
  claim entry or `@claim` test. Independent QA confirmed the feature works, but
  the required every-claim-is-a-test contract is still unmet.
- “No ads,” “no analytics,” and “no third-party scripts” appear in public copy,
  but are not stated as claims in `claims.json`; the current free-account test
  does not test ads or scripts. The separate privacy test observed only
  same-origin traffic during its one demo flow, which is useful evidence but is
  not a complete test for those listed promises.

Under the supplied claims contract, unlisted or only partially tested claims are
release-blocking.

### Medium — V-05: invalid optional CSV values are silently discarded

A CSV row containing valid calories, `protein=-5`, and
`weight=not-a-number` produced the success message “Imported 1 entry from CSV.”
The resulting row showed `—` for both fields. Required-column errors are clear
and recoverable, but invalid optional values are silently converted to null.
This can make an imported log appear complete while losing data. Reject the row
with a row/column error or report the discarded fields before saving.

### Medium — V-06: several mobile targets are smaller than the 44 px contract

At 390 px, measured target boxes included:

- footer Privacy: 47×22.5 px
- footer Terms: 40×22.5 px
- footer “Built by Param Factory”: 147×22.5 px
- header wordmark: 125.7×42 px

These miss the required 44×44 CSS px touch target baseline.

### Medium — V-07: unknown URLs return HTTP 200

`GET /not-a-real-route` returned HTTP 200 and the SPA later rendered its styled
not-found view. The acceptance contract requires a real 404 route. The existing
`responseOverrides` entry does not take effect because the navigation fallback
serves `index.html` first.

## Claims gate

Each exact `test` command from `.factory/claims.json` was run separately against
the repository's `/demo` entry point before general QA.

| Claim | Result | Evidence |
| --- | --- | --- |
| `offline-reload` | **FAIL** | Reloaded offline page stayed blank; expected heading absent |
| `csv-export` | PASS | CSV header and six sample rows asserted |
| `csv-import` | PASS | One-row import, totals, and note asserted |
| `json-export` | PASS | Parsed settings and six records asserted |
| `print-week` | PASS | Browser print call asserted |
| `local-private` | PASS | Same-origin requests and demo-only IndexedDB asserted |
| `free-no-account` | PASS | No password/payment/subscription gate found |
| `manual-entry` | PASS, incomplete coverage | Keyboard calorie save passed; optional fields not exercised |
| `settings-choice` | PASS, incomplete coverage | Range/theme passed; weight unit not exercised |
| `delete-log` | PASS | Demo records cleared to zero |
| `logged-day-average` | PASS | 2,062 kcal from six days, inside range |

Exact command summary: 10 passed, 1 failed. All eleven claim tags occur exactly
once in `tests/claims.spec.ts`.

## Clean-clone quality gates

A new detached clone was made at the exact candidate commit.

- `npm ci`: PASS; 59 packages installed, 60 audited, 0 vulnerabilities.
- `npm test`: PASS on a later full-suite run; 6 unit tests and 13 Chromium tests
  passed. This does not negate the earlier exact claim failure or the 7/10
  repeated failure rate.
- `npm run build`: PASS as the exact build invoked by `npm test`;
  `tsc --noEmit` passed and Vite produced `dist/index.html`.
- Lint: not available; the repository has no lint script.
- Production output: JS 31.59 KB raw / 10.84 KB gzip; CSS 18.88 KB raw /
  5.04 KB gzip.

## Functional and recovery checks

PASS unless called out above.

- Fresh `/app` showed a useful empty state with 0 of 7 days logged.
- Negative manual calories were blocked by native validation with “Value must
  be greater than or equal to 0.” Correcting the value to 2,100 saved normally.
- Calories, macros, weight, and a note updated the summary/table and survived a
  full reload in IndexedDB `calorie-week-view`.
- A reversed 2,500–2,000 calorie range stayed in the dialog with the actionable
  error “The maximum must be higher than the minimum. Change one value.” A valid
  range, pounds, and dark theme then saved correctly.
- Individual deletion required confirmation and returned the log to 0 of 7.
- CSV with missing required columns was rejected with corrective copy; a fixed
  row, including the boundary value of zero calories, imported successfully.
- JSON export → clear demo → invalid JSON rejection → valid JSON restore worked;
  six entries and the 2,062 kcal average returned.
- CSV/JSON downloads and print were also covered by claim tests.
- Missing days remained explicit and did not lower the average.

## Accessibility, responsive behavior, and motion

- Desktop and 390 px layouts had no page-level horizontal overflow.
- Home, privacy, terms, and not-found pages had zero axe violations in the
  independent scan. `/demo` and `/app` fail as described in V-02.
- Each tested route had `lang=en`, one `h1`, one `main`, correct route title,
  and no console/page errors.
- The skip link becomes visible at `x=16, y=8`, has a 3 px focus outline, and
  moves to `#main`.
- The entry dialog initially focuses Calories; Escape closes it and returns
  focus to “Add daily totals.” No dialog trap was found.
- Reduced-motion mode reduced the chart animation and transitions to
  `0.00001s`.
- Focus contrast measured 4.27:1 or better in light mode and 7.13:1 or better
  in dark mode where focus is visible.
- Charts include SVG title/description text alternatives and missing states use
  labels and patterns, not color alone.

Visual inspection found a coherent, product-specific topographic system on
desktop and mobile. The original art, self-hosted font, light/dark tokens, and
provenance match `.factory/design.md`.

## PWA, privacy, and deployment

- Manifest fields and 192/512/maskable icons are present with verified pixel
  dimensions. `display`, versioned `start_url`, and theme/background colors are
  set.
- Live offline reload passed 10/10 sequential isolated-context checks after
  controller/cache readiness; local claim reliability still fails V-01.
- A controlled service-worker script update installed and displayed “An update
  is ready. Reload to use it.”
- Demo and real data used only `demo:calorie-week-view` and
  `calorie-week-view`, respectively. Real save/reload made requests only to the
  product origin. No analytics, runtime AI, ad, account, or payment request was
  observed.
- This static PWA has no server-side/API endpoint, product-unlock call, or
  sign-in flow. API burst/rate-limit and Entra-authority checks are not
  applicable.
- Internal routes and the external Sociobot footer link resolved successfully.
- The factory `verify-url.sh` check passed: HTTP 200, title/lang/main/alt/button
  checks, and zero console errors. Evidence is under
  `qa-artifacts/verify-url-live/`.
- Live security headers include HSTS, CSP (`default-src 'self'`, no inline
  allowances), `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive
  `Permissions-Policy`. No cookies were set.
- HTML, service worker, and manifest use 30-second revalidation. Hashed JS/CSS
  and fonts use one-year immutable caching.

## Candidate/deployment identity

SHA-256 matched between the candidate build and live deployment for:

- `index.html`
- `sw.js`
- `manifest.webmanifest`
- `assets/index-ns4iTWs6.js`
- `assets/index-DYfyTR_m.css`
- `fonts/atkinson-regular.woff2`
- `art/weekly-terrain.webp`

The live deployment therefore represents the candidate under review.

## Performance

Lighthouse 12.8.2 mobile, live URL:

- Performance 96, Accessibility 100, Best Practices 100, SEO 100
- FCP 1.05 s, LCP 1.43 s, CLS 0.0325, TBT 221 ms
- Total initial transfer 109,354 bytes
- Navigation-only Lighthouse did not emit INP; interactive browser flows showed
  no hangs, but no field-style INP value is claimed.

Static budgets pass:

- JS: 10.84 KB gzip (budget 200 KB)
- CSS: 5.04 KB gzip (budget 50 KB)
- Fonts: 46,972 bytes total (budget 120 KB)
- Mobile hero WebP: 42,810 bytes (budget 300 KB)

## Required next actions

1. Make the required offline claim deterministic in the production preview and
   keep its repeated clean-context run green.
2. Make mobile chart scroll regions keyboard accessible with a visible focus
   treatment; rerun axe at 390 px on populated and empty states.
3. Add visible focus styling for the file labels/inputs and enlarge undersized
   touch targets.
4. Bring `claims.json` and claim tests into one-to-one coverage with every
   public promise, including the full manual/settings fields and JSON import.
5. Reject or explicitly report invalid optional CSV cells.
6. Serve unknown URLs with an actual 404 response while retaining the designed
   page.

