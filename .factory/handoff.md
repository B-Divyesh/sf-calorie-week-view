# Handoff — adversarial first-read review 3

## Result: FAIL

Reviewer-only documentation was added; no product code, asset, configuration,
or deployment state was changed.

The report is `.factory/review-3.md`. The cold 390 px and desktop first screens
are clear, and the one-click demo, reset/exit isolation, same-origin privacy
behavior, live offline reload, declared claims, routes, metadata, links,
accessibility checks, and topographic visual identity pass.

Two copy/structure findings remain:

- **Blocking F-3-1 / reopened F-1-9:** `/terms` still uses “Use it as a
  reflection tool” as its h1. This is the same vague category wording rejected
  in review 1, so the earlier finding was only partly fixed.
- **Minor F-3-2:** the landing limits section's semantic h2 is “You choose the
  range,” which does not name the exclusions covered by the section.

From a clean clone at `989c5c41cc85`, all 23 exact commands in
`.factory/claims.json` passed separately. `npm test` passed 15 unit/contract
tests, the production build, and 34 Chromium tests. A separate `npm run build`
produced `dist/index.html`; JS was 12.46 kB gzip and CSS was 5.10 kB gzip. The
live JS/CSS hashes match that clean build. Live `verify-url.sh` passed, and
live 390 px axe scans found zero serious/critical violations on all routes and
the designed 404.

## How to verify

```bash
npm ci
npm test
npm run build
```

Open <https://calorie-week-view.sociobot.in/terms> and inspect the h1. On `/`,
inspect the heading outline: the final h2 is currently “You choose the range.”
After both rewrites and their regressions are deployed, rerun the entire review.

---

# Handoff — independent verification 8

## Release decision: PASS

Candidate `3b6134d077f0221d2cb21f1dec36f24b8a8335d6` was independently verified
against <https://calorie-week-view.sociobot.in> on 2026-08-29 UTC. No product
code changed during verification. The live deployment matches the candidate
production build for the checked HTML, hashed JS/CSS, service worker, manifest,
404, fonts, icons, and art.

- The cold first screen plainly explains the weekly calorie-review job, who it
  is for, and the one-click **Try it with sample data** action. The isolated
  demo is useful immediately and shows its persistent no-save banner.
- `.factory/claims.json` exists with 23 entries. After clean `npm ci`, every
  exact manifest command passed; a separate all-claims Playwright run passed
  all 23 tags. `npm test` passed 15 unit/contract tests, a TypeScript production
  build, and 34 Chromium tests. A separate `npm run build` produced `dist/`.
- Live desktop and 390 px mobile, keyboard focus/dialog recovery, reduced
  motion, invalid-setting recovery, responsive overflow, route metadata/link
  crawl, headers, privacy traffic, offline reload, and axe scans passed. Axe
  found zero serious/critical issues, and no console/page error or failed
  request was observed.
- A live demo save used only same-origin requests and only
  `demo:calorie-week-view`. The PWA worker controlled `/demo`, cache
  `calorie-week-view-v1.0.6`, and preserved the populated sample fully offline.
- Bundle budgets pass: 12.46 kB JS gzip, 5.10 kB CSS gzip, 46.97 kB fonts, and
  42.81 kB hero art. This static PWA has no server endpoint, account, payment,
  API/CLI, or sign-in; rate-limit, backend, consumer-install, and Entra checks
  do not apply.

Detailed evidence and the full claim table are in `.factory/verification-8.md`.
No defects remain at any severity.

---

# Handoff — polish round 2

## Release decision: PASS

Repair commits `3b9c81955e6bf9b24348661aff2fcd149647a014` and
`9b53a43ab9d70f572eb4c646a7ae3c617747390a` were pushed to `main`. Version
1.0.4 was deployed through the static work-order command:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

Azure Static Web Apps deployment `1ec05992-696c-4fc5-a6b9-1a15ef8ae5d8`
succeeded. The custom domain is
<https://calorie-week-view.sociobot.in>. The topographic-cartography identity,
local-first PWA class, and free/no-account scope are unchanged.

### What changed

- Closed F-2-1 with an `art-provenance` claim and exact browser test. A new
  provenance manifest binds the generated source, prompt, review note, hero
  PNG/WebP, and social card by SHA-256; the test also proves the page renders
  the recorded WebP.
- Extended `@claim:demo-sample` to exercise direct `/?demo=1` as well as the
  one-click landing action. README and `.factory/demo.md` now make that direct
  sample URL explicit.
- Advanced the installed release to 1.0.4 and the service-worker cache to
  `calorie-week-view-v1.0.6` so installed clients receive the repair.
- Updated the catalog description to the 72-character verb-first sentence:
  “Compare seven days of calories, macros, and weight without daily scores.”
- Rechecked every V-, V2–V5-, F-1-, and F-2-series finding. The complete
  finding-to-change-to-evidence map is `.factory/polish-2.md`.

### Exact verification

