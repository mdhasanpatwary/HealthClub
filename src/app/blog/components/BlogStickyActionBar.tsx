"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { CreditCard, PhoneCall, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/SocialBrandIcons";

interface BlogStickyActionBarProps {
  hotline?: string;
  whatsapp?: string;
}

const DISMISS_EVENT = "hc-blog-sticky-dismiss";
const DISMISS_KEY = "hc_blog_sticky_bar_dismissed";

function subscribeDismiss(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DISMISS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DISMISS_EVENT, callback);
  };
}

function getDismissSnapshot(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerDismissSnapshot(): boolean {
  return false;
}

export function BlogStickyActionBar({
  hotline = "01886763849",
  whatsapp = "01886763849",
}: BlogStickyActionBarProps) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  // Synchronize dismissed status with sessionStorage
  const isDismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissSnapshot,
    getServerDismissSnapshot
  );

  // Normalize telephone and WhatsApp credentials
  const rawHotline = (hotline || "01886763849").replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;

  const rawWhatsapp = (whatsapp || hotline || "01886763849").replace(/[^0-9]/g, "");
  const normalizedWhatsapp = rawWhatsapp.replace(/^(880|88|0)/, "");
  const defaultWhatsappMsg = encodeURIComponent(
    "আসসালামু আলাইকুম, আমি হেলথ ক্লাব ওয়েবসাইট থেকে ডাক্তার ও ডায়াগনস্টিক সিরিয়ালের বিষয়ে জানতে চাই।"
  );
  const whatsappUrl = normalizedWhatsapp
    ? `https://wa.me/880${normalizedWhatsapp}?text=${defaultWhatsappMsg}`
    : "";

  // Track scroll depth (>=25%) and footer proximity
  useEffect(() => {
    if (isDismissed) return;

    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const scrollPercent = (scrollY / docHeight) * 100;
        setIsPastThreshold(scrollPercent >= 25);
      }

      // Check footer proximity as scroll fallback
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        setIsNearFooter(rect.top <= window.innerHeight + 50);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run initial scroll check
    handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    // IntersectionObserver on footer to reliably prevent visual overlap
    const footer = document.querySelector("footer");
    let observer: IntersectionObserver | null = null;

    if (footer && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsNearFooter(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: "0px 0px 80px 0px",
          threshold: 0,
        }
      );
      observer.observe(footer);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (observer) observer.disconnect();
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
      window.dispatchEvent(new Event(DISMISS_EVENT));
    } catch {
      // Ignore sessionStorage exceptions
    }
  };

  const isVisible = isPastThreshold && !isNearFooter && !isDismissed;

  return (
    <aside
      aria-label="মোবাইল কুইক কনভার্সন বার"
      className={`fixed bottom-0 left-0 right-0 z-50 min-[992px]:hidden bg-background/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-2 px-3 sm:px-4 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-md sm:max-w-lg">
        {/* Subtle micro-header with live status and dismiss button */}
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground pb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-foreground/90 font-semibold truncate text-[11px]">
              হেলথ ক্লাব মেম্বার সুবিধা
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-[10px] text-primary font-medium truncate">
              ফেনী সদর পার্টনার নেটওয়ার্ক
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="অ্যাকশন বার বন্ধ করুন"
            className="h-6 w-6 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors ml-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* High-converting touchpoint action buttons */}
        <div className="flex items-center gap-2">
          {/* 1. 10-30% Member Discount CTA */}
          <Link
            href="/membership"
            prefetch={false}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 h-10 px-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            <span className="truncate">১০-৩০% মেম্বার ছাড় নিন</span>
          </Link>

          {/* 2. Serial Helpline Dialer */}
          <a
            href={`tel:${hotlineTel}`}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 h-10 px-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-xs sm:text-sm border border-border/70 shadow-sm transition-all active:scale-[0.98]"
          >
            <PhoneCall className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="truncate">সিরিয়াল হেল্পলাইন</span>
          </a>

          {/* 3. WhatsApp Quick Trigger */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন"
              className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0 transition-all active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
