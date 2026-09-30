"use client";

import React, { useState, useRef } from "react";
import { Partner } from "@/services/db";
import { 
  PosterFormat, 
  PosterTheme, 
  PosterQrTarget, 
  PosterCustomOptions, 
  POSTER_THEMES 
} from "@/types/poster";
import { SITE_URL } from "@/lib/siteConfig";
import { PosterControlPanel } from "./PosterControlPanel";
import { PosterA4Format } from "./PosterA4Format";
import { PosterStandeeFormat } from "./PosterStandeeFormat";
import { Eye, AlertCircle } from "lucide-react";

interface PartnerPrintPosterProps {
  partners: Partner[];
  initialPartnerId?: string;
  initialFormat?: PosterFormat;
  helpline?: string;
}

export function PartnerPrintPoster({
  partners,
  initialPartnerId,
  initialFormat = "a4",
  helpline = "01886-763849",
}: PartnerPrintPosterProps) {
  // Find initial partner or pick the first available
  const defaultPartner = 
    partners.find((p) => p.id === initialPartnerId || p.slug === initialPartnerId) || 
    partners[0] || 
    null;

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(defaultPartner);
  const [format, setFormat] = useState<PosterFormat>(initialFormat);
  const [themeId, setThemeId] = useState<PosterTheme>("emerald");
  const [qrTarget, setQrTarget] = useState<PosterQrTarget>("registration");
  const [zoom, setZoom] = useState<number>(0.8);
  const [options, setOptions] = useState<PosterCustomOptions>({
    customNotice: "কাউন্টারে বিল পরিশোধের পূর্বে আপনার মেম্বার আইডি প্রদর্শন করুন",
    customDiscountBadge: "হেলথ ক্লাব মেম্বারদের জন্য এখানে ১০-৩০% বিশেষ ছাড়",
    helpline,
    website: "healthclubfeni.com",
    showAddress: true,
    showCategory: true,
    showEmergencyPhone: true,
    showCutMarks: false,
  });

  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!selectedPartner) {
    return (
      <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold font-heading text-secondary dark:text-white">
          কোনো অনুমোদিত পার্টনার পাওয়া যায়নি
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          পোস্টার তৈরি করার পূর্বে নিশ্চিত করুন যে ফেনী সদরে অনুমোদিত পার্টনার চিকিৎসাকেন্দ্র ডাটাবেজে সক্রিয় রয়েছে।
        </p>
      </div>
    );
  }

  const currentTheme = POSTER_THEMES[themeId] || POSTER_THEMES.emerald;

  // Construct URLs
  const partnerSlugOrId = selectedPartner.slug || selectedPartner.id;
  const registrationUrl = `${SITE_URL}/membership?ref=partner-poster&partner=${encodeURIComponent(partnerSlugOrId)}`;
  const profileUrl = `${SITE_URL}/partner-hospitals/${encodeURIComponent(partnerSlugOrId)}`;

  return (
    <div className="space-y-6">
      {/* Control Panel (Hidden during print) */}
      <PosterControlPanel
        partners={partners}
        selectedPartner={selectedPartner}
        onSelectPartner={setSelectedPartner}
        format={format}
        onChangeFormat={setFormat}
        theme={themeId}
        onChangeTheme={setThemeId}
        qrTarget={qrTarget}
        onChangeQrTarget={setQrTarget}
        options={options}
        onChangeOptions={setOptions}
        onPrint={handlePrint}
        zoom={zoom}
        onChangeZoom={setZoom}
      />

      {/* Screen Preview Container */}
      <div className="print:hidden bg-slate-900/5 dark:bg-slate-950/40 p-4 sm:p-8 rounded-3xl border border-border/80 flex flex-col items-center justify-center overflow-x-auto min-h-[600px]">
        <div className="flex items-center justify-between w-full max-w-4xl pb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">
              লাইভ প্রিভিউ ({format === "a4" ? "A4 ওয়াল পোস্টার" : "টেবিল-টপ স্ট্যান্ড কার্ড"})
            </span>
          </div>
          <span className="font-mono text-[11px]">
            স্কেল: {Math.round(zoom * 100)}% • রেজোলিউশন: ভেক্টর স্কেলেবল
          </span>
        </div>

        {/* Scaled Preview Stage */}
        <div
          className="transition-transform duration-200 origin-top flex items-center justify-center"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {format === "a4" ? (
            <PosterA4Format
              partner={selectedPartner}
              theme={currentTheme}
              options={options}
              qrTarget={qrTarget}
              registrationUrl={registrationUrl}
              profileUrl={profileUrl}
            />
          ) : (
            <PosterStandeeFormat
              partner={selectedPartner}
              theme={currentTheme}
              options={options}
              qrTarget={qrTarget}
              registrationUrl={registrationUrl}
              profileUrl={profileUrl}
            />
          )}
        </div>
      </div>

      {/* Actual Print Surface (Only visible during print) */}
      <div
        ref={printAreaRef}
        id="partner-poster-print-surface"
        className="hidden print:block poster-print-container"
      >
        {format === "a4" ? (
          <PosterA4Format
            partner={selectedPartner}
            theme={currentTheme}
            options={options}
            qrTarget={qrTarget}
            registrationUrl={registrationUrl}
            profileUrl={profileUrl}
          />
        ) : (
          <PosterStandeeFormat
            partner={selectedPartner}
            theme={currentTheme}
            options={options}
            qrTarget={qrTarget}
            registrationUrl={registrationUrl}
            profileUrl={profileUrl}
          />
        )}
      </div>

      {/* Embedded Global Print Stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: ${format === "a4" ? "A4 portrait" : "A5 portrait"};
            margin: 0;
          }

          html, body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
          }

          /* Hide all UI elements, layout chrome, and modals */
          header, footer, nav, aside, .print\\:hidden, button, [role="dialog"], #__next-build-watcher {
            display: none !important;
          }

          /* Target the printable document */
          #partner-poster-print-surface,
          .poster-print-container {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          .a4-poster-document {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            box-shadow: none !important;
          }

          .standee-poster-document {
            width: 148mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            page-break-after: avoid !important;
            break-inside: avoid !important;
            box-shadow: none !important;
          }

          /* Force high-fidelity color printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
