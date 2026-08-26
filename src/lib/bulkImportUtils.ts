import * as XLSX from "xlsx";
import { z } from "zod";
import {
  ImportEntityType,
  RawParsedData,
  ProcessedRow,
  ValidationIssue,
} from "@/types/bulkImport";
import { ENTITY_CONFIGS } from "./bulkImportConfigs";
import {
  doctorImportSchema,
  partnerImportSchema,
  bloodDonorImportSchema,
  ambulanceImportSchema,
  hotlineImportSchema,
} from "./bulkImportSchemas";

export { ENTITY_CONFIGS } from "./bulkImportConfigs";
export {
  doctorImportSchema,
  partnerImportSchema,
  bloodDonorImportSchema,
  ambulanceImportSchema,
  hotlineImportSchema,
} from "./bulkImportSchemas";

// --- Smart Auto-Mapping Helper ---

export function normalizeHeader(str: string): string {
  return str.toLowerCase().replace(/[\s_\-–—()[\]{}./\\]/g, "").trim();
}

export function autoMapColumns(
  rawHeaders: string[],
  entityType: ImportEntityType
): Record<string, string | null> {
  const config = ENTITY_CONFIGS[entityType];
  const mapping: Record<string, string | null> = {};

  for (const col of config.columns) {
    let matchedHeader: string | null = null;

    // 1. Direct match with key or label
    for (const raw of rawHeaders) {
      const normRaw = normalizeHeader(raw);
      if (normRaw === normalizeHeader(col.key) || normRaw === normalizeHeader(col.labelBn) || normRaw === normalizeHeader(col.labelEn)) {
        matchedHeader = raw;
        break;
      }
    }

    // 2. Match with aliases
    if (!matchedHeader) {
      for (const alias of col.aliases) {
        const normAlias = normalizeHeader(alias);
        for (const raw of rawHeaders) {
          const normRaw = normalizeHeader(raw);
          if (normRaw === normAlias || normRaw.includes(normAlias) || normAlias.includes(normRaw)) {
            matchedHeader = raw;
            break;
          }
        }
        if (matchedHeader) break;
      }
    }

    mapping[col.key] = matchedHeader;
  }

  return mapping;
}

// --- Parsing Functions ---

export async function parseFileToRawData(file: File): Promise<RawParsedData> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("File contains no sheets");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

  if (json.length === 0) {
    return { headers: [], rows: [] };
  }

  // Extract all headers found across rows
  const headersSet = new Set<string>();
  json.forEach((row) => {
    Object.keys(row).forEach((k) => headersSet.add(k.trim()));
  });

  const headers = Array.from(headersSet);
  const rows: Record<string, string>[] = json.map((row) => {
    const stringRow: Record<string, string> = {};
    for (const h of headers) {
      const val = row[h];
      stringRow[h] = val !== undefined && val !== null ? String(val).trim() : "";
    }
    return stringRow;
  });

  return { headers, rows };
}

// --- Row Processing & Validation Runner ---

export function processAndValidateRows(
  rawRows: Record<string, string>[],
  mapping: Record<string, string | null>,
  entityType: ImportEntityType
): ProcessedRow[] {
  return rawRows.map((rawRow, idx) => {
    const mappedObj: Record<string, unknown> = {};

    for (const [targetKey, sourceHeader] of Object.entries(mapping)) {
      if (sourceHeader && rawRow[sourceHeader] !== undefined) {
        mappedObj[targetKey] = rawRow[sourceHeader];
      } else {
        mappedObj[targetKey] = "";
      }
    }

    // Entity-specific normalizations
    if (entityType === "partners" && !mappedObj.logoText && mappedObj.name) {
      mappedObj.logoText = String(mappedObj.name).slice(0, 10);
    }
    if (entityType === "donors" && mappedObj.bloodGroup) {
      mappedObj.bloodGroup = String(mappedObj.bloodGroup).toUpperCase().replace(/\s/g, "");
    }
    if (entityType === "ambulances" && mappedObj.type) {
      const t = String(mappedObj.type).toUpperCase().trim();
      if (t.includes("NON")) mappedObj.type = "Non-AC";
      else if (t.includes("ICU")) mappedObj.type = "ICU";
      else if (t.includes("FREEZER")) mappedObj.type = "Freezer";
      else if (t.includes("AC")) mappedObj.type = "AC";
    }

    const errors: ValidationIssue[] = [];

    let schema: z.ZodTypeAny;
    switch (entityType) {
      case "doctors":
        schema = doctorImportSchema;
        break;
      case "partners":
        schema = partnerImportSchema;
        break;
      case "donors":
        schema = bloodDonorImportSchema;
        break;
      case "ambulances":
        schema = ambulanceImportSchema;
        break;
      case "hotlines":
        schema = hotlineImportSchema;
        break;
    }

    const parsed = schema.safeParse(mappedObj);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        errors.push({
          field: issue.path.join(".") || "general",
          message: issue.message,
        });
      });
    }

    return {
      id: `row-${idx + 1}-${Math.random().toString(36).slice(2, 7)}`,
      rowIndex: idx + 1,
      data: (parsed.success ? parsed.data : mappedObj) as Record<string, unknown>,
      raw: rawRow,
      isValid: parsed.success,
      errors,
    };
  });
}

// --- Sample Template Downloads ---

export function downloadSampleTemplate(
  entityType: ImportEntityType,
  format: "xlsx" | "csv"
): void {
  const config = ENTITY_CONFIGS[entityType];
  const headers = config.columns.map((c) => c.labelEn);
  const sampleRow1 = config.columns.map((c) => c.exampleValue || "");

  // Create sample dataset with headers and 2 demo rows
  const data = [headers, sampleRow1];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, config.titleEn.slice(0, 30));

  const filename = `healthclub_template_${entityType}.${format}`;

  if (format === "xlsx") {
    XLSX.writeFile(wb, filename);
  } else {
    XLSX.writeFile(wb, filename, { bookType: "csv" });
  }
}
