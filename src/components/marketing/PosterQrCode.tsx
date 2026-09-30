"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface PosterQrCodeProps {
  url: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  label?: string;
  subLabel?: string;
  showCenterLogo?: boolean;
  className?: string;
}

export function PosterQrCode({
  url,
  size = 180,
  fgColor = "#065f46",
  bgColor = "#ffffff",
  label,
  subLabel,
  showCenterLogo = true,
  className = "",
}: PosterQrCodeProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCurrent = true;

    async function generateSvg() {
      try {
        setLoading(true);
        const svg = await QRCode.toString(url, {
          type: "svg",
          margin: 1,
          errorCorrectionLevel: "H", // High error correction permits center logo overlay
          color: {
            dark: fgColor,
            light: bgColor,
          },
        });

        if (isCurrent) {
          setSvgMarkup(svg);
          setLoading(false);
        }
      } catch (err) {
        if (isCurrent) {
          console.error("QR Code Generation Error:", err);
          setLoading(false);
        }
      }
    }

    generateSvg();

    return () => {
      isCurrent = false;
    };
  }, [url, fgColor, bgColor]);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* QR Code Container with Frame */}
      <div
        className="relative flex items-center justify-center rounded-2xl bg-white p-2.5 shadow-sm border border-slate-200/80"
        style={{ width: size, height: size }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-1">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-[10px]">QR তৈরি হচ্ছে...</span>
          </div>
        ) : (
          <>
            {/* SVG Render Container */}
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />

            {/* Center Logo Shield Overlay */}
            {showCenterLogo && (
              <div
                className="absolute inset-0 m-auto flex items-center justify-center rounded-lg bg-white p-1 shadow-md border-2 border-emerald-600"
                style={{
                  width: Math.max(32, Math.floor(size * 0.22)),
                  height: Math.max(32, Math.floor(size * 0.22)),
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/member-card-logo.webp"
                    alt="HC Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Optional Under-QR Labels */}
      {(label || subLabel) && (
        <div className="mt-2 space-y-0.5 max-w-[200px]">
          {label && (
            <p className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
              {label}
            </p>
          )}
          {subLabel && (
            <p className="text-[10px] text-slate-500 font-medium leading-tight break-all">
              {subLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
