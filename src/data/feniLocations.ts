export interface FeniUpazila {
  id: string;
  nameBn: string;
  nameEn: string;
}

export const FENI_UPAZILAS: readonly FeniUpazila[] = [
  { id: "all", nameBn: "সকল এলাকা", nameEn: "All Areas" },
  { id: "feni-sadar", nameBn: "ফেনী সদর", nameEn: "Feni Sadar" },
  { id: "chhagalnaiya", nameBn: "ছাগলনাইয়া", nameEn: "Chhagalnaiya" },
  { id: "daganbhuiyan", nameBn: "দাগনভূঞা", nameEn: "Daganbhuiyan" },
  { id: "sonagazi", nameBn: "সোনাগাজী", nameEn: "Sonagazi" },
  { id: "parshuram", nameBn: "পরশুরাম", nameEn: "Parshuram" },
  { id: "fulgazi", nameBn: "ফুলগাজী", nameEn: "Fulgazi" },
] as const;

export const VALID_UPAZILA_IDS = [
  "feni-sadar",
  "chhagalnaiya",
  "daganbhuiyan",
  "sonagazi",
  "parshuram",
  "fulgazi",
] as const;

export type UpazilaId = (typeof VALID_UPAZILA_IDS)[number];

/**
 * Returns localized name for an upazila ID
 */
export function getUpazilaLabel(upazilaId?: string | null, locale = "bn"): string {
  if (!upazilaId) {
    return locale === "en" ? "Feni Sadar" : "ফেনী সদর";
  }
  const match = FENI_UPAZILAS.find((u) => u.id === upazilaId);
  if (!match) {
    return locale === "en" ? "Feni Sadar" : "ফেনী সদর";
  }
  return locale === "en" ? match.nameEn : match.nameBn;
}

/**
 * Detects upazila key from address/chamber text as a smart fallback
 */
export function detectUpazilaFromText(text?: string | null): UpazilaId {
  if (!text) return "feni-sadar";
  const lower = text.toLowerCase();

  if (
    lower.includes("দাগনভূঞা") ||
    lower.includes("দাগনভুঁইয়া") ||
    lower.includes("দাগনভূঁইয়া") ||
    lower.includes("daganbhuiyan") ||
    lower.includes("daganbhuiya")
  ) {
    return "daganbhuiyan";
  }

  if (
    lower.includes("ছাগলনাইয়া") ||
    lower.includes("ছাগলনাইয়া") ||
    lower.includes("chhagalnaiya") ||
    lower.includes("chagalnaiya")
  ) {
    return "chhagalnaiya";
  }

  if (
    lower.includes("সোনাগাজী") ||
    lower.includes("sonagazi")
  ) {
    return "sonagazi";
  }

  if (
    lower.includes("পরশুরাম") ||
    lower.includes("parshuram") ||
    lower.includes("parashuram")
  ) {
    return "parshuram";
  }

  if (
    lower.includes("ফুলগাজী") ||
    lower.includes("fulgazi") ||
    lower.includes("phulgazi")
  ) {
    return "fulgazi";
  }

  return "feni-sadar";
}
