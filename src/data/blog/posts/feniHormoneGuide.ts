import { BlogPost } from "@/types/blog";
import { FENI_HORMONE_TEST_PRICING } from "./feniHormonePricing";
import {
  FENI_HORMONE_COMPARISON_TABLE,
  FENI_HORMONE_CENTERS,
} from "./feniHormoneCenters";

export const FENI_HORMONE_TEST_FERTILITY_GUIDE: BlogPost = {
  slug: "feni-hormone-test-fertility-guide",
  titleBn:
    "ফেনীতে হরমোন টেস্ট (FSH, LH, Prolactin, Testosterone) খরচ ও প্রজনন স্বাস্থ্য পরীক্ষা ২০২৬",
  titleEn:
    "Female & Male Hormone Test Cost in Feni: Fertility Blood Tests, Labs & Specialist Guide 2026",
  excerptBn:
    "ফেনীতে নারী ও পুরুষের প্রজনন হরমোন টেস্টের (FSH, LH, Prolactin, Testosterone, AMH, Estradiol) খরচ, পিসিওডি/পিসিওএস (PCOS) স্ক্রিনিং, বন্ধ্যত্ব ডায়াগনসিস, পিরিয়ডের ২-৩য় দিনে স্যাম্পল দেওয়ার সঠিক নিয়ম, শীর্ষ কেমিলুমিনেসেন্স প্যাথলজি ল্যাব এবং হেলথ ক্লাবে ১০-৩০% মেম্বার ছাড়ের পূর্ণাঙ্গ গাইড।",
  excerptEn:
    "Comprehensive guide to male and female fertility hormone test costs in Feni Sadar: FSH, LH, Prolactin, Total Testosterone, AMH, Estradiol, PCOS screening profiles, CLIA lab reviews, Day 2-3 sample collection rules, and 10-30% Health Club member discounts.",
  category: "diagnostic-guide",
  categoryNameBn: "ডায়াগনস্টিক ও ল্যাব গাইড",
  categoryNameEn: "Diagnostic & Lab Guide",
  publishedDate: "2026-03-28",
  modifiedDate: "2026-09-28",
  readTimeBn: "১১ মিনিট পাঠ",
  readTimeEn: "11 min read",
  author: {
    nameBn: "মেডিকেল এডিটোরিয়াল টিম",
    nameEn: "Medical Editorial Team",
    roleBn: "হেলথ ক্লাব এন্ডোক্রাইনোলজি ও ফার্টিলিটি রিসার্চ বিভাগ",
    roleEn: "Health Club Endocrinology & Fertility Desk",
    avatarUrl: "/images/member-card-logo.webp",
  },
  coverImage: "/images/blog/best-diagnostic-centers-feni.webp",
  coverImageAlt:
    "Female and Male Fertility Hormone Test Cost FSH LH Prolactin Testosterone in Feni 2026",
  tags: [
    "হরমোন টেস্ট খরচ ফেনী",
    "প্রোল্যাকটিন টেস্ট",
    "টেস্টোস্টেরন পরীক্ষা",
    "Hormone test cost in Feni",
    "Fertility hormone profile price Feni",
    "FSH LH Test Feni",
    "AMH Test Feni",
    "PCOS Test Feni",
  ],
  metaKeywords: [
    "hormone test cost in feni",
    "fertility blood test price feni",
    "fsh lh test fee in feni sadar",
    "prolactin test cost feni",
    "testosterone test price feni",
    "amh test cost in feni",
    "pcos hormone profile feni",
    "estradiol e2 test feni",
    "beta hcg blood test feni",
    "dhea sulfate test feni",
    "ফেনীতে হরমোন টেস্ট খরচ",
    "প্রোল্যাকটিন টেস্ট ফেনী",
    "টেস্টোস্টেরন পরীক্ষা ফেনী",
    "এএমএইচ টেস্ট খরচ ফেনী",
    "পিসিওএস রক্ত পরীক্ষা",
    "health club feni hormone test discount",
  ],
  keyHighlightsBn: [
    "ফেনী সদর উপজেলার অনুমোদিত ডায়াগনস্টিক সেন্টারে একক হরমোন টেস্টের (যেমন: FSH, LH, Prolactin, Testosterone) নিয়মিত ফি ৳৫০০ - ৳১,০০০ এবং সম্পূর্ণ ফার্টিলিটি বা পিসিওএস হরমোন প্যানেলের ফি ৳১,৮০০ - ৳৪,৫০০।",
    "কেমিলুমিনেসেন্স ইমিউনোঅ্যাসে (CLIA / ECLIA) প্রযুক্তি: আধুনিক রশ কোবাস (Roche Cobas) ও অ্যাবট আর্কিটেক্ট মেশিনে অতি সূক্ষ্ম পিকোগ্রাম বা ন্যানোগ্রাম মাত্রার হরমোন নিখুঁতভাবে পরিমাপ করা হয়।",
    "মাসিকের ২য় বা ৩য় দিনের বেসলাইন নীতি: নারী প্রজনন হরমোন FSH, LH এবং Estradiol (E2) পরীক্ষার রক্তের নমুনা সর্বদা মাসিকের ২য় বা ৩য় দিন সকালে প্রদান করতে হয়।",
    "প্রোল্যাকটিন পরীক্ষার মানসিক প্রস্তুতি: মানসিক চাপ, উদ্বেগ বা দ্রুত হেঁটে আসলে প্রোল্যাকটিন কৃত্রিমভাবে বেড়ে যায়; তাই ল্যাবে পৌঁছে কমপক্ষে ২০-৩০ মিনিট শান্তভাবে বসে বিশ্রাম নেওয়া বাধ্যতামূলক।",
    "এন্টি-মুলেরিয়ান হরমোন (AMH) দিয়ে ডিম্বাশয়ের ডিম্বাণুর রিজার্ভ নির্ণয়: বয়সজনিত ডিম্বাণু হ্রাস বা প্রিম্যাচিউর মেনোপজ মূল্যায়নে এএমএইচ অত্যন্ত নিখুঁত বায়োমার্কার যা মাসের যেকোনো দিন করা যায়।",
    "পুরুষ বন্ধ্যত্ব ও টেস্টোস্টেরন মূল্যায়ন: সকাল ৮টা থেকে ১০টার মধ্যে রক্তের স্যাম্পল দিয়ে সিরাম টেস্টোস্টেরন, এফএসএইচ ও এলএইচ টেস্ট করে শুক্রাণু উৎপাদন ও টেস্টিকুলার কার্যক্ষমতা নির্ণয় করা হয়।",
    "পিসিওডি / পিসিওএস (PCOS) স্ক্রিনিং প্যানেল: অনিয়মিত পিরিয়ড, মুখে অতিরিক্ত লোম, ব্রণ ও ওজন বৃদ্ধির চিকিৎসায় এলএইচ:এফএসএইচ অনুপাত, টেস্টোস্টেরন, প্রোল্যাকটিন ও ফাস্টিং ইনসুলিন পরীক্ষা অপরিহার্য।",
    "হেলথ ক্লাব ডিজিটাল মেম্বারদের জন্য ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে সকল হরমোন ও ফার্টিলিটি রক্ত পরীক্ষায় সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড়।",
  ],
  introParagraphsBn: [
    "মানবদেহের প্রজনন স্বাস্থ্য, মানসিক ভারসাম্য, বিপাক প্রক্রিয়া এবং স্বাভাবিক বংশবৃদ্ধির জটিল শারীরবৃত্তীয় কার্যক্রম পরিচালিত হয় এন্ডোক্রাইন গ্রন্থি থেকে নিঃসৃত হরমোনের সূক্ষ্ম ভারসাম্যের মাধ্যমে। নারী ও পুরুষ উভয়ের ক্ষেত্রেই বন্ধ্যত্ব (Infertility), অনিয়মিত মাসিক চক্র, পলিসিস্টিক ওভারি সিন্ড্রোম (PCOS), শারীরিক দুর্বলতা কিংবা যৌন সক্ষমতা হ্রাসের মূল কারণ অনুসন্ধানে আধুনিক চিকিৎসাবিজ্ঞানের প্রথম পদক্ষেপ হলো রক্তের **প্রজনন হরমোন প্রোফাইল (Reproductive Hormone Profile)**। পূর্বে সনাতন এলাইজা (ELISA) বা তেজস্ক্রিয় পদ্ধতিতে এসব পরীক্ষা করা হতো, যাতে সময় বেশি লাগত এবং ফলাফলের নির্ভুলতায় তারতম্য ঘটত। তবে বর্তমানে ফেনী সদর উপজেলার আধুনিক ডায়াগনস্টিক ল্যাবগুলোতে সংযোজিত হয়েছে আন্তর্জাতিক মানের **সম্পূর্ণ স্বয়ংক্রিয় কেমিলুমিনেসেন্স ইমিউনোঅ্যাসে (CLIA ও ECLIA)** প্ল্যাটফর্ম।",
    "নারী প্রজনন স্বাস্থ্যের মূল্যায়নে পিটুইটারি ও ওভারিয়ান হরমোনগুলোর পারস্পরিক অনুপাত অত্যন্ত সংবেদনশীল। এর মধ্যে **ফলিকল স্টিমুলেটিং হরমোন (FSH)** ডিম্বাশয়ে ডিম্বাণু পরিপক্ব করতে উদ্দীপনা যোগায় এবং **লিউটিনাইজিং হরমোন (LH)** ডিম্বাণু নিঃসরণ বা ওভুলেশনে প্রধান ভূমিকা পালন করে। চিকিৎসাবিজ্ঞানের প্রটোকল অনুযায়ী, ডিম্বাশয়ের প্রাথমিক অবস্থা বা ওভেরিয়ান রিজার্ভ যাচাই করতে মাসিকের ২য় বা ৩য় দিনে (Early Follicular Phase) রক্তের বেসলাইন এফএসএইচ, এলএইচ এবং এস্ট্রাডিওল (E2) পরীক্ষা করা বাধ্যতামূলক। স্বাভাবিক নারীর ক্ষেত্রে এই সময়ে এফএসএইচ-এর মাত্রা এলএইচ-এর চেয়ে বেশি থাকে; কিন্তু পলিসিস্টিক ওভারি সিন্ড্রোমে (PCOS) এই অনুপাত উল্টে গিয়ে এলএইচ-এর মাত্রা দ্বিগুণ বা তিনগুণ পর্যন্ত বৃদ্ধি পেতে পারে।",
    "তরুণীদের মধ্যে বর্তমানে সবচেয়ে দ্রুত বর্ধনশীল হরমোনাল জটিলতা হলো **পিসিওডি বা পিসিওএস (PCOS/PCOD)**। অনিয়মিত পিরিয়ড, ডিম্বাশয়ে একাধিক সিস্ট, মুখে অবাঞ্ছিত অতিরিক্ত লোম (Hirsutism), অতিরিক্ত ব্রণ, চুল পড়া এবং স্থূলতার পেছনে প্রধান কারণ অতিরিক্ত পুরুষ হরমোন বা অ্যান্ড্রোজেনের উপস্থিতি। এজন্য চিকিৎসকরা **সিরাম টোটাল টেস্টোস্টেরন (Total Testosterone)**, **ফ্রি টেস্টোস্টেরন**, **ডিএইচইএ সালফেট (DHEA-S)** এবং মেটাবলিক ইনসুলিন রেজিস্ট্যান্সের জন্য **ফাস্টিং ইনসুলিন** পরীক্ষা নির্দেশ করে থাকেন। সঠিক সময়ে এই পরীক্ষাগুলো করিয়ে হরমোন বিশেষজ্ঞ বা গাইনি চিকিৎসকের পরামর্শ নিলে ভবিষ্যৎ বন্ধ্যত্ব ও ডায়াবেটিসের ঝুঁকি পুরোপুরি এড়ানো সম্ভব।",
    "নারীদের প্রজনন ক্ষমতা বাধার আরেকটি নীরব কারণ হলো রক্তে **সিরাম প্রোল্যাকটিন (Prolactin)** বৃদ্ধি পাওয়া বা হাইপারপ্রোল্যাকটিনোমিয়া। পিটুইটারি গ্রন্থি থেকে ক্ষরিত এই হরমোন সাধারণত দুগ্ধদানকারী মায়েদের বাড়ে; কিন্তু অবিবাহিত বা সন্তানহীন নারীর শরীরে প্রোল্যাকটিন বেড়ে গেলে ওভুলেশন বন্ধ হয়ে যায়, পিরিয়ড অনিয়মিত বা বন্ধ থাকে এবং স্তনবৃন্ত থেকে অস্বাভাবিক তরল নির্গত হতে পারে। প্রোল্যাকটিন অত্যন্ত স্ট্রেস-সংবেদনশীল (Stress-sensitive) হরমোন; তাই পরীক্ষার পূর্বে ল্যাবে এসে অন্তত ২০ থেকে ৩০ মিনিট শান্তভাবে শুয়ে বা বসে বিশ্রাম নেওয়া অত্যন্ত জরুরি।",
    "আধুনিক ফার্টিলিটি চিকিৎসার সবচেয়ে যুগান্তকারী বায়োমার্কার হলো **এন্টি-মুলেরিয়ান হরমোন (Serum AMH)**। একজন নারীর ডিম্বাশয়ে ঠিক কতগুলো কার্যকর ডিম্বাণু অবশিষ্ট আছে (Ovarian Reserve বা জৈবিক ঘড়ি) তা এএমএইচ পরীক্ষার মাধ্যমে নির্ভুলভাবে জানা যায়। অন্যান্য হরমোনের মতো এএমএইচ মাসিকের দিনের ওপর নির্ভর করে না; মাসের যেকোনো দিন যেকোনো সময়ে রক্ত দিয়ে এই পরীক্ষা করানো সম্ভব। বিশেষ করে ৩০ ঊর্ধ্ব নারীদের গর্ভধারণ পরিকল্পনা বা আইভিএফ (IVF) চিকিৎসার পূর্বে ডিম্বাশয়ের সক্ষমতা মূল্যায়নে এটি আন্তর্জাতিক স্বর্ণমান।",
    "পুরুষ প্রজনন স্বাস্থ্য ও বন্ধ্যত্বের ৫০ ভাগ ক্ষেত্রে পুরুষ হরমোনের তারতম্য দায়ী। শুক্রাণুর স্বল্পতা (Oligospermia) বা সম্পূর্ণ অনুপস্থিতিতে (Azoospermia) **সিরাম টোটাল টেস্টোস্টেরন**, **এফএসএইচ**, **এলএইচ** এবং **প্রোল্যাকটিন** পরীক্ষা করে নির্ণয় করা হয় সমস্যাটি অণ্ডকোষের নাকি মস্তিষ্কের পিটুইটারি গ্রন্থির। যেহেতু সকালে রক্তে টেস্টোস্টেরনের মাত্রা সর্বোচ্চ থাকে, তাই পুরুষদের এই রক্ত পরীক্ষাটি সকাল ৮টা থেকে ১০টার মধ্যে খালি পেটে সম্পন্ন করার পরামর্শ দেওয়া হয়।",
    "ফেনীতে প্রজনন স্বাস্থ্য ও গাইনি জটিলতায় অভিজ্ঞ পরামর্শের জন্য [ফেনীর সেরা গাইনি ও প্রসূতিরোগ বিশেষজ্ঞ](/blog/best-gynecologists-in-feni), ডিম্বাশয় ও জরায়ু মূল্যায়নে [ফেনী প্রেগন্যান্সি আল্ট্রাসোনোগ্রাফি ও অ্যানোমালি স্ক্যান গাইড](/blog/pregnancy-ultrasonography-4d-anomaly-scan-in-feni), সাধারণ শারীরিক দুর্বলতায় [ফেনীর সেরা মেডিসিন ডাক্তার](/blog/best-medicine-doctors-in-feni), থাইরয়েড হরমোন মূল্যায়নে [ফেনী থাইরয়েড ও টিএসএইচ টেস্ট গাইড](/blog/feni-thyroid-tsh-test-cost-guide), রক্তের সংক্রমণ ও হিমোগ্লোবিন দেখতে [ফেনী সিবিসি রক্তের পরীক্ষা গাইড](/blog/feni-blood-test-cbc-cost-guide), ইউটিআই ও ইনফেকশন স্ক্রিনিংয়ে [ফেনী প্রস্রাব ও কালচার টেস্ট গাইড](/blog/feni-urine-re-culture-test-guide), ডায়াবেটিস ও ইনসুলিন নিয়ন্ত্রণে [ফেনী ডায়াবেটিস ও এইচবিএওয়ানসি টেস্ট গাইড](/blog/feni-hba1c-diabetes-test-guide), সকল স্বাস্থ্য পরীক্ষার খরচের জন্য [মেডিকেল টেস্ট মূল্যতালিকা](/blog/feni-medical-test-price-list), সরকারি সেবায় [ফেনী ২৫০ শয্যা জেনারেল হাসপাতাল](/blog/feni-sadar-hospital-guide), এবং সর্বোচ্চ মেম্বার ডিসকাউন্ট পেতে [ফেনী হেলথ ক্লাব মেম্বারশিপ গাইড](/blog/feni-health-club-membership-discount-guide) রোগীদের জন্য অত্যন্ত তথ্যবহুল নির্দেশিকা।",
    "ফেনী সদর শহরের স্বনামধন্য প্যাথলজি ল্যাব ও হাসপাতালগুলোতে একক প্রজনন হরমোন টেস্টের বাজার ফি সাধারণত ৫০০ থেকে ১,০০০ টাকা এবং পূর্ণাঙ্গ ফার্টিলিটি বা পিসিওএস হরমোন প্রোফাইলের ফি ১,৮০০ থেকে ৪,৫০০ টাকা পর্যন্ত হয়ে থাকে। তবে হেলথ ক্লাবের ডিজিটাল কার্ডধারীরা ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে (যেমন: প্যাসিফিক হেলথ কেয়ার সেন্টার, লাইফ কেয়ার ডায়াগনস্টিক সেন্টার, ইম্পেরিয়াল নিউরোকেয়ার, ফেনী ম্যাক্স ডায়াগনস্টিক ও আল-আকসা হাসপাতাল) মেম্বারশিপ প্রদর্শন করে এফএসএইচ, এলএইচ, প্রোল্যাকটিন, টেস্টোস্টেরন, এএমএইচ ও বিটা-এইচসিজিসহ সকল হরমোন ও প্যাথলজি বিলে সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড় (১০-৩০% মেম্বার ছাড়) পেয়ে থাকেন।",
  ],
  diagnosticComparisonTable: FENI_HORMONE_COMPARISON_TABLE,
  diagnosticCenters: FENI_HORMONE_CENTERS,
  diagnosticTestPricingBn: FENI_HORMONE_TEST_PRICING,
  bookingGuideBn: {
    titleBn: "৪টি ধাপে হরমোন রক্ত পরীক্ষার সঠিক সময়, প্রস্তুতি ও স্যাম্পল দেওয়ার নিয়ম",
    stepsBn: [
      {
        step: "১ম ধাপ: মাসিকের সঠিক দিন নির্ধারণ (Menstrual Cycle Timing Day 2-3)",
        title: "এফএসএইচ, এলএইচ ও এস্ট্রাডিওলের জন্য মাসিকের ২য় বা ৩য় দিন নির্বাচন",
        desc: "নারী প্রজনন হরমোনের বেসলাইন মাত্রা জানতে মাসিকের রক্তস্রাব শুরুর দিনটিকে ১ম দিন ধরে ২য় বা ৩য় দিন সকালবেলা রক্ত দিতে হবে। তবে এএমএইচ বা বিটা-এইচসিজি মাসের যেকোনো দিন করা যায় এবং ওভুলেশন ট্র্যাকিংয়ে প্রোজেস্টেরন ২১তম দিনে করতে হয়।",
      },
      {
        step: "২য় ধাপ: মানসিক বিশ্রাম ও প্রোল্যাকটিন প্রটোকল (Rest & Stress Relaxation)",
        title: "ল্যাবে পৌঁছানোর পর ২০-৩০ মিনিট শান্তভাবে বসে বিশ্রাম নেওয়া",
        desc: "প্রোল্যাকটিন হরমোন সামান্য মানসিক উদ্বেগ, ভয় বা দ্রুত সিঁড়ি বেয়ে উঠলে কৃত্রিমভাবে বৃদ্ধি পায়। তাই রক্ত দেওয়ার পূর্বে ল্যাবরেটরির ওয়েটিং এরিয়ায় মোবাইল বা দুশ্চিন্তা দূরে রেখে অন্তত আধা ঘণ্টা শান্তভাবে বিশ্রাম নিন। স্তনবৃন্তে কোনো চাপ দেওয়া থেকে বিরত থাকুন।",
      },
      {
        step: "৩য় ধাপ: সকালের ফাস্টিং ও টেস্টোস্টেরন নমুনা (Morning Fasting 8-10 AM)",
        title: "সকাল ৮টা থেকে ১০টার মধ্যে ৮-১০ ঘণ্টার খালি পেটে রক্তের নমুনা ড্র",
        desc: "পুরুষদের টেস্টোস্টেরন এবং নারীদের পিসিওএস স্ক্রিনিংয়ে ফাস্টিং ইনসুলিনের জন্য রাতের খাবারের পর ৮-১০ ঘণ্টা অনাহারে থেকে সকালে স্যাম্পল দিতে হয়। ল্যাবের দক্ষ ফ্লেবোটোমিস্ট এসএসটি (SST) জেল-ভ্যাকুটেইনার টিউবে রক্তের নমুনা সংগ্রহ করবেন।",
      },
      {
        step: "৪র্থ ধাপ: কেমিলুমিনেসেন্স প্রসেসিং ও মেম্বার ছাড় (CLIA Report & Savings)",
        title: "৩-৬ ঘণ্টায় স্বয়ংক্রিয় রিপোর্ট ডেলিভারি ও হেলথ ক্লাব মেম্বার ছাড়",
        desc: "সম্পূর্ণ স্বয়ংক্রিয় অ্যানালাইজারে সিরাম পৃথক করে টেস্ট সম্পন্ন হয়। জরুরি প্রোল্যাকটিন ও বিটা-এইচসিজি রিপোর্ট ৩-৪ ঘণ্টার মধ্যে পাওয়া যায়। বিল পরিশোধের সময় হেলথ ক্লাবের ডিজিটাল কার্ড প্রদর্শন করে বিলের ওপর সরাসরি ১০% থেকে ৩০% ক্যাশলেস ডিসকাউন্ট গ্রহণ করুন।",
      },
    ],
  },
  selectionGuideBn: {
    titleBn: "ফেনীতে নির্ভরযোগ্য হরমোন ও ফার্টিলিটি ডায়াগনস্টিক ল্যাব নির্বাচনের ৫টি মূল মানদণ্ড",
    pointsBn: [
      {
        title: "১. ফুল অটোমেটেড কেমিলুমিনেসেন্স (CLIA / ECLIA) সিস্টেম",
        desc: "ল্যাবরেটরিতে বিশ্বমানের রশ কোবাস (Roche Cobas), অ্যাবট আর্কিটেক্ট (Abbott Architect) বা সিমেন্সের সম্পূর্ণ স্বয়ংক্রিয় ইমিউনোঅ্যাসে অ্যানালাইজার রয়েছে কিনা নিশ্চিত করুন। পুরনো ম্যানুয়াল এলাইজায় হরমোনের পিকোগ্রাম মাত্রার নির্ভুলতা পাওয়া যায় না।",
      },
      {
        title: "২. ৩ স্তরের দৈনিক ইন্টারনাল কোয়ালিটি কন্ট্রোল (3-Level QC)",
        desc: "প্রতিদিন টেস্ট শুরুর আগে লো, নরমাল ও হাই কন্ট্রোল সিরাম রান করে মেশিনের ক্যালিব্রেশন যাচাই করা হয় এমন ডায়াগনস্টিক সেন্টার বেছে নিন, যা ভুল রিপোর্টের সম্ভাবনা শূন্যে নামিয়ে আনে।",
      },
      {
        title: "৩. নারী রোগীদের রক্তের নমুনা সংগ্রহে দক্ষ নারী ফ্লেবোটোমিস্ট",
        desc: "প্রজনন হরমোন ও ফার্টিলিটি টেস্টে নারীদের মানসিক স্বাচ্ছন্দ্য ও গোপনীয়তা অত্যন্ত গুরুত্বপূর্ণ। দক্ষ নারী টেকনোলজিস্ট দ্বারা আলাদা প্রাইভেট স্যাম্পলিং কক্ষে রক্ত নেওয়ার সুবিধা থাকা বাঞ্ছনীয়।",
      },
      {
        title: "৪. কনসালট্যান্ট ক্লিনিক্যাল প্যাথলজিস্ট কর্তৃক অনুমোদিত রিপোর্ট",
        desc: "শুধুমাত্র ল্যাব টেকনিশিয়ানের প্রিন্ট নয়, বরং বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) স্বীকৃত কনসালট্যান্ট বায়োকেমিস্ট বা হিস্টোপ্যাথলজিস্ট কর্তৃক পুঙ্খানুপুঙ্খভাবে নিরীক্ষিত ও স্বাক্ষরিত রিপোর্ট প্রদান করে এমন ল্যাব নির্বাচন করুন।",
      },
      {
        title: "৫. হেলথ ক্লাব পার্টনারশিপ ও নিশ্চিত ১০-৩০% মেম্বার সাশ্রয়",
        desc: "বন্ধ্যত্ব বা পিসিওএস চিকিৎসায় প্রতি মাসে একাধিকবার হরমোন মনিটরিং করতে হয়। ফেনী সদরের হেলথ ক্লাব অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে টেস্ট করালে প্রতিটি ভিজিটে সরাসরি ১০% থেকে ৩০% মেম্বার ডিসকাউন্ট নিশ্চিত পাওয়া যায়।",
      },
    ],
  },
  faqs: [
    {
      questionBn: "ফেনীতে হরমোন ও ফার্টিলিটি টেস্টের খরচ কত?",
      questionEn: "What is the cost of hormone and fertility blood tests in Feni?",
      answerBn:
        "ফেনী সদর উপজেলার অনুমোদিত ডায়াগনস্টিক ল্যাবগুলোতে একক হরমোন টেস্টের (যেমন: FSH, LH, Prolactin, Total Testosterone) ফি সাধারণত ৫০০ থেকে ১,০০০ টাকা। এএমএইচ (AMH) টেস্টের ফি ১,৫০০ থেকে ২,৬০০ টাকা এবং পূর্ণাঙ্গ ফার্টিলিটি বা পিসিওএস হরমোন প্যানেলের ফি ১,৮০০ থেকে ৪,৫০০ টাকা। হেলথ ক্লাবের নিবন্ধিত কার্ডধারীরা পার্টনার ল্যাবে ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড় পেয়ে থাকেন।",
      answerEn:
        "In diagnostic laboratories across Feni Sadar, single reproductive hormone tests (such as FSH, LH, Prolactin, and Total Testosterone) cost BDT 500 - 1,000. Serum AMH ranges from BDT 1,500 - 2,600, while comprehensive fertility/PCOS panels cost BDT 1,800 - 4,500. Registered Health Club members receive guaranteed 10% to 30% discounts at partner centers.",
    },
    {
      questionBn: "এফএসএইচ (FSH) এবং এলএইচ (LH) টেস্ট মাসিকের ২য় বা ৩য় দিনে কেন করতে হয়?",
      questionEn: "Why must FSH and LH tests be performed on Day 2 or Day 3 of the menstrual cycle?",
      answerBn:
        "মাসিক শুরুর ২য় বা ৩য় দিনকে আর্লি ফলিকুলার ফেজ বলা হয়। এই সময়ে ডিম্বাশয়ের প্রাথমিক বেসলাইন কার্যক্ষমতা এবং পিটুইটারি গ্রন্থির হরমোন সংকেত সবচেয়ে নিরপেক্ষভাবে প্রতিফলিত হয়। চক্রের অন্য সময়ে হরমোনের স্বাভাবিক ওঠানামার কারণে ডিম্বাশয়ের ডিম্বাণুর রিজার্ভ বা পিসিওএসের সঠিক অবস্থা বোঝা যায় না।",
      answerEn:
        "Day 2 or 3 of the menstrual cycle represents the early follicular baseline phase. Testing during this window provides the most accurate clinical evaluation of ovarian reserve and pituitary gonadotropin balance without interference from mid-cycle ovulatory surges.",
    },
    {
      questionBn: "প্রোল্যাকটিন (Prolactin) টেস্ট করানোর আগে কী কী বিশেষ নিয়ম মানতে হয়?",
      questionEn: "What special preparations are required before taking a serum prolactin blood test?",
      answerBn:
        "প্রোল্যাকটিন মানসিক চাপ ও শারীরিক পরিশ্রমে দ্রুত বেড়ে যায়। তাই রক্ত দেওয়ার পূর্বে অন্তত ২০-৩০ মিনিট ল্যাবে শান্ত হয়ে বসে বিশ্রাম নিতে হয়। ঘুম ভাঙার অন্তত ২-৩ ঘণ্টা পর স্যাম্পল দেওয়া উত্তম। এছাড়া টেস্টের আগের রাতে স্তনবৃন্তে কোনো চাপ দেওয়া বা ভারী শারীরিক ব্যায়াম করা থেকে সম্পূর্ণ বিরত থাকতে হবে।",
      answerEn:
        "Serum prolactin is highly sensitive to physiological and emotional stress. Patients must rest quietly in the laboratory for 20-30 minutes prior to venipuncture. Blood should be drawn 2-3 hours after awakening, avoiding breast stimulation or vigorous exercise the preceding evening.",
    },
    {
      questionBn: "এএমএইচ (AMH) টেস্ট কী এবং এটি কীভাবে ডিম্বাশয়ের ডিম্বাণু রিজার্ভ নির্দেশ করে?",
      questionEn: "What is an AMH test and how does it evaluate ovarian egg reserve?",
      answerBn:
        "এএমএইচ বা এন্টি-মুলেরিয়ান হরমোন ডিম্বাশয়ের ক্ষুদ্র ক্রমবর্ধমান ফলিকলগুলো থেকে তৈরি হয়। রক্তে এর মাত্রা দেখে একজন নারীর ডিম্বাশয়ে গর্ভধারণের উপযোগী কতগুলো ডিম্বাণু অবশিষ্ট রয়েছে তা নির্ভুলভাবে জানা যায়। বয়স বাড়ার সাথে সাথে এএমএইচ কমতে থাকে। এটি মাসিকের চক্রের ওপর নির্ভরশীল নয় এবং মাসের যেকোনো দিন করা যায়।",
      answerEn:
        "Anti-Müllerian Hormone (AMH) is secreted by growing pre-antral ovarian follicles and serves as a direct biomarker of biological ovarian reserve. Unlike FSH or LH, AMH remains stable throughout the menstrual cycle and can be evaluated on any cycle day.",
    },
    {
      questionBn: "পিসিওএস বা পিসিওডি (PCOS/PCOD) শনাক্ত করতে কোন কোন রক্ত পরীক্ষা জরুরি?",
      questionEn: "Which blood hormone tests are essential for diagnosing PCOS or PCOD?",
      answerBn:
        "পিসিওএস ডায়াগনসিসে চিকিৎসকরা সাধারণত মাসিকের ২য়/৩য় দিনে সিরাম এফএসএইচ ও এলএইচ (LH:FSH অনুপাত যাচাই), প্রোল্যাকটিন, টোটাল ও ফ্রি টেস্টোস্টেরন, ডিএইচইএ-এস, থাইরয়েড টিএসএইচ এবং ফাস্টিং ইনসুলিন পরীক্ষা দিয়ে থাকেন। এর সাথে পেলভিক আল্ট্রাসোনোগ্রাফি করে ডিম্বাশয়ের সিস্ট পর্যবেক্ষণ করা হয়।",
      answerEn:
        "Investigating PCOS requires Day 2-3 LH and FSH (evaluating elevated LH:FSH ratio), Serum Prolactin, Total and Free Testosterone, DHEA-S, TSH, and Fasting Insulin to evaluate hyperandrogenism and metabolic insulin resistance, complemented by pelvic ultrasonography.",
    },
    {
      questionBn: "পুরুষদের টেস্টোস্টেরন পরীক্ষা কখন এবং কীভাবে করা উচিত?",
      questionEn: "When and how should male testosterone blood tests be conducted?",
      answerBn:
        "পুরুষের রক্তে টেস্টোস্টেরনের মাত্রা সারকাডিয়ান ছন্দ অনুযায়ী সকালবেলা সর্বোচ্চ থাকে এবং বিকেলে কমে যায়। তাই নির্ভুল ফলাফল পেতে সকাল ৮টা থেকে ১০টার মধ্যে ৮ ঘণ্টার খালি পেটে রক্তের নমুনা ড্র করতে হবে। টেস্টের পূর্বে অ্যালকোহল ও ভারী রাতজাগা পরিহার করা প্রয়োজন।",
      answerEn:
        "Serum testosterone exhibits circadian diurnal rhythmicity, peaking in the morning hours. Blood samples should strictly be collected between 8:00 AM and 10:00 AM following an overnight fast for accurate hypogonadism assessment.",
    },
    {
      questionBn: "হরমোন রক্ত পরীক্ষার রিপোর্ট পেতে কত সময় লাগে?",
      questionEn: "How long does it take to receive hormone test results in Feni?",
      answerBn:
        "আধুনিক স্বয়ংক্রিয় কেমিলুমিনেসেন্স প্ল্যাটফর্মে একক হরমোন (যেমন: Prolactin, FSH, LH, Testosterone) এবং জরুরি বিটা-এইচসিজি রিপোর্ট ৩ থেকে ৬ ঘণ্টার মধ্যে পাওয়া যায়। তবে এএমএইচ বা ডিএইচইএ-এস জাতীয় উচ্চতর পরীক্ষার চূড়ান্ত ভ্যালিডেটেড রিপোর্ট পেতে ১২ থেকে ২৪ ঘণ্টা সময় লাগতে পারে।",
      answerEn:
        "On fully automated chemiluminescence platforms, standard single hormone assays (Prolactin, FSH, LH, Testosterone) and stat Beta-hCG reports are delivered in 3 to 6 hours. Specialized tests like AMH and DHEA-S typically take 12 to 24 hours for consultant validation.",
    },
    {
      questionBn: "হেলথ ক্লাব মেম্বার কার্ড দিয়ে ফেনীতে হরমোন টেস্টে কীভাবে ডিসকাউন্ট পাওয়া যায়?",
      questionEn: "How can patients receive discounts on hormone tests in Feni using Health Club cards?",
      answerBn:
        "হেলথ ক্লাবের নিবন্ধিত সদস্যরা ফেনী সদরের অনুমোদিত পার্টনার ডায়াগনস্টিক সেন্টারে (যেমন: প্যাসিফিক হেলথ কেয়ার, লাইফ কেয়ার, ইম্পেরিয়াল নিউরোকেয়ার, ফেনী ম্যাক্স ও আল-আকসা হাসপাতাল) বিলিং কাউন্টারে ডিজিটাল মেম্বার কার্ড প্রদর্শন করে সকল প্রজনন ও হরমোন টেস্টে সরাসরি ১০% থেকে ৩০% নিশ্চিত মেম্বার ছাড় (১০-৩০% মেম্বার ছাড়) পেয়ে থাকেন।",
      answerEn:
        "Health Club members present their digital membership card before billing at authorized partner centers in Feni Sadar (including Pacific Health Care, Life Care, Imperial Neurocare, Feni Max, and Al-Aqsa Hospital) to receive guaranteed 10% to 30% discounts across all endocrine laboratory tests.",
    },
  ],
  relatedSlugs: [
    "best-gynecologists-in-feni",
    "pregnancy-ultrasonography-4d-anomaly-scan-in-feni",
    "best-medicine-doctors-in-feni",
    "feni-thyroid-tsh-test-cost-guide",
    "feni-hba1c-diabetes-test-guide",
    "feni-blood-test-cbc-cost-guide",
    "feni-urine-re-culture-test-guide",
    "feni-kidney-creatinine-urea-test-guide",
    "feni-x-ray-digital-dr-cost-guide",
    "full-body-health-checkup-packages-in-feni",
    "feni-medical-test-price-list",
    "best-diagnostic-centers-in-feni",
    "feni-sadar-hospital-guide",
    "feni-health-club-membership-discount-guide",
  ],
};
