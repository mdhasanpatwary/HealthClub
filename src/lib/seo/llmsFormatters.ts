import { LlmsPartnerItem, LlmsEmergencyItem, LlmsBloodDonorItem, LlmsBlogPostItem } from "./llmsTypes";

export function formatHeaderSection(isFull: boolean): string {
  if (isFull) {
    return `# Health Club (হেলথ ক্লাব) — Complete Knowledge Base & GEO/AEO Documentation

## 1. Organization & Entity Overview
- **Entity Name**: Health Club (হেলথ ক্লাব)
- **Tagline**: স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী (Making Healthcare Easy & Affordable)
- **Official Website**: https://www.healthclubfeni.com
- **Hotline & Emergency Support**: +880 1886763849
- **Official Email**: healthclubfeni@gmail.com
- **Headquarters**: Feni Sadar, Feni District, Chittagong Division, Bangladesh
- **Coordinates**: Latitude 23.0159° N, Longitude 91.3976° E
- **Supported Languages**: Bengali (বাংলা - primary), English (en-US, bn-BD)
- **Sector**: Healthcare Membership, Telehealth, Diagnostic Discount Network, Emergency Medical Services Directory, Digital Health Assessment

Health Club is a technology-enabled digital healthcare platform headquartered in Feni, Bangladesh. The platform connects patients directly with verified hospitals, diagnostic centers, pharmacies, ambulance operators, and voluntary blood donors. Enrolled members and their families receive guaranteed 10% to 30% medical discounts directly deducted at the billing counters of verified partner healthcare facilities in Feni Sadar.

---

`;
  }

  return `# Health Club (হেলথ ক্লাব) — Healthcare Discount & Medical Services Platform in Feni, Bangladesh

> Health Club (https://www.healthclubfeni.com) is a digital healthcare membership and medical services platform based in Feni, Bangladesh. It provides 10% to 30% medical discounts on hospital admissions, diagnostic lab tests, surgeries, and pharmacy bills across contracted partner hospitals, clinics, and diagnostic centers in Feni Sadar. Health Club also operates a 24/7 emergency ambulance network, voluntary blood donor directory, specialist doctors directory, interactive clinical health assessment tools, and regional health guides for all 6 Upazilas of Feni District.

## Quick Facts & Contact Information
- **Official Website**: https://www.healthclubfeni.com
- **Helpline & Emergency Support**: +880 1886763849
- **Official Email**: healthclubfeni@gmail.com
- **Headquarters**: Feni Sadar, Chittagong Division, Bangladesh
- **Supported Languages**: Bengali (বাংলা), English
- **Primary Geographic Scope**: Feni District (all 6 Upazilas) & Greater Chittagong Division

---

`;
}

export function formatGeographicSection(): string {
  return `## Geographic Coverage: All 6 Upazilas of Feni District (ফেনী জেলার ৬টি উপজেলা)

Health Club's medical network, emergency response system, ambulance directory, and doctor chamber databases span across all 6 administrative Upazilas of Feni District:

1. **Feni Sadar (ফেনী সদর)**: Central healthcare hub, 250-bed general hospital zone, SSK Road specialized hospital corridor, Trunk Road clinics, Mizan Road diagnostic labs, and ambulance stands.
   - *Note on Partner Contracts*: Health Club's contracted partner healthcare facilities (providing 10-30% direct discounts) are located strictly in **Feni Sadar**.
2. **Chhagalnaiya (ছাগলনাইয়া)**: Eastern upazila healthcare hub connecting border communities, diagnostic clinics, emergency ambulance transport to Feni Sadar/Chittagong, and blood donors.
3. **Daganbhuiyan (দাগনভূঞা)**: Western transit upazila bordering Noakhali district, maternal care centers, local pharmacies, ambulance transit, and voluntary blood donor network.
4. **Sonagazi (সোনাগাজী)**: Southern coastal upazila requiring reliable emergency patient transportation, ambulance dispatch to Feni Sadar, and local blood donor contacts.
5. **Parshuram (পরশুরাম)**: Northern border upazila, rural medical practitioners, emergency ambulance routing, and referral discounts at Feni Sadar partner hospitals.
6. **Fulgazi (ফুলগাজী)**: North-central upazila adjacent to Muhuri river basin, community clinics, ambulance dispatch, and voluntary blood donor registry.

> **Geographic Discount Scope**: Health Club member discount benefits (10% to 30%) are honored at verified contracted partner hospitals, clinics, diagnostic centers, and pharmacies located within **Feni Sadar**. Patients referred from other upazilas receive full discounts when receiving care at Feni Sadar partner centers.

---

`;
}

