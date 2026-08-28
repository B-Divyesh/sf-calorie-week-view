import type { DayRecord, DaySlot, Settings } from './types';

const DAY_MS = 86_400_000;

export function localISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function startOfWeek(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const distance = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - distance);
  return copy;
}

export function addDays(date: Date, count: number): Date {
  return new Date(date.getTime() + count * DAY_MS);
}

export function weekDates(start: Date): string[] {
  return Array.from({ length: 7 }, (_, index) => localISO(addDays(start, index)));
}

export function slotsForWeek(records: DayRecord[], start: Date): DaySlot[] {
  const byDate = new Map(records.map((record) => [record.date, record]));
  return weekDates(start).map((date) => ({ date, record: byDate.get(date) }));
}

export function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

export function rangeLabel(averageCalories: number | null, settings: Settings): string {
  if (averageCalories === null) return 'No average yet';
  if (averageCalories < settings.calorieMin) return 'Below your range';
  if (averageCalories > settings.calorieMax) return 'Above your range';
  return 'Inside your range';
}

export function formatWeekRange(start: Date): string {
  const end = addDays(start, 6);
  const sameYear = start.getFullYear() === end.getFullYear();
  const startText = new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }),
  }).format(start);
  const endText = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(end);
  return `${startText}–${endText}`;
}

export function formatDay(iso: string): { weekday: string; date: string } {
  const value = parseLocalDate(iso);
  return {
    weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(value),
    date: new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(value),
  };
}

export function parseCSV(source: string): DayRecord[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"' && quoted && source[index + 1] === '"') {
      field += '"'; index += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field.trim()); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field.trim()); field = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else field += char;
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) throw new Error('The CSV needs a header and at least one data row.');

  const normalise = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');
  const headers = rows[0].map(normalise);
  const indexOf = (names: string[]) => headers.findIndex((header) => names.includes(header));
  const columns = {
    date: indexOf(['date', 'day']),
    calories: indexOf(['calories', 'calorie', 'kcal', 'energy']),
    protein: indexOf(['protein', 'proteing']),
    carbs: indexOf(['carbs', 'carbohydrate', 'carbohydrates', 'carbsg']),
    fat: indexOf(['fat', 'fatg']),
    weight: indexOf(['weight', 'weightkg', 'weightlb']),
    note: indexOf(['note', 'notes']),
  };
  if (columns.date < 0 || columns.calories < 0) {
    throw new Error('The CSV needs date and calories columns.');
  }

  const optionalNumber = (value: string | undefined, rowNumber: number, column: string): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new Error(`Row ${rowNumber} has an invalid ${column} value. Leave it blank or use a non-negative number.`);
    }
    return parsed;
  };

  return rows.slice(1).map((cells, rowIndex) => {
    const date = cells[columns.date];
    const calories = Number(cells[columns.calories]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parseLocalDate(date).getTime()) || localISO(parseLocalDate(date)) !== date) {
      throw new Error(`Row ${rowIndex + 2} has an invalid date. Use YYYY-MM-DD.`);
    }
    if (!Number.isFinite(calories) || calories < 0) {
      throw new Error(`Row ${rowIndex + 2} has invalid calories.`);
    }
    return {
      date,
      calories: Math.round(calories),
      protein: columns.protein >= 0 ? optionalNumber(cells[columns.protein], rowIndex + 2, 'protein') : null,
      carbs: columns.carbs >= 0 ? optionalNumber(cells[columns.carbs], rowIndex + 2, 'carbs') : null,
      fat: columns.fat >= 0 ? optionalNumber(cells[columns.fat], rowIndex + 2, 'fat') : null,
      weight: columns.weight >= 0 ? optionalNumber(cells[columns.weight], rowIndex + 2, 'weight') : null,
      note: columns.note >= 0 ? (cells[columns.note] ?? '').slice(0, 200) : '',
      updatedAt: Date.now(),
    } satisfies DayRecord;
  });
}

const csvCell = (value: string | number | null) => {
  const text = value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function recordsToCSV(records: DayRecord[]): string {
  const header = 'date,calories,protein_g,carbs_g,fat_g,weight,note';
  const body = [...records].sort((a, b) => a.date.localeCompare(b.date)).map((record) =>
    [record.date, record.calories, record.protein, record.carbs, record.fat, record.weight, record.note]
      .map(csvCell).join(','));
  return [header, ...body].join('\n');
}