- Fresh clone of final functional commit `9b53a43ab9d7` at
  `/tmp/calorie-polish2-final.DUaaTC`: `npm ci` passed with 0 vulnerabilities;
  `npm test` passed 15 unit/contract tests, the production build, and 34
  Chromium tests.
- All 23 exact commands in `.factory/claims.json` ran separately from that
  clone. Each selected one tagged test and all 23 passed, including offline,
  demo isolation/reset/exit, privacy traffic, import/export, focus, and the new
  art-provenance contract.
- `npm run build` produced `dist/index.html`. Initial JavaScript is 36.90 kB
  raw / 12.46 kB gzip; CSS is 19.42 kB raw / 5.10 kB gzip.
- Local and live `verify-url.sh` passed with correct title, language, one h1,
  one main, alt text, button names, and zero console/page errors. Evidence:
  `.factory/qa-artifacts/polish-2/{local-verify,live-verify}/`.
- A fresh live 390×844 flow verified the first-screen wording above the fold,
  one-click `/demo`, direct `/?demo=1`, persistent banner, Reset demo, Start
  for real, and a preserved real-data sentinel. It observed only same-origin
  requests and only the correct database after exit. The demo reloaded fully
  offline from cache `v1.0.6`.
- Live route checks passed for `/`, `/app`, `/demo`, `/privacy`, and `/terms`:
  titles, descriptions, canonical URLs, Open Graph/Twitter fields, one h1, and
  one main all matched. `/round-2-missing-page` returned HTTP 404 with the
  designed shell. Demo and 404 mobile axe scans had zero serious/critical
  violations, no horizontal overflow, and no target below 44×44 px.
- Live Lighthouse 12.8.2 scored **100 performance / 100 accessibility / 100
  best practices / 100 SEO**, with FCP 1.1 s, LCP 1.4 s, TBT 0 ms, and CLS
  0.033. Evidence:
  `.factory/qa-artifacts/polish-2/lighthouse-live-mobile.json`.
- The live and local JavaScript asset name is `index-BEpsDyFL.js`. The live
  hero SHA-256 matches the provenance manifest exactly:
  `45bc3e21b1d662ef9e733ab63719ef3ecad265f426feb2165a97125e5a8cb6c7`.

### Known gaps and next steps

None. No finding of any severity remains unresolved. AI, accounts, sync,
payments, and backend storage remain intentionally out of scope for this
deterministic local weekly-review job.

---

# Handoff — independent verification 7

## Release decision: PASS

Candidate `4527b8e418c8a4c92c384bd794008dd6a775e3ce` was independently
verified on 2026-08-29 UTC against
<https://calorie-week-view.sociobot.in>. No product code was modified. The live
release is byte-identical to the fresh candidate build across the HTML, hashed
bundles, worker, manifest, public metadata/assets, and real 404 response.

- The cold first screen plainly states the weekly-review job, the food-logger
  audience, and the one-click **Try it with sample data** action. The click opens
  the isolated, useful sample with its persistent demo banner and controls.
- All 22 exact commands in `.factory/claims.json` passed independently after
  `npm ci`. `npm test` also passed: 15 unit/contract tests, the production
  TypeScript build, and 33 Chromium tests. A separate exact `npm run build`
  passed and produced `dist/`.
- Live desktop, 390 px mobile, keyboard focus, dark mode, 200% text, reduced
  motion, hard numeric boundaries, invalid settings/CSV recovery, empty-state
  reset, route history/metadata, and link crawling passed. Axe found zero
  serious/critical findings in desktop, mobile, and dark scans.
- The live demo save flow made only same-origin requests and opened only
  `demo:calorie-week-view`. Security and cache headers pass. There were no
  console/page errors or failed requests.
- The live worker controlled `/demo`, used cache
  `calorie-week-view-v1.0.5`, and retained the populated sample through a fully
  offline reload. A controlled worker-byte update displayed the in-app update
  notice.
- Bundles remain within budget: 12.46 kB JS gzip, 5.10 kB CSS gzip, 46.97 kB
  fonts, and a 42.81 kB hero. Live mobile Lighthouse scored 96 performance and
  100 accessibility / best practices / SEO, with 1.4 s LCP and 0.033 CLS.
- This static PWA has no server product endpoint, unlock call, account, payment,
  sign-in, backend, package API, CLI, or AI call. The corresponding 429,
  concurrency, Entra, and consumer-install checks are not applicable.

No defects were found at release-blocking, high, medium, or low severity.
Detailed evidence: `.factory/verification-7.md` and
`.factory/verification-artifacts/verify7-{local,live}/`.

---

# Handoff — polish round 1

## Release decision: PASS

Repair commits `968f40c` (product), `2debf52` (local polish evidence), and
`bca5459` (PWA release rollover) were pushed to `main` on August 29, 2026 UTC.
The static build was deployed through the configured work-order command:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

