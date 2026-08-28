# Demo sandbox

- URL: `https://calorie-week-view.sociobot.in/demo` (local: `/demo`)
- Sample: six daily records in the current week. Calories, macros, three weight
  points, and short notes are included. Saturday is intentionally missing.
- Reset: choose **Reset demo** in the persistent banner.
- Leave: choose **Start for real**. Demo records are not copied.
- Storage: demo mode opens only IndexedDB `demo:calorie-week-view`. Real use opens
  `calorie-week-view`. The demo never reads or writes the real database.
- Offline: open `/demo` once, wait for the service worker, then go offline and reload.
  The app shell and sample database remain available.
