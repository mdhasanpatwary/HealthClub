"use client";

import { useRef } from "react";
import Image from "next/image";
import { User, Building, Camera, Trash2, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fallbackType?: 'user' | 'building' | 'doctor' | 'stethoscope';
}

export function ImageUpload({ value, onChange, label, fallbackType = 'user' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("ছবির সাইজ ২ মেগাবাইটের বেশি হওয়া যাবে না।");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-secondary block">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm group">
          {value ? (
            <Image
              src={value}
              alt="Preview"
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
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
          >
            <Camera className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
              ছবি মুছে ফেলুন
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
