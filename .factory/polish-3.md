# Polish round 3

Release `1.0.5` · functional repair `744381d303b9a97e9d31b4d8b0b59264a17cdc8f`
· deployment `1a1638fc-af0f-4c13-bc97-cc2de9bcba6e` · live URL:
<https://calorie-week-view.sociobot.in>

Every `.factory/review-*.md` and `.factory/polish-*.md` available before this
round was reread in full. The current product was checked rather than relying
on earlier PASS labels. “Live check” below means a fresh Chromium context after
the round-3 deployment. All referenced screenshots are committed under
`.factory/qa-artifacts/polish-3/`.

| Finding | Change made or retained | Evidence: test · screenshot path · live URL check |
| --- | --- | --- |
| V-01 | Kept the versioned app-shell cache and advanced it to `calorie-week-view-v1.0.7`. | `@claim:offline-reload` · `.factory/qa-artifacts/polish-3/live-demo-offline-mobile.png` · live `/?demo=1` retained the banner, six days, and 2,062 kcal after a fully offline reload. |
| V-02 | Kept calorie and weight charts as named, keyboard-focusable regions with text alternatives. | accessibility browser test · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live `/demo` axe scan found 0 serious/critical issues. |
| V-03 | Kept the designed 3 px `:focus-within` outline for file inputs. | “makes mobile chart scrollers, import controls, and footer links visibly keyboard reachable” · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live `/demo` retained the visible import controls and keyboard surface. |
| V-04 | Kept all 23 claims unique and selector-isolated. | `@regression:claim-selector-isolation`; 23/23 exact manifest commands passed · `.factory/qa-artifacts/polish-3/live-verify/screenshot-desktop.png` · live JS hash matched the clean build. |
| V-05 | Kept invalid optional CSV fields as an atomic rejection. | “reports invalid optional CSV cells and leaves the log unchanged” · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live sample remained at six entries. |
| V-06 | Kept every visible control at least 44 × 44 CSS px. | `@regression:mobile-target-size` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live 390 px sweep across seven pages found 0 undersized targets. |
| V-07 | Kept known SPA rewrites separate from the designed HTTP 404. | `@regression:real-404` · `.factory/qa-artifacts/polish-3/live-404-mobile.png` · live `/round-3-missing-page` returned 404. |
| V2-01 | Kept full JSON validation before database writes. | `@claim:json-import-validation` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live sample loaded unchanged. |
| V3-01 | Kept user-range, no-score, no-search/coaching, and medical-boundary claims declared and tested. | four corresponding `@claim` tests · `.factory/qa-artifacts/polish-3/live-terms-mobile.png` · live `/`, `/demo`, and `/terms` showed the tested boundaries. |
| V3-02 | Kept one exact Playwright selector for every manifest claim. | `@regression:claim-selector-isolation`; each exact command selected 1 test · `.factory/qa-artifacts/polish-3/live-verify/screenshot-desktop.png` · deployed bundle matched tested output. |
| V4-01 | Kept Cancel and close as non-submit buttons with focus restoration. | `@regression:dialog-cancel` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live demo dialogs remained keyboard operable. |
| V4-02 | Kept **Start for real** destructive only to the demo database. | `@claim:demo-exit-isolation` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live sentinel survived exit and `demo:calorie-week-view` was removed. |
| V4-03 | Kept responsive targets at least 44 × 44 CSS px. | `@regression:mobile-target-size` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live 390 × 844 sweep found none below the limit. |
| V4-04 | Kept shared numeric bounds and all-or-nothing CSV writes. | `@regression:csv-record-bounds` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live demo rendered without recovery errors. |
| V4-05 | Kept per-entry weight units and conversion without changing stored meaning. | `@regression:weight-unit-conversion`; `@claim:settings-choice` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live sample displayed its recorded kilogram values. |
| V5-01 | Kept logical successor focus after route, week, entry, and settings changes. | `@regression:successful-action-focus`; route navigation regression · `.factory/qa-artifacts/polish-3/live-terms-mobile.png` · live Privacy navigation and Back each focused the new h1. |
| V5-02 | Kept the literal shared-shell 404 and recovery action. | `@regression:404-shell` · `.factory/qa-artifacts/polish-3/live-404-mobile.png` · live unknown path returned 404 with no overflow or axe issue. |
| F-1-1 | Kept the exact “six sample days and one missing day” first-action explanation. | `@claim:demo-sample` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live first-screen copy and one-click sample passed. |
| F-1-2 | Kept Reset demo declared and restoring entries plus settings. | `@claim:demo-reset` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live reset restored six entries and 1,800–2,200. |
| F-1-3 | Kept demo exit declared and isolated from a seeded real log. | `@claim:demo-exit-isolation` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live `1,999` marker survived demo exit unchanged. |
| F-1-4 | Kept the chart, calorie average, macro averages, and weight trend as one observable claim. | `@claim:weekly-display` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live demo showed seven chart days, 2,062 kcal, macros, and weights. |
| F-1-5 | Kept the CSV schema claim and rejection coverage for missing columns and invalid dates. | `@claim:csv-import` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live import help names date and calories. |
| F-1-6 | Kept the first-screen audience sentence free of an untested streak claim. | `.factory/copy-audit.md`; `@claim:no-daily-score` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live lede names scores and suggested targets only. |
| F-1-7 | Kept the exact comma-separated-text export wording. | `@claim:csv-export` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live `/demo` showed the precise export help. |
| F-1-8 | Kept route-specific title, description, canonical, Open Graph, Twitter, favicon, and touch icon metadata. | route metadata browser test · `.factory/qa-artifacts/polish-3/live-404-mobile.png` · seven live routes, including 404 and offline, matched their metadata sets. |
| F-1-9 | Kept “Weekly calorie review” on the landing page and removed the last “reflection tool” occurrence from Terms. | `@regression:route-heading-copy` · `.factory/qa-artifacts/polish-3/live-terms-mobile.png` · live `/terms` h1 is “Terms for Calorie Week View”; no rendered route contains “reflection tool.” |
| F-1-10 | Kept the literal hero caption. | `.factory/copy-audit.md`; `@claim:no-daily-score` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live caption says “Compare all seven days without a daily score.” |
| F-1-11 | Kept “Example calorie chart” as the preview label. | `.factory/copy-audit.md` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live `/` showed the exact label. |
| F-1-12 | Kept “Example seven-day calorie review” as the preview h2. | `@regression:landing-heading-outline` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live landing outline matched the expected h2 list. |
| F-1-13 | Kept “Export or print the week” as step 3. | CSV, JSON, and print claim tests · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live `/` showed the exact heading. |
| F-1-14 | Replaced the remaining non-semantic limits treatment with the h2 “What Calorie Week View does not do.” | `@regression:landing-heading-outline` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live h2 names the full boundary section. |
| F-1-15 | Kept README free of the subjective “calm” wording. | README copy audit · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live product copy uses “weekly review.” |
| F-1-16 | Kept “demo” as the single user-facing sample-mode term. | `@claim:demo-sample` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live navigation and banner say “Demo.” |
| F-1-17 | Kept concrete sample contents instead of “realistic.” | `@claim:demo-sample` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live sample showed six entries, macros, weights, and notes. |
| F-1-18 | Kept reader copy in browser language and technical storage names in developer docs. | `@claim:local-private` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live first screen says the log stays in this browser. |
| F-1-19 | Kept the offline result in plain words. | `@claim:offline-reload` · `.factory/qa-artifacts/polish-3/live-demo-offline-mobile.png` · live demo reloaded offline. |
| F-1-20 | Kept the IndexedDB namespace out of try-it copy. | `@claim:local-private` · `.factory/qa-artifacts/polish-3/live-demo-mobile.png` · live banner describes separation without implementation jargon. |
| F-2-1 | Kept the art provenance manifest and SHA-256 binding for source and published assets. | `@claim:art-provenance` · `.factory/qa-artifacts/polish-3/live-verify/screenshot-desktop.png` · live rendered WebP matched the recorded asset. |
| F-3-1 / F-1-9 reopened | Changed the Terms h1 from “Use it as a reflection tool” to “Terms for Calorie Week View.” | `@regression:route-heading-copy` · `.factory/qa-artifacts/polish-3/live-terms-mobile.png` · cold live `/terms` showed the exact new h1 and retained the personal-record-keeping sentence. |
| F-3-2 | Changed the landing limits h2 to “What Calorie Week View does not do” and moved “You choose the range.” into its own following paragraph. | `@regression:landing-heading-outline` · `.factory/qa-artifacts/polish-3/live-home-mobile.png` · live heading outline was exact and literal. |

