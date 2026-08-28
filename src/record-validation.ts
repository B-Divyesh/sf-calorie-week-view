export type NumericRecordField = 'calories' | 'protein' | 'carbs' | 'fat' | 'weight';

type NumericRule = {
  minimum: number;
  maximum: number;
  integer?: boolean;
};

export const RECORD_NUMERIC_RULES: Record<NumericRecordField, NumericRule> = {
  calories: { minimum: 0, maximum: 20_000, integer: true },
  protein: { minimum: 0, maximum: 1_000 },
  carbs: { minimum: 0, maximum: 2_000 },
  fat: { minimum: 0, maximum: 1_000 },
  weight: { minimum: 1, maximum: 1_500 },
};

export function numericRecordIssue(field: NumericRecordField, value: unknown): string | null {
  const rule = RECORD_NUMERIC_RULES[field];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < rule.minimum || value > rule.maximum || (rule.integer && !Number.isSafeInteger(value))) {
    const kind = rule.integer ? 'whole number' : 'number';
    return `Use a ${kind} from ${rule.minimum.toLocaleString()} to ${rule.maximum.toLocaleString()}.`;
  }
  return null;
}
