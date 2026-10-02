/**
 * Utility functions for generating clean, SEO-friendly URL slugs
 * with clean English ASCII formatting and intelligent Bengali transliteration.
 */

import { generateCleanAsciiSlug, transliterateBengaliToEnglish } from "@/lib/transliteration";

export { transliterateBengaliToEnglish, generateCleanAsciiSlug };

/**
 * Generates an SEO-friendly URL slug for a partner healthcare facility.
 * Prefers English name/title if provided; otherwise cleanly transliterates Bengali to English ASCII.
 *
 * Examples:
 * - ("ইসলামিয়া ফিজিওথেরাপি এন্ড রিহ্যাবিলিটেশন সেন্টার") -> "islamia-physiotherapy-and-rehabilitation-center"
 * - ("মজুমদার ডেন্টাল ক্লিনিক", "Mazumder Dental Clinic") -> "mazumder-dental-clinic"
 * - ("Imperial Neurocare & Diagnostic Center") -> "imperial-neurocare-and-diagnostic-center"
 */
export function generatePartnerSlug(input: string, nameEn?: string): string {
  if (nameEn && nameEn.trim()) {
    return generateCleanAsciiSlug(nameEn);
  }
  if (!input || !input.trim()) {
    return "";
  }
  return generateCleanAsciiSlug(input);
}

/**
 * Sanitizes an explicitly user-provided custom slug into clean ASCII.
 */
export function sanitizePartnerSlug(customSlug: string): string {
  return generateCleanAsciiSlug(customSlug);
}

/**
 * Resolves a unique slug for a partner by checking against existing partner slugs in Prisma.
 * If a collision is found with another partner, appends -2, -3, etc.
 */
export async function resolveUniquePartnerSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaClient: any,
  baseSlug: string,
  currentPartnerId?: string
): Promise<string> {
  const cleanBase = baseSlug || `partner-${Date.now().toString(36)}`;
  let candidate = cleanBase;
  let counter = 2;

  while (true) {
    const existing = await prismaClient.partner.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || (currentPartnerId && existing.id === currentPartnerId)) {
      return candidate;
    }

    candidate = `${cleanBase}-${counter}`;
    counter++;
  }
}

/**
 * Generates an SEO-friendly clean English URL slug for a doctor profile.
 * Prefers English name if provided; otherwise cleanly transliterates Bengali name.
 *
 * Examples:
 * - ("ডাঃ কামরুন্নাহার রলি") -> "dr-kamrunnahar-roli"
 * - ("ডাঃ মো: আবদুল কুদ্দুছ (সোহাগ)", "Dr. Md. Abdul Kuddus (Sohag)") -> "dr-md-abdul-kuddus-sohag"
 * - ("Dr. Champa Kundu") -> "dr-champa-kundu"
 */
export function generateDoctorSlug(input: string, nameEn?: string): string {
  if (nameEn && nameEn.trim()) {
    return generateCleanAsciiSlug(nameEn);
  }
  if (!input || !input.trim()) {
    return "";
  }
  return generateCleanAsciiSlug(input);
}

/**
 * Sanitizes an explicitly user-provided custom doctor slug.
 */
export function sanitizeDoctorSlug(customSlug: string): string {
  return generateCleanAsciiSlug(customSlug);
}

/**
 * Resolves a unique slug for a doctor by checking against existing doctor slugs in Prisma.
 * If a collision is found with another doctor, appends -2, -3, etc.
 */
export async function resolveUniqueDoctorSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaClient: any,
  baseSlug: string,
  currentDoctorId?: string
): Promise<string> {
  const cleanBase = baseSlug || `doctor-${Date.now().toString(36)}`;
  let candidate = cleanBase;
  let counter = 2;

  while (true) {
    const existing = await prismaClient.doctor.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || (currentDoctorId && existing.id === currentDoctorId)) {
      return candidate;
    }

    candidate = `${cleanBase}-${counter}`;
    counter++;
  }
}
