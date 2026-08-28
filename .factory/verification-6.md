# Independent verification 6

## Release decision: PASS

**Candidate:** `698ddbf26852cd56d05b17c60c8c78b47a296b20`  
**Live URL:** https://calorie-week-view.sociobot.in  
**Verified:** 2026-08-28 UTC  
**Scope:** independent, no product-code changes

The deployed application matches the candidate build and passes the researched
brief, work-order gates, claims contract, PWA checks, accessibility baseline,
and local-first privacy contract. No defects were found.

## Mandatory first gates

`.factory/claims.json` is present and declares 18 testable visitor claims. From
the clean candidate checkout, after `npm ci`, I executed every listed command in
manifest order. Each command rebuilt the product and exercised its Playwright
claim test through `/demo`; none failed. I then ran the same claims together as
an independent confirmation:

```text
npx playwright test --grep '@claim' --reporter=list
18 passed (26.7s)
```

This covered offline reload; CSV/JSON import and export; printing; isolated
demo storage; absence of third-party traffic, account gates, daily scoring,
food search, coaching, and medical advice; manual entry; settings persistence;
user-selected ranges; deletion; and logged-day averages.

I cold-opened the live root in a new browser context. The first screen says
“Review your calories by week,” identifies “food loggers” as its audience, and
explains that it shows the weekly pattern without streaks, scores, or automatic
targets. Its first prominent action is **Try it with sample data**, immediately
followed by “See a complete week before adding your own entries.” It therefore
answers what it does, for whom, and what to click first in plain words. The
button opens the isolated sample week in one click.

Evidence: `verification-artifacts/verify6-live-first-read-1440.png`.

## Local quality gates

- `npm ci`: PASS — 61 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test`: PASS — 15 Vitest unit/contract tests, TypeScript check, production
  build, and 29 Chromium end-to-end tests.
- `npm run build`: PASS — produced `dist/`.
- Non-claim browser suite was re-run separately: the 11 tests passed, including
  serious/critical axe scans, routes/link integrity/console clean, focus
  restoration, static 404, invalid inputs, demo exit isolation, 390px targets,
  and unit conversion. The final weight-conversion regression was also re-run
  alone and passed.
- No lint command is defined. `tsc --noEmit` runs as part of every build.

Production output is comfortably within the static-PWA budgets: initial JS is
36.59 kB raw / 12.44 kB gzip and CSS is 19.42 kB raw / 5.10 kB gzip. The two
self-hosted fonts total 46.97 kB; the first-screen WebP is 42.81 kB.

## Independent product exercise

At desktop and 390×844 mobile I exercised the sample review, settings, manual
entry dialog, CSV error recovery, demo controls, range display, theme, and
offline reload. Normal and boundary behavior is covered by the browser suite:

- six logged sample days average to 2,062 kcal; the missing day remains blank;
  optional macro and weight summaries render;
- keyboard-only mobile entry saves optional macros, weight, and note;
- invalid CSV calories show a recovery message and do not alter the log;
- a reversed calorie range reports “The maximum must be higher than the
  minimum. Change one value.”;
- HTML numeric bounds reject a 20,001-calorie manual value; importer tests also
  verify all upper bounds and no partial write;
- cancel/close preserve records and restore focus; successful saves and week
  changes move focus to the logical successor;
- changing kg/lb changes display while retaining the stored value's meaning.

At 390px there was no horizontal overflow and no visible target under 44×44 CSS
pixels. With reduced motion, the chart animation duration resolved to `0.00001s`.
Keyboard focus is visibly styled; the mobile verification found the active
**Clear demo records** control visible with a solid outline.

## Accessibility, privacy, and PWA evidence

- `/opt/fleet/lib/verify-url.sh` passed against the live root: HTTPS 200,
  title, `lang="en"`, one h1, main landmark, image alt text, labelled buttons,
  and no console/page errors (660 ms observed load).
- Independent `@axe-core/playwright` scans found **zero serious or critical
  violations** on the live desktop demo, 390px demo, and dark theme.
- A live demo request log made no cross-origin request. Its only IndexedDB
  database was `demo:calorie-week-view`, confirming the stated sandbox namespace.
  No console or page error occurred.
- Browser response headers on `/`, `/demo`, and the 404 include a self-only CSP
  with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, HSTS, and a permissions
  policy disabling camera, microphone, and geolocation. The hashed JS asset is
  `public, max-age=31536000, immutable`; documents and `sw.js` revalidate in
  30 seconds.
- A fresh live service worker controlled `/demo`, cache
  `calorie-week-view-v1.0.4` contained `/demo`, and a fully offline reload showed
  both “Review your calorie week” and the 2,062 kcal sample. Calling
  `registration.update()` resolved cleanly; source and deployed worker implement
  `skipWaiting`, `clientsClaim`, cache versioning, and the update-ready notice.
- The live manifest is valid for standalone use and ships 192px, 512px, and
  maskable icons. `/not-a-route` returns HTTP 404 with the standard shell.

Evidence: `verification-artifacts/verify6-verify-url/` and
`verification-artifacts/verify6-live-demo-mobile-390.png`.

## Candidate/deployment identity

The local production build and live root reference the identical hashed assets:
`/assets/index-vyyEnZUR.js` and `/assets/index-CEsbQIcF.css`. Live HTML was
1,906 bytes with the same asset names as `dist/index.html`; the application
reports version 1.0.2. The live response has the candidate's expected 404,
manifest, robots, sitemap, CSP, cache, and service-worker behavior. The prior
deployment-only concern is therefore not reproducible on this candidate.

## Applicability notes

This is a static, local-first PWA. It has no server-side product API, payment or
unlock endpoint, sign-in, external identity provider, backend persistence,
health endpoint, or package/CLI API. Rate-limit/429 testing, Entra verification,
backend concurrency testing, and clean-consumer installation are not applicable.

## Defects by severity

None found.
