export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: 'founding' | 'premium';
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

export interface Partner {
  id: string;
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
  workingHours?: string;
  departmentDiscounts?: string;
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

// Initial seed data
export const initialPartners: Partner[] = [
  {
    id: "p1",
    name: "পপুলার ডায়াগনস্টিক সেন্টার",
    category: "diagnostic",
    address: "এসএসকে রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০৯৬১৩৭৮৭৮০১",
    logoText: "Popular",
    imageUrl: "/images/placeholders/diagnostic.webp"
  },
  {
    id: "p2",
    name: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
    category: "hospital",
    address: "মিজান রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "১০৬০৬",
    logoText: "Labaid",
    imageUrl: "/images/placeholders/hospital.webp"
  },
  {
    id: "p3",
    name: "লাজ ফার্মা লিমিটেড",
    category: "pharmacy",
    address: "ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০২-৯৩৪৩৫১৬",
    logoText: "Lazz",
    imageUrl: "/images/placeholders/pharmacy.webp"
  },
  {
    id: "p5",
    name: "ইবনে সিনা ডায়াগনস্টিক সেন্টার",
    category: "diagnostic",
    address: "মহিপাল, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০৯৬১০০০৯৬১০",
    logoText: "Ibn Sina",
    imageUrl: "/images/placeholders/diagnostic.webp"
  },
  {
    id: "p6",
    name: "স্কয়ার হাসপাতাল (সিলেক্টেড সুবিধা)",
    category: "hospital",
    address: "গ্র্যান্ড ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "১০৬১৬",
    logoText: "Square",
    imageUrl: "/images/placeholders/hospital.webp"
  },
  {
    id: "p_ddlab",
    name: "ডিডি ল্যাব",
    category: "diagnostic",
    address: "মা প্লাজা (জিয়া মহিলা কলেজের বিপরীতে), শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "01898221111, 01898445555, 09666747575",
    logoText: "DD Lab",
    imageUrl: "/images/partners/ddlab.webp"
  }
];

export const initialMembers: Member[] = [
  {
    id: "HC-1001",
    name: "মোঃ আব্দুর রহমান",
    phone: "01711112222",
    email: "arahman@gmail.com",
    tier: "founding",
    status: "active",
    joinedDate: "2026-01-10",
    expiryDate: "2027-01-10",
    totalSaved: 2000,
    emailVerified: true
  },
  {
    id: "HC-1002",
    name: "নুসরাত জাহান",
    phone: "01811112222",
    email: "nusrat@gmail.com",
    tier: "premium",
    status: "active",
    joinedDate: "2026-03-15",
    expiryDate: "2027-03-15",
    totalSaved: 300,
    emailVerified: true
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: "tx1",
    memberId: "HC-1001",
    memberName: "মোঃ আব্দুর রহমান",
    partnerId: "p1",
    partnerName: "পপুলার ডায়াগনস্টিক সেন্টার",
    amount: 5000,
    saved: 500,
    date: "2026-06-12 10:30 AM"
  },
  {
    id: "tx3",
    memberId: "HC-1002",
    memberName: "নুসরাত জাহান",
    partnerId: "p3",
    partnerName: "লাজ ফার্মা লিমিটেড",
    amount: 3000,
    saved: 300,
    date: "2026-07-02 01:20 PM"
  },
  {
    id: "tx4",
    memberId: "HC-1001",
    memberName: "মোঃ আব্দুর রহমান",
    partnerId: "p2",
    partnerName: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
    amount: 15000,
    saved: 1500,
    date: "2026-07-10 11:45 AM"
  }
];

export interface Doctor {
  id: string;
  name: string;
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
  isActive: boolean;
}

export { initialDoctors } from "./initialDoctors";
