import './styles.css';
import { WeekStore } from './db';
import { DEFAULT_SETTINGS, type DayRecord, type Settings } from './types';
import { parseJSONBackup } from './backup';
import {
  addDays, average, formatDay, formatWeekRange, localISO, parseCSV, parseLocalDate,
  rangeLabel, recordsToCSV, slotsForWeek, startOfWeek,
} from './week';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('App root is missing.');
const app: HTMLDivElement = root;

const BUILD_ID = '1.0.0';
let store: WeekStore | null = null;
let records: DayRecord[] = [];
let settings: Settings = { ...DEFAULT_SETTINGS };
let weekStart = startOfWeek(new Date());
let demoMode = false;
let returnFocus: HTMLElement | null = null;

const escapeHTML = (value: string | number) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

function routePath(): string {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path;
}

function setMetadata(title: string, description: string, path: string): void {
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://calorie-week-view.sociobot.in${path}`);
}

function navigate(path: string): void {
  window.history.pushState({}, '', path);
  void renderRoute(true);
}

function header(active: string): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demoMode ? `<aside class="demo-banner" aria-label="Demo status"><span><strong>Demo</strong> — sample data, nothing is saved to your log.</span><span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-route="/app">Start for real</button></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-route="/" aria-label="Calorie Week View home">
        <svg viewBox="0 0 44 44" aria-hidden="true"><path d="M4 22c0-9 8-17 18-17s18 8 18 17-8 17-18 17S4 31 4 22Z"/><path d="M10 22c0-6 5-11 12-11s12 5 12 11-5 11-12 11-12-5-12-11Z"/><path d="M16 22c0-3 3-6 6-6s6 3 6 6-3 6-6 6-6-3-6-6Z"/></svg>
        <span>Calorie<br />Week View</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/app" data-route="/app" ${active === 'review' ? 'aria-current="page"' : ''}>Review</a>
        <a href="/demo" data-route="/demo" ${active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/privacy" data-route="/privacy" ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p>See your calorie week without a daily score.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-route="/privacy">Privacy</a><a href="/terms" data-route="/terms">Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build-id">Version ${BUILD_ID} · Original generated map art</p>
  </footer>`;
}

function page(content: string, active = ''): string {
  return `<div class="page-shell">${header(active)}${content}${footer()}<div id="route-status" class="sr-only" aria-live="polite"></div><div id="toast" class="toast" role="status" aria-live="polite"></div></div>`;
}

function homePage(): string {
  setMetadata('Calorie Week View — Review a week at once', 'Review seven days of calories, macros, and weight in one calm, private view.', '/');
  return page(`
    <main id="main">
      <section class="hero contour-field" aria-labelledby="home-title">
        <div class="hero-copy">
          <p class="eyebrow">A weekly reflection tool</p>
          <h1 id="home-title" tabindex="-1">Review your calories by week</h1>
          <p class="lede">For food loggers who want the weekly pattern without streaks, scores, or automatic targets.</p>
          <div class="hero-actions">
            <button class="button primary" data-route="/demo">Try it with sample data</button>
            <span>See a complete week before adding your own entries.</span>
          </div>
          <a class="secondary-link" href="/app" data-route="/app">Start with a blank week</a>
          <ul class="plain-facts" aria-label="Product facts">
            <li>Your log stays in this browser.</li>
            <li>Works offline after the first visit.</li>
            <li>Free. No account or ads.</li>
          </ul>
        </div>
        <figure class="hero-art">
          <picture>
            <source srcset="/art/weekly-terrain.webp" type="image/webp" />
            <img src="/art/weekly-terrain.png" alt="Layered paper contour lines turn seven ridges into a calm weekly landscape." width="768" height="512" fetchpriority="high" decoding="async" />
          </picture>
          <figcaption>Read the shape of a week, not a daily score.</figcaption>
        </figure>
      </section>

      <section class="preview-section" aria-labelledby="preview-title">
        <div class="section-heading"><p class="eyebrow">The weekly map</p><h2 id="preview-title">Seven days stay in context</h2><p>Missing days stay blank. Averages use only the days you logged.</p></div>
        ${staticPreview()}
      </section>

      <section class="how-section" aria-labelledby="how-title">
        <div class="section-heading"><p class="eyebrow">How it works</p><h2 id="how-title">Turn entries into one review</h2></div>
        <ol class="trail-steps">
          <li><span>01</span><div><h3>Add daily totals</h3><p>Type calories and optional macros or weight. You can also import CSV.</p></div></li>
          <li><span>02</span><div><h3>Read the week</h3><p>Compare your logged-day average with the range you chose.</p></div></li>
          <li><span>03</span><div><h3>Keep your copy</h3><p>Export CSV or JSON. Print one week for your own records.</p></div></li>
        </ol>
      </section>

      <section class="limits-section" aria-labelledby="limits-title">
        <div><p class="eyebrow">A quiet boundary</p><h2 id="limits-title">You choose the range</h2></div>
        <div class="measure"><p>This tool does not set calorie targets, diagnose health, or judge a day. It does not include food search or coaching.</p><p>Delete or export your whole log from the review screen.</p></div>
      </section>
    </main>`);
}

