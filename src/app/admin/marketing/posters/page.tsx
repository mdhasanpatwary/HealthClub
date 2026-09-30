import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/app/admin/components/AdminNav";
import { getPartnersForPostersAction } from "@/app/actions/partnerPosterActions";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { PartnerPrintPoster } from "@/components/marketing/PartnerPrintPoster";
import { PosterFormat } from "@/types/poster";
import { ChevronRight, Printer, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "মার্কেটিং ও পার্টনার পোস্টার জেনারেটর | Admin Portal",
  description: "চুক্তিভুক্ত পার্টনার চিকিৎসাকেন্দ্রের জন্য প্রিন্ট-রেডি ভেক্টর পোস্টার ও টেবিল-টপ স্ট্যান্ড কার্ড জেনারেটর",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminMarketingPostersPageProps {
  searchParams: Promise<{
    partnerId?: string;
    slug?: string;
    format?: string;
  }>;
}

export default async function AdminMarketingPostersPage({
  searchParams,
}: AdminMarketingPostersPageProps) {
  const resolvedParams = await searchParams;
  const initialPartnerId = resolvedParams.partnerId || resolvedParams.slug;
  const initialFormat: PosterFormat = 
    resolvedParams.format === "standee" ? "standee" : "a4";

  // Server-side parallel fetch of verified partners and contact info
  const [partners, contactSettings] = await Promise.all([
    getPartnersForPostersAction(),
    getCachedContactSettings(),
  ]);

  return (
    <div className="space-y-6">
      {/* Admin Horizontal Navigation (hidden during print) */}
      <div className="print:hidden space-y-4">
        <AdminNav />

        {/* Breadcrumb & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
              <Link href="/admin" className="hover:text-foreground">
                এডমিন ড্যাশবোর্ড
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/admin/partners" className="hover:text-foreground">
                পার্টনার নেটওয়ার্ক
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-semibold">মার্কেটিং পোস্টার জেনারেটর</span>
            </nav>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Printer className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-secondary dark:text-white">
                  পার্টনার ডিসকাউন্ট পোস্টার ও কিউআর জেনারেটর
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ফেনী সদর পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারের জন্য অফিসিয়াল A4 ওয়াল পোস্টার এবং ডেস্ক স্ট্যান্ড কার্ড
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/partners"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>পার্টনার তালিকা</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Print & Poster Generator Application */}
      <PartnerPrintPoster
        partners={partners}
        initialPartnerId={initialPartnerId}
        initialFormat={initialFormat}
        helpline={contactSettings.hotline || "01886-763849"}
      />
    </div>
  );
}
