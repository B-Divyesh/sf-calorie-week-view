# Polish round 2

Release: `1.0.4` · repair commits: `3b9c81955e6b`, `9b53a43ab9d7`
· deployment: `1ec05992-696c-4fc5-a6b9-1a15ef8ae5d8` · live URL:
<https://calorie-week-view.sociobot.in>

The current and historical review records were reread in full. The table maps
every finding ID to the retained or new repair and fresh round-2 evidence. The
full clean-clone suite and all 23 exact claim commands passed. Screenshots are
under `.factory/qa-artifacts/polish-2/`.

| Finding | Change made | Evidence: test · screenshot · live check |
| --- | --- | --- |
| V-01 | Kept the versioned app-shell cache and offline navigation fallback; advanced it to `calorie-week-view-v1.0.6`. | `@claim:offline-reload` · `live-demo-offline-mobile.png` · live `/?demo=1` reloaded with 2,062 kcal while fully offline. |
| V-02 | Kept both chart scrollers as named, keyboard-focusable regions. | accessibility browser test · `live-demo-mobile.png` · live `/demo` axe scan: 0 serious/critical. |
| V-03 | Kept the designed 3 px `:focus-within` outline on file inputs. | “makes mobile chart scrollers, import controls, and footer links visibly keyboard reachable” · `live-demo-mobile.png` · live `/demo` keyboard surface checked. |
| V-04 | Kept unique exact selectors for every claim and added the F-2-1 claim. | `@regression:claim-selector-isolation`; 23/23 exact claim commands · `live-verify/screenshot-desktop.png` · live release matches the tested bundle. |
| V-05 | Kept atomic rejection of invalid optional CSV values. | “reports invalid optional CSV cells and leaves the log unchanged” · `live-demo-mobile.png` · live `/demo` rendered the unchanged sample. |
| V-06 | Kept 44 px minimum targets across the shared shell and app. | `@regression:mobile-target-size` · `live-demo-mobile.png` · live 390 px sweep found 0 undersized controls. |
| V-07 | Kept known-route rewrites separate from the static 404 response. | `@regression:real-404` · `live-404-mobile.png` · live `/round-2-missing-page` returned HTTP 404. |
| V2-01 | Kept complete JSON validation before any database write. | `@claim:json-import-validation` · `live-demo-mobile.png` · live `/demo` sample remained intact. |
| V3-01 | Kept target, score, coaching/search, and medical boundaries as declared claims. | `@claim:user-chosen-range`, `@claim:no-daily-score`, `@claim:no-food-search-or-coaching`, `@claim:no-medical-advice` · `live-verify/screenshot-desktop.png` · live `/`, `/demo`, and `/terms` checked. |
| V3-02 | Kept one exact browser selector per manifest claim. | `@regression:claim-selector-isolation`; each command reported 1 passed · `live-verify/screenshot-desktop.png` · live bundle hash matched local. |
| V4-01 | Kept Cancel and close controls as non-submit buttons with focus restoration. | `@regression:dialog-cancel` · `live-demo-mobile.png` · live `/demo` dialogs remained keyboard operable. |
| V4-02 | Kept demo exit destructive only to `demo:calorie-week-view`. | `@claim:demo-exit-isolation` · `live-demo-mobile.png` · live sentinel survived and only `calorie-week-view` remained. |
| V4-03 | Kept responsive controls at least 44×44 CSS px. | `@regression:mobile-target-size` · `live-demo-mobile.png` · live 390×844 sweep found none below the limit. |
| V4-04 | Kept shared numeric bounds and all-or-nothing CSV writes. | `@regression:csv-record-bounds` · `live-demo-mobile.png` · live `/demo` loaded without error. |
| V4-05 | Kept per-record weight units and display conversion without changing stored meaning. | `@regression:weight-unit-conversion` and `@claim:settings-choice` · `live-demo-mobile.png` · live settings and sample weights checked. |
| V5-01 | Kept logical successor focus after week changes, entry saves, and settings saves. | `@regression:successful-action-focus` · `live-demo-mobile.png` · live one-click navigation focused the new h1. |
| V5-02 | Kept the literal, shared-shell 404 with recovery link and no mobile overflow. | `@regression:404-shell` · `live-404-mobile.png` · live unknown URL returned 404 and “Page not found”. |
| F-1-1 | First-screen help names six sample days and one missing day. | `@claim:demo-sample` · `live-verify/screenshot-mobile.png` · live cold first screen showed the exact sentence. |
| F-1-2 | Reset behavior remains declared and restores entries plus range. | `@claim:demo-reset` · `live-demo-mobile.png` · live reset restored 6/7 days and 1,800–2,200. |
| F-1-3 | Demo exit remains declared and proves real-data preservation. | `@claim:demo-exit-isolation` · `live-demo-mobile.png` · live real sentinel survived demo exit. |
| F-1-4 | Weekly chart, calorie average, macros, and weight trend remain one observable claim. | `@claim:weekly-display` · `live-demo-mobile.png` · live `/demo` showed all summaries and weights. |
| F-1-5 | CSV claim and test cover required columns and ISO dates, including rejection cases. | `@claim:csv-import` · `live-demo-mobile.png` · live import UI states the required columns. |
| F-1-6 | First-screen copy says daily scores and suggested targets; it makes no streak claim. | `.factory/copy-audit.md`; `@claim:no-daily-score` · `live-verify/screenshot-mobile.png` · live `/` exact lede checked. |
| F-1-7 | Export help says CSV is comma-separated text. | `@claim:csv-export` · `live-demo-mobile.png` · live `/demo` exact export help checked. |
| F-1-8 | Every SPA route updates title, description, canonical, Open Graph, and Twitter fields; 404 has the complete static set. | “keeps route titles, landmarks, links, and console clean”; `@regression:404-shell` · `live-404-mobile.png` · live `/`, `/app`, `/demo`, `/privacy`, `/terms`, and 404 metadata all matched. |
| F-1-9 | Eyebrow remains the literal “Weekly calorie review.” | `.factory/copy-audit.md` · `live-verify/screenshot-mobile.png` · live `/` exact copy checked. |
| F-1-10 | Hero caption remains “Compare all seven days without a daily score.” | `.factory/copy-audit.md`; `@claim:no-daily-score` · `live-verify/screenshot-desktop.png` · live `/` exact copy checked. |
| F-1-11 | Preview label remains “Example calorie chart.” | `.factory/copy-audit.md` · `live-verify/screenshot-desktop.png` · live `/` exact copy checked. |
| F-1-12 | Preview heading remains “Example seven-day calorie review.” | `.factory/copy-audit.md` · `live-verify/screenshot-desktop.png` · live `/` exact copy checked. |
| F-1-13 | Third step remains “Export or print the week.” | `.factory/copy-audit.md`; export/print claim tests · `live-verify/screenshot-desktop.png` · live `/` exact heading checked. |
| F-1-14 | Limits label remains “What this tool does not do.” | `.factory/copy-audit.md` · `live-verify/screenshot-desktop.png` · live `/` exact heading checked. |
| F-1-15 | README uses the measurable phrase “weekly review,” without “calm.” | README copy audit · `live-verify/screenshot-desktop.png` · live product copy uses the same literal term. |
| F-1-16 | README and interface consistently call the sample mode “demo.” | `@claim:demo-sample` · `live-demo-mobile.png` · live banner and navigation say “Demo.” |
| F-1-17 | README names six sample entries and their fields instead of calling them realistic. | `@claim:demo-sample` · `live-demo-mobile.png` · live sample showed those concrete contents. |
| F-1-18 | Reader copy says data stays “in this browser”; IndexedDB appears only in developer details. | `@claim:local-private` · `live-verify/screenshot-mobile.png` · live `/` and `/privacy` exact wording checked. |
| F-1-19 | Reader copy states the offline result without service-worker jargon. | `@claim:offline-reload` · `live-demo-offline-mobile.png` · live offline reload passed. |
| F-1-20 | Demo database namespace remains in developer docs, not the try-it instructions. | `@claim:local-private` · `live-demo-mobile.png` · live demo banner uses plain language. |
| F-2-1 | Added `art-provenance` to `claims.json`, a SHA-256 provenance manifest, and an exact test binding source, prompt, review, published derivatives, and rendered hero. | `@claim:art-provenance` · `live-verify/screenshot-desktop.png` · live hero SHA-256 `45bc…b6c7` matched the manifest. |

## Round-2 verification summary

- Clean clone at final functional commit `9b53a43ab9d7`: `npm ci`, `npm test`, and `npm run build` passed; 15 unit/contract tests and 34 Chromium tests passed.
- Every one of the 23 commands in `.factory/claims.json` ran separately; every command selected exactly one tagged browser test and passed.
- Live `verify-url.sh` reported the correct title, `lang=en`, one h1, one main, complete image alternatives, labelled buttons, and no console/page errors.
- Live 390 px demo and 404 axe scans found zero serious/critical violations. There was no horizontal overflow and no visible target below 44×44 px.
- Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.033.
- The deployed JavaScript asset is `index-BEpsDyFL.js`, identical to `dist/`. Initial JS is 12.46 kB gzip and CSS is 5.10 kB gzip.

No review finding remains open.
