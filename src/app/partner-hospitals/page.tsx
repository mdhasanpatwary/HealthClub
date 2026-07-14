import Link from "next/link";
import PartnerDirectory from "@/components/ui/PartnerDirectory";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "পার্টনার হাসপাতাল ও ডায়াগনস্টিকস - হেলথ ক্লাব",
  description: "আমাদের মেম্বারশিপ কার্ড ব্যবহার করে দেশের যেসব হাসপাতাল, ল্যাব ও ফার্মেসীতে ডিসকাউন্ট পাবেন তার তালিকা।"
};

export default function PartnerHospitalsPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase">অংশীদার নেটওয়ার্ক</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            পার্টনার হাসপাতাল ও ডায়াগনস্টিকস
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            আপনার নিকটস্থ পার্টনার সুবিধা খুঁজুন এবং প্রতিটি সেবায় বিশেষ ছাড় ও ছাড়ের হার নিশ্চিত করুন।
          </p>
        </div>

        {/* Directory Component */}
        <div className="bg-muted/30 border border-border/80 rounded-3xl p-6 sm:p-8">
          <PartnerDirectory />
        </div>

        {/* Become Partner Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-emerald-500/5 to-secondary/5 border border-primary/20 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary dark:text-white">
            আপনি কি একটি স্বাস্থ্যসেবা প্রতিষ্ঠান পরিচালনা করেন?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            আমাদের হেলথ ক্লাব পার্টনার নেটওয়ার্কে যুক্ত হয়ে হাজার হাজার সদস্যদের কাছে আপনার সেবা পৌঁছে দিন এবং আপনার কাস্টমার বেস বৃদ্ধি করুন।
          </p>
          <div>
            <Link href="/become-partner">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white font-semibold">
                পার্টনার হাসপাতাল হিসেবে আবেদন করুন
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
