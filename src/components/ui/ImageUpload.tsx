"use client";

import { useRef } from "react";
import Image from "next/image";
import { User, Building, Camera, Trash2, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fallbackType?: 'user' | 'building' | 'doctor' | 'stethoscope';
}

export function ImageUpload({ value, onChange, label, fallbackType = 'user' }: ImageUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      toast.error(t("ui.imageUpload.invalidFormat"));
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB raw before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("ui.imageUpload.sizeLimit"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      toast.error(t("ui.imageUpload.readError"));
      e.target.value = "";
    };

    reader.onabort = () => {
      e.target.value = "";
    };

    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result !== "string") {
        toast.error(t("ui.imageUpload.processError"));
        return;
      }

      // Compress and resize image using offscreen canvas to prevent storage quota issues
      const img = new window.Image();
      img.onerror = () => {
        toast.error(t("ui.imageUpload.processError"));
      };
      img.onload = () => {
        try {
          const maxDim = 800; // 800px max width/height
          let { width, height } = img;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            // Fallback to original data URL if canvas 2D context fails
            onChange(result);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          onChange(compressedDataUrl);
        } catch {
          onChange(result);
        }
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-secondary block">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm group">
          {value ? (
            <Image
              src={value}
              alt={label ? `${label} Preview` : "Image Preview"}
              fill
              unoptimized
              className="object-cover object-left-top"
            />
          ) : fallbackType === 'building' ? (
            <Building className="h-8 w-8 text-muted-foreground" />
          ) : fallbackType === 'doctor' || fallbackType === 'stethoscope' ? (
            <Stethoscope className="h-8 w-8 text-primary" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
          <button
            type="button"
            aria-label={label ? `${label} ${t("ui.imageUpload.changeImage")}` : t("ui.imageUpload.uploadImage")}
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Camera className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label={label || t("ui.imageUpload.uploadImage")}
            onChange={handleFileChange}
            className="border-border bg-background text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onChange("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-[10px] text-rose-600 hover:text-rose-700 p-0 h-auto mt-1 flex items-center gap-1 hover:bg-transparent"
            >
              <Trash2 className="h-3 w-3" />
              {t("ui.imageUpload.deleteImage")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