## Additional cumulative audit repair

The static offline fallback still contained an unreviewed map metaphor. It now
uses the literal h1 “This page is not available offline,” complete route
metadata, the shared header/footer, Privacy and Terms links, and release 1.0.5.
`@regression:offline-shell-copy`, the live axe/target sweep, and
`.factory/qa-artifacts/polish-3/live-offline-mobile.png` verify it.

## Round-3 verification summary

- Final fresh clone `/tmp/calorie-polish3-final.eXcYXg/clone` at `744381d`: `npm ci`
  reported 0 vulnerabilities. All 23 exact claim commands passed separately.
- The same clone passed `npm test`: 15 unit/contract tests, a production build,
  and 37 Chromium tests. A separate `npm run build` produced `dist/index.html`.
- Initial JS is 36.89 kB raw / 12.45 kB gzip; CSS is 19.42 kB raw / 5.10 kB
  gzip. The live JS and CSS SHA-256 values match `dist/`.
- Live mobile Lighthouse scored 100 performance / 100 accessibility / 100 best
  practices / 100 SEO. FCP was 1.1 s, LCP 1.4 s, TBT 0 ms, and CLS 0.033.
- The live 390 px route sweep found 0 serious/critical axe violations, 0
  undersized visible targets, 0 overflows, and 0 errors on successful pages.
- The final post-deploy cold audit repeated demo reset/exit isolation, route
  and Back focus, same-origin traffic, offline reload, and all seven mobile
  route checks; see `.factory/qa-artifacts/polish-3/live-final-audit.json`.
- `verify-url.sh` passed locally and live. The live home report recorded the
  correct title, `lang=en`, one h1/main, complete alt text, labelled buttons,
  and no console/page errors.

No review finding remains unresolved.
