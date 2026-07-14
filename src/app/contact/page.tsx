import ContactForm from "@/components/landing/ContactForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "যোগাযোগ করুন - হেলথ ক্লাব",
  description: "হেলথ ক্লাবের সাথে যোগাযোগ করুন। আমাদের ফোন নাম্বার, ইমেইল, অফিস ঠিকানা ও হোয়াটসঅ্যাপ মেসেজিং তথ্য।"
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">যোগাযোগ করুন</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            মেম্বারশিপ নিয়ে আপনার যেকোনো প্রশ্ন, পার্টনার হতে আবেদন অথবা যেকোনো পরামর্শ জানাতে আমাদের মেসেজ দিন।
          </p>
        </div>

        {/* Contact Form Wrapper */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-6 sm:p-8">
          <ContactForm />
        </div>

        {/* Help Center CTA */}
        <div className="max-w-2xl mx-auto text-center space-y-4 pt-6">
          <h3 className="font-heading text-lg font-bold text-secondary dark:text-white">
            সাধারণ জিজ্ঞাসাগুলোর উত্তর খুঁজছেন?
          </h3>
          <p className="text-sm text-muted-foreground">
            রেজিস্ট্রেশন, ভেরিফিকেশন এবং ডিসকাউন্ট নিয়ে বিস্তারিত ও সচরাচর জিজ্ঞাসিত প্রশ্নগুলোর দ্রুত উত্তর জানতে FAQ পেজটি দেখতে পারেন।
          </p>
          <div>
            <Link href="/#faq">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">
                জিজ্ঞাসা ও উত্তরমালা (FAQ) দেখুন
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
