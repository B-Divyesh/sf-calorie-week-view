import { describe, expect, it } from 'vitest';
import { average, parseCSV, rangeLabel, recordsToCSV, slotsForWeek } from './week';
import { DEFAULT_SETTINGS } from './types';
import { parseJSONBackup } from './backup';

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

  it('rejects invalid optional numeric values instead of silently dropping them', () => {
    expect(() => parseCSV('date,calories,protein,weight\n2026-08-24,2050,-5,not-a-number'))
      .toThrow('Row 2 has an invalid protein value');
    expect(() => parseCSV('date,calories,protein,weight\n2026-08-24,2050,120,not-a-number'))
      .toThrow('Row 2 has an invalid weight value');
  });

  it('round trips records through export', () => {
    const records = parseCSV('date,calories,note\n2026-08-24,2050,"Dinner, out"');
    expect(parseCSV(recordsToCSV(records))[0]).toMatchObject({ date: '2026-08-24', calories: 2050, note: 'Dinner, out' });
  });
});

describe('JSON backups', () => {
  const validBackup = {
    settings: { calorieMin: 1800, calorieMax: 2200, weightUnit: 'kg', theme: 'system' },
    records: [{ date: '2026-08-24', calories: 2050, protein: 120, carbs: 225, fat: 70, weight: 72.5, note: 'Dinner', updatedAt: 1 }],
  };

  it('accepts the complete shape exported by the app', () => {
    expect(parseJSONBackup(validBackup)).toEqual(validBackup);
  });

  it('rejects invalid recovery values before they can reach IndexedDB @regression:json-backup-validation', () => {
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], date: '2026-02-31' }] })).toThrow('Entry 1 has an invalid date');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], protein: -5 }] })).toThrow('Entry 1 has an invalid protein');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], carbs: Number.NaN }] })).toThrow('Entry 1 has an invalid carbs');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], fat: 999_999_999 }] })).toThrow('Entry 1 has an invalid fat');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], weight: -2 }] })).toThrow('Entry 1 has an invalid weight');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], note: 10 }] })).toThrow('Entry 1 has an invalid note');
    expect(() => parseJSONBackup({ ...validBackup, records: [{ ...validBackup.records[0], updatedAt: -1 }] })).toThrow('Entry 1 has an invalid updated time');
    expect(() => parseJSONBackup({ ...validBackup, settings: { ...validBackup.settings, calorieMin: 2500, calorieMax: 2000 } })).toThrow('Backup settings have an invalid calorie range');
    expect(() => parseJSONBackup({ ...validBackup, settings: { ...validBackup.settings, weightUnit: 'stone' } })).toThrow('Backup settings have an invalid weight unit');
    expect(() => parseJSONBackup({ ...validBackup, settings: { ...validBackup.settings, theme: 'chartreuse' } })).toThrow('Backup settings have an invalid color theme');
  });
});
