"use client";

import { useState } from "react";
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

export function BlogShareBar({ url, title, locale = "bn" }: BlogShareBarProps) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

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

      {shareLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${item.name}`}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border/70 bg-card text-muted-foreground transition-colors ${item.className}`}
          >
            <Icon className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline font-medium">{item.name}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-semibold text-emerald-600">
              {isEn ? "Copied" : "কপি হয়েছে"}
            </span>
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-medium">
              {isEn ? "Copy Link" : "লিংক কপি"}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
