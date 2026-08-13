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
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০৯৬১৩৭৮৭৮০১",
    logoText: "Popular",
    imageUrl: "/images/placeholders/diagnostic.png"
  },
  {
    id: "p2",
    name: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
    category: "hospital",
    address: "মিজান রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "১০৬০৬",
    logoText: "Labaid",
    imageUrl: "/images/placeholders/hospital.png"
  },
  {
    id: "p3",
    name: "লাজ ফার্মা লিমিটেড",
    category: "pharmacy",
    address: "ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০২-৯৩৪৩৫১৬",
    logoText: "Lazz",
    imageUrl: "/images/placeholders/pharmacy.png"
  },
  {
    id: "p5",
    name: "ইবনে সিনা ডায়াগনস্টিক সেন্টার",
    category: "diagnostic",
    address: "মহিপাল, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "০৯৬১০০০৯৬১০",
    logoText: "Ibn Sina",
    imageUrl: "/images/placeholders/diagnostic.png"
  },
  {
    id: "p6",
    name: "স্কয়ার হাসপাতাল (সিলেক্টেড সুবিধা)",
    category: "hospital",
    address: "গ্র্যান্ড ট্রাঙ্ক রোড, ফেনী",
    discount: "১০-৩০% ডিসকাউন্ট",
    phone: "১০৬১৬",
    logoText: "Square",
    imageUrl: "/images/placeholders/hospital.png"
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

export const initialDoctors: Doctor[] = [
  {
    id: "doc_1",
    name: "ডাঃ মোহাম্মদ শাহাদাত হোসেন",
    specialty: "মানসিক রোগ ও নিউরোসাইকিয়াট্রি বিশেষজ্ঞ",
    department: "psychiatry",
    degrees: "MBBS, BCS, MCPS, FCPS (Psychiatry)",
    designation: "সহকারী অধ্যাপক, জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট ও হাসপাতাল (NIMH), ঢাকা",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মা প্লাজা (জিয়া মহিলা কলেজের বিপরীতে), শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ২০৩ (২য় তলা)",
    visitingDays: "প্রতি শুক্রবার",
    visitingHours: "সকাল ৯:০০ - বিকাল ৫:০০",
    serialPhone: "01898221111, 01898445555, 09666747575",
    consultationFee: "৳১,০০০ (প্রথম সাক্ষাৎ)",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_2",
    name: "ডাঃ রিয়াজ উদ্দিন চৌধুরী",
    specialty: "মেডিসিন, লিভার ও পরিপাকতন্ত্র (গ্যাস্ট্রোএন্টারোলজি) বিশেষজ্ঞ",
    department: "medicine",
    degrees: "MBBS, BCS, MCPS, FCPS (Medicine), ট্রেইন্ড ফেলো (গ্যাস্ট্রোএন্টারোলজি)",
    designation: "কনসালট্যান্ট - মেডিসিন ও গ্যাস্ট্রোএন্টারোলজি",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ১০৫",
    visitingDays: "শনিবার - বৃহস্পতিবার",
    visitingHours: "বিকাল ৫:০০ - রাত ৯:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳৮০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_3",
    name: "ডাঃ মইনুল মাহমুদ সানী",
    specialty: "রক্তনালী ও ভাস্কুলার সার্জারি বিশেষজ্ঞ",
    department: "surgery",
    degrees: "MBBS, MS (Vascular Surgery)",
    designation: "সহকারী অধ্যাপক, ভাস্কুলার সার্জারি বিভাগ, বিএসএমএমইউ (পিজি হাসপাতাল), ঢাকা",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড কনসালটেশন সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ২০১",
    visitingDays: "প্রতি শুক্রবার",
    visitingHours: "বিকাল ৩:০০ - রাত ৮:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳১,০০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_4",
    name: "ডাঃ মোঃ তৌফিকুল হাসান ভূঁইয়া",
    specialty: "হাড়ভাঙ্গা, বাতব্যাথা ও অর্থোপেডিক সার্জারি বিশেষজ্ঞ",
    department: "orthopedics",
    degrees: "MBBS, BCS, MS (Orthopaedic Surgery)",
    designation: "সহকারী অধ্যাপক, অর্থোপেডিক বিভাগ, কুমিল্লা মেডিকেল কলেজ হাসপাতাল",
    chamberName: "ডিডি ল্যাব ডায়াগনস্টিক অ্যান্ড কনসালটেশন সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ৩০২",
    visitingDays: "প্রতি শনিবার, সোমবার ও বুধবার",
    visitingHours: "বিকাল ৪:০০ - রাত ৮:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳৮০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_5",
    name: "ডাঃ তুহিন শুভ্র দাস",
    specialty: "কিডনি ও মূত্রথলি রোগ (নেফ্রোলজি) বিশেষজ্ঞ",
    department: "nephrology",
    degrees: "MBBS, BCS, MD (Nephrology)",
    designation: "কনসালট্যান্ট - কিডনি রোগ বিভাগ, চট্টগ্রাম মেডিকেল কলেজ ও হাসপাতাল",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড কনসালটেশন সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ১০২",
    visitingDays: "প্রতি শুক্রবার ও শনিবার",
    visitingHours: "সকাল ১০:০০ - বিকাল ৪:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳১,০০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_6",
    name: "ডাঃ মোঃ কামরুল হাসান",
    specialty: "লিভার ও হেপাটোলজি রোগ বিশেষজ্ঞ",
    department: "hepatology",
    degrees: "MBBS, BCS, MD (Hepatology)",
    designation: "কনসালট্যান্ট, হেপাটোলজি বিভাগ, বিএসএমএমইউ (পিজি হাসপাতাল), ঢাকা",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ২০৪",
    visitingDays: "প্রতি শুক্রবার",
    visitingHours: "বিকাল ২:০০ - রাত ৮:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳১,০০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_7",
    name: "ডাঃ মোঃ আতিকুর রহমান",
    specialty: "বাত, ব্যাথা, প্যারালাইসিস ও রিউমাটোলজি বিশেষজ্ঞ",
    department: "rheumatology",
    degrees: "MBBS, BCS, MD (Rheumatology), FACR (USA)",
    designation: "রেজিস্ট্রার, রিউমাটোলজি বিভাগ, কুর্মিটোলা জেনারেল হাসপাতাল, ঢাকা",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড কনসালটেশন সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ৩০১",
    visitingDays: "প্রতি শুক্রবার",
    visitingHours: "সকাল ৯:০০ - বিকাল ৩:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳১,০০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_8",
    name: "ডাঃ সায়মা আক্তার",
    specialty: "খাদ্য, পুষ্টি ও ডায়েট বিশেষজ্ঞ (ক্লিনিক্যাল নিউট্রিশনিস্ট)",
    department: "nutrition",
    degrees: "MSc in Food & Nutrition, Certified Clinical Dietitian",
    designation: "চিফ কনসালট্যান্ট ডায়েটিশিয়ান ও নিউট্রিশন স্পেশালিস্ট",
    chamberName: "ডিডি ল্যাব স্পেশালাইজড ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ১০৪",
    visitingDays: "প্রতি রবি, মঙ্গল ও বৃহস্পতিবার",
    visitingHours: "বিকাল ৪:০০ - রাত ৮:০০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳৬০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_9",
    name: "ডাঃ মীর শওকত নেওয়াজ (নীরব)",
    specialty: "জেনারেল মেডিসিন ও ডায়াবেটিস রোগ অভিজ্ঞ চিকিৎসক",
    department: "medicine",
    degrees: "MBBS, CCD (BIRDEM), PGT (Medicine)",
    designation: "সিনিয়র মেডিকেল অফিসার ও ডায়াবেটোলজিস্ট",
    chamberName: "ডিডি ল্যাব ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মা প্লাজা, শহীদ শহীদুল্লাহ কায়সার রোড, ফেনী",
    roomNo: "রুম নং: ১০১",
    visitingDays: "প্রতিদিন (শুক্রবার বাদে)",
    visitingHours: "সন্ধ্যা ৬:০০ - রাত ৯:৩০",
    serialPhone: "01898221111, 01898445555",
    consultationFee: "৳৫০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_10",
    name: "ডাঃ নুসরাত জাহান চৌধুরী",
    specialty: "স্ত্রী রোগ, প্রসূতি ও বন্ধ্যাত্ব বিশেষজ্ঞ সার্জন (গাইনী)",
    department: "gynecology",
    degrees: "MBBS, DGO, FCPS (Gynae & Obs)",
    designation: "সহকারী অধ্যাপক ও গাইনী কনসালট্যান্ট, ২৫০ শয্যা জেনারেল হাসপাতাল, ফেনী",
    chamberName: "পপুলার ডায়াগনস্টিক সেন্টার",
    chamberAddress: "এসএসকে রোড, ফেনী",
    roomNo: "রুম নং: ২০১",
    visitingDays: "প্রতিদিন (শুক্রবার বাদে)",
    visitingHours: "বিকাল ৫:০০ - রাত ৮:৩০",
    serialPhone: "০৯৬১৩৭৮৭৮০১, 01811223344",
    consultationFee: "৳৮০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_11",
    name: "ডাঃ মোঃ আবদুল্লাহ আল নোমান (তৌহিদ)",
    specialty: "শিশু ও কিশোর রোগ বিশেষজ্ঞ (পেডিয়াট্রিক্স)",
    department: "pediatrics",
    degrees: "MBBS, DCH, MD (Pediatrics), FCPS (P)",
    designation: "সহকারী অধ্যাপক - শিশু বিভাগ, কুমিল্লা মেডিকেল কলেজ",
    chamberName: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
    chamberAddress: "মিজান রোড, ফেনী",
    roomNo: "রুম নং: ২০৫",
    visitingDays: "শনিবার, সোমবার ও বুধবার",
    visitingHours: "বিকাল ৫:০০ - রাত ৮:০০",
    serialPhone: "১০৬০৬, 01711223344",
    consultationFee: "৳৮০০",
    imageUrl: "",
    isActive: true
  },
  {
    id: "doc_12",
    name: "ডাঃ ফারহানা বিনতে রশীদ",
    specialty: "হৃদরোগ ও কার্ডিওলজি বিশেষজ্ঞ",
    department: "cardiology",
    degrees: "MBBS, BCS, MD (Cardiology), FCPS",
    designation: "সহকারী অধ্যাপক - হৃদরোগ বিভাগ, জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল (NICVD), ঢাকা",
    chamberName: "ইবনে সিনা ডায়াগনস্টিক সেন্টার",
    chamberAddress: "মহিপাল, ফেনী",
    roomNo: "রুম নং: ১০৮",
    visitingDays: "প্রতি বৃহস্পতিবার ও শুক্রবার",
    visitingHours: "সকাল ১০:০০ - বিকাল ৪:০০",
    serialPhone: "০৯৬১০০০৯৬১০, 01822334455",
    consultationFee: "৳১,০০০",
    imageUrl: "",
    isActive: true
  }
];

