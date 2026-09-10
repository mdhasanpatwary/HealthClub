/**
 * Utility functions for generating clean, SEO-friendly URL slugs
 * with first-class support for Bengali Unicode characters and English text.
 */

/**
 * Generates an SEO-friendly URL slug from a name or title.
 * Supports Bengali characters (\u0980-\u09FF), English alphanumeric (a-z, 0-9),
 * and converts spaces, punctuation, and symbols into single hyphens.
 *
 * Examples:
 * - "মজুমদার ডেন্টাল ক্লিনিক" -> "মজুমদার-ডেন্টাল-ক্লিনিক"
 * - "Imperial Neurocare & Diagnostic Center" -> "imperial-neurocare-diagnostic-center"
 * - "আল-আকসা হাসপাতাল লিঃ ফেনী" -> "আল-আকসা-হাসপাতাল-লি-ফেনী"
 */
export function generatePartnerSlug(input: string): string {
  if (!input || !input.trim()) {
    return "";
  }

  return input
    .trim()
    .toLowerCase()
    // Replace ampersand with hyphen
    .replace(/&/g, "-")
    // Replace characters that are NOT Bengali Unicode (\u0980-\u09FF), English alphanumeric, or hyphens with hyphens
    .replace(/[^\u0980-\u09FFa-z0-9-]/g, "-")
    // Collapse multiple consecutive hyphens into a single hyphen
    .replace(/-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");
}

/**
 * Sanitizes an explicitly user-provided custom slug.
 */
export function sanitizePartnerSlug(customSlug: string): string {
  return generatePartnerSlug(customSlug);
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