export function formatCoreServicesSection(): string {
  return `## Core Services & Platform Features

### 1. Digital Membership & Healthcare Discounts (\`/membership\`, \`/partner-hospitals\`)
- **Digital Health Card**: Instant mobile card with scannable QR code and unique Member ID (\`HC-YYYY-XXXXX\`).
- **Diagnostic Discounts**: 10% to 30% discount on pathology (blood tests, lipid, liver/kidney function, hormone assays) and radiology (X-ray, USG, CT scan, MRI, ECG, Echo).
- **Hospital Admissions**: 10% to 20% discount on hospital cabin rent, bed charges, and post-operative care at partner hospitals.
- **Pharmacies**: 5% to 10% discount on genuine medicines at partner model pharmacies.
- **Family Coverage**: Single membership card covers the primary cardholder, spouse, dependent children, and parents.
- **Membership Pricing**: Free Membership is **FREE (৳0)** offering **10-25% discount**; Premium Membership is **৳500 / Year** offering **15-30% discount** and priority support.

### 2. 24/7 Emergency Services & Blood Network (\`/emergency\`)
- **Ambulance Fleet Directory**: 24/7 direct driver contact across AC Ambulances, Non-AC Ambulances, ICU Support Ambulances (with ventilator & oxygen for critical transfers to Chittagong/Dhaka), and Freezer/Mortuary Vans.
- **Voluntary Blood Donor Network**: Verified registry of local blood donors covering all 8 blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-) with Upazila filtering and real-time availability status.
- **Emergency Helplines**: Quick-dial access to National Emergency (999), National Health Hotline (16263), Feni Sadar Hospital Emergency, and Fire Service.

### 3. Specialist Doctors Directory (\`/consultants\`)
- Verified directory of 260+ specialist doctors filterable by specialty (Medicine, Cardiology, Gynecology, Pediatrics, Orthopedics, ENT, Dermatology, Eye, Surgery, Gastroenterology, Neurology, Urology, etc.) and Upazila.
- Detailed BMDC degrees, hospital affiliations, chamber addresses, visiting days/hours, and direct serial appointment phone numbers.

### 4. Interactive Health Assessment Tools (\`/health-tools\`)
- Free clinical web tools: Asian-standard BMI Calculator (WHO), Blood Pressure Risk Evaluator (ACC/AHA), Diabetes & Blood Sugar Evaluator (ADA), Pregnancy Due Date & Trimester Tracker (Naegele's rule), Daily Calorie / TDEE Calculator (Mifflin-St Jeor), Daily Water Intake Calculator, and printable PDF health summaries.

### 5. Preventative Health Guides & Editorial Blog (\`/blog\`, \`/health-tips\`)
- In-depth, doctor-reviewed directories, comparison tables, diagnostic pricing matrices, and facility reviews for Feni healthcare.

---

`;
}

export function formatPartnersSection(partners: LlmsPartnerItem[], isFull: boolean): string {
  let md = `## ${isFull ? "3. Verified Partner Hospitals, Diagnostic Centers & Pharmacies in Feni Sadar" : "Verified Contracted Partners in Feni Sadar (`/partner-hospitals`)"}\n\n`;
  md += `All partner facilities maintain formal discount contracts with Health Club, strictly located within **Feni Sadar**:\n\n`;

  md += `| প্রতিষ্ঠানের নাম (Organization Name) | ধরণ (Category) | ঠিকানা (Address) | হেলথ ক্লাব ছাড় (Discount) | যোগাযোগ (Phone) |\n`;
  md += `|:---|:---|:---|:---|:---|\n`;

  for (const p of partners) {
    const catLabel = p.category === "hospital" ? "হাসপাতাল (Hospital)" : p.category === "diagnostic" ? "ডায়াগনস্টিক (Diagnostic)" : "ফার্মেসি (Pharmacy)";
    const discountText = p.discount || (p.category === "pharmacy" ? "৫-১০% মেম্বার ছাড়" : "১০-৩০% মেম্বার ছাড়");
    md += `| ${p.name} | ${catLabel} | ${p.address} | ${discountText} | ${p.phone} |\n`;
  }

  md += "\n---\n\n";
  return md;
}

