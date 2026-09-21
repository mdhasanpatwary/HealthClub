"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ListOrdered } from "lucide-react";

interface BlogFloatingTocButtonProps {
  locale?: string;
}

export function BlogFloatingTocButton({ locale = "bn" }: BlogFloatingTocButtonProps) {
  const isEn = locale === "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 650);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const scrollToToc = () => {
    const el = document.getElementById("mobile-toc") || document.getElementById("overview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <aside
      aria-label={isEn ? "Quick Navigation Controls" : "দ্রুত নেভিগেশন নিয়ন্ত্রণ"}
      className="fixed bottom-20 right-3.5 z-40 lg:hidden flex items-center gap-1 p-1 rounded-full bg-background/95 backdrop-blur-md border border-border/80 shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      <button
        type="button"
        onClick={scrollToToc}
        aria-label={isEn ? "Go to Table of Contents" : "সূচিপত্রে যান"}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer"
      >
        <ListOrdered className="h-3.5 w-3.5" />
        <span>{isEn ? "TOC" : "সূচিপত্র"}</span>
      </button>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label={isEn ? "Scroll to Top" : "উপরে যান"}
        className="h-7 w-7 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-colors cursor-pointer"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}
