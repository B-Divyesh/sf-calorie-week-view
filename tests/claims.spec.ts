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
    const cache = await caches.open('calorie-week-view-v1.0.4');
    return Boolean(script && stylesheet && await cache.match(script, { ignoreVary: true }) && await cache.match(stylesheet, { ignoreVary: true }) && await cache.match('/demo', { ignoreVary: true }));
  });
  await context.setOffline(true);
  await page.reload();
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

test('loads no ads, analytics, or third-party scripts @claim:no-ads-tracking-third-party', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add daily totals' }).first().click();
  await page.getByRole('spinbutton', { name: 'Calories Required' }).fill('2010');
  await page.getByRole('button', { name: 'Save daily totals' }).click();
  const externalResources = await page.evaluate(() => [...document.querySelectorAll('script[src], img[src], iframe[src], link[rel="stylesheet"][href], link[rel="preload"][href], link[rel="manifest"][href]')]
    .map((node) => (node as HTMLScriptElement | HTMLImageElement | HTMLIFrameElement | HTMLLinkElement).src || (node as HTMLLinkElement).href)
    .filter((url) => url && new URL(url).origin !== location.origin));
  expect(externalRequests).toEqual([]);
  expect(externalResources).toEqual([]);
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

test('saves a chosen range, weight unit, and dark theme @claim:settings-choice', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Change settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose your range' });
  await dialog.getByLabel('Minimum calories').fill('1900');
  await dialog.getByLabel('Maximum calories').fill('2300');
  await dialog.getByLabel('Weight unit').selectOption('lb');
  await dialog.getByLabel('Color theme').selectOption('dark');
  await dialog.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByText('range 1,900–2,300')).toBeVisible();
  await expect(page.getByRole('cell', { name: '160.5 lb' })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByText('range 1,900–2,300')).toBeVisible();
  await expect(page.getByRole('cell', { name: '160.5 lb' })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => new Promise<Record<string, unknown>>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('settings', 'readonly');
      const value = transaction.objectStore('settings').get('main');
      value.onsuccess = () => resolve(value.result);
      value.onerror = () => reject(value.error);
    };
  }))).toMatchObject({ calorieMin: 1900, calorieMax: 2300, weightUnit: 'lb', theme: 'dark' });
  await page.getByRole('button', { name: 'Add daily totals' }).first().click();
  await expect(page.getByLabel('Weight (lb)')).toBeVisible();
  await page.getByRole('button', { name: 'Close entry form' }).click();
});

test('uses the calorie range chosen by the person reviewing it @claim:user-chosen-range', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Change settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose your range' });
  await expect(dialog.getByText('Enter a range you already use. This tool does not suggest one.')).toBeVisible();
  await dialog.getByLabel('Minimum calories').fill('1950');
  await dialog.getByLabel('Maximum calories').fill('2350');
  await dialog.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('range 1,950–2,350')).toBeVisible();
  await expect(page.getByText('Inside your range')).toBeVisible();
});

test('shows daily totals without a score or judgement @claim:no-daily-score', async ({ page }) => {
  await page.goto('/demo');
  const rows = page.locator('.entry-row[role="row"]');
  await expect(rows).toHaveCount(8);
  for (const rowText of await rows.allTextContents()) expect(rowText).not.toMatch(/score|grade|judg(e|ment)/i);
  await expect(page.getByRole('button', { name: /score|grade|judg(e|ment)/i })).toHaveCount(0);
});

test('exposes no food search or coaching flow @claim:no-food-search-or-coaching', async ({ page }) => {
  for (const route of ['/', '/demo', '/app', '/privacy', '/terms']) {
    await page.goto(route);
    await expect(page.getByRole('search')).toHaveCount(0);
    await expect(page.locator('input[type="search"], [role="searchbox"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /food search|search foods|coach|coaching/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /food search|search foods|coach|coaching/i })).toHaveCount(0);
  }
});

test('shows a medical boundary without advice controls @claim:no-medical-advice', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: 'No medical advice' })).toBeVisible();
  await expect(page.getByText('This tool does not provide medical advice, a diagnosis, or a calorie target.')).toBeVisible();
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: /advice|diagnos|recommend/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /advice|diagnos|recommend/i })).toHaveCount(0);
});

