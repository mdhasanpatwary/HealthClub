import { Prisma } from "@/generated/client/client";
import { Member } from "@/services/db";

export const MEMBER_SELECT_FIELDS = {
  id: true,
  name: true,
  phone: true,
  email: true,
  tier: true,
  status: true,
  joinedDate: true,
  expiryDate: true,
  qrCodeUrl: true,
  totalSaved: true,
  address: true,
  birthDate: true,
  profession: true,
  // Note: profilePictureUrl omitted to prevent large base64 payload transfer in bulk queries
  bkashSender: true,
  bkashTxnId: true,
  renewalStatus: true,
  renewalBkashSender: true,
  renewalBkashTxnId: true,
} as const;

export const MEMBER_DETAIL_SELECT_FIELDS = {
  ...MEMBER_SELECT_FIELDS,
  profilePictureUrl: true,
  referenceCode: true,
  discountAmount: true,
} as const;

// Helper to format Date objects as YYYY-MM-DD in local time (not UTC).
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type PrismaMemberRecord =
  | Prisma.MemberGetPayload<{ select: typeof MEMBER_SELECT_FIELDS }>
  | Prisma.MemberGetPayload<object>;

export function mapPrismaMember(m: PrismaMemberRecord): Member {
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    email: m.email || "",
    tier: m.tier as Member["tier"],
    status: m.status as Member["status"],
    joinedDate: formatDate(m.joinedDate),
    expiryDate: formatDate(m.expiryDate),
    qrCodeUrl: m.qrCodeUrl || undefined,
    totalSaved: m.totalSaved,
    address: m.address || "",
    birthDate: m.birthDate ? formatDate(m.birthDate) : "",
    profession: m.profession || "",
    profilePictureUrl: (m as { profilePictureUrl?: string | null }).profilePictureUrl || undefined,
    bkashSender: m.bkashSender || undefined,
    bkashTxnId: m.bkashTxnId || undefined,
    renewalStatus: m.renewalStatus || undefined,
    renewalBkashSender: m.renewalBkashSender || undefined,
    renewalBkashTxnId: m.renewalBkashTxnId || undefined,
    referenceCode: (m as { referenceCode?: string | null }).referenceCode || undefined,
    discountAmount: (m as { discountAmount?: number | null }).discountAmount ?? 0,
  };
}
