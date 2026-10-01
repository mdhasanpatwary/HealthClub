"use client";

import { useEffect, useState } from "react";

export function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let cachedDocHeight = 1;

    const updateDocHeight = () => {
      cachedDocHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    updateDocHeight();

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = (window.scrollY / cachedDocHeight) * 100;
          const clamped = Math.min(100, Math.max(0, current));
          setProgress((prev) => (Math.abs(prev - clamped) > 0.5 ? clamped : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDocHeight, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDocHeight);
    };
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-[calc(3.5rem+env(safe-area-inset-top,0px))] min-[992px]:top-[calc(4rem+env(safe-area-inset-top,0px))] left-0 right-0 h-1 bg-primary/10 z-40 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full w-full bg-primary transition-transform duration-100 ease-out origin-left will-change-transform"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