test('imports entries and settings from a JSON backup @claim:json-import', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#json-input').setInputFiles({
    name: 'backup.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      settings: { calorieMin: 1900, calorieMax: 2300, weightUnit: 'lb', theme: 'dark' },
      records: [{ date: '2026-08-17', calories: 2300, protein: 125, carbs: 250, fat: 78, weight: 160, note: 'Restored day', updatedAt: 1 }],
    })),
  });
  await expect(page.getByText('Imported 1 entry from the backup.')).toBeVisible();
  await expect(page.getByRole('cell', { name: '2,300' })).toBeVisible();
  await expect(page.getByText('range 1,900–2,300')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Add daily totals' }).first().click();
  await expect(page.getByLabel('Weight (lb)')).toBeVisible();
});

test('rejects invalid JSON backups without changing the log @claim:json-import-validation', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#json-input').setInputFiles({
    name: 'impossible-date.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      settings: { calorieMin: 1800, calorieMax: 2200, weightUnit: 'kg', theme: 'system' },
      records: [{ date: '2026-02-31', calories: 2300, protein: null, carbs: null, fat: null, weight: null, note: '', updatedAt: 1 }],
    })),
  });
  await expect(page.getByText(/Entry 1 has an invalid date/)).toBeVisible();
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
  await page.locator('#json-input').setInputFiles({
    name: 'bad-settings.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({
      settings: { calorieMin: 2500, calorieMax: 2000, weightUnit: 'stone', theme: 'chartreuse' },
      records: [{ date: '2026-08-17', calories: 2300, protein: null, carbs: null, fat: null, weight: null, note: '', updatedAt: 1 }],
    })),
  });
  await expect(page.getByText(/Backup settings have an invalid calorie range/)).toBeVisible();
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
  await expect(page.getByText('range 1,800–2,200')).toBeVisible();
  await expect(page.getByRole('cell', { name: '2,300' })).toHaveCount(0);
});

test('clears every local record @claim:delete-log', async ({ page }) => {
  await page.goto('/demo');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear demo records' }).click();
  await expect(page.getByText('Cleared all demo records.')).toBeVisible();
  await expect(page.getByText('0 of 7 days logged')).toBeVisible();
});

