import * as XLSX from "xlsx";
import { z } from "zod";
import {
  ImportEntityType,
  EntityConfig,
  RawParsedData,
  ProcessedRow,
  ValidationIssue,
} from "@/types/bulkImport";

export const ENTITY_CONFIGS: Record<ImportEntityType, EntityConfig> = {
  doctors: {
    type: "doctors",
    titleBn: "বিশেষজ্ঞ ডাক্তার",
    titleEn: "Specialist Doctors",
    descBn: "ডাক্তারদের তথ্য, স্পেশালিটি, চেম্বার, ভিজিটিং সময় ও সিরিয়াল নম্বর",
    descEn: "Doctor profiles, specialties, chamber locations, visiting hours & phone",
    columns: [
      {
        key: "name",
        labelBn: "ডাক্তারের নাম",
        labelEn: "Doctor Name",
        required: true,
        aliases: ["name", "doctor_name", "doctor name", "নাম", "ডাক্তারের নাম", "dr_name", "dr name"],
        exampleValue: "ডাঃ মোঃ রফিকুল ইসলাম",
      },
      {
        key: "specialty",
        labelBn: "স্পেশালিটি / রোগ বিশেষজ্ঞ",
        labelEn: "Specialty",
        required: true,
        aliases: ["specialty", "specialist", "স্পেশালিটি", "রোগ বিশেষজ্ঞ", "বিশেষজ্ঞ"],
        exampleValue: "মেডিসিন ও বক্ষব্যাধি বিশেষজ্ঞ",
      },
      {
        key: "department",
        labelBn: "ডিপার্টমেন্ট",
        labelEn: "Department",
        required: true,
        aliases: ["department", "dept", "বিভাগ", "ডিপার্টমেন্ট", "শাখা"],
        exampleValue: "medicine",
      },
      {
        key: "degrees",
        labelBn: "ডিগ্রিসমূহ",
        labelEn: "Degrees / Qualifications",
        required: true,
        aliases: ["degrees", "degree", "qualification", "ডিগ্রি", "শিক্ষাগত যোগ্যতা"],
        exampleValue: "MBBS, FCPS (Medicine), MACP (USA)",
      },
      {
        key: "designation",
        labelBn: "পদবী / হাসপাতাল",
        labelEn: "Designation",
        required: true,
        aliases: ["designation", "title", "পদবী", "বর্তমান পদবী", "কর্মস্থল"],
        exampleValue: "সহকারী অধ্যাপক, মেডিসিন বিভাগ",
      },
      {
        key: "chamberName",
        labelBn: "চেম্বারের নাম",
        labelEn: "Chamber Name",
        required: true,
        aliases: ["chambername", "chamber_name", "chamber", "hospital", "চেম্বার", "চেম্বারের নাম", "হাসপাতাল"],
        exampleValue: "ল্যাবএইড স্পেশালাইজড ডায়াগনস্টিক",
      },
      {
        key: "chamberAddress",
        labelBn: "চেম্বারের ঠিকানা",
        labelEn: "Chamber Address",
        required: true,
        aliases: ["chamberaddress", "chamber_address", "address", "ঠিকানা", "চেম্বারের ঠিকানা"],
        exampleValue: "এসএসকে রোড, ট্রাঙ্ক রোড মোড়, ফেনী",
      },
      {
        key: "roomNo",
        labelBn: "রুম নম্বর",
        labelEn: "Room No",
        required: false,
        aliases: ["roomno", "room_no", "room", "রুম নং", "রুম নম্বর"],
        exampleValue: "৩০২ (৩য় তলা)",
      },
      {
        key: "visitingDays",
        labelBn: "রোগী দেখার দিন",
        labelEn: "Visiting Days",
        required: true,
        aliases: ["visitingdays", "visiting_days", "days", "দিন", "রোগী দেখার দিন"],
        exampleValue: "শনি থেকে বৃহস্পতি",
      },
      {
        key: "visitingHours",
        labelBn: "রোগী দেখার সময়",
        labelEn: "Visiting Hours",
        required: true,
        aliases: ["visitinghours", "visiting_hours", "hours", "time", "সময়", "রোগী দেখার সময়"],
        exampleValue: "বিকাল ৫টা - রাত ৯টা",
      },
      {
        key: "serialPhone",
        labelBn: "সিরিয়াল ফোন",
        labelEn: "Serial Phone",
        required: true,
        aliases: ["serialphone", "serial_phone", "phone", "mobile", "মোবাইল", "ফোন", "সিরিয়াল ফোন"],
        exampleValue: "01711223344",
      },
      {
        key: "consultationFee",
        labelBn: "পরামর্শ ফি",
        labelEn: "Consultation Fee",
        required: false,
        aliases: ["consultationfee", "consultation_fee", "fee", "ভিজিট", "ফি", "পরামর্শ ফি"],
        exampleValue: "৮০০ টাকা (নতুন), ৫০০ টাকা (পুরাতন)",
      },
    ],
  },
  partners: {
    type: "partners",
    titleBn: "পার্টনার নেটওয়ার্ক (হাসপাতাল/ল্যাব/ফার্মেসি)",
    titleEn: "Partner Network (Hospitals/Labs/Pharmacies)",
    descBn: "চুক্তিভিত্তিক হাসপাতাল, ডায়াগনস্টিক ও ফার্মেসির নাম, ছাড় ও যোগাযোগ",
    descEn: "Partner hospitals, diagnostics and pharmacies with discounts and contact info",
    columns: [
      {
        key: "name",
        labelBn: "প্রতিষ্ঠানের নাম",
        labelEn: "Facility Name",
        required: true,
        aliases: ["name", "partner_name", "hospital_name", "নাম", "প্রতিষ্ঠানের নাম"],
        exampleValue: "পপুলার ডায়াগনস্টিক সেন্টার",
      },
      {
        key: "category",
        labelBn: "ক্যাটাগরি",
        labelEn: "Category (hospital/diagnostic/pharmacy)",
        required: true,
        aliases: ["category", "type", "ক্যাটাগরি", "ধরণ"],
        exampleValue: "diagnostic",
      },
      {
        key: "address",
        labelBn: "ঠিকানা",
        labelEn: "Address",
        required: true,
        aliases: ["address", "location", "ঠিকানা", "লোকেশন"],
        exampleValue: "এসএসকে রোড, ফেনী সদর, ফেনী",
      },
      {
        key: "discount",
        labelBn: "ডিসকাউন্ট বিবরণ",
        labelEn: "Discount Description",
        required: true,
        aliases: ["discount", "discount_rate", "ছাড়", "ডিসকাউন্ট", "ডিসকাউন্ট রেট"],
        exampleValue: "১০-৩০% ডিসকাউন্ট",
      },
      {
        key: "phone",
        labelBn: "ফোন / হেল্পলাইন",
        labelEn: "Phone / Helpline",
        required: true,
        aliases: ["phone", "mobile", "contact", "ফোন", "মোবাইল", "হেল্পলাইন"],
        exampleValue: "01811223344",
      },
      {
        key: "email",
        labelBn: "ইমেইল",
        labelEn: "Email",
        required: false,
        aliases: ["email", "e-mail", "ইমেইল"],
        exampleValue: "info@popularfeni.com",
      },
      {
        key: "logoText",
        labelBn: "লোগো টেক্সট / সংক্ষিপ্ত নাম",
        labelEn: "Logo Text / Short Name",
        required: true,
        aliases: ["logotext", "logo_text", "short_name", "লোগো টেক্সট", "সংক্ষিপ্ত নাম"],
        exampleValue: "Popular",
      },
      {
        key: "emergencyPhone",
        labelBn: "জরুরি হটলাইন",
        labelEn: "Emergency Phone",
        required: false,
        aliases: ["emergencyphone", "emergency_phone", "hotline", "জরুরি ফোন"],
        exampleValue: "01899112233",
      },
      {
        key: "workingHours",
        labelBn: "কার্যকাল / সেবা সময়",
        labelEn: "Working Hours",
        required: false,
        aliases: ["workinghours", "working_hours", "hours", "খোলা থাকার সময়"],
        exampleValue: "২৪ ঘণ্টা খোলা",
      },
    ],
  },
  donors: {
    type: "donors",
    titleBn: "রক্তদাতা নেটওয়ার্ক",
    titleEn: "Blood Donors",
    descBn: "স্বেচ্ছাসেবী রক্তদাতাদের নাম, রক্তের গ্রুপ, উপজেলা ও ফোন নম্বর",
    descEn: "Blood donors with blood group, upazila area and phone number",
    columns: [
      {
        key: "name",
        labelBn: "রক্তদাতার নাম",
        labelEn: "Donor Name",
        required: true,
        aliases: ["name", "donor_name", "নাম", "রক্তদাতার নাম"],
        exampleValue: "তানভীর আহমেদ",
      },
      {
        key: "bloodGroup",
        labelBn: "রক্তের গ্রুপ",
        labelEn: "Blood Group (A+, B+, O+, AB+, etc.)",
        required: true,
        aliases: ["bloodgroup", "blood_group", "group", "রক্তের গ্রুপ", "গ্রুপ"],
        exampleValue: "O+",
      },
      {
        key: "upazila",
        labelBn: "উপজেলা",
        labelEn: "Upazila (e.g. feni-sadar)",
        required: true,
        aliases: ["upazila", "thana", "area", "উপজেলা", "থানা", "এলাকা"],
        exampleValue: "feni-sadar",
      },
      {
        key: "phone",
        labelBn: "ফোন নম্বর",
        labelEn: "Phone Number",
        required: true,
        aliases: ["phone", "mobile", "contact", "ফোন", "মোবাইল"],
        exampleValue: "01812345678",
      },
      {
        key: "lastDonated",
        labelBn: "সর্বশেষ রক্তদানের তারিখ",
        labelEn: "Last Donation Date",
        required: false,
        aliases: ["lastdonated", "last_donated", "last_donation", "সর্বশেষ রক্তদান"],
        exampleValue: "২০২৬-০১-১৫",
      },
    ],
  },
  ambulances: {
    type: "ambulances",
    titleBn: "অ্যাম্বুলেন্স সার্ভিস",
    titleEn: "Ambulance Services",
    descBn: "জরুরি অ্যাম্বুলেন্স বহর, ধরন (ICU, AC, Non-AC, Freezer) ও অবস্থান",
    descEn: "Emergency ambulance fleet, type (ICU, AC, Non-AC, Freezer) and location",
    columns: [
      {
        key: "name",
        labelBn: "সার্ভিস / এজেন্সির নাম",
        labelEn: "Agency / Service Name",
        required: true,
        aliases: ["name", "agency_name", "ambulance_name", "নাম", "এজেন্সির নাম"],
        exampleValue: "ফেনী সেন্ট্রাল অ্যাম্বুলেন্স সার্ভিস",
      },
      {
        key: "type",
        labelBn: "অ্যাম্বুলেন্সের ধরন",
        labelEn: "Type (ICU / AC / Non-AC / Freezer)",
        required: true,
        aliases: ["type", "ambulance_type", "ধরন", "টাইপ"],
        exampleValue: "ICU",
      },
      {
        key: "location",
        labelBn: "অবস্থান / স্ট্যান্ড",
        labelEn: "Location / Station",
        required: true,
        aliases: ["location", "stand", "address", "অবস্থান", "স্ট্যান্ড", "ঠিকানা"],
        exampleValue: "সদর হাসপাতাল মোড়, ফেনী",
      },
      {
        key: "phone",
        labelBn: "ফোন নম্বর",
        labelEn: "Phone Number",
        required: true,
        aliases: ["phone", "mobile", "contact", "ফোন", "মোবাইল"],
        exampleValue: "01755112233",
      },
      {
        key: "availableHours",
        labelBn: "সার্ভিসের সময়",
        labelEn: "Available Hours",
        required: false,
        aliases: ["availablehours", "available_hours", "hours", "সময়"],
        exampleValue: "২৪ ঘণ্টা",
      },
    ],
  },
  hotlines: {
    type: "hotlines",
    titleBn: "জরুরি হটলাইন ও অক্সিজেন",
    titleEn: "Emergency Hotlines & Oxygen",
    descBn: "অক্সিজেন সেবা, ফায়ার সার্ভিস, পুলিশ ও হাসপাতালের সরাসরি হটলাইন",
    descEn: "Direct emergency contacts for Oxygen, Fire Service, Police & Hospitals",
    columns: [
      {
        key: "titleBn",
        labelBn: "সেবার নাম (বাংলা)",
        labelEn: "Title (Bengali)",
        required: true,
        aliases: ["titlebn", "title_bn", "name_bn", "নাম (বাংলা)", "সেবার নাম", "শিরোনাম"],
        exampleValue: "ফেনী অক্সিজেন ব্যাংক",
      },
      {
        key: "titleEn",
        labelBn: "সেবার নাম (ইংরেজি)",
        labelEn: "Title (English)",
        required: true,
        aliases: ["titleen", "title_en", "name_en", "title", "নাম (ইংরেজি)", "Name"],
        exampleValue: "Feni Oxygen Bank",
      },
      {
        key: "category",
        labelBn: "ক্যাটাগরি",
        labelEn: "Category (hospital/oxygen/fire/police/blood_bank)",
        required: true,
        aliases: ["category", "type", "ক্যাটাগরি", "ধরন"],
        exampleValue: "oxygen",
      },
      {
        key: "phone",
        labelBn: "হটলাইন নম্বর",
        labelEn: "Hotline Phone",
        required: true,
        aliases: ["phone", "hotline", "mobile", "ফোন", "হটলাইন"],
        exampleValue: "01833445566",
      },
      {
        key: "descriptionBn",
        labelBn: "বিবরণ (বাংলা)",
        labelEn: "Description (Bengali)",
        required: false,
        aliases: ["descriptionbn", "description_bn", "desc_bn", "বিবরণ"],
        exampleValue: "ফেনী জেলার যেকোনো স্থানে ২৪ ঘণ্টা ফ্রি অক্সিজেন সিলিন্ডার ডেলিভারি",
      },
      {
        key: "descriptionEn",
        labelBn: "বিবরণ (ইংরেজি)",
        labelEn: "Description (English)",
        required: false,
        aliases: ["descriptionen", "description_en", "desc_en", "description"],
        exampleValue: "24/7 free home delivery of oxygen cylinders across Feni district",
      },
    ],
  },
};

