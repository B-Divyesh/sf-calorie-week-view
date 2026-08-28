import type { DayRecord, Settings } from './types';
import { localISO, parseLocalDate } from './week';

export type CalorieWeekBackup = {
  records: DayRecord[];
  settings?: Settings;
};

type BackupObject = Record<string, unknown>;

const isObject = (value: unknown): value is BackupObject => typeof value === 'object' && value !== null && !Array.isArray(value);

function invalidRecord(index: number, field: string, detail: string): never {
  throw new Error(`Entry ${index + 1} has an invalid ${field}. ${detail}`);
}

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseLocalDate(value);
  return Number.isFinite(date.getTime()) && localISO(date) === value;
}

function requiredNumber(value: unknown, index: number, field: string, maximum: number, integer = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > maximum || (integer && !Number.isSafeInteger(value))) {
    invalidRecord(index, field, integer
      ? `Use a whole number from 0 to ${maximum.toLocaleString()}.`
      : `Use a number from 0 to ${maximum.toLocaleString()}.`);
  }
  return value;
}

function optionalNumber(value: unknown, index: number, field: string, maximum: number): number | null {
  if (value === null) return null;
  return requiredNumber(value, index, field, maximum);
}

function parseRecord(value: unknown, index: number): DayRecord {
  if (!isObject(value)) throw new Error(`Entry ${index + 1} must be an object.`);
  if (!validDate(value.date)) invalidRecord(index, 'date', 'Use a real date in YYYY-MM-DD format.');
  if (typeof value.note !== 'string' || value.note.length > 200) {
    invalidRecord(index, 'note', 'Use text with 200 characters or fewer.');
  }
  return {
    date: value.date,
    calories: requiredNumber(value.calories, index, 'calories', 20_000, true),
    protein: optionalNumber(value.protein, index, 'protein', 1_000),
    carbs: optionalNumber(value.carbs, index, 'carbs', 2_000),
    fat: optionalNumber(value.fat, index, 'fat', 1_000),
    weight: optionalNumber(value.weight, index, 'weight', 1_500),
    note: value.note,
    updatedAt: requiredNumber(value.updatedAt, index, 'updated time', Number.MAX_SAFE_INTEGER, true),
  };
}

function parseSettings(value: unknown): Settings {
  if (!isObject(value)) throw new Error('Backup settings must include a calorie range, weight unit, and color theme.');
  const { calorieMin, calorieMax, weightUnit, theme } = value;
  if (typeof calorieMin !== 'number' || !Number.isFinite(calorieMin) || calorieMin < 0 || calorieMin > 20_000 ||
    typeof calorieMax !== 'number' || !Number.isFinite(calorieMax) || calorieMax < 0 || calorieMax > 20_000 || calorieMax <= calorieMin) {
    throw new Error('Backup settings have an invalid calorie range. The maximum must be higher than the minimum, and both must be from 0 to 20,000.');
  }
  if (weightUnit !== 'kg' && weightUnit !== 'lb') throw new Error('Backup settings have an invalid weight unit. Choose kg or lb.');
  if (theme !== 'light' && theme !== 'dark' && theme !== 'system') throw new Error('Backup settings have an invalid color theme. Choose light, dark, or system.');
  return { calorieMin, calorieMax, weightUnit, theme };
}

/**
 * Reads an exported backup into the exact shape the IndexedDB stores accept.
 * This completes before any write is attempted, keeping a bad recovery file
 * from changing either records or settings.
 */
export function parseJSONBackup(value: unknown): CalorieWeekBackup {
  if (!isObject(value) || !Array.isArray(value.records)) {
    throw new Error('This is not a Calorie Week View backup with a records list.');
  }
  const records = value.records.map(parseRecord);
  const dates = new Set<string>();
  for (const record of records) {
    if (dates.has(record.date)) throw new Error(`The backup repeats the date ${record.date}. Keep one entry for each date.`);
    dates.add(record.date);
  }
  const settings = Object.hasOwn(value, 'settings') ? parseSettings(value.settings) : undefined;
  return { records, ...(settings ? { settings } : {}) };
}
