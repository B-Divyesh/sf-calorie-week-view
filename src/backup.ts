import type { DayRecord, Settings, WeightUnit } from './types';
import { localISO, parseLocalDate } from './week';
import { numericRecordIssue, type NumericRecordField } from './record-validation';

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

function recordNumber(value: unknown, index: number, field: NumericRecordField): number {
  const issue = numericRecordIssue(field, value);
  if (issue) invalidRecord(index, field, issue);
  return value as number;
}

function optionalNumber(value: unknown, index: number, field: Exclude<NumericRecordField, 'calories'>): number | null {
  if (value === null) return null;
  return recordNumber(value, index, field);
}

function parseRecord(value: unknown, index: number, fallbackWeightUnit: WeightUnit): DayRecord {
  if (!isObject(value)) throw new Error(`Entry ${index + 1} must be an object.`);
  if (!validDate(value.date)) invalidRecord(index, 'date', 'Use a real date in YYYY-MM-DD format.');
  if (typeof value.note !== 'string' || value.note.length > 200) {
    invalidRecord(index, 'note', 'Use text with 200 characters or fewer.');
  }
  const weight = optionalNumber(value.weight, index, 'weight');
  const weightUnit = value.weightUnit === undefined ? fallbackWeightUnit : value.weightUnit;
  if (weight !== null && weightUnit !== 'kg' && weightUnit !== 'lb') {
    invalidRecord(index, 'weight unit', 'Choose kg or lb.');
  }
  return {
    date: value.date,
    calories: recordNumber(value.calories, index, 'calories'),
    protein: optionalNumber(value.protein, index, 'protein'),
    carbs: optionalNumber(value.carbs, index, 'carbs'),
    fat: optionalNumber(value.fat, index, 'fat'),
    weight,
    weightUnit: weight === null ? null : weightUnit as WeightUnit,
    note: value.note,
    updatedAt: (() => {
      if (typeof value.updatedAt !== 'number' || !Number.isSafeInteger(value.updatedAt) || value.updatedAt < 0) {
        invalidRecord(index, 'updated time', 'Use a non-negative whole number.');
      }
      return value.updatedAt;
    })(),
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
export function parseJSONBackup(value: unknown, fallbackWeightUnit: WeightUnit = 'kg'): CalorieWeekBackup {
  if (!isObject(value) || !Array.isArray(value.records)) {
    throw new Error('This is not a Calorie Week View backup with a records list.');
  }
  const settings = Object.hasOwn(value, 'settings') ? parseSettings(value.settings) : undefined;
  const records = value.records.map((record, index) => parseRecord(record, index, settings?.weightUnit ?? fallbackWeightUnit));
  const dates = new Set<string>();
  for (const record of records) {
    if (dates.has(record.date)) throw new Error(`The backup repeats the date ${record.date}. Keep one entry for each date.`);
    dates.add(record.date);
  }
  return { records, ...(settings ? { settings } : {}) };
}