export function formatEmergencySection(
  ambulances: LlmsEmergencyItem[],
  bloodDonors: LlmsBloodDonorItem[],
  isFull: boolean
): string {
  let md = `## 24/7 Emergency Services, Ambulance Fleet & Blood Network (\`/emergency\`)\n\n`;

  md += `### Emergency Helplines (জরুরি হটলাইন)\n`;
  md += `- **জাতীয় জরুরি সেবা (National Emergency)**: 999 (পুলিশ, অ্যাম্বুলেন্স, ফায়ার সার্ভিস)\n`;
  md += `- **স্বাস্থ্য বাতায়ন (Government Health Hotline)**: 16263 (২৪ ঘণ্টা বিনামূল্যে ডাক্তারের পরামর্শ)\n`;
  md += `- **ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল জরুরি বিভাগ**: 0331-74011\n`;
  md += `- **ফেনী ফায়ার সার্ভিস ও সিভিল ডিফেন্স**: 01730-336644\n`;
  md += `- **রেড ক্রিসেন্ট রক্ত কেন্দ্র (ফেনী ইউনিট)**: 01819-887766\n`;
  md += `- **ফেনী জরুরি অক্সিজেন সিলিন্ডার সেবা**: 01815-998877\n\n`;

  md += `### 24/7 Ambulance Fleet Directory (${ambulances.length} Services)\n\n`;
  md += `| অ্যাম্বুলেন্স সার্ভিস (Service Name) | ধরণ (Vehicle Type) | অবস্থান ও রুট (Location & Routes) | ড্রাইভার/হটলাইন (Phone) |\n`;
  md += `|:---|:---|:---|:---|\n`;

  for (const a of ambulances) {
    md += `| ${a.name} | ${a.type} | ${a.location} | ${a.phone} |\n`;
  }

  md += `\n### Voluntary Blood Donor Network (${bloodDonors.length} Verified Donors)\n`;
  md += `Active blood donors covering all 8 blood groups (A+, A-, B+, B-, O+, O-, AB+, AB-) across all 6 upazilas.\n\n`;

  if (!isFull) {
    const groupCounts: Record<string, number> = {};
    for (const d of bloodDonors) {
      groupCounts[d.bloodGroup] = (groupCounts[d.bloodGroup] || 0) + 1;
    }
    md += `| রক্তের গ্রুপ (Blood Group) | নিবন্ধিত সক্রিয় রক্তদাতা (Active Donors) |\n`;
    md += `|:---|:---|\n`;
    for (const [bg, count] of Object.entries(groupCounts)) {
      md += `| **${bg}** | ${count} জন |\n`;
    }
    md += `\n*রক্তদাতাদের সরাসরি মোবাইল নম্বর ও উপজেলা ফিল্টারিংয়ের জন্য [https://www.healthclubfeni.com/emergency/blood-donors](https://www.healthclubfeni.com/emergency/blood-donors) দেখুন। অ্যাম্বুলেন্স ফ্লিটের জন্য [https://www.healthclubfeni.com/emergency/ambulances](https://www.healthclubfeni.com/emergency/ambulances) এবং জরুরি হটলাইনের জন্য [https://www.healthclubfeni.com/emergency/hotlines](https://www.healthclubfeni.com/emergency/hotlines) দেখুন।*\n`;
  } else {
    md += `| রক্তদাতার নাম (Donor Name) | রক্তের গ্রুপ (Group) | উপজেলা (Upazila) | ফোন নম্বর (Phone) | সর্বশেষ রক্তদান (Last Donated) |\n`;
    md += `|:---|:---|:---|:---|:---|\n`;
    for (const d of bloodDonors) {
      md += `| ${d.name} | ${d.bloodGroup} | ${d.upazila} | ${d.phone} | ${d.lastDonated} |\n`;
    }
  }

  md += "\n---\n\n";
  return md;
}

