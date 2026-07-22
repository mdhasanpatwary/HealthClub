import ContactForm from "@/components/landing/ContactForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { Locale } from "@/lib/i18n";
import JsonLd from "@/components/seo/JsonLd";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const isEn = locale === "en";

  return {
    title: isEn ? "Contact Us - Health Club Hotline & Support" : "যোগাযোগ করুন - হেলথ ক্লাব হটলাইন ও অফিস",
    description: isEn
      ? "Get in touch with Health Club support team. Find our hotline number, support email, address, and online inquiry form."
      : "হেলথ ক্লাবের সাথে যোগাযোগ করুন। আমাদের ফোন নাম্বার (+8801783721411), ইমেইল, অফিস ঠিকানা ও সাপোর্ট সেন্টার।",
    alternates: {
      canonical: "https://healthclubfeni.vercel.app/contact",
    },
    openGraph: {
      title: isEn ? "Contact Health Club - Hotline +8801783721411" : "যোগাযোগ করুন - হেলথ ক্লাব",
      description: isEn
        ? "Contact our helpline for membership queries or hospital partnership applications."
        : "মেম্বারশিপ অথবা পার্টনারশিপ সংক্রান্ত যেকোনো প্রশ্ন নিয়ে আমাদের সাথে কথা বলুন।",
      url: "https://healthclubfeni.vercel.app/contact",
    },
  };
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": locale === "en" ? "Home" : "হোম",
          "item": "https://healthclubfeni.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locale === "en" ? "Contact Us" : "যোগাযোগ করুন",
          "item": "https://healthclubfeni.vercel.app/contact"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": locale === "en" ? "Contact Health Club" : "হেলথ ক্লাবের সাথে যোগাযোগ",
      "url": "https://healthclubfeni.vercel.app/contact",
      "description": "Contact channel for Health Club members and partner healthcare facilities."
    }
  ];

  return (
    <div className="bg-background min-h-screen py-12">
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">
            {locale === "en" ? "Contact Us" : "যোগাযোগ করুন"}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {locale === "en" ? "Get in Touch with Us" : "আমাদের সাথে যোগাযোগ করুন"}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {locale === "en"
              ? "Have questions about membership, partner application, or suggestions? Send us a message."
              : "মেম্বারশিপ নিয়ে আপনার যেকোনো প্রশ্ন, পার্টনার হতে আবেদন অথবা যেকোনো পরামর্শ জানাতে আমাদের মেসেজ দিন।"}
          </p>
        </div>

        {/* Contact Form Wrapper */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-6 sm:p-8">
          <ContactForm />
        </div>

        {/* Help Center CTA */}
        <div className="max-w-2xl mx-auto text-center space-y-4 pt-6">
          <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
            {locale === "en" ? "Looking for quick answers?" : "সাধারণ জিজ্ঞাসাগুলোর উত্তর খুঁজছেন?"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === "en"
              ? "Check our Frequently Asked Questions (FAQ) page for details on registration, verification, and discounts."
              : "রেজিস্ট্রেশন, ভেরিফিকেশন এবং ডিসকাউন্ট নিয়ে বিস্তারিত ও সচরাচর জিজ্ঞাসিত প্রশ্নগুলোর দ্রুত উত্তর জানতে FAQ পেজটি দেখতে পারেন।"}
          </p>
          <div>
            <Link href="/#faq">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                {locale === "en" ? "View FAQ" : "জিজ্ঞাসা ও উত্তরমালা (FAQ) দেখুন"}
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
