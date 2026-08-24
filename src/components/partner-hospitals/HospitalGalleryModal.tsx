"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Partner } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";

interface HospitalGalleryModalProps {
  partner: Partner;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function HospitalGalleryModal({
  partner,
  isOpen,
  onClose,
  initialIndex = 0,
}: HospitalGalleryModalProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
  }

  const fallbackImage =
    partner.category === "hospital"
      ? "/images/placeholders/hospital.webp"
      : partner.category === "diagnostic"
      ? "/images/placeholders/diagnostic.webp"
      : "/images/placeholders/pharmacy.webp";

  const images = [
    {
      src: partner.imageUrl || fallbackImage,
      captionBn: `${partner.name} - মূল ভবন ও রিসেপশন`,
      captionEn: `${partner.name} - Main Building & Entrance`,
    },
    {
      src: "/images/placeholders/hospital.webp",
      captionBn: "রোগী ভর্তি ও ইনডোর চিকিৎসা সুবিধা",
      captionEn: "Inpatient Wards & Admission Facilities",
    },
    {
      src: "/images/placeholders/diagnostic.webp",
      captionBn: "ডিজিটাল ল্যাবরেটরি ও ডায়াগনস্টিক বিভাগ",
      captionEn: "Digital Laboratory & Diagnostic Imaging",
    },
    {
      src: "/images/placeholders/pharmacy.webp",
      captionBn: "ইন-হাউজ ফার্মেসি ও মেডিসিন কাউন্টার",
      captionEn: "In-house Pharmacy & Medical Supplies",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images.length]);

  if (!isOpen) return null;

  const currentImg = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-card/90 border border-border/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 id="gallery-modal-title" className="text-xs sm:text-sm font-bold text-foreground font-heading">
                {partner.name} - {isEn ? "Photo Gallery" : "ছবি গ্যালারি"}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Image Stage */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[420px] rounded-2xl overflow-hidden bg-black/40 border border-border/40 flex items-center justify-center">
          <Image
            src={currentImg.src}
            alt={partner.name}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-contain"
          />

          {/* Prev / Next Buttons */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg cursor-pointer transition-all hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg cursor-pointer transition-all hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Caption */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 text-white text-xs sm:text-sm font-medium text-center">
            {isEn ? currentImg.captionEn : currentImg.captionBn}
          </div>
        </div>

        {/* Thumbnails Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-14 w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? "border-primary scale-105 shadow-md ring-2 ring-primary/30"
                  : "border-border/60 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