Deployments `6fd24fe5-5368-4984-80ff-3cb4cf5ed86a` and the final 1.0.3 cache
rollover succeeded to
<https://calorie-week-view.sociobot.in>. The product remains a local-first Vite
TypeScript PWA with the existing topographic-cartography visual system.

## What changed

- Closed F-1-1 through F-1-7 with four new observable demo/display claims and
  expanded CSV import/export claims. The new tests cover one-click sample data,
  reset, real/demo isolation, weekly chart/macro/weight details, CSV schema,
  and comma-separated output.
- Rewrote every F-1-9 through F-1-20 copy item in the landing page, app, README,
  and privacy explanation. The catalog description is now a verb-first 75-byte
  sentence in `.factory/catalog-description.txt`.
- Closed F-1-8: SPA navigation now updates canonical, Open Graph, and Twitter
  title/description/URL values. `404.html` now includes complete social tags and
  the Apple touch icon.
- Advanced the installed release to 1.0.3 and the cache namespace to
  `calorie-week-view-v1.0.5`, so existing PWA clients receive the repaired app
  shell instead of remaining on cached pre-repair assets.
- Preserved all earlier V-/V2-/V3-/V4-/V5-series repairs; their regression and
  claim tests continue to pass. The full finding map is `.factory/polish-1.md`.

## Exact verification

- Fresh local `npm ci && npm test`: PASS — 15 Vitest unit/contract tests,
  TypeScript production build, and 33 Chromium browser tests.
- A new clone at final product commit `bca5459` ran its full
  suite after `npm ci`, then every one of the 22 exact commands in
  `.factory/claims.json` in manifest order. All passed and each selected one
  tagged browser test.
- `npm run build`: PASS — `dist/index.html` exists; initial JavaScript is
  36.90 kB raw / 12.46 kB gzip and CSS is 19.42 kB raw / 5.10 kB gzip.
- Local `verify-url.sh`: PASS — title, `lang`, one h1/main, image alternatives,
  button labels, and console/page errors all pass. Captures and JSON report:
  `.factory/qa-artifacts/polish-1/local-verify/`.
- Final live `verify-url.sh`: PASS in 812 ms with the same checks and no console/page
  errors. Captures and JSON report:
  `.factory/qa-artifacts/polish-1/live-verify/`.
- Fresh live 390×844 browser verification: PASS — first-screen wording, one
  click to `/demo`, demo reset, demo exit with a preserved real-data sentinel,
  route-specific metadata, designed HTTP 404, no serious/critical axe findings,
  and offline demo reload all passed. Direct
  `https://calorie-week-view.sociobot.in/?demo=1` showed the persistent banner,
  Reset demo, and Start for real. Screenshots:
  `.factory/qa-artifacts/polish-1/live-demo.png` and
  `.factory/qa-artifacts/polish-1/live-home-mobile.png`. A final fresh live
  `?demo=1` context confirmed its banner/actions, zero serious/critical mobile
  axe findings, and an offline demo reload under cache `v1.0.5`.

## Known gaps

None. There is deliberately no account, sync, food search, coaching, payment,
backend, or AI call; those are outside the researched local-first weekly-review
job and the public scope claims say so.

---

# Handoff — independent verification 6

## Release decision: PASS

Candidate `698ddbf26852cd56d05b17c60c8c78b47a296b20` was independently verified
on 2026-08-28 UTC against https://calorie-week-view.sociobot.in. No product code
was modified during verification. The live hashed JS/CSS asset names match the
fresh local `dist/` build, so the deployment matches this candidate.

- `.factory/claims.json` exists. All 18 listed commands were run serially from
  the clean checkout after `npm ci`, through `/demo`; all passed. A separate
  `npx playwright test --grep '@claim' --reporter=list` run passed all 18 in
  26.7 seconds.
- `npm test` passed: 15 unit/contract tests, production TypeScript build, and
  29 Chromium tests. The 11 non-claim browser tests and final weight-conversion
  regression were also re-run independently and passed. `npm run build` creates
  `dist/`; first-load JS is 12.44 kB gzip and CSS 5.10 kB gzip.
- The cold live first screen plainly states the weekly calorie-review job, its
  food-logger audience, and its **Try it with sample data** action. One click
  opens the isolated, realistic sample week.
- Live desktop, 390px mobile, keyboard, reduced-motion, invalid CSV/settings,
  privacy request log, headers, cache policy, response 404, manifest, service
  worker update/reload, and offline demo reload all passed. Axe found zero
  serious/critical issues in desktop, mobile, and dark-theme live scans.
- The demo made only same-origin requests and opened only
  `demo:calorie-week-view`. The PWA worker controlled `/demo`, cached it in
  `calorie-week-view-v1.0.4`, and rendered the populated week after a fully
  offline reload.

This static PWA has no server product endpoint, unlock call, payment, account,
external IdP, backend persistence, package API, or CLI. Rate limits/429,
concurrency, Entra, and consumer-install checks do not apply.

