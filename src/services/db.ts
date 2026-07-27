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
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  saved: number;
  date: string;
}

// Initial seed data
export const initialPartners: Partner[] = [
  {
    id: "p1",
    name: "পপুলার ডায়াগনস্টিক সেন্টার",
    category: "diagnostic",
    address: "এসএসকে রোড, ফেনী",
    discount: "১০-২৫% ডিসকাউন্ট",
    phone: "০৯৬১৩৭৮৭৮০১",
    logoText: "Popular",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p2",
    name: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
    category: "hospital",
    address: "মিজান রোড, ফেনী",
    discount: "১০-২৫% ডিসকাউন্ট",
    phone: "১০৬০৬",
    logoText: "Labaid",
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p3",
    name: "লাজ ফার্মা লিমিটেড",
    category: "pharmacy",
    address: "ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-২৫% ডিসকাউন্ট",
    phone: "০২-৯৩৪৩৫১৬",
    logoText: "Lazz",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p5",
    name: "ইবনে সিনা ডায়াগনস্টিক সেন্টার",
    category: "diagnostic",
    address: "মহিপাল, ফেনী",
    discount: "১০-২৫% ডিসকাউন্ট",
    phone: "০৯৬১০০০৯৬১০",
    logoText: "Ibn Sina",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "p6",
    name: "স্কয়ার হাসপাতাল (সিলেক্টেড সুবিধা)",
    category: "hospital",
    address: "গ্র্যান্ড ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-২৫% ডিসকাউন্ট",
    phone: "১০৬১৬",
    logoText: "Square",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop"
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

