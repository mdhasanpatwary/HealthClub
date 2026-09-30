import { BlogPost, BlogReviewer } from "@/types/blog";
import { getBlogDoctorDepartment } from "@/data/blog/departmentBlogMapping";
import { formatArticleDate } from "@/lib/dateUtils";

/**
 * Standard registry of verified BMDC-registered physician reviewers by department.
 * Powers Schema.org `reviewedBy: Physician` markup and on-page E-E-A-T badges.
 */
const DEPARTMENT_REVIEWER_MAP: Record<string, Omit<BlogReviewer, "reviewDateBn">> = {
  nephrology: {
    doctorNameBn: "ডা. মো. ইকবাল হোসেন",
    doctorNameEn: "Dr. Md. Iqbal Hossain",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি - নেফ্রোলজি",
    specialtyBn: "কিডনি রোগ ও ডায়ালাইসিস বিশেষজ্ঞ",
    profileSlug: "dr-md-iqbal-hossain-nephrologist",
    bmdcRegNo: "A-54210",
  },
  orthopedics: {
    doctorNameBn: "ডা. মো. ইকবাল হোসেন",
    doctorNameEn: "Dr. Md. Iqbal Hossain",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমএস - অর্থোপেডিক্স (নিটোর)",
    specialtyBn: "কনসালট্যান্ট - অর্থোপেডিক সার্জারি ও ট্রমা, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-iqbal-hossain-orthopedic",
    bmdcRegNo: "A-72802",
  },
  dental: {
    doctorNameBn: "ডাঃ জাহিদ হোসেন মজুমদার",
    doctorNameEn: "Dr. Zahid Hossain Mazumder",
    degreesBn: "বিডিএস, পিজিটি - ওএমএস (ঢামেক)",
    specialtyBn: "মুখ ও দন্তরোগ বিশেষজ্ঞ এবং ডেন্টাল সার্জন",
    profileSlug: "dr-zahid-hossain-mazumder",
    bmdcRegNo: "10244",
  },
  urology: {
    doctorNameBn: "ডাঃ মো: ফাহমিদুল হক (রিয়ন)",
    doctorNameEn: "Dr. Md. Fahmidul Haque Rion",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমএস - ইউরোলজি (কুমেক)",
    specialtyBn: "ইউরোলজিস্ট ও অ্যান্ডোলজিস্ট",
    profileSlug: "dr-md-fahmidul-haque-rion",
    bmdcRegNo: "A-63275",
  },
  gynecology: {
    doctorNameBn: "ডা. সালমা আক্তার",
    doctorNameEn: "Dr. Salma Akter",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস (গাইনি ও অবস)",
    specialtyBn: "কনসালট্যান্ট - স্ত্রীরোগ ও প্রসূতিবিদ্যা, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-salma-akter-gynecologist",
    bmdcRegNo: "A-46250",
  },
  dermatology: {
    doctorNameBn: "ডা. ফাতেমাতুজ জোহরা অন্তরা",
    doctorNameEn: "Dr. Fatematuz Zohra Antara",
    degreesBn: "এমবিবিএস, ডি.ডি (থাইল্যান্ড), এফসিপিএস (চর্ম ও যৌন), ফেলোশিপ (লেজার)",
    specialtyBn: "চর্ম, এলার্জি, সেক্স ও লেজার বিশেষজ্ঞ",
    profileSlug: "dr-fatematuz-zohra-antara",
    bmdcRegNo: "A-56231",
  },
  pediatrics: {
    doctorNameBn: "ডাঃ মোঃ জিয়াউদ্দিন আহমেদ",
    doctorNameEn: "Dr. Md. Ziauddin Ahmed",
    degreesBn: "এমবিবিএস, ডিসিএইচ, ফেলোশিপ ইন নিওনেটোলজি",
    specialtyBn: "শিশু ও নবজাতক রোগ বিশেষজ্ঞ, কনসালট্যান্ট, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-ziauddin-ahmed",
    bmdcRegNo: "A-54028",
  },
  neurology: {
    doctorNameBn: "ডা. মো. নাজমুল হাসান",
    doctorNameEn: "Dr. Md. Nazmul Hasan",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি - নিউরোলজি",
    specialtyBn: "কনসালট্যান্ট - নিউরোলজি ও নিউরোমেডিসিন, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-nazmul-hasan-neurologist",
    bmdcRegNo: "A-56410",
  },
  gastroenterology: {
    doctorNameBn: "সহযোগী অধ্যাপক ডা. অসীম কুমার সাহা",
    doctorNameEn: "Assoc. Prof. Dr. Ashim Kumar Saha",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি - গ্যাস্ট্রোএন্টারোলজি",
    specialtyBn: "সহযোগী অধ্যাপক ও বিভাগীয় প্রধান, গ্যাস্ট্রোএন্টারোলজি বিভাগ",
    profileSlug: "dr-ashim-kumar-saha",
    bmdcRegNo: "A-30540",
  },
  ent: {
    doctorNameBn: "সহযোগী অধ্যাপক ডা. মোহাম্মদ জহিরুল ইসলাম",
    doctorNameEn: "Assoc. Prof. Dr. Mohammad Zahirul Islam",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), ডিএলও, এফসিপিএস - ইএনটি",
    specialtyBn: "নাক কান গলা ও হেড-নেক সার্জারি বিশেষজ্ঞ ও সার্জন",
    profileSlug: "dr-mohammad-zahirul-islam-ent",
    bmdcRegNo: "A-31084",
  },
  cardiology: {
    doctorNameBn: "ডা. মো. নিজাম উদ্দিন",
    doctorNameEn: "Dr. Md. Nizam Uddin",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি - কার্ডিওলজি",
    specialtyBn: "সহকারী অধ্যাপক ও বিভাগীয় প্রধান, হৃদরোগ বিভাগ, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-nizam-uddin-cardiologist",
    bmdcRegNo: "A-41872",
  },
  diabetes: {
    doctorNameBn: "ডা. মো. কবির হোসেন",
    doctorNameEn: "Dr. Md. Kabir Hossain",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমডি - এন্ডোক্রাইনোলজি (বিএসএমএমইউ)",
    specialtyBn: "ডায়াবেটিস, থাইরয়েড ও হরমোন রোগ বিশেষজ্ঞ",
    profileSlug: "dr-md-kabir-hossain-endocrinologist",
    bmdcRegNo: "A-57176",
  },
  psychiatry: {
    doctorNameBn: "সহকারী অধ্যাপক ডা. মোহাম্মদ শাহাদাত হোসাইন",
    doctorNameEn: "Asst. Prof. Dr. Mohammad Shahadat Hossain",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস - সাইকিয়াট্রি",
    specialtyBn: "সহকারী অধ্যাপক, জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট (NIMH)",
    profileSlug: "dr-mohammad-shahadat-hossain-psychiatrist",
    bmdcRegNo: "A-51846",
  },
  surgery: {
    doctorNameBn: "ডা. মো. সাইফুল ইসলাম",
    doctorNameEn: "Dr. Md. Saiful Islam",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এমএস - জেনারেল সার্জারি",
    specialtyBn: "জেনারেল, ল্যাপারোস্কোপিক ও ট্রমা সার্জন, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-saiful-islam-surgeon",
    bmdcRegNo: "A-56245",
  },
  eye: {
    doctorNameBn: "ডা. মো. রফিকুল ইসলাম",
    doctorNameEn: "Dr. Md. Rafiqul Islam",
    degreesBn: "এমবিবিএস, ডিও, এফসিপিএস - চক্ষু",
    specialtyBn: "চক্ষু বিশেষজ্ঞ ও ফ্যাকো সার্জন",
    profileSlug: "dr-md-rafiqul-islam-eye",
    bmdcRegNo: "A-36520",
  },
  physiotherapy: {
    doctorNameBn: "ডা. এস. এম. তানভীর আহমেদ",
    doctorNameEn: "Dr. S. M. Tanvir Ahmed",
    degreesBn: "বিপিটি, এমপিটি (অর্থোপেডিক্স), পিজিটি (নিউরোরিহ্যাব)",
    specialtyBn: "ফিজিওথেরাপি ও রিহ্যাবিলিটেশন কনসালট্যান্ট",
    profileSlug: "dr-sm-tanvir-ahmed-physiotherapist",
    bmdcRegNo: "PT-1482",
  },
  medicine: {
    doctorNameBn: "ডা. মো. কামরুল হাসান",
    doctorNameEn: "Dr. Md. Kamrul Hasan",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস - মেডিসিন",
    specialtyBn: "কনসালট্যান্ট - মেডিসিন ও ক্রিটিক্যাল কেয়ার, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-kamrul-hasan-medicine",
    bmdcRegNo: "A-51540",
  },
};

