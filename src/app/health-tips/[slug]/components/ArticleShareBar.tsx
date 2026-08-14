"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/health-tips/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(isEn ? "Article link copied to clipboard!" : "আর্টিকেলের লিংক কপি করা হয়েছে!");
  };

  const handleFacebookShare = () => {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(`${window.location.origin}/health-tips/${slug}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const text = encodeURIComponent(`${title} - ${window.location.origin}/health-tips/${slug}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
        <Share2 className="h-4 w-4" />
        {isEn ? "Share this health guide:" : "এই স্বাস্থ্য গাইডটি শেয়ার করুন:"}
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFacebookShare}
          className="text-xs h-8 gap-1.5 border-border text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          <span>Facebook</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="text-xs h-8 gap-1.5 border-border text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>WhatsApp</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="text-xs h-8 gap-1.5 border-border"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <span>{isEn ? "Copy Link" : "লিংক কপি"}</span>
        </Button>
      </div>
    </div>
  );
}
