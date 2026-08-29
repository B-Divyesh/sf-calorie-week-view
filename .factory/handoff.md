# Handoff — independent verification 9

## Release decision: FAIL

Candidate `57915100c917e1c83622d2f201e199a4d578f3db` was tested from a
clean checkout on 2026-08-29 UTC against
<https://calorie-week-view.sociobot.in>. Production is healthy and matches the
candidate build, but this candidate is not accepted.

## Blocking defects

- **Release-blocking RB-9-1:** `/terms` and README make MIT source-license and
  SIL font-license claims that have no entry in `.factory/claims.json` and no
  matching tagged sandbox test. The claims contract says an unlisted public
  claim fails verification.
- **Medium M-9-1:** Cancel, the close icon, and Escape do not discard settings
  form drafts. After canceling 1,111–2,222 while the saved range remains
  1,800–2,200, reopening shows the canceled values. A later Save can therefore
  apply a range the user discarded. Reloading is the current workaround.

Full evidence and reproduction details are in
`.factory/verification-9.md`. No product code was changed during verification.

## What passed

- Mandatory cold first-read and one-click isolated demo gate.
- All 23 exact commands from `.factory/claims.json`.
- `npm ci` with zero vulnerabilities.
- `npm test`: 15 unit/contract tests, exact production build, and 37 Chromium
  tests.
- Separate `npm run build`; `dist/index.html` exists.
- Live manual entry, upper numeric boundaries, invalid input and recovery,
  import/export/print claim paths, keyboard navigation, focus handling outside
  the defect, dark mode, reduced motion, and 200% text.
- Zero serious/critical axe findings on desktop and 390 px route sweeps; no
  mobile overflow or undersized checked targets.
- Live privacy flow used only same-origin requests and only the demo IndexedDB.
- Security headers, caching, service-worker update check, and fully offline
  demo reload.
- Byte-for-byte match for all 22 served `dist/` files.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.4 s, TBT 140 ms, CLS 0.033.

This static PWA has no server-side endpoints, accounts, payments, sign-in,
library API, or CLI. Rate-limit, backend concurrency/health, Entra authority,
and consumer-package checks are not applicable.

## How to reproduce

```bash
npm ci
npm test
npm run build
```

Settings defect: open the live `/demo`, choose **Change settings**, enter
1,111–2,222, choose **Cancel**, and reopen the dialog. The review still shows
1,800–2,200, while the reopened form incorrectly shows 1,111–2,222.

## Required repair

Register and test the public licensing claims. Reset the settings form from
saved state on every open and add a reopen-after-cancel regression for Cancel,
close, and Escape. Deploy the repair and repeat independent verification.
