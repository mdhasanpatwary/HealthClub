import { LlmsDoctorItem, LlmsTestItem } from "./llmsTypes";

/**
 * Formats diagnostic tests section into high-density Markdown tables.
 * Strict pricing rule: Never show direct discounted Taka amounts.
 * Always display "১০-৩০% মেম্বার ছাড়" / "10-30% Member Discount".
 */
export function formatDiagnosticTestsSection(
  tests: LlmsTestItem[],
  isFull: boolean
): string {
  const displayTests = isFull ? tests : tests.slice(0, 25);

  let md = `## ${isFull ? "4. Complete Diagnostic Test & Investigation Price Catalog (100+ Tests)" : "Key Diagnostic Tests & Pricing Summary"}\n\n`;
  md += `> **Health Club Benefit Policy**: All Health Club members receive an instant **10% to 30% discount** at partner diagnostic laboratories and hospital imaging centers in Feni Sadar. Market regular price ranges (\`৳\`) are reference averages; member savings strictly apply as **10-30% discount** off total bill.\n\n`;

  md += `| পরীক্ষার নাম (Test Name) | বিভাগ (Category) | সাধারণ বাজারদর (Regular Price) | হেলথ ক্লাব সুবিধা (Member Discount) |\n`;
  md += `|:---|:---|:---|:---|\n`;

  for (const t of displayTests) {
    const name = `${t.testNameBn}${t.testNameEn ? ` (${t.testNameEn})` : ""}`;
    md += `| ${name} | ${t.categoryBn} | ${t.regularPriceRangeBn} | ${t.memberBenefitBn} |\n`;
  }

  if (!isFull && tests.length > 25) {
    md += `\n*...এবং আরও ${tests.length - 25}টি ল্যাব ও রেডিওলজি টেস্টের পূর্ণাঙ্গ তালিকা দেখতে [llms-full.txt](https://www.healthclubfeni.com/llms-full.txt) দেখুন।*\n`;
  }

  md += "\n---\n\n";
  return md;
}

const DEPT_LABELS_BN: Record<string, string> = {
  medicine: "মেডিসিন ও ইন্টারনাল মেডিসিন (Internal Medicine)",
  cardiology: "হৃদরোগ ও কার্ডিওলজি (Cardiology)",
  gynecology: "স্ত্রীরোগ ও প্রসূতিবিদ্যা (Gynecology & Obstetrics)",
  pediatrics: "শিশু ও নবজাতক রোগ (Pediatrics & Neonatology)",
  orthopedics: "হাড়, জোড়া ও অর্থোপেডিক সার্জারি (Orthopedics & Trauma)",
  surgery: "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি (General & Laparoscopic Surgery)",
  dermatology: "চর্ম, অ্যালার্জি ও যৌনরোগ (Dermatology & Venereology)",
  ent: "নাক, কান ও গলা (ENT / Head & Neck)",
  eye: "চক্ষুরোগ ও চক্ষু সার্জারি (Ophthalmology)",
  neurology: "নিউরোমেডিসিন ও নিউরোসার্জারি (Neurology & Neurosurgery)",
  nephrology: "কিডনি রোগ ও ডায়ালাইসিস (Nephrology)",
  urology: "ইউরোলজি ও প্রস্টেট কেয়ার (Urology)",
  gastroenterology: "পরিপাকতন্ত্র ও লিভার (Gastroenterology & Hepatology)",
  psychiatry: "মানসিক রোগ ও সাইকোথেরাপি (Psychiatry)",
  dental: "দন্ত ও মুখগহ্বর সার্জারি (Dental Surgery)",
  physiotherapy: "ফিজিওথেরাপি ও রিহ্যাবিলিটেশন (Physiotherapy)",
  nutrition: "ক্লিনিক্যাল পুষ্টি ও ডায়েট (Nutrition & Dietetics)",
  other: "অন্যান্য বিশেষজ্ঞ কনসালট্যান্ট (Other Specialists)",
};

