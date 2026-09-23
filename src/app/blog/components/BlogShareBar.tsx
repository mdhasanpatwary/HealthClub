"use client";

import { useState, useSyncExternalStore } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";
import {
  FacebookIcon,
  WhatsAppIcon,
  LinkedInIcon,
} from "@/components/ui/SocialBrandIcons";
import { toast } from "sonner";

interface BlogShareBarProps {
  url: string;
  title: string;
  locale?: string;
}

const emptySubscribe = () => () => {};

export function BlogShareBar({ url, title, locale = "bn" }: BlogShareBarProps) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title,
        url,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        handleCopy();
      }
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      className: "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "hover:bg-blue-700/10 hover:text-blue-700 dark:hover:text-blue-400",
    },
  ];

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(
          isEn ? "Article link copied to clipboard!" : "নিবন্ধের লিংক কপি করা হয়েছে!"
        );
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error(
        isEn ? "Failed to copy link" : "লিংক কপি করতে ব্যর্থ হয়েছে"
      );
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1 font-semibold text-foreground mr-1">
        <Share2 className="h-3.5 w-3.5 text-primary" />
        <span>{isEn ? "Share:" : "শেয়ার করুন:"}</span>
      </span>

      {canShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label={isEn ? "Share via device apps" : "ডিভাইসের অ্যাপে শেয়ার করুন"}
          className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:scale-95 cursor-pointer font-medium"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-semibold">{isEn ? "Share" : "শেয়ার"}</span>
        </button>
      )}

      {shareLinks.map((item) => {
        const Icon = item.icon;
        const shareLabel = isEn
          ? `Share on ${item.name}`
          : `${item.name}-এ শেয়ার করুন`;

        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={shareLabel}
            className={`flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-border/70 bg-card text-muted-foreground transition-colors active:scale-95 ${item.className}`}
          >
            <Icon className="h-4 w-4 fill-current" />
            <span className="text-xs font-medium">{item.name}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          isEn
            ? "Copy article link to clipboard"
            : "নিবন্ধের লিংক ক্লিপবোর্ডে কপি করুন"
        }
        className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 rounded-lg border border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors active:scale-95 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600">
              {isEn ? "Copied" : "কপি হয়েছে"}
            </span>
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" />
            <span className="text-xs font-medium">
              {isEn ? "Copy Link" : "লিংক কপি"}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