/**
 * Dedicated slug-level reviewer overrides for specialized procedures/scans.
 */
const SLUG_REVIEWER_OVERRIDES: Record<string, Omit<BlogReviewer, "reviewDateBn">> = {
  "feni-4d-anomaly-scan-pregnancy-ultrasound-guide": {
    doctorNameBn: "ডা. রোকেয়া বেগম",
    doctorNameEn: "Dr. Rokeya Begum",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), ডিএমআরডি - রেডিওলজি ও সোনোলজি",
    specialtyBn: "কনসালট্যান্ট - রেডিওলজি ও ইমেজিং, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-rokeya-begum-radiologist",
    bmdcRegNo: "A-52840",
  },
  "feni-mammography-breast-cancer-screening-guide": {
    doctorNameBn: "ডা. রোকেয়া বেগম",
    doctorNameEn: "Dr. Rokeya Begum",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), এফসিপিএস - অবস্ ও গাইনি",
    specialtyBn: "কনসালট্যান্ট - গাইনি ও ব্রেস্ট অনকোলজি স্ক্রিনিং, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-rokeya-begum-gynecology",
    bmdcRegNo: "A-48920",
  },
  "feni-hearing-aid-audiometry-hearing-test-guide": {
    doctorNameBn: "ডা. মো. সাইফুল ইসলাম",
    doctorNameEn: "Dr. Md. Saiful Islam",
    degreesBn: "এমবিবিএস, বিসিএস (স্বাস্থ্য), ডিএলও - ইএনটি, এফসিপিএস - ইএনটি ফাইনাল পর্ব",
    specialtyBn: "কনসালট্যান্ট - ইএনটি বিভাগ, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-md-saiful-islam-ent",
    bmdcRegNo: "A-41890",
  },
  "feni-female-gynecologist-doctor-chamber-list": {
    doctorNameBn: "সহকারী অধ্যাপক (ডাঃ) কামরুন নাহার (রলী)",
    doctorNameEn: "Asst. Prof. Dr. Kamrun Nahar Roli",
    degreesBn: "এমবিবিএস, বিসিএস স্বাস্থ্য, এফসিপিএস - অবস্ ও গাইনী, এমআরসিওজি পার্ট-২ লন্ডন",
    specialtyBn: "সহকারী অধ্যাপক - গাইনী ও অবস্, ২৫০ শয্যা জেনারেল হাসপাতাল ফেনী",
    profileSlug: "dr-kamrun-nahar-roli",
    bmdcRegNo: "A-45967",
  },
};