function staticPreview(): string {
  const values = [1980, 2140, 1870, 2250, 2050, 0, 2080];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return `<div class="map-sheet preview-map" aria-label="Example week: six days logged, 2,062 calorie average, inside range">
    <div class="preview-summary"><div><span>Logged-day average</span><strong>2,062 <small>kcal</small></strong></div><span class="range-stamp inside">Inside range</span></div>
    <div class="preview-bars">${values.map((value, index) => `<div class="preview-day"><span class="bar bar-height-${index} ${value ? '' : 'missing'}"><i></i></span><strong>${days[index]}</strong><small>${value || 'Missing'}</small></div>`).join('')}</div>
  </div>`;
}

function infoPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  const heading = privacy ? 'Your log stays with you' : 'Use it as a reflection tool';
  setMetadata(`${privacy ? 'Privacy' : 'Terms'} — Calorie Week View`, privacy ? 'How Calorie Week View stores and protects your local data.' : 'Terms for using Calorie Week View.', `/${kind}`);
  return page(`<main id="main" class="prose-page contour-field"><p class="eyebrow">${privacy ? 'Privacy' : 'Terms'}</p><h1 tabindex="-1">${heading}</h1>
    ${privacy ? `
      <p class="lede">Calorie Week View stores your entries and settings in your browser.</p>
      <h2>What is stored</h2><p>Daily calories, optional macros, optional weight, notes, and your chosen range are stored in IndexedDB on this device.</p>
      <h2>What leaves your device</h2><p>The app sends no log data to us. It has no analytics, account system, ads, or third-party scripts.</p>
      <h2>Demo separation</h2><p>Demo data uses a separate browser database. The demo does not read or change your real log.</p>
      <h2>Your controls</h2><p>Export CSV or JSON from the review screen. Choose “Delete my log” to remove all stored entries and settings.</p>
      <h2>Contact</h2><p>Questions can go to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p>
    ` : `
      <p class="lede">Use Calorie Week View for personal record keeping.</p>
      <h2>No medical advice</h2><p>This tool does not provide medical advice, a diagnosis, or a calorie target. Ask a qualified professional about health decisions.</p>
      <h2>Your responsibility</h2><p>You choose what to enter and how to interpret it. Check imported data before relying on a weekly review.</p>
      <h2>Availability</h2><p>The software is provided without a warranty. Export a backup if your records matter to you.</p>
      <h2>License</h2><p>The source code is available under the MIT License.</p>
    `}
    <p class="legal-date">Effective August 28, 2026</p></main>`, kind);
}