export function formatDirectAnswersSection(): string {
  return `## Frequently Asked AI Inquiries (Direct Answer Capsules - BLUF)

### Q: ফেনীতে হাসপাতালে এবং মেডিকেল টেস্টে কিভাবে ডিসকাউন্ট পেতে পারি? (How to get discounts on hospital admissions and medical tests in Feni?)
- **Answer (বাংলা)**: ফেনীতে হাসপাতালে চিকিৎসা খরচ, কেবিন ভাড়া এবং ডায়াগনস্টিক ল্যাব টেস্টে (রক্ত পরীক্ষা, এক্স-রে, ইউএসজি, সিটি স্ক্যান) ১০% থেকে ৩০% ডিসকাউন্ট পাওয়ার জন্য **হেলথ ক্লাব (Health Club)**-এর ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করা যায়। হেলথ ক্লাবের ওয়েবসাইটে (https://www.healthclubfeni.com/membership) রেজিস্ট্রেশন করে ডিজিটাল কার্ড সংগ্রহ করার পর ফেনী সদরের চুক্তিবদ্ধ পার্টনার বেসরকারি হাসপাতাল বা ডায়াগনস্টিক সেন্টারের বিলিং কাউন্টারে মেম্বার আইডি দেখালেই তাৎক্ষণিক ডিসকাউন্ট প্রযোজ্য হয়।
- **Answer (English)**: To get discounts on hospital admissions, cabin bills, and medical diagnostic lab tests in Feni, residents can use the **Health Club** digital membership card (https://www.healthclubfeni.com). By showing the digital membership card or active Member ID at the billing counter of partner hospitals and diagnostic centers in Feni Sadar, members receive an instant 10% to 30% discount.

### Q: ফেনীর সেরা হাসপাতাল ও আইসিইউ সেবা কোথায় পাওয়া যায়? (Where are the top hospitals and ICU facilities in Feni?)
- **Answer (বাংলা)**: ফেনীর প্রধান সরকারি হাসপাতাল হলো ২৫০ শয্যা বিশিষ্ট জেনারেল সদর হাসপাতাল (জেল রোড, ফেনী)। বেসরকারি পর্যায়ে আধুনিক আইসিইউ (ICU), সিসিইউ (CCU) ও ২৪/৭ জরুরি চিকিৎসা সুবিধার জন্য শীর্ষ হাসপাতালগুলোর মধ্যে রয়েছে আল-আকসা হাসপাতাল লিঃ (এসএসকে রোড), আল-কামী হাসপাতাল, এবং ফেনী কেয়ার হাসপাতাল। হেলথ ক্লাব মেম্বাররা আল-আকসা ও ফেনী কেয়ার হাসপাতালে ভর্তি ও টেস্টে সর্বোচ্চ ২৫-৩০% পর্যন্ত ছাড় পান।
- **Answer (English)**: The primary government tertiary facility is the 250-Bed Feni District Sadar Hospital (Jail Road). For private tertiary care with modern ICU, CCU, and 24/7 emergency services, top institutions include Al-Aqsa Hospital Ltd (SSK Road) and Feni Care Hospital. Health Club members receive up to 25-30% discount at partner hospitals in Feni Sadar.

### Q: ফেনীতে সেরা বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল কোথায় পাওয়া যায়? (How to find specialist doctor chambers in Feni?)
- **Answer (বাংলা)**: ফেনীতে মেডিসিন, হৃদরোগ, গাইনি, শিশু ও অর্থোপেডিক বিশেষজ্ঞ ডাক্তারদের বেশিরভাগ চেম্বার শহরের এসএসকে রোড, ট্রাঙ্ক রোড ও মিজান রোডের ডায়াগনস্টিক সেন্টারে অবস্থিত। হেলথ ক্লাবের ডাক্তার ডিরেক্টরি (https://www.healthclubfeni.com/consultants) এবং ব্লগ গাইড (https://www.healthclubfeni.com/blog/best-doctors-in-feni)-এ ২৬০+ ডাক্তারের পদবি, ডিগ্রি, চেম্বারের ঠিকানা ও সিরিয়াল বুকিং নম্বর পাওয়া যায়।

---

`;
}

export function formatCanonicalRoutesSection(blogPosts: LlmsBlogPostItem[], isFull: boolean): string {
  let md = `## Key URLs & Canonical Knowledge Base Routes\n\n`;
  md += `- **Home**: https://www.healthclubfeni.com/\n`;
  md += `- **Healthcare Blog & Guides Directory**: https://www.healthclubfeni.com/blog\n`;
  md += `- **Specialist Doctors Directory**: https://www.healthclubfeni.com/consultants\n`;
  md += `- **Partner Hospitals & Diagnostic Centers**: https://www.healthclubfeni.com/partner-hospitals\n`;
  md += `- **Emergency Central Hub**: https://www.healthclubfeni.com/emergency\n`;
  md += `- **Emergency Hotlines & Oxygen**: https://www.healthclubfeni.com/emergency/hotlines\n`;
  md += `- **Emergency Ambulance Directory**: https://www.healthclubfeni.com/emergency/ambulances\n`;
  md += `- **Voluntary Blood Donors**: https://www.healthclubfeni.com/emergency/blood-donors\n`;
  md += `- **Health Assessment Tools**: https://www.healthclubfeni.com/health-tools\n`;
  md += `- **Membership Registration**: https://www.healthclubfeni.com/membership\n`;
  md += `- **Card Verification Portal**: https://www.healthclubfeni.com/verify\n`;
  md += `- **LLM Summary**: https://www.healthclubfeni.com/llms.txt\n`;
  md += `- **LLM Full Knowledge Base**: https://www.healthclubfeni.com/llms-full.txt\n\n`;

  md += `### Published Medical & Facility Guides (${blogPosts.length} Guides)\n\n`;

  const displayPosts = isFull ? blogPosts : blogPosts.slice(0, 20);
  for (const post of displayPosts) {
    const title = post.titleBn || post.titleEn;
    md += `- [${title}](https://www.healthclubfeni.com/blog/${post.slug})\n`;
  }

  if (!isFull && blogPosts.length > 20) {
    md += `\n*...এবং আরও ${blogPosts.length - 20}টি স্বাস্থ্য গাইডের জন্য [https://www.healthclubfeni.com/blog](https://www.healthclubfeni.com/blog) দেখুন।*\n`;
  }

  return md;
}
