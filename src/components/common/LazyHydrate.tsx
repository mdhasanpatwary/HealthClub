"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazyHydrateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  className?: string;
}

/**
 * Defers client-side component hydration until the element approaches the viewport.
 * Avoids loading, parsing, and evaluating heavy client bundles (e.g., Zod, React Hook Form)
 * during initial page load when the user is at the top of the page.
 */
export default function LazyHydrate({
  children,
  fallback = null,
  rootMargin = "350px 0px",
  className,
}: LazyHydrateProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldRender) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      Promise.resolve().then(() => setShouldRender(true));
      return;
    }

    const element = containerRef.current;
    if (!element) {
      Promise.resolve().then(() => setShouldRender(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}
