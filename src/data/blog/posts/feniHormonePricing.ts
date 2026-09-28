import { DiagnosticTestPriceItem } from "@/types/blog";

export const FENI_HORMONE_TEST_PRICING: {
  titleBn: string;
  subtitleBn: string;
  titleEn: string;
  subtitleEn: string;
  tests: DiagnosticTestPriceItem[];
} = {
  titleBn: "ফেনীতে হরমোন ও প্রজনন স্বাস্থ্য টেস্ট খরচ এবং মেম্বার ছাড় ২০২৬",
  subtitleBn:
    "ফেনী সদর উপজেলার অনুমোদিত ডায়াগনস্টিক সেন্টারে নারী ও পুরুষের প্রজনন হরমোন, পিসিওডি স্ক্রিনিং ও ফার্টিলিটি রক্ত পরীক্ষার নিয়মিত বাজার ফি বনাম হেলথ ক্লাব মেম্বার কার্ডে ১০-৩০% নিশ্চিত ছাড়ের তালিকা।",
  titleEn: "Female & Male Hormone & Fertility Test Price Guide in Feni (2026)",
  subtitleEn:
    "Comprehensive comparison of regular market fees and 10-30% Health Club member discounts across Feni Sadar chemiluminescence immunoassay pathology labs.",
  tests: [
    // ১. মৌলিক নারী প্রজনন ও ওভুলেশন হরমোন
    {
      testNameBn: "সিরাম প্রোল্যাকটিন (Serum Prolactin / PRL Test)",
      testNameEn: "Serum Prolactin Hormone Test (Hyperprolactinemia, Galactorrhea & Infertility)",
      categoryBn: "প্রজনন ও পিটুইটারি হরমোন",
      regularPriceRangeBn: "৳৫০০ - ৳৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম এফএসএইচ (Serum FSH - Follicle Stimulating Hormone)",
      testNameEn: "Serum Follicle Stimulating Hormone (Ovarian Reserve & Spermatogenesis)",
      categoryBn: "প্রজনন ও ওভুলেশন হরমোন",
      regularPriceRangeBn: "৳৫০০ - ৳৮৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম এলএইচ (Serum LH - Luteinizing Hormone)",
      testNameEn: "Serum Luteinizing Hormone (Ovulation Surge & PCOS Diagnosis)",
      categoryBn: "প্রজনন ও ওভুলেশন হরমোন",
      regularPriceRangeBn: "৳৫০০ - ৳৮৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম এস্ট্রাডিওল (Serum Estradiol / E2)",
      testNameEn: "Serum Estradiol (E2) Test (Follicular Maturation & Endometrial Proliferation)",
      categoryBn: "স্ত্রী হরমোন ও ফলিকুলার বৃদ্ধি",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম প্রোজেস্টেরন (Serum Progesterone - Day 21)",
      testNameEn: "Serum Progesterone (Luteal Phase Defect & Ovulation Confirmation)",
      categoryBn: "ওভুলেশন ও প্রেগন্যান্সি স্থায়িত্ব",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "এন্টি-মুলেরিয়ান হরমোন (Serum AMH - Anti-Müllerian Hormone)",
      testNameEn: "Serum Anti-Müllerian Hormone (Ovarian Reserve & Biological Egg Clock)",
      categoryBn: "ওভেরিয়ান রিজার্ভ ও বন্ধ্যত্ব",
      regularPriceRangeBn: "৳১,৫০০ - ৳২,৬০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },

    // ২. পুরুষ ও নারী অ্যান্ড্রোজেন হরমোন
    {
      testNameBn: "সিরাম টোটাল টেস্টোস্টেরন (Serum Total Testosterone)",
      testNameEn: "Serum Total Testosterone (Male Hypogonadism, Female Hirsutism & Libido)",
      categoryBn: "অ্যান্ড্রোজেন ও পুরুষ হরমোন",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ফ্রি টেস্টোস্টেরন (Serum Free Testosterone)",
      testNameEn: "Serum Free Testosterone (Bioavailable Unbound Active Androgen)",
      categoryBn: "অ্যান্ড্রোজেন ও পুরুষ হরমোন",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম ডিএইচইএ সালফেট (Serum DHEA-S / DHEA-Sulfate)",
      testNameEn: "Serum DHEA-Sulfate (Adrenal Hyperandrogenism & Virilization)",
      categoryBn: "এড্রেনাল ও হরমোন ভারসাম্য",
      regularPriceRangeBn: "৳১,০০০ - ৳১,৮০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২৪ - ৪৮ ঘণ্টা",
    },

    // ৩. গর্ভাবস্থা ও সহায়ক এন্ডোক্রাইন টেস্ট
    {
      testNameBn: "সিরাম বিটা-এইচসিজি (Serum Beta-hCG Quantitative)",
      testNameEn: "Serum Beta Human Chorionic Gonadotropin (Early Pregnancy & Ectopic Detection)",
      categoryBn: "গর্ভধারণ ও একটোপিক স্ক্রিনিং",
      regularPriceRangeBn: "৳৫০০ - ৳৮৫০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "২ - ৪ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম টিএসএইচ (Serum TSH - Thyroid Stimulating Hormone)",
      testNameEn: "Serum TSH (Thyroid Dysfunction & Menstrual Irregularity Link)",
      categoryBn: "থাইরয়েড ও প্রজনন সহায়তা",
      regularPriceRangeBn: "৳৩০০ - ৳৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৩ - ৬ ঘণ্টা",
    },
    {
      testNameBn: "সিরাম কর্টিসোল মর্নিং (Serum Cortisol - Morning 8 AM)",
      testNameEn: "Serum Cortisol Morning Peak (Adrenal Function & Chronic Stress Axis)",
      categoryBn: "এড্রেনাল ও স্ট্রেস হরমোন",
      regularPriceRangeBn: "৳৬০০ - ৳১,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৪ - ৮ ঘণ্টা",
    },

    // ৪. সম্মিলিত প্রজনন ও পিসিওএস প্যাকেজ
    {
      testNameBn: "নারী বেসিক ফার্টিলিটি হরমোন প্রোফাইল (FSH, LH, Prolactin, TSH)",
      testNameEn: "Basic Female Fertility Hormone Panel (Day 2-3 Menstrual Cycle Baseline)",
      categoryBn: "ফার্টিলিটি স্ক্রিনিং প্রোফাইল",
      regularPriceRangeBn: "৳১,৮০০ - ৳২,৯০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "কম্প্রিহেন্সিভ পিসিওএস / পিসিওডি হরমোন প্যানেল (PCOS Diagnostic Panel)",
      testNameEn: "Comprehensive PCOS Panel (FSH, LH, Prolactin, Total Testosterone, TSH, Fasting Insulin)",
      categoryBn: "পিসিওএস ও ওভুলেশন প্যানেল",
      regularPriceRangeBn: "৳২,৮০০ - ৳৪,৫০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৮ - ১২ ঘণ্টা",
    },
    {
      testNameBn: "পুরুষ প্রজনন ও টেস্টোস্টেরন প্যানেল (Male Infertility Hormone Profile)",
      testNameEn: "Male Infertility Profile (Total Testosterone, FSH, LH, Prolactin)",
      categoryBn: "পুরুষ প্রজনন স্বাস্থ্য প্যানেল",
      regularPriceRangeBn: "৳১,৮০০ - ৳৩,০০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "৬ - ৮ ঘণ্টা",
    },
    {
      testNameBn: "অ্যাডভান্সড ওভেরিয়ান রিজার্ভ ও ইনফার্টিলিটি প্যাকেজ (Advanced Fertility Workup)",
      testNameEn: "Advanced Infertility Workup (AMH, FSH, LH, E2, Prolactin, TSH)",
      categoryBn: "উচ্চতর ফার্টিলিটি ও ডিম্বাণু রিজার্ভ",
      regularPriceRangeBn: "৳৩,৮০০ - ৳৬,২০০",
      memberPriceRangeBn: "১০-৩০% মেম্বার ছাড়",
      discountPercentageBn: "১০-৩০% মেম্বার ছাড়",
      turnaroundTimeBn: "১২ - ২৪ ঘণ্টা",
    },
  ],
};