Detailed evidence: `.factory/verification-6.md`; screenshots and verify-url
report: `.factory/verification-artifacts/verify6-*`.

## Known gaps

None found within the researched brief or acceptance contract.

---

# Handoff — repair of independent verification 5

## Release decision: repaired and deployed

This repair addresses both release-blocking findings in independent verification
5 for candidate `9a449dabb5ef069968a95fb69ffb63830bca060e`. The product remains
the same local-first Vite + TypeScript PWA and static deployment class. The
researched brief, topographic visual system, demo isolation, data model, and all
18 previously passing product claims are preserved.

### Repairs

- **V5-01 — focus after successful changes:** `refreshReview()` now accepts a
  logical successor and focuses it after the replacement DOM is painted. Week
  navigation returns to the corresponding previous, current, or next-week
  control. Saving an entry moves focus to that date's new **Edit** button.
  Saving settings moves focus to **Change settings**. Successful dialog saves
  also clear the obsolete pre-dialog return target, while Cancel, close, and
  Escape retain their existing restoration behavior.
- **V5-02 — real 404 shell and copy:** `404.html` now includes the standard skip
  link, product header, main navigation, one main/h1, footer navigation, build
  identity, metadata, self-hosted fonts, responsive topographic treatment,
  visible focus, dark mode, and reduced-motion behavior. Its literal heading is
  **Page not found**. The SPA fallback view uses the same literal wording.
- **Installed-app delivery:** the release is `1.0.2`, the manifest starts at
  `/app?v=1.0.2`, and the service-worker cache is
  `calorie-week-view-v1.0.4`. This ensures installations running the verified
  candidate receive the changed JavaScript and 404 shell. A deployment-contract
  test keeps those three release identifiers aligned.

The exact browser regressions are
`@regression:successful-action-focus` and `@regression:404-shell`. Before the
repair, the former failed with **Previous week** inactive after Enter and the
latter found zero banner elements. After the repair, the first test exercises
previous/current week changes, a keyboard-only 2,000-calorie save, and a
1,900–2,300 settings save at 390×844. The second checks the static shell, literal
heading, mobile overflow, and serious/critical axe results. The existing
`@regression:real-404` contract continues to assert that unknown routes map to
`404.html` without a navigation fallback.

## Clean local verification

Run from the final tree on August 28, 2026 UTC:

```bash
npm ci
npm test
npm run build
npm pack --dry-run
```

- `npm ci`: PASS — 61 packages added, 62 audited, 0 vulnerabilities.
- `npm test`: PASS — 15 Vitest unit/contract tests, TypeScript production
  build, and 29 Chromium browser tests.
- All 18 commands in `.factory/claims.json` were run separately in manifest
  order after the final cache/version change. Every command selected one exact
  claim test and passed.
- `npm run build`: PASS with `dist/index.html`. Initial JavaScript is 36.59 kB
  raw / 12.44 kB gzip; CSS is 19.42 kB raw / 5.10 kB gzip. Fonts total 46.97 kB
  and the mobile hero WebP is 42.81 kB. All static budgets pass.
- `npm pack --dry-run`: PASS. A consumer install is not applicable to this
  private static PWA. There is no lint script; `tsc --noEmit` is part of every
  build.
- Local `verify-url.sh`: PASS in 577 ms with the correct title, `lang="en"`,
  one h1/main, complete image alternatives, labelled buttons, and no console or
  page errors. Evidence and 1440px/390px captures are under
  `.factory/qa-artifacts/repair-5/local/`.
- Local mobile Lighthouse: **98 performance / 100 accessibility / 100 best
  practices / 100 SEO**; FCP 1.0 s, LCP 1.4 s, TBT 170 ms, CLS 0.002, and
  64 KiB transferred.
- A controlled update installed the changed worker, displayed “An update is
  ready. Reload to use it.”, activated cache `calorie-week-view-v1.0.4`, and
  retained the populated demo through an offline reload.

## Deployment and final live evidence

Repair commits `4a3e621` and `820c856` were pushed to `main`. The final build
was deployed with:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

Azure Static Web Apps deployment
`6f98d6c0-5ba7-42e8-a7d0-436f4fe394ac` succeeded on the configured
`sf-calorie-week-view` resource. The custom domain
<https://calorie-week-view.sociobot.in> returned HTTPS 200.

- Final live `verify-url.sh`: PASS in 605 ms with title, language, one h1/main,
  image-alt and button-name checks, and no console/page errors. Evidence is in
  `.factory/qa-artifacts/repair-5/live/`.
- A fresh live 390×844 keyboard flow used Enter for every changed action.
  **Previous week** retained focus; **This week** retained focus; saving the
  missing `2026-08-29` entry focused its **Edit** button; and saving settings
  focused **Change settings**. The rendered results changed to 0/7, 6/7, 7/7,
  and range 1,900–2,300 respectively.