test('has no serious accessibility violations at desktop and 390px mobile', async ({ page }) => {
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(mobileResults.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
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

test('supports a 390px keyboard entry path with optional fields @claim:manual-entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add daily totals' }).first().focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('spinbutton', { name: 'Calories Required' }).fill('1995');
  await page.getByLabel('Protein (g)').fill('110');
  await page.getByLabel('Carbs (g)').fill('220');
  await page.getByLabel('Fat (g)').fill('65');
  await page.getByLabel('Weight (kg)').fill('72.4');
  await page.getByLabel(/Note/).fill('Keyboard note');
  await page.getByRole('button', { name: 'Save daily totals' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Saved totals for/)).toBeVisible();
  await expect(page.getByText('P 110g · C 220g · F 65g')).toBeVisible();
  await expect(page.getByRole('cell', { name: '72.4 kg' })).toBeVisible();
  await expect(page.getByText('Note: Keyboard note')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('successful week, entry, and settings changes keep keyboard focus @regression:successful-action-focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');

  await page.getByRole('button', { name: 'Previous week' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('0 of 7 days logged')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous week' })).toBeFocused();

  await page.locator('[data-action="this-week"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
  await expect(page.locator('[data-action="this-week"]')).toBeFocused();

  const missingAdd = page.locator('.entry-row.is-missing').getByRole('button', { name: 'Add' });
  await missingAdd.focus();
  await page.keyboard.press('Enter');
  const entryDialog = page.getByRole('dialog', { name: 'Add daily totals' });
  const savedDate = await entryDialog.getByLabel('Date').inputValue();
  await entryDialog.getByRole('spinbutton', { name: 'Calories Required' }).fill('2000');
  await entryDialog.getByRole('button', { name: 'Save daily totals' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('7 of 7 days logged')).toBeVisible();
  await expect(page.locator(`[data-action="edit-entry"][data-date="${savedDate}"]`)).toBeFocused();

  await page.getByRole('button', { name: 'Change settings' }).focus();
  await page.keyboard.press('Enter');
  const settingsDialog = page.getByRole('dialog', { name: 'Choose your range' });
  await settingsDialog.getByLabel('Minimum calories').fill('1900');
  await settingsDialog.getByLabel('Maximum calories').fill('2300');
  await settingsDialog.getByRole('button', { name: 'Save settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('range 1,900–2,300')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Change settings' })).toBeFocused();
});

test('the static 404 uses the standard shell and literal copy @regression:404-shell', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/404.html');
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('makes mobile chart scrollers, import controls, and footer links visibly keyboard reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const chart = page.locator('.chart-scroll').first();
  await chart.focus();
  await expect(chart).toBeFocused();
  await expect(chart).toHaveCSS('outline-style', 'solid');
  const csvInput = page.locator('#csv-input');
  await csvInput.focus();
  await expect(page.locator('label.file-button').first()).toHaveCSS('outline-style', 'solid');
  for (const link of await page.locator('.site-footer nav a').all()) {
    const box = await link.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect((await page.locator('.wordmark').boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test('reports invalid optional CSV cells and leaves the log unchanged', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-input').setInputFiles({
    name: 'bad-optional.csv', mimeType: 'text/csv',
    buffer: Buffer.from('date,calories,protein,weight\n2026-08-17,2300,-5,not-a-number'),
  });
  await expect(page.getByText(/Row 2 has an invalid protein value/)).toBeVisible();
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
});

test('Cancel and close leave both forms unchanged and restore focus @regression:dialog-cancel', async ({ page }) => {
  await page.goto('/demo');
  const missingAdd = page.locator('.entry-row.is-missing').getByRole('button', { name: 'Add' });

  await missingAdd.click();
  const entryDialog = page.getByRole('dialog', { name: 'Add daily totals' });
  const missingDate = await entryDialog.getByLabel('Date').inputValue();
  await entryDialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(entryDialog).toBeHidden();
  await expect(missingAdd).toBeFocused();

  await missingAdd.click();
  await entryDialog.getByRole('spinbutton', { name: 'Calories Required' }).fill('2111');
  await entryDialog.getByRole('button', { name: 'Close entry form' }).click();
  await expect(entryDialog).toBeHidden();
  await expect(missingAdd).toBeFocused();
  expect(await page.evaluate(async (date) => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result.transaction('days', 'readonly').objectStore('days').get(date);
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    };
  }), missingDate)).toBeUndefined();

  const settingsTrigger = page.getByRole('button', { name: 'Change settings' });
  for (const closeName of ['Cancel', 'Close settings']) {
    await settingsTrigger.click();
    const settingsDialog = page.getByRole('dialog', { name: 'Choose your range' });
    await settingsDialog.getByLabel('Minimum calories').fill(closeName === 'Cancel' ? '1111' : '1234');
    await settingsDialog.getByLabel('Maximum calories').fill(closeName === 'Cancel' ? '2222' : '2345');
    await settingsDialog.getByRole('button', { name: closeName }).click();
    await expect(settingsDialog).toBeHidden();
    await expect(settingsTrigger).toBeFocused();
  }
  await expect(page.getByText('range 1,800–2,200')).toBeVisible();
  expect(await page.evaluate(async () => new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result.transaction('settings', 'readonly').objectStore('settings').get('main');
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    };
  }))).toMatchObject({ calorieMin: 1800, calorieMax: 2200 });
});