// --- Zod Validation Schemas ---

export const doctorImportSchema = z.object({
  name: z.string().min(2, "Name must have at least 2 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  department: z.string().min(2, "Department is required").default("medicine"),
  degrees: z.string().min(2, "Degrees / qualification is required"),
  designation: z.string().min(2, "Designation is required"),
  chamberName: z.string().min(2, "Chamber name is required"),
  chamberAddress: z.string().min(2, "Chamber address is required"),
  roomNo: z.string().optional().default(""),
  visitingDays: z.string().min(2, "Visiting days are required"),
  visitingHours: z.string().min(2, "Visiting hours are required"),
  serialPhone: z.string().min(5, "Serial phone number is required"),
  consultationFee: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

export const partnerImportSchema = z.object({
  name: z.string().min(2, "Facility name is required"),
  category: z.enum(["hospital", "diagnostic", "pharmacy"], {
    message: "Category must be hospital, diagnostic, or pharmacy",
  }),
  address: z.string().min(3, "Address is required"),
  discount: z.string().min(2, "Discount description is required"),
  phone: z.string().min(5, "Contact phone is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  logoText: z.string().min(1, "Logo text is required"),
  emergencyPhone: z.string().optional().default(""),
  workingHours: z.string().optional().default(""),
  mapLink: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
});

export const bloodDonorImportSchema = z.object({
  name: z.string().min(2, "Donor name is required"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], {
    message: "Blood group must be A+, A-, B+, B-, O+, O-, AB+, or AB-",
  }),
  upazila: z.string().min(2, "Upazila is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  lastDonated: z.string().optional().default("তথ্য নেই"),
  isAvailable: z.boolean().optional().default(true),
});

export const ambulanceImportSchema = z.object({
  name: z.string().min(2, "Agency name is required"),
  type: z.enum(["ICU", "AC", "Non-AC", "Freezer"], {
    message: "Type must be ICU, AC, Non-AC, or Freezer",
  }),
  location: z.string().min(2, "Location is required"),
  phone: z.string().min(5, "Phone number is required"),
  availableHours: z.string().optional().default("২৪ ঘণ্টা"),
});

export const hotlineImportSchema = z.object({
  titleBn: z.string().min(2, "Bengali title is required"),
  titleEn: z.string().min(2, "English title is required"),
  category: z.enum(["hospital", "fire", "police", "oxygen", "blood_bank"], {
    message: "Category must be hospital, fire, police, oxygen, or blood_bank",
  }),
  phone: z.string().min(3, "Phone number is required"),
  descriptionBn: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
});

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
      // In Zod v4, issues can be accessed via error.issues
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