function notFoundPage(): string {
  setMetadata('Page not found — Calorie Week View', 'Return to Calorie Week View.', '/404');
  return page(`<main id="main" class="not-found contour-field"><p class="elevation">Elevation — 404</p><h1 tabindex="-1">This trail ends here</h1><p>The page does not exist. Your saved log is unchanged.</p><a class="button primary" href="/" data-route="/">Return home</a></main>`);
}

function sampleRecords(): DayRecord[] {
  const start = startOfWeek(new Date());
  const samples: Array<[number, number, number, number, number, number | null, string]> = [
    [0, 1980, 112, 221, 68, 72.8, 'Lunch out'],
    [1, 2140, 126, 240, 71, 72.6, ''],
    [2, 1870, 103, 198, 64, null, 'Quiet day'],
    [3, 2250, 131, 256, 76, 72.5, 'Dinner with friends'],
    [4, 2050, 118, 226, 69, null, ''],
    [6, 2080, 122, 229, 70, 72.3, ''],
  ];
  return samples.map(([day, calories, protein, carbs, fat, weight, note]) => ({
    date: localISO(addDays(start, day)), calories, protein, carbs, fat, weight, note, updatedAt: Date.now(),
  }));
}

async function openReview(isDemo: boolean): Promise<void> {
  store?.close();
  demoMode = isDemo;
  store = new WeekStore(isDemo);
  records = await store.records();
  settings = await store.settings();
  if (isDemo && records.length === 0) {
    records = sampleRecords();
    await store.saveMany(records);
    settings = { ...DEFAULT_SETTINGS };
    await store.saveSettings(settings);
  }
  weekStart = startOfWeek(new Date());
  applyTheme();
}