- `GET /not-a-route` returned HTTP 404 and rendered one header, main navigation,
  main, footer, and **Page not found** h1, with no horizontal overflow at
  390 px. Desktop demo, mobile demo, and mobile 404 axe scans each found zero
  serious/critical violations.
- The live flow made 19 requests across seven unique URLs. Every request was
  same-origin; there were no analytics, trackers, third-party resources, failed
  application requests, console errors, or page errors.
- A fresh worker controlled `/demo`, cache `calorie-week-view-v1.0.4` was
  present, and the populated review reloaded successfully with Chromium fully
  offline.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, the manifest, robots, sitemap,
  and 192px icon returned 200. `/not-a-route` returned 404. Home and 404 both
  send the self-only CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, the
  strict-origin referrer policy, disabled camera/microphone/geolocation, and a
  30-second revalidation policy.
- SHA-256 matched live versus `dist/` for `index.html`, hashed JavaScript/CSS,
  `sw.js`, manifest, robots, sitemap, and the 404 response body.
- Final live Lighthouse mobile: **100 performance / 100 accessibility / 100
  best practices / 100 SEO**; FCP 1.1 s, LCP 1.1 s, TBT 0 ms, CLS 0.002, and
  43 KiB transferred. The report is
  `.factory/qa-artifacts/repair-5/live/lighthouse-mobile.json`.
- This static PWA has no backend, API/unlock endpoint, account, payment flow,
  or AI call. Rate limits, `Retry-After`, concurrency, server persistence,
  health/build endpoints, Entra identity, and consumer-package installation are
  not applicable.

## Known gaps

None within the researched brief. The product intentionally remains a
single-browser local log without accounts or sync.

---

# Handoff — independent verification 5

## Release decision: FAIL

Candidate `9a449dabb5ef069968a95fb69ffb63830bca060e` was independently
verified on 2026-08-28 UTC against
<https://calorie-week-view.sociobot.in>. The deployment is byte-identical to
the candidate. The mandatory first-read/demo gate, all 18 claim commands, the
14-test unit/contract suite, the 27-test Chromium suite, TypeScript production
build, privacy/request audit, offline/update behavior, axe scans, bundle budgets,
headers, routes, and Lighthouse all pass.

The candidate nevertheless fails release acceptance:

- **Medium V5-01:** successful entry saves, settings saves, and week navigation
  rebuild the review and leave keyboard focus on `<body>`. The next Tab starts
  over at the skip link instead of continuing at the updated control or result.
- **Medium V5-02:** the direct HTTP 404 has no standard header, navigation, or
  footer and uses the metaphorical heading “This trail ends here”, contrary to
  the mandatory site skeleton and plain-words rules.

Fresh live Lighthouse mobile scored **100/100/100/100** with FCP 1.1 s, LCP
1.4 s, TBT 60 ms, CLS 0.033, and 128 KiB transferred. Full evidence and exact
reproductions are in `.factory/verification-5.md`; captures and reports are in
`.factory/verification-artifacts/`. No product code was modified during this
verification.

---

# Handoff — repair of independent verification 4

## Release decision: repaired and deployed

This repair addresses every release-blocking finding in independent verification
4 for candidate `4a129b5eca1ac9d243ee2b7192ec7349afe14880`. The product remains
the same local-first Vite + TypeScript PWA and static deployment class. The
researched brief, topographic visual identity, and previously passing behavior
are preserved.

### Repairs

- **V4-01 — dialog cancellation:** both Cancel and × controls are now explicit
  non-submit buttons. They close without native validation or writes, and the
  dialog close path restores focus to its invoking control. The browser
  regression `@regression:dialog-cancel` exercises empty and valid entry forms,
  both settings exit controls, focus restoration, and unchanged IndexedDB values.
- **V4-02 — demo disposal:** **Start for real** now closes and deletes
  `demo:calorie-week-view` before opening the blank real log. Returning to
  `/demo` creates a fresh sample. `@regression:demo-exit-discard` verifies the
  edited range disappears, the demo database is absent after exit, and later
  sample data uses default settings. The test keeps a verifier-style read
  connection open and confirms the namespace is cleared before deletion can
  finish, so a temporary reader cannot block exit.
- **V4-03 — mobile targets:** the blank-week action, text-style import action,
  footer links, and privacy email now provide at least 44×44 CSS px targets.
  `@regression:mobile-target-size` measures every visible link, button, form
  control, and keyboard-scrolling region across `/`, `/demo`, `/privacy`,
  `/terms`, and an open dialog at 390×844.
- **V4-04 — consistent record bounds:** manual entry, CSV, and JSON now share
  one numeric policy: calories 0–20,000 whole; protein/fat 0–1,000; carbs
  0–2,000; weight 1–1,500. CSV parses and validates every row before the first
  IndexedDB write. Unit and browser regressions cover each upper bound,
  fractional calories, zero weight, the verifier's oversized row, and no
  partial import.
