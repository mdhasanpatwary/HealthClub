export type ImportEntityType = "doctors" | "partners" | "donors" | "ambulances" | "hotlines";

export interface ColumnDefinition {
  key: string;
  labelBn: string;
  labelEn: string;
  required: boolean;
  aliases: string[];
  descriptionBn?: string;
  descriptionEn?: string;
  exampleValue?: string;
}

export interface EntityConfig {
  type: ImportEntityType;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  columns: ColumnDefinition[];
}

export interface RawParsedData {
  headers: string[];
  rows: Record<string, string>[];
}

export interface ColumnMapping {
  targetField: string;
  sourceHeader: string | null;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ProcessedRow<T = Record<string, unknown>> {
  id: string; // generated unique row identifier
  rowIndex: number;
  data: T;
  raw: Record<string, string>;
  isValid: boolean;
  errors: ValidationIssue[];
}

export interface BulkImportResult {
  success: boolean;
  totalImported: number;
  totalFailed: number;
  errors?: string[];
  message?: string;
}
