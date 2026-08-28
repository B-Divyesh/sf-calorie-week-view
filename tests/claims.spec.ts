import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('works offline after the first visit @claim:offline-reload', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Review your calorie week' })).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, null, { timeout: 15_000 }).catch(async () => {
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  });
  await page.waitForFunction(async () => {
    const script = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    const stylesheet = document.querySelector<HTMLLinkElement>('link[rel="stylesheet"]')?.href;
    return Boolean(script && stylesheet && await caches.match(script) && await caches.match(stylesheet));
  });
  await context.setOffline(true);
  await page.goto(page.url());
  await expect(page.getByRole('heading', { name: 'Review your calorie week' })).toBeVisible();
  await expect(page.getByText('2,062 kcal')).toBeVisible();
});

test('exports the sample log as CSV @claim:csv-export', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  if (!stream) throw new Error('CSV download stream was not available.');
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv.split('\n')[0]).toBe('date,calories,protein_g,carbs_g,fat_g,weight,note');
  expect(csv.split('\n')).toHaveLength(7);
  expect(csv).toContain('Dinner with friends');
});

test('exports entries and settings as JSON @claim:json-export', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  if (!stream) throw new Error('JSON download stream was not available.');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(backup.settings).toMatchObject({ calorieMin: 1800, calorieMax: 2200 });
  expect(backup.records).toHaveLength(6);
});

test('opens the browser print flow for one week @claim:print-week', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'print', { value: () => { document.documentElement.dataset.printCalled = 'yes'; } });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Print this week' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-called', 'yes');
});

test('imports CSV entries and shows them in a week @claim:csv-import', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-input').setInputFiles({
    name: 'week.csv', mimeType: 'text/csv',
    buffer: Buffer.from('date,calories,protein,carbs,fat,weight,note\n2026-08-17,2300,125,250,78,72.1,Imported day'),
  });
  await expect(page.getByText('Imported 1 entry from CSV.')).toBeVisible();
  await expect(page.getByRole('cell', { name: '2,300' })).toBeVisible();
  await expect(page.getByText('Note: Imported day')).toBeVisible();
});

test('keeps demo traffic and storage local @claim:local-private', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add daily totals' }).first().click();
  const dialog = page.getByRole('dialog', { name: /daily totals/i });
  await dialog.getByLabel('Calories').fill('2010');
  await dialog.getByRole('button', { name: 'Save daily totals' }).click();
  const names = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(names).toContain('demo:calorie-week-view');
  expect(names).not.toContain('calorie-week-view');
  expect(externalRequests).toEqual([]);
});

test('uses logged days only for the weekly average @claim:logged-day-average', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('2,062 kcal')).toBeVisible();
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
  await expect(page.getByText('Inside your range')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Optional weight trend' })).toBeVisible();
  await expect(page.getByText('119 g')).toBeVisible();
});

test('is free and has no account gate @claim:free-no-account', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved to your log.')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
});

test('saves a chosen range and dark theme @claim:settings-choice', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Change settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose your range' });
  await dialog.getByLabel('Minimum calories').fill('1900');
  await dialog.getByLabel('Maximum calories').fill('2300');
  await dialog.getByLabel('Color theme').selectOption('dark');
  await dialog.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByText('range 1,900–2,300')).toBeVisible();
});

test('clears every local record @claim:delete-log', async ({ page }) => {
  await page.goto('/demo');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear demo records' }).click();
  await expect(page.getByText('Cleared all demo records.')).toBeVisible();
  await expect(page.getByText('0 of 7 days logged')).toBeVisible();
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  const homeResults = await new AxeBuilder({ page }).analyze();
  expect(homeResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.goto('/demo');
  const demoResults = await new AxeBuilder({ page }).analyze();
  expect(demoResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const darkResults = await new AxeBuilder({ page }).analyze();
  expect(darkResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('keeps route titles, landmarks, links, and console clean', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const routes = [
    ['/', 'Calorie Week View — Review a week at once'],
    ['/demo', 'Demo — Calorie Week View'],
    ['/app', 'Weekly review — Calorie Week View'],
    ['/privacy', 'Privacy — Calorie Week View'],
    ['/terms', 'Terms — Calorie Week View'],
    ['/not-a-route', 'Page not found — Calorie Week View'],
  ];
  for (const [route, title] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const brokenInternalLinks = await page.locator('a[href]').evaluateAll(async (links) => {
      const paths = [...new Set(links.map((link) => (link as HTMLAnchorElement).href).filter((href) => new URL(href).origin === location.origin))];
      const results = await Promise.all(paths.map(async (href) => ({ href, ok: (await fetch(href)).ok })));
      return results.filter((result) => !result.ok);
    });
    expect(brokenInternalLinks).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('supports a 390px keyboard entry path @claim:manual-entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add daily totals' }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Calories Required' }).fill('1995');
  await page.getByRole('button', { name: 'Save daily totals' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Saved totals for/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