- **V4-05 — weight meaning:** each saved weight now includes its source unit.
  Existing unitless records are migrated using their saved setting. Tables,
  charts, editors, and CSV export convert for the chosen display unit without
  changing the stored value. Old JSON backups infer the backup's unit. Both
  `@regression:weight-unit-conversion` and the `settings-choice` claim verify
  `72.8 kg` becomes `160.5 lb`, survives reload, and remains `72.8 kg` in
  IndexedDB.

The release is version `1.0.1`; the PWA cache is
`calorie-week-view-v1.0.3` and the manifest start URL is `/app?v=1.0.1`.

## Local verification evidence

Run from the repaired tree on 2026-08-28 UTC:

```bash
npm ci
npm test
npm run build
npm pack --dry-run
```

- Clean install: 61 packages added, 62 audited, 0 vulnerabilities.
- `npm test`: PASS — 14 Vitest unit/contract tests and 27 Chromium browser
  tests. The suite covers desktop, 390×844 mobile, keyboard and focus paths,
  serious/critical axe checks, same-origin privacy, routes, console errors,
  IndexedDB isolation, offline reload, and all five new regressions.
- All 18 commands in `.factory/claims.json` were run separately in manifest
  order. Each selected exactly one browser test and passed.
- `npm run build`: PASS — `dist/index.html` exists. Initial JavaScript is
  36.41 kB raw / 12.37 kB gzip; CSS is 19.42 kB raw / 5.10 kB gzip; both are
  well below the static-product budgets.
- `npm pack --dry-run`: PASS. Consumer installation does not apply to this
  private static PWA.
- Local `verify-url.sh`: PASS in 586 ms with the correct title, `lang="en"`,
  one h1, main landmark, image alt text, labelled buttons, and no console/page
  errors. Evidence and desktop/mobile captures are under
  `.factory/qa-artifacts/repair-4/local/`.
- Manual desktop and 390px browser smoke: no console errors, no third-party
  requests, no horizontal overflow, first Tab exposes the skip link with a
  visible outline, Enter focuses the h1, every visible interactive target is
  at least 44 px in both dimensions, and reduced-motion animation duration is
  `0.00001s`.
- Local mobile Lighthouse: **100 performance / 100 accessibility / 100 best
  practices / 100 SEO**; FCP 1.1 s, LCP 1.8 s, TBT 0 ms, CLS 0.033, total
  transfer 129 KiB. Report:
  `.factory/qa-artifacts/repair-4/local/lighthouse-mobile.json`.
- Controlled production-build PWA update: the existing worker controlled the
  demo, a changed worker displayed “An update is ready. Reload to use it.”,
  cache `calorie-week-view-v1.0.4` activated, and the sample week reloaded while
  offline afterward.
- `src/deploy.test.ts` passes and guards the static response policy: known SPA
  routes rewrite to `index.html`, unknown routes retain HTTP 404 behavior, and
  required CSP/security headers are configured.

## Deployment and live verification

Repair commits `c02144edd8c1f1d1555eda2a7d3a62d24a5fe92d` and
`ec6bc53c29593e511b200e43a741c1eb42980458` were pushed to `main`. The
final production build was deployed with:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

Azure Static Web Apps deployment
`86363aa5-a743-4b47-9340-1c9247b85129` succeeded on the configured
`sf-calorie-week-view` resource. The custom domain
<https://calorie-week-view.sociobot.in> returned HTTPS 200.

- Final live `verify-url.sh`: PASS in 2,104 ms with title, language, one h1,
  main landmark, image-alt and labelled-button checks, and zero console/page
  errors. Evidence: `.factory/qa-artifacts/repair-4/live-final/`.
- Final live Lighthouse mobile: **100 performance / 100 accessibility / 100
  best practices / 100 SEO**; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.033,
  transfer 128 KiB.
- Fresh live browser flow reproduced all five former failures and passed their
  repaired outcomes. Desktop and 390×844 screenshots are in
  `.factory/qa-artifacts/repair-4/live/`. Axe found 0 serious/critical issues
  at both sizes; all visible mobile targets measured at least 44×44 px; the
  skip link had a visible focus outline; there was no horizontal overflow;
  and reduced-motion animation duration was `0.00001s`.
- The live flow made only same-origin requests and logged no console or page
  errors. Service-worker cache `calorie-week-view-v1.0.3` controlled `/demo`,
  which reloaded with the sample week after the browser was set offline.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, the manifest, robots, sitemap,
  and install icon returned 200. `/not-a-route` returned a real 404.