/**
 * Resolves the authoritative BMDC-registered physician reviewer for a blog post.
 * Checks post.reviewedBy first, then slug-level overrides, then department mapping,
 * and finally defaults to the senior medicine consultant.
 */
export function resolveBlogReviewer(post: BlogPost): BlogReviewer {
  const defaultDate = formatArticleDate(post.modifiedDate || post.publishedDate);

  if (post.reviewedBy && post.reviewedBy.doctorNameBn) {
    return {
      ...post.reviewedBy,
      reviewDateBn: post.reviewedBy.reviewDateBn || defaultDate,
    };
  }

  const slugOverride = SLUG_REVIEWER_OVERRIDES[post.slug];
  if (slugOverride) {
    return {
      ...slugOverride,
      reviewDateBn: defaultDate,
    };
  }

  const dept = getBlogDoctorDepartment(post.slug, post.doctorGroups?.[0]?.department);
  const deptReviewer = DEPARTMENT_REVIEWER_MAP[dept] || DEPARTMENT_REVIEWER_MAP.medicine;

  return {
    ...deptReviewer,
    reviewDateBn: defaultDate,
  };
}

/**
 * Generates Schema.org `reviewedBy: Physician` structured data for MedicalWebPage and BlogPosting.
 */
export function getReviewerSchema(reviewer: BlogReviewer, siteUrl: string) {
  const profileUrl = reviewer.profileSlug
    ? (reviewer.profileSlug.startsWith("http")
        ? reviewer.profileSlug
        : `${siteUrl}/consultants/${reviewer.profileSlug.replace(/^\//, "")}`)
    : `${siteUrl}/about-us`;

  return {
    "@type": "Physician",
    name: reviewer.doctorNameBn,
    ...(reviewer.doctorNameEn ? { alternateName: reviewer.doctorNameEn } : {}),
    jobTitle: reviewer.specialtyBn,
    medicalSpecialty: reviewer.specialtyBn,
    description: reviewer.degreesBn,
    url: profileUrl,
    ...(reviewer.photoUrl
      ? {
          image: reviewer.photoUrl.startsWith("http")
            ? reviewer.photoUrl
            : `${siteUrl}${reviewer.photoUrl}`,
        }
      : {}),
    ...(reviewer.bmdcRegNo ? { identifier: `BMDC Reg: ${reviewer.bmdcRegNo}` } : {}),
  };
}