function applyTheme(): void {
  if (settings.theme === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = settings.theme;
}

function reviewPage(): string {
  const slots = slotsForWeek(records, weekStart);
  const logged = slots.flatMap((slot) => slot.record ? [slot.record] : []);
  const averageCalories = average(logged.map((record) => record.calories));
  const status = rangeLabel(averageCalories, settings);
  const active = demoMode ? 'demo' : 'review';
  setMetadata(`${demoMode ? 'Demo' : 'Weekly review'} — Calorie Week View`, 'Review your seven-day calorie, macro, and weight pattern.', demoMode ? '/demo' : '/app');
  return page(`<main id="main" class="app-main">
    <section class="review-heading contour-field">
      <div><p class="eyebrow">${demoMode ? 'Sample week' : 'Your weekly map'}</p><h1 tabindex="-1">Review your calorie week</h1><p>Missing days stay blank and do not lower your average.</p></div>
      <div class="week-controls" aria-label="Choose a week"><button class="icon-button" data-action="previous-week" aria-label="Previous week">←</button><button class="week-label" data-action="this-week">${formatWeekRange(weekStart)}</button><button class="icon-button" data-action="next-week" aria-label="Next week">→</button></div>
    </section>

    <section class="summary-grid" aria-label="Weekly summary">
      <div class="summary-main"><span>Logged-day average</span><strong>${averageCalories === null ? '—' : Math.round(averageCalories).toLocaleString()} <small>${averageCalories === null ? '' : 'kcal'}</small></strong><span class="range-stamp ${status.startsWith('Inside') ? 'inside' : status.startsWith('No') ? 'neutral' : 'outside'}">${status}</span><small>${logged.length} of 7 days logged · range ${settings.calorieMin.toLocaleString()}–${settings.calorieMax.toLocaleString()}</small></div>
      ${macroSummary('Protein', logged, 'protein')}${macroSummary('Carbs', logged, 'carbs')}${macroSummary('Fat', logged, 'fat')}
    </section>

    <section class="map-sheet chart-section" aria-labelledby="calorie-chart-title">
      <div class="chart-heading"><div><p class="eyebrow">Contour 01</p><h2 id="calorie-chart-title">Calories across seven days</h2></div><div class="legend"><span class="range-key"></span>Your range</div></div>
      ${calorieChart(slots)}
    </section>

    <section class="map-sheet weight-section" aria-labelledby="weight-chart-title">
      <div class="chart-heading"><div><p class="eyebrow">Contour 02</p><h2 id="weight-chart-title">Optional weight trend</h2></div><span>${settings.weightUnit}</span></div>
      ${weightChart(slots)}
    </section>

    <section class="entries-section" aria-labelledby="entries-title">
      <div class="section-row"><div><p class="eyebrow">Field notes</p><h2 id="entries-title">Daily entries</h2></div><button class="button primary" data-action="add-entry">Add daily totals</button></div>
      ${entriesTable(slots)}
    </section>

    <section class="tools-section" aria-labelledby="tools-title"><div><p class="eyebrow">Your records</p><h2 id="tools-title">Import, export, or clear</h2></div>
      <div class="tool-groups">
        <div><h3>Bring in entries</h3><p>CSV needs date and calories columns. Macros, weight, and note are optional.</p><label class="button secondary file-button">Import CSV<input id="csv-input" type="file" accept=".csv,text/csv" /></label><label class="text-link file-button">Import JSON backup<input id="json-input" type="file" accept=".json,application/json" /></label><p class="import-note">JSON backups are checked before import. Invalid files leave your log unchanged.</p></div>
        <div><h3>Keep a copy</h3><p>CSV works in spreadsheets. JSON keeps entries and settings together.</p><button class="button secondary" data-action="export-csv">Export CSV</button><button class="text-button" data-action="export-json">Export JSON</button><button class="text-button" data-action="print-week">Print this week</button></div>
        <div><h3>Adjust the map</h3><p>Set your own calorie range, weight unit, and color theme.</p><button class="button secondary" data-action="open-settings">Change settings</button>${demoMode ? '<button class="danger-link" data-action="clear-demo">Clear demo records</button>' : '<button class="danger-link" data-action="delete-all">Delete my log</button>'}</div>
      </div>
    </section>
  </main>${dialogs()}`, active);
}

function macroSummary(label: string, values: DayRecord[], key: 'protein' | 'carbs' | 'fat'): string {
  const result = average(values.flatMap((record) => record[key] === null ? [] : [record[key]]));
  return `<div class="summary-macro"><span>${label} average</span><strong>${result === null ? '—' : `${Math.round(result)} g`}</strong><small>${result === null ? 'No values logged' : 'On logged values'}</small></div>`;
}

function calorieChart(slots: ReturnType<typeof slotsForWeek>): string {
  const max = Math.max(settings.calorieMax * 1.25, ...slots.map((slot) => slot.record?.calories ?? 0), 2500);
  const chartTop = 18;
  const chartBottom = 178;
  const chartHeight = chartBottom - chartTop;
  const y = (value: number) => chartBottom - (value / max) * chartHeight;
  const bandY = y(settings.calorieMax);
  const bandHeight = Math.max(4, y(settings.calorieMin) - bandY);
  const bars = slots.map((slot, index) => {
    const x = 50 + index * 72;
    const day = formatDay(slot.date);
    if (!slot.record) return `<g class="day-mark missing"><rect x="${x}" y="154" width="38" height="24" rx="4"/><path d="M${x + 8} 166h22"/><text x="${x + 19}" y="201" text-anchor="middle">${day.weekday}</text><text x="${x + 19}" y="216" text-anchor="middle">Missing</text></g>`;
    const barY = y(slot.record.calories);
    return `<g class="day-mark"><rect x="${x}" y="${barY}" width="38" height="${chartBottom - barY}" rx="4"/><text x="${x + 19}" y="${Math.max(13, barY - 6)}" text-anchor="middle">${slot.record.calories}</text><text x="${x + 19}" y="201" text-anchor="middle">${day.weekday}</text><text x="${x + 19}" y="216" text-anchor="middle">${day.date.replace(' ', ' ')}</text></g>`;
  }).join('');
  const summary = slots.map((slot) => `${formatDay(slot.date).weekday}: ${slot.record ? `${slot.record.calories} calories` : 'missing'}`).join('; ');
  return `<div class="chart-scroll" tabindex="0" role="region" aria-label="Scrollable calorie chart. Use arrow keys to scroll when needed."><svg class="calorie-chart trace-in" viewBox="0 0 560 230" role="img" aria-labelledby="calorie-svg-title calorie-svg-desc"><title id="calorie-svg-title">Daily calorie bars</title><desc id="calorie-svg-desc">${escapeHTML(summary)}. Chosen range is ${settings.calorieMin} to ${settings.calorieMax} calories.</desc><g class="grid-lines"><path d="M34 18v160h515"/><path d="M34 98h515"/><path d="M34 58h515"/><path d="M34 138h515"/></g><rect class="target-band" x="34" y="${bandY}" width="515" height="${bandHeight}"/><g class="bars">${bars}</g></svg></div>`;
}

function weightChart(slots: ReturnType<typeof slotsForWeek>): string {
  const points = slots.flatMap((slot, index) => slot.record?.weight === null || slot.record?.weight === undefined ? [] : [{ index, value: slot.record.weight, date: slot.date }]);
  if (points.length === 0) return `<div class="chart-empty"><span class="contour-mini" aria-hidden="true"></span><p>No weight values this week.</p><button class="text-button" data-action="add-entry">Add weight with a daily entry</button></div>`;
  const values = points.map((point) => point.value);
  const low = Math.min(...values) - 0.5;
  const high = Math.max(...values) + 0.5;
  const plotted = points.map((point) => ({ ...point, x: 48 + point.index * 74, y: 104 - ((point.value - low) / (high - low || 1)) * 72 }));
  const path = plotted.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const summary = plotted.map((point) => `${formatDay(point.date).weekday}: ${point.value} ${settings.weightUnit}`).join('; ');
  return `<div class="chart-scroll" tabindex="0" role="region" aria-label="Scrollable weight chart. Use arrow keys to scroll when needed."><svg class="weight-chart trace-in" viewBox="0 0 560 145" role="img" aria-labelledby="weight-svg-title weight-svg-desc"><title id="weight-svg-title">Weight trend</title><desc id="weight-svg-desc">${escapeHTML(summary)}</desc><path class="weight-line" d="${path}"/>${plotted.map((point) => `<g><circle cx="${point.x}" cy="${point.y}" r="6"/><text x="${point.x}" y="${point.y - 12}" text-anchor="middle">${point.value}</text><text x="${point.x}" y="132" text-anchor="middle">${formatDay(point.date).weekday}</text></g>`).join('')}</svg></div>`;
}

function entriesTable(slots: ReturnType<typeof slotsForWeek>): string {
  return `<div class="entries-table" role="table" aria-label="Daily totals"><div class="entry-row entry-header" role="row"><span role="columnheader">Day</span><span role="columnheader">Calories</span><span role="columnheader">Macros</span><span role="columnheader">Weight</span><span role="columnheader">Action</span></div>${slots.map((slot) => {
    const day = formatDay(slot.date);
    const record = slot.record;
    return `<div class="entry-row ${record ? '' : 'is-missing'}" role="row"><span role="cell"><strong>${day.weekday}</strong><small>${day.date}</small></span><span role="cell">${record ? record.calories.toLocaleString() : '<em>Missing</em>'}</span><span role="cell">${record ? macroLine(record) : '—'}</span><span role="cell">${record?.weight !== null && record?.weight !== undefined ? `${record.weight} ${settings.weightUnit}` : '—'}</span><span role="cell"><button class="text-button" data-action="edit-entry" data-date="${slot.date}">${record ? 'Edit' : 'Add'}</button></span>${record?.note ? `<span class="entry-note" role="cell">Note: ${escapeHTML(record.note)}</span>` : ''}</div>`;
  }).join('')}</div>`;
}

function macroLine(record: DayRecord): string {
  const parts = [['P', record.protein], ['C', record.carbs], ['F', record.fat]].filter(([, value]) => value !== null).map(([label, value]) => `${label} ${value}g`);
  return parts.length ? parts.join(' · ') : '—';
}

function dialogs(): string {
  return `<dialog id="entry-dialog" aria-labelledby="entry-dialog-title"><form id="entry-form" method="dialog"><div class="dialog-heading"><div><p class="eyebrow">Daily field note</p><h2 id="entry-dialog-title">Add daily totals</h2></div><button class="close-button" value="cancel" aria-label="Close entry form">×</button></div>
    <div class="form-grid"><label class="full">Date<input name="date" type="date" required /></label><label class="full">Calories<input name="calories" type="number" min="0" max="20000" step="1" inputmode="numeric" required /><span>Required</span></label><label>Protein (g)<input name="protein" type="number" min="0" max="1000" step="0.1" inputmode="decimal" /></label><label>Carbs (g)<input name="carbs" type="number" min="0" max="2000" step="0.1" inputmode="decimal" /></label><label>Fat (g)<input name="fat" type="number" min="0" max="1000" step="0.1" inputmode="decimal" /></label><label>Weight (${settings.weightUnit})<input name="weight" type="number" min="1" max="1500" step="0.1" inputmode="decimal" /></label><label class="full">Note <span>(optional)</span><textarea name="note" maxlength="200" rows="2"></textarea></label></div>
    <p id="entry-error" class="form-error" role="alert"></p><div class="dialog-actions"><button class="danger-link" type="button" data-action="delete-entry" hidden>Delete this entry</button><span></span><button class="button secondary" value="cancel">Cancel</button><button class="button primary" type="submit">Save daily totals</button></div></form></dialog>
    <dialog id="settings-dialog" aria-labelledby="settings-dialog-title"><form id="settings-form" method="dialog"><div class="dialog-heading"><div><p class="eyebrow">Map settings</p><h2 id="settings-dialog-title">Choose your range</h2></div><button class="close-button" value="cancel" aria-label="Close settings">×</button></div><p>Enter a range you already use. This tool does not suggest one.</p>
      <div class="form-grid"><label>Minimum calories<input name="calorieMin" type="number" min="0" max="20000" required value="${settings.calorieMin}" /></label><label>Maximum calories<input name="calorieMax" type="number" min="0" max="20000" required value="${settings.calorieMax}" /></label><label>Weight unit<select name="weightUnit"><option value="kg" ${settings.weightUnit === 'kg' ? 'selected' : ''}>Kilograms (kg)</option><option value="lb" ${settings.weightUnit === 'lb' ? 'selected' : ''}>Pounds (lb)</option></select></label><label>Color theme<select name="theme"><option value="system" ${settings.theme === 'system' ? 'selected' : ''}>Use device setting</option><option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option><option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option></select></label></div><p id="settings-error" class="form-error" role="alert"></p><div class="dialog-actions"><span></span><button class="button secondary" value="cancel">Cancel</button><button class="button primary" type="submit">Save settings</button></div></form></dialog>`;
}

async function renderRoute(focusHeading = false): Promise<void> {
  const path = routePath();
  const wantsDemo = path === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  if (path === '/app' || wantsDemo) {
    if (!store || demoMode !== wantsDemo) await openReview(wantsDemo);
    app.innerHTML = reviewPage();
  } else {
    demoMode = false;
    store?.close(); store = null;
    document.documentElement.removeAttribute('data-theme');
    if (path === '/') app.innerHTML = homePage();
    else if (path === '/privacy') app.innerHTML = infoPage('privacy');
    else if (path === '/terms') app.innerHTML = infoPage('terms');
    else app.innerHTML = notFoundPage();
  }
  bindPageEvents();
  if (focusHeading) {
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('h1');
      heading?.focus();
      const live = document.querySelector('#route-status');
      if (live && heading) live.textContent = heading.textContent;
    });
  }
}

function bindPageEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-route]').forEach((element) => element.addEventListener('click', (event) => {
    event.preventDefault(); navigate(element.dataset.route ?? '/');
  }));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach((element) => element.addEventListener('click', () => void handleAction(element)));
  document.querySelector<HTMLInputElement>('#csv-input')?.addEventListener('change', (event) => void importCSV(event));
  document.querySelector<HTMLInputElement>('#json-input')?.addEventListener('change', (event) => void importJSON(event));
  document.querySelector<HTMLFormElement>('#entry-form')?.addEventListener('submit', (event) => void saveEntry(event));
  document.querySelector<HTMLFormElement>('#settings-form')?.addEventListener('submit', (event) => void saveSettings(event));
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => dialog.addEventListener('close', () => returnFocus?.focus()));
}

async function handleAction(element: HTMLElement): Promise<void> {
  const action = element.dataset.action;
  if (action === 'previous-week' || action === 'next-week') {
    weekStart = addDays(weekStart, action === 'previous-week' ? -7 : 7); await refreshReview();
  } else if (action === 'this-week') { weekStart = startOfWeek(new Date()); await refreshReview(); }
  else if (action === 'add-entry') openEntry(localISO(new Date()));
  else if (action === 'edit-entry') openEntry(element.dataset.date ?? localISO(new Date()));
  else if (action === 'open-settings') openDialog('settings-dialog', element);
  else if (action === 'export-csv') download('calorie-week-view.csv', recordsToCSV(records), 'text/csv');
  else if (action === 'export-json') download('calorie-week-view-backup.json', JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), settings, records }, null, 2), 'application/json');
  else if (action === 'print-week') window.print();
  else if (action === 'delete-entry') await deleteEntry();
  else if (action === 'delete-all') await deleteAll();
  else if (action === 'clear-demo') await clearDemo();
  else if (action === 'reset-demo') await resetDemo();
}

