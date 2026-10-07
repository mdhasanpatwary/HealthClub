export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'free' | 'premium' | 'founding';
  status: 'active' | 'inactive' | 'pending_payment' | 'pending_approval';
  joinedDate: string;
  expiryDate: string;
  qrCodeUrl?: string;
  totalSaved: number;
  address?: string;
  birthDate?: string;
  profession?: string;
  profilePictureUrl?: string;
  password?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  bkashSender?: string;
  bkashTxnId?: string;
  renewalStatus?: string;
  renewalBkashSender?: string;
  renewalBkashTxnId?: string;
  referenceCode?: string;
  discountAmount?: number;
  role?: string;
  adminRole?: AdminRole;
}

export type MemberNotificationType =
  | 'renewal_approved'
  | 'renewal_rejected'
  | 'transaction_recorded'
  | 'expiring_soon'
  | 'welcome'
  | 'system';

export interface MemberNotification {
  id: string;
  memberId: string;
  type: MemberNotificationType;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface DepartmentDiscount {
  id?: string;
  name: string;
  discount: string;
  description?: string;
}

export interface PartnerSocialLinks {
  facebook?: string;
  whatsapp?: string;
  website?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
}

export function parsePartnerSocialLinks(raw?: string | null): PartnerSocialLinks | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object") {
      return parsed as PartnerSocialLinks;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatSocialUrl(platform: keyof PartnerSocialLinks, value?: string): string | undefined {
  if (!value || !value.trim()) return undefined;
  const trimmed = value.trim();

  if (platform === "whatsapp") {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const rawNumber = trimmed.replace(/[^0-9]/g, "");
    const normalizedNumber = rawNumber.replace(/^(880|88|0)/, "");
    return `https://wa.me/880${normalizedNumber}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export interface Partner {
  id: string;
  slug?: string;
  name: string;
  category: 'hospital' | 'diagnostic' | 'pharmacy';
  address: string;
  discount: string;
  phone: string;
  logoText: string;
  mapLink?: string;
  imageUrl?: string;
  email?: string;
  password?: string;
  emergencyPhone?: string;
  ambulancePhone?: string;
  workingHours?: string;
  departmentDiscounts?: string;
  socialLinks?: string;
  facilities?: string;
  galleryImages?: string;
  upazila?: string;
  isPartner?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerFacilityItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descBn?: string;
  descEn?: string;
  icon?: string;
  isAvailable: boolean;
  isCustom?: boolean;
}

export interface PartnerGalleryImage {
  id: string;
  url: string;
  captionBn?: string;
  captionEn?: string;
}

export function parsePartnerGallery(raw?: string | null): PartnerGalleryImage[] {
  if (!raw || typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PartnerGalleryImage[]) : [];
  } catch {
    return [];
  }
}

export type AdminRole = 'super_admin' | 'content_moderator' | 'support_staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PartnerStaff {
  id: string;
  partnerId: string;
  name: string;
  username: string;
  phone?: string;
  deskName: string;
  role: 'cashier' | 'manager';
  plainPassword?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  transactionCount?: number;
  totalSavedAmount?: number;
  totalBillAmount?: number;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  partnerId: string;
  partnerName: string;
  staffId?: string;
  staffName?: string;
  deskName?: string;
  amount: number;
  saved: number;
  date: string;
}

export interface PartnerRequest {
  id: string;
  orgName: string;
  category: 'hospital' | 'diagnostic' | 'pharmacy';
  address: string;
  discount: string;
  contactName?: string | null;
  phone: string;
  email: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PublicMemberVerification {
  id: string;
  name: string;
  tier: string;
  status: string;
  expiryDate: string;
  isExpired: boolean;
}

// Initial seed data from verified Feni Sadar partners
export { initialPartners } from "@/data/initialPartnersData";


export interface Doctor {
  id: string;
  slug?: string;
  name: string;
  nameEn?: string;
  specialty: string;
  department: string;
  degrees: string;
  designation: string;
  chamberName: string;
  chamberAddress: string;
  roomNo?: string;
  visitingDays: string;
  visitingHours: string;
  serialPhone: string;
  consultationFee?: string;
  imageUrl?: string;
  partnerId?: string;
  upazila?: string;
  isActive: boolean;
  availableToday?: boolean;
  onLeaveUntil?: string;
  notice?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DatabaseSnapshot {
  id: string;
  name: string;
  description?: string | null;
  format: "json" | "sql";
  fileSize: number;
  tableStats: Record<string, number>;
  dataPayload?: string | null;
  trigger: "manual" | "automated";
  createdBy?: string | null;
  createdAt: string;
  expiresAt?: string | null;
}

export interface BackupTableStats {
  members: number;
  partners: number;
  partnerStaff: number;
  transactions: number;
  doctors: number;
  partnerRequests: number;
  contactMessages: number;
  systemSettings: number;
  pwaInstallations: number;
  memberNotifications: number;
  adminUsers: number;
  databaseSnapshots: number;
  reviews?: number;
  pushSubscriptions?: number;
  bloodDonors?: number;
  ambulanceServices?: number;
  totalRecords: number;
}

export interface BackupSettings {
  autoSchedule: "disabled" | "daily" | "weekly" | "monthly";
  retentionDays: number;
  maxSnapshots: number;
  lastRunAt?: string | null;
  notifyOnBackup: boolean;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  memberId: string;
  partnerId: string;
  rating: number;
  comment?: string | null;
  status: ReviewStatus;
  adminFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    name: string;
    tier: string;
    profilePictureUrl?: string | null;
    phone?: string;
  };
  partner?: {
    id: string;
    name: string;
    category: string;
  };
}

export interface PartnerReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface AdminReviewSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRating: number;
}

export { initialDoctors } from "./initialDoctors";

