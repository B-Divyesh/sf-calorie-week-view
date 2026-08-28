import { describe, expect, it } from 'vitest';
import { average, parseCSV, rangeLabel, recordsToCSV, slotsForWeek } from './week';
import { DEFAULT_SETTINGS } from './types';

describe('weekly calculations', () => {
  it('averages only supplied values', () => {
    expect(average([1980, 2140, 1870])).toBeCloseTo(1996.67, 1);
    expect(average([])).toBeNull();
  });

  it('labels the chosen range without prescribing one', () => {
    expect(rangeLabel(2000, DEFAULT_SETTINGS)).toBe('Inside your range');
    expect(rangeLabel(1700, DEFAULT_SETTINGS)).toBe('Below your range');
    expect(rangeLabel(2300, DEFAULT_SETTINGS)).toBe('Above your range');
  });

  it('keeps missing dates as empty slots', () => {
    const records = parseCSV('date,calories\n2026-08-24,2000\n2026-08-26,2100');
    const slots = slotsForWeek(records, new Date(2026, 7, 24, 12));
    expect(slots).toHaveLength(7);
    expect(slots[1].record).toBeUndefined();
    expect(slots[2].record?.calories).toBe(2100);
  });
});

describe('CSV', () => {
  it('imports common headings and quoted notes', () => {
    const records = parseCSV('date,kcal,protein,carbs,fat,weight,note\n2026-08-24,2050,120,225,70,72.5,"Dinner, out"');
    expect(records[0]).toMatchObject({ date: '2026-08-24', calories: 2050, protein: 120, note: 'Dinner, out' });
  });

  it('rejects files without required columns', () => {
    expect(() => parseCSV('day,protein\n2026-08-24,120')).toThrow('date and calories');
  });

  it('round trips records through export', () => {
    const records = parseCSV('date,calories,note\n2026-08-24,2050,"Dinner, out"');
    expect(parseCSV(recordsToCSV(records))[0]).toMatchObject({ date: '2026-08-24', calories: 2050, note: 'Dinner, out' });
  });
});