function openDialog(id: string, trigger: HTMLElement): void {
  returnFocus = trigger;
  document.querySelector<HTMLDialogElement>(`#${id}`)?.showModal();
}

function openEntry(date: string): void {
  const dialog = document.querySelector<HTMLDialogElement>('#entry-dialog');
  const form = document.querySelector<HTMLFormElement>('#entry-form');
  if (!dialog || !form) return;
  returnFocus = document.activeElement as HTMLElement;
  const record = records.find((item) => item.date === date);
  const set = (name: string, value: string | number | null) => {
    const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
    field.value = value === null ? '' : String(value);
  };
  set('date', date); set('calories', record?.calories ?? ''); set('protein', record?.protein ?? '');
  set('carbs', record?.carbs ?? ''); set('fat', record?.fat ?? ''); set('weight', record?.weight ?? ''); set('note', record?.note ?? '');
  const title = dialog.querySelector('#entry-dialog-title');
  if (title) title.textContent = record ? 'Edit daily totals' : 'Add daily totals';
  const deleteButton = dialog.querySelector<HTMLButtonElement>('[data-action="delete-entry"]');
  if (deleteButton) { deleteButton.hidden = !record; deleteButton.dataset.date = date; }
  dialog.showModal();
  (form.elements.namedItem('calories') as HTMLInputElement).focus();
}