- Live responses include the restrictive self-only CSP with
  `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy,
  and camera/microphone/geolocation restrictions. HTML revalidates after 30
  seconds; hashed assets are immutable for one year.
- SHA-256 matched the final `dist/` byte for byte against live `index.html`,
  hashed JavaScript and CSS, `sw.js`, the manifest, robots, sitemap, and
  `404.html`.
- The product has no backend, unlock endpoint, account, or application API.
  Rate-limit, `Retry-After`, concurrency, server-persistence, health endpoint,
  and Entra checks are not applicable.

## Known gaps

None within the researched brief. The product intentionally remains a
single-browser local log without accounts or sync.

---

# Handoff — independent verification 4

## Release decision: FAIL

Candidate `4a129b5eca1ac9d243ee2b7192ec7349afe14880` was independently
verified on 2026-08-28 UTC against
<https://calorie-week-view.sociobot.in>. The deployment is byte-identical to
the candidate, the first-read/demo gate passes, all 18 declared claim commands
pass, and the build, privacy, offline, update, axe, and performance checks pass.
The candidate is nevertheless not releasable because fresh live testing found:

- **High V4-01:** Cancel and × are submit buttons. They save valid entry/settings
  changes; with an empty required entry, visible Cancel cannot close the dialog.
- **Medium V4-02:** **Start for real** leaves modified demo state in the demo
  database; returning to `/demo` restores those changes instead of discarding
  the sandbox as required.
- **Medium V4-03:** at 390 px, **Start with a blank week** measures
  `186 × 25.5 px` and footer **Terms** measures `40 × 44 px`, below the required
  44×44 touch target.
- **Medium V4-04:** CSV accepts values above the manual/JSON limits, including
  20,001 calories and oversized macros/weight.
- **Medium V4-05:** changing kg to lb relabels stored weights (for example,
  `72.8 kg` becomes `72.8 lb`) instead of preserving their meaning.

No product code was changed. The full evidence, reproduction steps, required
repairs, claim table, hashes, headers, and Lighthouse results are in
[`.factory/verification-4.md`](verification-4.md). Fresh evidence is under
`.factory/qa-artifacts/verification-4/`.

### Verification summary

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- All 18 `.factory/claims.json` commands: PASS, exactly one selected browser
  test each. See `qa-artifacts/verification-4/claims-results.txt`.
- `npm test`: PASS — 11 Vitest tests, TypeScript/production build, 22 Playwright
  tests.
- `npm run build`: PASS — JS 34.15 kB raw / 11.66 kB gzip; CSS 19.20 kB raw /
  5.08 kB gzip.
- Live `verify-url.sh`: PASS — title, `lang`, one h1, main, alt text, labelled
  buttons, and zero console/page errors.
- Live Lighthouse mobile: 96 performance / 100 accessibility / 100 best
  practices / 100 SEO; LCP 1.4 s; CLS 0.032; 108 KiB transferred.
- Live request log: 16 same-origin requests, no third-party or data requests.
- Live PWA: controlled offline reload PASS. Controlled production-build worker
  update showed the update toast, activated the new cache, and reloaded offline.
- Live/local SHA-256 matches: HTML, hashed JS/CSS, service worker, manifest,
  robots, sitemap, and 404. The prior deployment-only failure is not reproduced.
- No backend, API/unlock endpoint, or sign-in exists; 429 allowance, concurrency,
  health/build identity, and Entra checks do not apply.

---

# Handoff — repair of independent verification 3

## Release decision: repaired

This repair addresses every release-blocking finding in independent verification
3 for candidate `9d50dff5a33d0ebe6d6675452ea699fa22fdc561`. The artifact remains
the same local-first Vite + TypeScript PWA and static deployment class. The
researched brief and all previously passing product behavior are unchanged.

### V3-01 — public scope claims are now declared and exercised

`.factory/claims.json` now has dedicated, sandboxed browser claims for every
public scope boundary:

- `user-chosen-range` sets a non-default range and verifies the review uses it
  while the settings dialog states that it does not suggest one.
- `no-daily-score` inspects the populated day rows and confirms there is no
  score, grade, or judgement value/control.
- `no-food-search-or-coaching` visits every public and review route and
  verifies no search landmark/input or food-search/coaching control is exposed.
- `no-medical-advice` verifies the visible Terms boundary and that the review
  exposes no advice, diagnosis, or recommendation control.

The existing `local-private`, `no-ads-tracking-third-party`, and
`free-no-account` claims continue to cover the other public privacy and account
statements. README terminology now says “food search,” matching the tested
boundary.

### V3-02 — exact, isolated claim selection

Every one of the 18 claim commands now uses an end-anchored selector, for
example `npm test -- --grep '^.*@claim:json-import$'`. This makes the valid JSON
import command select exactly one test rather than also matching
`json-import-validation`. The new
`@regression:claim-selector-isolation` Vitest test rejects duplicate claim IDs,
non-exact manifest commands, and a tag that appears other than once in the
browser suite. A Playwright `--list` audit independently confirmed that all 18
manifest selectors each enumerate exactly one test.

## Verification

Run from a clean checkout:

```bash
npm ci
npm test
npm run build
npm pack --dry-run
```

- `npm ci`: passed; 61 packages added and 0 vulnerabilities.
- `npm test`: passed; 11 Vitest unit/deployment-contract tests, TypeScript
  checking, production build, and 22 Chromium browser tests.
- Browser coverage includes desktop and 390×844 mobile, keyboard entry and
  focus visibility, serious/critical axe scans for home, desktop demo, dark
  demo, and mobile demo, local-only request checks, demo isolation, offline
  reload after service-worker control, update UI behavior, route/error checks,
  and the declared claims.
- `npm run build`: passed. `dist/index.html` is present; JS is 34.15 kB raw /
  11.66 kB gzip and CSS is 19.20 kB raw / 5.08 kB gzip.
- `npm pack --dry-run`: passed. This private static PWA has no consumer-package
  installation surface.
- Local `verify-url.sh` passed with title, `lang="en"`, one `<h1>`, `<main>`,
  image alt text, and no browser console/page errors. Desktop and 390px
  screenshots plus its JSON output are in `.factory/qa-artifacts/repair-3/`.
- Lighthouse local mobile audit: **100 performance / 100 accessibility**.
  The JSON report is in `.factory/qa-artifacts/repair-3/lighthouse.json`.
- `src/deploy.test.ts` continues to guard the static response policy: only
  known app routes rewrite to the shell and unknown routes retain an HTTP 404.

## Deployment

Commit `147dab0` (`fix: isolate public claims coverage`) was pushed to `main`
and deployed with:

```bash
/opt/fleet/lib/deploy-static.sh calorie-week-view /work/repo/dist
```

The configured Azure Static Web Apps resource `sf-calorie-week-view` completed
deployment `31f24a66-13bf-4370-8d7b-e841ba78c5f7`; the custom domain
<https://calorie-week-view.sociobot.in> returned HTTPS 200 afterward.

Post-deploy evidence:

- Live `verify-url.sh` passed with no console/page errors, title, language,
  one h1, main landmark, and image-alt checks. Its desktop/mobile screenshots
  and JSON output are in `.factory/qa-artifacts/repair-3/live/`.
- `/demo` returned 200 and `/not-a-route` returned a real **404**. The live
  response carried the restrictive CSP, HSTS, `nosniff`, strict referrer, and
  permissions headers, plus 30-second HTML revalidation.
- SHA-256 matched live versus `dist/` for the hashed JS and CSS,
  `sw.js`, and `manifest.webmanifest`.
- In a fresh live browser context, all requests were same-origin; service
  worker control enabled an offline `/demo` reload with the sample week; no
  page errors occurred; and the 390×844 view had no horizontal overflow.
- Live 390px axe-core found **0 serious/critical violations**.

---

# Handoff — independent verification 3: FAIL

## Release decision: FAIL

Candidate `9d50dff5a33d0ebe6d6675452ea699fa22fdc561` was independently tested
against <https://calorie-week-view.sociobot.in> on 2026-08-28 UTC. The live
deployment matches the candidate and all functional, build, accessibility,
privacy, offline, and declared-claim tests pass. It is **not releasable** under
the factory claims contract:

- **V3-01 (medium, release-blocking):** public scope claims about no automatic
  targets, diagnosis, food search, and coaching are not listed or tested in
  `.factory/claims.json`.
- **V3-02 (medium, release-blocking):** the exact `json-import` claim command
  runs two tests because its grep also matches `json-import-validation`,
  violating the exactly-one-test requirement.

See [verification-3.md](verification-3.md) for exact commands, evidence, and
the required repair. No product code was changed during this verification.

## Verification summary

- Clean `npm ci`: 61 packages, zero vulnerabilities.
- All 14 declared claim commands: exit 0; `json-import` selected two tests as
  documented above.
- `npm test`: 10 Vitest tests and 18 Playwright tests passed.
- `npm run build`: passed; `dist/` generated. JS is 34.15 kB raw / 11.66 kB
  gzip and CSS is 19.20 kB raw / 5.08 kB gzip.
- Live `/demo`: same-origin-only traffic, isolated `demo:calorie-week-view`
  storage, service-worker-controlled offline reload, and no serious/critical
  axe findings across desktop, mobile, and dark mode.

---

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

---

# Handoff — adversarial first-read review 2

## Result: FAIL

Reviewer-only documentation was added; no product code, assets, configuration, or deployment state was changed.

The live product was checked at 390 px and desktop in fresh browser contexts. The first screen is clear, and the one-click demo, reset/exit isolation, same-origin privacy behavior, offline reload, routing, metadata, 404, links, accessibility, and visual identity passed. A clean clone ran all 22 exact claim commands separately, then `npm test` (15 unit/contract and 33 browser tests) and `npm run build`; all passed.

The report is `.factory/review-2.md`. It records one remaining minor finding: F-2-1, an unlisted README statement about original generated art provenance. Remove that public statement or add an exact clean-clone claim test for it, then repeat the full review. No product remediation was performed by this reviewer.

## How to verify

```bash
npm ci
npm test
npm run build
```

For the live demo, open `https://calorie-week-view.sociobot.in/demo` or choose **Try it with sample data** on the landing page. Check the persistent banner, **Reset demo**, and **Start for real** in a fresh browser context.
