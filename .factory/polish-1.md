# Polish round 1

Repair commit: `968f40c6878c3bd0da6d747044b0bb9d33ecd5a5` (updated in the final
handoff commit). The clean-clone and deployed verification evidence is recorded
in `.factory/handoff.md`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| V-01 | Service-worker shell cache and its offline claim regression remain in place. | `@claim:offline-reload`; live `/demo` offline reload check. |
| V-02 | Mobile chart scrollers remain named, focusable regions. | Mobile axe browser test; live `/demo`. |
| V-03 | File labels retain the visible `:focus-within` outline. | Keyboard reachability browser test. |
| V-04 | Claims are now complete and selector-isolated. | `src/claims-contract.test.ts`; every command in `claims.json`. |
| V-05 | CSV validation still rejects invalid optional values before writes. | Invalid optional CSV regression. |
| V-06 | Header, footer, and controls retain 44 px targets. | Mobile target-size regression. |
| V-07 | Static unknown routes retain the actual 404 response and shell. | `src/deploy.test.ts`; live unknown-route check. |
| V2-01 | JSON backup validation remains atomic before writes. | `@claim:json-import-validation`. |
| V3-01 | Scope boundaries are declared and tested. | `@claim:user-chosen-range`, `@claim:no-daily-score`, `@claim:no-food-search-or-coaching`, `@claim:no-medical-advice`. |
| V3-02 | Each manifest selector still targets exactly one browser test. | `@regression:claim-selector-isolation`. |
| V4-01 | Dialog cancellation remains non-submitting and restores focus. | `@regression:dialog-cancel`. |
| V4-02 | Demo exit discards only demo storage. | `@claim:demo-exit-isolation`. |
| V4-03 | Mobile controls remain at least 44 px. | `@regression:mobile-target-size`. |
| V4-04 | CSV numeric bounds remain shared with manual entry validation. | `@regression:csv-record-bounds`. |
| V4-05 | Display-unit changes preserve each weight's recorded unit. | `@regression:weight-unit-conversion`. |
| V5-01 | Successful review actions return focus to the logical successor. | `@regression:successful-action-focus`. |
| V5-02 | The static 404 keeps the shared shell and literal recovery copy. | `@regression:404-shell`; live unknown-route check. |
| F-1-1 | The first-screen explanation now says “six sample days and one missing day”; a one-click sample claim verifies the full first view. | `@claim:demo-sample`; `qa-artifacts/polish-1/local-demo.png`; live `/demo`. |
| F-1-2 | Reset is declared and restores seeded entries and settings. | `@claim:demo-reset`; live `/demo`. |
| F-1-3 | Demo exit is declared, seeds a real sentinel, and proves it remains unchanged. | `@claim:demo-exit-isolation`; live `/demo` → `/app`. |
| F-1-4 | The weekly chart, calorie average, macro averages, and weights are declared as one observable capability. | `@claim:weekly-display`; live `/demo`. |
| F-1-5 | CSV claim now states the required schema and test rejects missing columns and non-ISO dates without losing imported data. | `@claim:csv-import`. |
| F-1-6 | The lede removes the untested streak promise. | First-read copy audit; live `/`. |
| F-1-7 | Export help now accurately says that CSV downloads as comma-separated text. | `@claim:csv-export`; live `/demo`. |
| F-1-8 | Route navigation updates canonical, Open Graph, and Twitter title/description/URL; static 404 has complete social and touch-icon tags. | Route metadata browser test; `@regression:404-shell`; live route checks. |
| F-1-9 | Eyebrow now says “Weekly calorie review.” | `.factory/copy-audit.md`; live `/`. |
| F-1-10 | Hero caption now says “Compare all seven days without a daily score.” | `.factory/copy-audit.md`; live `/`. |
| F-1-11 | Preview label now says “Example calorie chart.” | `.factory/copy-audit.md`; live `/`. |
| F-1-12 | Preview heading now says “Example seven-day calorie review.” | `.factory/copy-audit.md`; live `/`. |
| F-1-13 | Third step now says “Export or print the week.” | `.factory/copy-audit.md`; live `/`. |
| F-1-14 | Limits eyebrow now says “What this tool does not do.” | `.factory/copy-audit.md`; live `/`. |
| F-1-15 | README removes the subjective “calm” description. | README copy audit; live repository README. |
| F-1-16 | README consistently calls the product try-out a demo. | README copy audit. |
| F-1-17 | README names the six sample entries and their contents instead of calling them realistic. | README copy audit. |
| F-1-18 | Reader-facing README and privacy copy say “this browser”; IndexedDB stays in developer verification notes. | README and privacy route check. |
| F-1-19 | README leads with the offline result, not service-worker jargon. | README copy audit; `@claim:offline-reload`. |
| F-1-20 | README moves the demo database namespace to the developer test section. | README copy audit; `.factory/demo.md`. |

All screenshots and live results are added to the final handoff after deployment.