function optionalFormNumber(data: FormData, name: string): number | null {
  const value = String(data.get(name) ?? '').trim();
  return value ? Number(value) : null;
}

async function saveEntry(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!store) return;
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const record: DayRecord = {
    date: String(data.get('date')), calories: Number(data.get('calories')),
    protein: optionalFormNumber(data, 'protein'), carbs: optionalFormNumber(data, 'carbs'), fat: optionalFormNumber(data, 'fat'),
    weight: optionalFormNumber(data, 'weight'), note: String(data.get('note') ?? '').trim().slice(0, 200), updatedAt: Date.now(),
  };
  await store.save(record);
  records = await store.records();
  document.querySelector<HTMLDialogElement>('#entry-dialog')?.close();
  weekStart = startOfWeek(parseLocalDate(record.date));
  await refreshReview(`Saved totals for ${formatDay(record.date).date}.`);
}

async function saveSettings(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!store) return;
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const minimum = Number(data.get('calorieMin'));
  const maximum = Number(data.get('calorieMax'));
  const error = document.querySelector('#settings-error');
  if (maximum <= minimum) {
    if (error) error.textContent = 'The maximum must be higher than the minimum. Change one value.';
    return;
  }
  settings = { calorieMin: minimum, calorieMax: maximum, weightUnit: data.get('weightUnit') as Settings['weightUnit'], theme: data.get('theme') as Settings['theme'] };
  await store.saveSettings(settings); applyTheme();
  document.querySelector<HTMLDialogElement>('#settings-dialog')?.close();
  await refreshReview('Saved your settings.');
}

