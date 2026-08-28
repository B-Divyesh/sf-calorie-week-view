export type DayRecord = {
  date: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  weight: number | null;
  weightUnit: WeightUnit | null;
  note: string;
  updatedAt: number;
};

export type WeightUnit = 'kg' | 'lb';

export type Settings = {
  calorieMin: number;
  calorieMax: number;
  weightUnit: WeightUnit;
  theme: 'light' | 'dark' | 'system';
};

export const DEFAULT_SETTINGS: Settings = {
  calorieMin: 1800,
  calorieMax: 2200,
  weightUnit: 'kg',
  theme: 'system',
};

export type DaySlot = {
  date: string;
  record?: DayRecord;
};
