import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticWebAppsConfig = {
  routes?: Array<{ route: string; rewrite?: string }>;
  navigationFallback?: unknown;
  responseOverrides?: Record<string, { rewrite?: string }>;
};

describe('static deployment routing', () => {
  it('rewrites only known app routes and preserves a real 404 response @regression:real-404', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as StaticWebAppsConfig;
    const appRoutes = ['/', '/app', '/demo', '/privacy', '/terms'];
    expect(config.navigationFallback).toBeUndefined();
    expect(appRoutes.every((route) => config.routes?.some((rule) => rule.route === route && rule.rewrite === '/index.html'))).toBe(true);
    expect(config.responseOverrides?.['404']?.rewrite).toBe('/404.html');
  });
});
