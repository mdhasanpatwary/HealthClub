"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User, Building, Camera, Trash2, Stethoscope, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImageAction } from "@/app/actions/uploadActions";
import { StorageFolder } from "@/services/storageService";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fallbackType?: 'user' | 'building' | 'doctor' | 'stethoscope';
  folder?: StorageFolder;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label,
  fallbackType = 'user',
  folder = 'members',
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Seamlessly migrate legacy base64 values if existing in database records
  const migratedRef = useRef(false);
  useEffect(() => {
    if (!migratedRef.current && value && value.startsWith("data:image/") && !isUploading) {
      migratedRef.current = true;
      setIsUploading(true);
      uploadImageAction(value, folder)
        .then((res) => {
          if (res.success && res.url) {
            onChange(res.url);
          }
        })
        .catch(() => {
          // silently ignore background migration failure
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  }, [value, folder, isUploading, onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      toast.error("শুধুমাত্র JPG, PNG বা WebP ফরম্যাটের ছবি আপলোড করা যাবে।");
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB raw before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      toast.error("ছবি পড়তে সমস্যা হয়েছে।");
      e.target.value = "";
    };

    reader.onabort = () => {
      e.target.value = "";
    };

    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result !== "string") {
        toast.error("ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
        return;
      }

      // Compress and resize image using offscreen canvas to prevent storage quota issues
      const img = new window.Image();
      img.onerror = () => {
        toast.error("ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
      };
      img.onload = () => {
        try {
          const maxDim = 800; // 800px max width/height
          let { width, height } = img;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            toast.error("ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

          // Show immediate local preview with loading state
          setLocalPreview(compressedDataUrl);
          setIsUploading(true);

          // Upload to Supabase Storage CDN asynchronously
          uploadImageAction(compressedDataUrl, folder)
            .then((res) => {
              if (res.success && res.url) {
                onChange(res.url);
                setLocalPreview(null);
                toast.success("ছবি সফলভাবে আপলোড হয়েছে।");
              } else {
                setLocalPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                toast.error(res.error || "ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
              }
            })
            .catch(() => {
              setLocalPreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              toast.error("ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
            })
            .finally(() => {
              setIsUploading(false);
            });
        } catch {
          setLocalPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.error("ছবি প্রসেস করতে ব্যর্থ হয়েছে।");
        }
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  const displayUrl = localPreview || value;

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-secondary block">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm group">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={label ? `${label} Preview` : "Image Preview"}
              fill
              sizes="64px"
              unoptimized={displayUrl.startsWith("data:")}
              className="object-cover object-left-top"
            />
          ) : fallbackType === 'building' ? (
            <Building className="h-8 w-8 text-muted-foreground" />
          ) : fallbackType === 'doctor' || fallbackType === 'stethoscope' ? (
            <Stethoscope className="h-8 w-8 text-primary" />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}

          {isUploading && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 z-10"
            >
              <Loader2 className="h-5 w-5 text-white animate-spin" />
              <span className="text-[8px] text-white/90 font-medium leading-none px-1 text-center truncate">
                আপলোড হচ্ছে...
              </span>
            </div>
          )}

          {!isUploading && !disabled && (
            <button
              type="button"
              aria-label={label ? `${label} ছবি পরিবর্তন করুন` : "ছবি আপলোড করুন"}
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={disabled || isUploading}
            aria-label={label || "ছবি আপলোড করুন"}
            onChange={handleFileChange}
            className="border-border bg-background text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {(value || localPreview) && (
            <Button
              type="button"
              variant="ghost"
              disabled={disabled || isUploading}
              onClick={() => {
                onChange("");
                setLocalPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-[10px] text-rose-600 hover:text-rose-700 p-0 h-auto mt-1 flex items-center gap-1 hover:bg-transparent"
            >
              <Trash2 className="h-3 w-3" />
              ছবি মুছুন
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