test('Start for real discards the demo database and reseeds a later demo @regression:demo-exit-discard', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Change settings' }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose your range' });
  await dialog.getByLabel('Minimum calories').fill('1234');
  await dialog.getByLabel('Maximum calories').fill('2345');
  await dialog.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('range 1,234–2,345')).toBeVisible();
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      (window as Window & { demoObserver?: IDBDatabase }).demoObserver = request.result;
      resolve();
    };
  }));

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText('0 of 7 days logged')).toBeVisible();
  expect(await page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const database = (window as Window & { demoObserver?: IDBDatabase }).demoObserver;
    if (!database) return reject(new Error('The observer database was not retained.'));
    const result = database.transaction('days', 'readonly').objectStore('days').count();
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error);
  }))).toBe(0);
  await page.evaluate(() => {
    (window as Window & { demoObserver?: IDBDatabase }).demoObserver?.close();
    delete (window as Window & { demoObserver?: IDBDatabase }).demoObserver;
  });
  await expect.poll(() => page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name))).not.toContain('demo:calorie-week-view');

  await page.goto('/demo');
  await expect(page.getByText('range 1,800–2,200')).toBeVisible();
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
});

test('every interactive target is at least 44 by 44 CSS pixels at 390px @regression:mobile-target-size', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
    await page.goto(route);
    const undersized = await page.locator('a[href], button, input, select, textarea, [tabindex="0"]').evaluateAll((elements) => elements.flatMap((element) => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || element.closest('dialog:not([open])')) return [];
      const box = element.getBoundingClientRect();
      return box.width < 44 || box.height < 44
        ? [{ label: element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('name'), width: box.width, height: box.height }]
        : [];
    }));
    expect(undersized, `${route} has undersized interactive targets`).toEqual([]);
  }

  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add daily totals' }).click();
  const dialogTargets = await page.getByRole('dialog').locator('button, input, select, textarea').evaluateAll((elements) => elements.flatMap((element) => {
    if (getComputedStyle(element).display === 'none' || (element as HTMLElement).hidden) return [];
    const box = element.getBoundingClientRect();
    return box.width < 44 || box.height < 44 ? [{ name: element.getAttribute('name') || element.textContent, width: box.width, height: box.height }] : [];
  }));
  expect(dialogTargets).toEqual([]);
});

test('rejects every oversized CSV field without partial writes @regression:csv-record-bounds', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('#csv-input').setInputFiles({
    name: 'oversized.csv', mimeType: 'text/csv',
    buffer: Buffer.from('date,calories,protein,carbs,fat,weight\n2026-08-17,1999,100,200,70,72\n2026-08-18,20001,1001,2001,1001,1501'),
  });
  await expect(page.getByText(/Row 3 has invalid calories.*20,000/)).toBeVisible();
  expect(await page.evaluate(async () => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result.transaction('days', 'readonly').objectStore('days').count();
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    };
  }))).toBe(6);
  await expect(page.getByText('6 of 7 days logged')).toBeVisible();
});

test('changing weight units converts display while preserving stored meaning @regression:weight-unit-conversion', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('cell', { name: '72.8 kg' })).toBeVisible();
  await page.getByRole('button', { name: 'Change settings' }).click();
  const settingsDialog = page.getByRole('dialog', { name: 'Choose your range' });
  await settingsDialog.getByLabel('Weight unit').selectOption('lb');
  await settingsDialog.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByRole('cell', { name: '160.5 lb' })).toBeVisible();

  const stored = await page.evaluate(async () => new Promise<Record<string, unknown>>((resolve, reject) => {
    const request = indexedDB.open('demo:calorie-week-view');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('days', 'readonly');
      const result = transaction.objectStore('days').getAll();
      result.onsuccess = () => resolve(result.result.find((record) => record.weight === 72.8));
      result.onerror = () => reject(result.error);
    };
  }));
  expect(stored).toMatchObject({ weight: 72.8, weightUnit: 'kg' });

  await page.getByRole('cell', { name: '160.5 lb' }).locator('..').getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByLabel('Weight (lb)')).toHaveValue('160.5');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.reload();
  await expect(page.getByRole('cell', { name: '160.5 lb' })).toBeVisible();
});
