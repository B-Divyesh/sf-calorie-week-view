import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticWebAppsConfig = {
  routes?: Array<{ route: string; rewrite?: string }>;
  navigationFallback?: unknown;
  responseOverrides?: Record<string, { rewrite?: string }>;
};

type PackageManifest = { version: string };
type WebManifest = { start_url: string };

describe('static deployment routing', () => {
  it('rewrites only known app routes and preserves a real 404 response @regression:real-404', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as StaticWebAppsConfig;
    const appRoutes = ['/', '/app', '/demo', '/privacy', '/terms'];
    expect(config.navigationFallback).toBeUndefined();
    expect(appRoutes.every((route) => config.routes?.some((rule) => rule.route === route && rule.rewrite === '/index.html'))).toBe(true);
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
  });

  it('keeps the installed app and offline cache on the current release', () => {
    const packageManifest = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as PackageManifest;
    const webManifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public/manifest.webmanifest'), 'utf8')) as WebManifest;
    const appSource = readFileSync(resolve(process.cwd(), 'src/main.ts'), 'utf8');
    const serviceWorker = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');
    expect(packageManifest.version).toBe('1.0.6');
    expect(webManifest.start_url).toBe('/app?v=1.0.6');
    expect(appSource).toContain("const BUILD_ID = '1.0.6'");
    expect(serviceWorker).toContain("const CACHE_NAME = 'calorie-week-view-v1.0.8'");
  });
});