async function deleteEntry(): Promise<void> {
  const button = document.querySelector<HTMLButtonElement>('[data-action="delete-entry"]');
  const date = button?.dataset.date;
  if (!date || !store || !window.confirm(`Delete the entry for ${formatDay(date).date}?`)) return;
  await store.delete(date); records = await store.records();
  document.querySelector<HTMLDialogElement>('#entry-dialog')?.close();
  await refreshReview(`Deleted the entry for ${formatDay(date).date}.`);
}

async function deleteAll(): Promise<void> {
  if (!store || !window.confirm(`Delete all ${records.length} entries and reset your settings? This cannot be undone.`)) return;
  await store.clear(); records = []; settings = { ...DEFAULT_SETTINGS }; applyTheme();
  await refreshReview('Deleted your log and reset your settings.');
}

async function resetDemo(): Promise<void> {
  if (!store) return;
  await store.clear(); records = sampleRecords(); settings = { ...DEFAULT_SETTINGS };
  await store.saveMany(records); await store.saveSettings(settings); weekStart = startOfWeek(new Date());
  await refreshReview('Reset the demo to its sample week.');
}

async function clearDemo(): Promise<void> {
  if (!store || !window.confirm(`Clear all ${records.length} demo entries? Use Reset demo to restore them.`)) return;
  await store.clear(); records = []; settings = { ...DEFAULT_SETTINGS }; applyTheme();
  await refreshReview('Cleared all demo records.');
}

async function importCSV(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !store) return;
  try {
    const imported = parseCSV(await file.text());
    await store.saveMany(imported); records = await store.records();
    weekStart = startOfWeek(parseLocalDate(imported[0].date));
    await refreshReview(`Imported ${imported.length} ${imported.length === 1 ? 'entry' : 'entries'} from CSV.`);
  } catch (error) {
    showToast(error instanceof Error ? `${error.message} Fix the file and import it again.` : 'The CSV could not be read. Fix the file and import it again.', true);
  }
  input.value = '';
}

async function importJSON(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !store) return;
  try {
    const backup = parseJSONBackup(JSON.parse(await file.text()));
    await store.saveMany(backup.records);
    if (backup.settings) { settings = backup.settings; await store.saveSettings(settings); }
    records = await store.records();
    if (backup.records.length) weekStart = startOfWeek(parseLocalDate(backup.records[0].date));
    applyTheme();
    await refreshReview(`Imported ${backup.records.length} ${backup.records.length === 1 ? 'entry' : 'entries'} from the backup.`);
  } catch (error) {
    showToast(error instanceof Error ? `${error.message} Choose a JSON backup exported by this app.` : 'The backup could not be read. Choose a JSON backup exported by this app.', true);
  }
  input.value = '';
}

function download(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Downloaded ${filename}.`);
}

async function refreshReview(message?: string): Promise<void> {
  app.innerHTML = reviewPage(); bindPageEvents();
  if (message) requestAnimationFrame(() => showToast(message));
}

function showToast(message: string, error = false): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message; toast.classList.toggle('error', error); toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 4500);
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.');
        });
      });
    }).catch(() => showToast('Offline setup did not finish. Reload while online to try again.', true));
  });
}

window.addEventListener('popstate', () => void renderRoute(true));
void renderRoute();
registerServiceWorker();
