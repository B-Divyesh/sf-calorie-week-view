import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Claim = { id: string; test: string };

describe('public-claims contract', () => {
  it('maps every declared claim to one exact browser-test selector @regression:claim-selector-isolation', () => {
    const root = process.cwd();
    const claims = JSON.parse(readFileSync(resolve(root, '.factory/claims.json'), 'utf8')) as Claim[];
    const browserTests = readFileSync(resolve(root, 'tests/claims.spec.ts'), 'utf8');
    const ids = claims.map((claim) => claim.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const claim of claims) {
      expect(claim.test).toBe(`npm test -- --grep '^.*@claim:${claim.id}$'`);
      const tags = browserTests.match(new RegExp(`@claim:${claim.id}(?![\\w-])`, 'g')) ?? [];
      expect(tags).toHaveLength(1);
    }
  });
});
