import { Partner, Doctor } from "@/services/db";

/**
 * Builds Category-aware FAQPage JSON-LD schema for Partner Hospitals,
 * Diagnostic Centers, and Pharmacies.
 */
export function generatePartnerFaqSchema(partner: Partner, doctors: Doctor[] = []) {
  const isPharmacy = partner.category === "pharmacy";
  const isHospital = partner.category === "hospital";

  const discountScopeText = isPharmacy
    ? "প্রেসক্রিপশন ঔষধ, ওটিসি ও স্বাস্থ্যপণ্যে"
    : "প্যাথলজি, ডায়াগনস্টিক টেস্ট ও স্বাস্থ্যসেবায়";

  const hoursText = isHospital
    ? `${partner.name}-এ ২৪ ঘণ্টা জরুরি স্বাস্থ্যসেবা, ইমার্জেন্সি সাপোর্ট ও ইনডোর চিকিৎসা সেবা চালু থাকে। প্যাথলজি ও বহির্বিভাগ সেবা প্রতিদিন সকাল থেকে রাত পর্যন্ত পরিচালিত হয়।`
    : isPharmacy
    ? `${partner.name} প্রতিদিন (${partner.workingHours || "সকাল ৮:০০ থেকে রাত ১১:৩০ পর্যন্ত"}) খোলা থাকে এবং নির্ভরযোগ্য ঔষধ সেবা প্রদান করে।`
    : `${partner.name} প্রতিদিন ডায়াগনস্টিক টেস্ট ও সেবা প্রদানের জন্য খোলা থাকে (${partner.workingHours || "সপ্তাহের ৭ দিন খোলা"})।`;

  const doctorAnswerText =
    doctors.length > 0
      ? `হ্যাঁ, ${partner.name}-এ অভিজ্ঞ ও বিশেষজ্ঞ ডাক্তারদের নিয়মিত চেম্বার ও কনসালটেশন সেবা রয়েছে। হেলথ ক্লাব ডিরেক্টরি থেকে ডাক্তারদের তালিকা ও সরাসরি সিরিয়াল নম্বর দেখে নিতে পারেন।`
      : isPharmacy
      ? `${partner.name} মূলত একটি নিবন্ধিত মডেল ফার্মেসি। প্রেসক্রিপশন অনুযায়ী মানসম্মত ঔষধ ও স্বাস্থ্যপণ্য সরবরাহ করা হয়। বিস্তারিত জানতে হটলাইনে (${partner.phone}) যোগাযোগ করুন।`
      : `হ্যাঁ, এখানে নিয়মিত বিশেষজ্ঞ চিকিৎসকদের চেম্বার পরিচালিত হয়। বিস্তারিত শিডিউল জানতে হটলাইনে (${partner.phone}) কল করুন।`;

  const specificQ5 = isPharmacy
    ? {
        "@type": "Question",
        name: `${partner.name}-এ কী কী ধরনের ঔষধ ও স্বাস্থ্যপণ্য পাওয়া যায়?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${partner.name}-এ সকল প্রকার জেনেরিক ও ব্র্যান্ডেড প্রেসক্রিপশন ঔষধ, ডায়াবেটিক কেয়ার ও ইনসুলিন, শিশু খাদ্য, ওটিসি সামগ্রী এবং বিপি মেশিন ও থার্মোমিটারসহ দরকারি সার্জিক্যাল স্বাস্থ্যপণ্য পাওয়া যায়।`,
        },
      }
    : isHospital
    ? {
        "@type": "Question",
        name: `${partner.name}-এ কী কী ইনডোর ও আউটডোর চিকিৎসা সুবিধা রয়েছে?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `এখানে সার্বক্ষণিক জরুরি বিভাগ, কেবিন ও ওয়ার্ড ভর্তি সুবিধা, বিশেষজ্ঞ কনসালটেশন, আধুনিক অপারেশন থিয়েটার এবং ডিজিটাল ল্যাব টেস্টের নির্ভরযোগ্য সুবিধা রয়েছে।`,
        },
      }
    : {
        "@type": "Question",
        name: `${partner.name}-এ কী কী প্যাথলজি ও ডায়াগনস্টিক টেস্ট করানো যায়?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `এখানে ডিজিটাল এক্স-রে, আল্ট্রাসনোগ্রাম (USG), ইকোকার্ডিওগ্রাফি, ইসিজি, হরমোন প্রোফাইল ও সকল প্রকার বায়োকেমিস্ট্রি ল্যাব টেস্টের নির্ভরযোগ্য সুবিধা রয়েছে।`,
        },
      };

  const specificQ6 = isPharmacy
    ? {
        "@type": "Question",
        name: `ফার্মেসিতে হেলথ ক্লাব মেম্বারশিপ ছাড় পাওয়ার নিয়ম কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `কাউন্টার থেকে ঔষধ বা পণ্য কেনার সময় আপনার হেলথ ক্লাব মেম্বার কার্ড বা নিবন্ধিত মোবাইল নম্বর প্রদর্শন করলেই তাত্ক্ষণিক ${partner.discount || "৫-১০%"} মেম্বার ছাড় সমন্বয় করা হবে।`,
        },
      }
    : isHospital
    ? {
        "@type": "Question",
        name: `জরুরি রোগী ভর্তি ও অ্যাম্বুলেন্স সহায়তার জন্য কীভাবে যোগাযোগ করবেন?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `২৪/৭ জরুরি রোগী ভর্তি ও অ্যাম্বুলেন্স সহায়তার জন্য সরাসরি হটলাইনে (${partner.emergencyPhone || partner.phone}) কল করুন।`,
        },
      }
    : {
        "@type": "Question",
        name: `টেস্ট রিপোর্ট পেতে সাধারণত কত সময় লাগে?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `রুটিন রক্ত ও প্যাথলজি পরীক্ষার রিপোর্ট একই দিনে সরবরাহ করা হয়। জরুরি প্রয়োজনে দ্রুততম সময়ে অনলাইন বা ফিজিক্যাল রিপোর্ট ডেলিভারির ব্যবস্থা রয়েছে।`,
        },
      };

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${partner.name}-এ হেলথ ক্লাব মেম্বাররা কত শতাংশ ছাড় বা ডিসকাউন্ট পান?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${partner.name}-এ হেলথ ক্লাব কার্ডধারী মেম্বাররা ${discountScopeText} ${partner.discount} পর্যন্ত আকর্ষণীয় ছাড় পেয়ে থাকেন। বিলিং বা ক্যাশ কাউন্টারে মেম্বার কার্ড বা মোবাইল নম্বর দেখালেই তাত্ক্ষণিক ছাড় প্রযোজ্য হয়।`,
        },
      },
      {
        "@type": "Question",
        name: `${partner.name}-এর ঠিকানা কোথায় এবং যোগাযোগের ফোন নম্বর কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${partner.name}-এর ঠিকানা: ${partner.address}, ফেনী। যেকোনো তথ্য ও সিরিয়ালের জন্য যোগাযোগ করুন: ${partner.phone}${partner.emergencyPhone ? ` (জরুরি হটলাইন: ${partner.emergencyPhone})` : ""}।`,
        },
      },
      {
        "@type": "Question",
        name: `${partner.name}-এ কি বিশেষজ্ঞ ডাক্তারদের চেম্বার ও সিরিয়াল সেবা রয়েছে?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: doctorAnswerText,
        },
      },
      {
        "@type": "Question",
        name: `${partner.name}-এর সেবা প্রদানের সময়সূচী ও জরুরি সেবা কী?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: hoursText,
        },
      },
      specificQ5,
      specificQ6,
    ],
  };
}