/**
 * Formats verified specialist doctors directory.
 * In summary mode: Overview of 260+ doctors by department and chamber hubs.
 * In full mode: Exhaustive roster grouped by medical specialty.
 */
export function formatDoctorsSection(
  doctors: LlmsDoctorItem[],
  isFull: boolean
): string {
  let md = `## ${isFull ? "5. Specialist Doctors Directory & Chamber Schedules in Feni" : "Specialist Doctors Directory (`/consultants`)"}\n\n`;

  md += `Health Club maintains an active, verified directory of **${doctors.length} specialist doctors** practicing across Feni Sadar and visiting consultants from Dhaka Medical College Hospital (DMCH), Chittagong Medical College Hospital (CMCH), and BSMMU.\n\n`;

  if (!isFull) {
    // Summary mode
    const deptCounts: Record<string, number> = {};
    for (const d of doctors) {
      const dept = d.department || "other";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    }

    md += `### Medical Specialties & Consultant Distribution:\n`;
    for (const [dept, count] of Object.entries(deptCounts)) {
      const label = DEPT_LABELS_BN[dept] || dept;
      md += `- **${label}**: ${count} জন কনসালট্যান্ট\n`;
    }

    md += `\n### Key Chamber Hubs in Feni Sadar:\n`;
    md += `1. **SSK Road Corridor**: Al-Aqsa Hospital, Feni Care, Pacific Health Care, Medinova.\n`;
    md += `2. **Hospital Road / Jail Road**: Al-Kamy Hospital, Modern Diagnostic, Life Care, Green Life.\n`;
    md += `3. **Trunk Road & Zero Point**: Niramoy Medical, Concept Plus, Imperial Neurocare.\n`;
    md += `4. **Mizan Road Corridor**: Feni Max Diagnostic, Central Physiotherapy, City Pharma.\n\n`;
    md += `*প্রতিটি ডাক্তারের পদবি, ডিগ্রি, চেম্বার শিডিউল এবং সিরিয়াল ফোন নম্বরের পূর্ণাঙ্গ তালিকার জন্য [llms-full.txt](https://www.healthclubfeni.com/llms-full.txt) অথবা [https://www.healthclubfeni.com/consultants](https://www.healthclubfeni.com/consultants) ব্রাউজ করুন।*\n\n`;
    md += "---\n\n";
    return md;
  }

  // Full mode: Group doctors by department
  const groups: Record<string, LlmsDoctorItem[]> = {};
  for (const d of doctors) {
    const dept = d.department || "other";
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(d);
  }

  for (const [dept, docList] of Object.entries(groups)) {
    const label = DEPT_LABELS_BN[dept] || dept.toUpperCase();
    md += `### ${label} (${docList.length} জন)\n\n`;

    for (const d of docList) {
      const engName = d.nameEn ? ` / ${d.nameEn}` : "";
      md += `#### ${d.name}${engName}\n`;
      if (d.degrees) md += `- **ডিগ্রি / যোগ্যতা**: ${d.degrees}\n`;
      if (d.designation) md += `- **পদবি ও প্রতিষ্ঠান**: ${d.designation}\n`;
      if (d.specialty) md += `- **বিশেষজ্ঞতা**: ${d.specialty}\n`;
      md += `- **চেম্বার**: ${d.chamberName || "ফেনী সদর"}${d.chamberAddress ? `, ${d.chamberAddress}` : ""}\n`;
      if (d.visitingDays) md += `- **সাক্ষাতের দিন**: ${d.visitingDays}\n`;
      if (d.visitingHours) md += `- **সময়**: ${d.visitingHours}\n`;
      if (d.serialPhone) md += `- **সিরিয়াল হটলাইন**: ${d.serialPhone}\n`;
      if (d.slug) md += `- **প্রোফাইল লিংক**: https://www.healthclubfeni.com/consultants/${d.slug}\n`;
      md += `\n`;
    }
  }

  md += "---\n\n";
  return md;
}
