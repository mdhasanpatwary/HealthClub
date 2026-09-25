"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Trash2, Camera, Sparkles } from "lucide-react";
import { PartnerGalleryImage } from "@/services/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toBanglaNums } from "@/lib/utils";
import { toast } from "sonner";

interface PartnerGalleryCardProps {
  galleryImages: PartnerGalleryImage[];
  onChange: (images: PartnerGalleryImage[]) => void;
}

const MAX_GALLERY_IMAGES = 6;

export function PartnerGalleryCard({
  galleryImages,
  onChange,
}: PartnerGalleryCardProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaptionBn, setNewCaptionBn] = useState("");
  const [newCaptionEn, setNewCaptionEn] = useState("");

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      toast.error("অনুগ্রহ করে প্রথমে একটি ছবি আপলোড করুন");
      return;
    }

    if (galleryImages.length >= MAX_GALLERY_IMAGES) {
      toast.error(`গ্যালারিতে সর্বোচ্চ ${toBanglaNums(MAX_GALLERY_IMAGES)}টি ছবি যোগ করা যাবে`);
      return;
    }

    const newPhoto: PartnerGalleryImage = {
      id: `gal_${Date.now()}`,
      url: newImageUrl.trim(),
      captionBn: newCaptionBn.trim() || "হাসপাতাল ও চিকিৎসাসেবা",
      captionEn: newCaptionEn.trim() || "Hospital & Healthcare",
    };

    onChange([...galleryImages, newPhoto]);
    setNewImageUrl("");
    setNewCaptionBn("");
    setNewCaptionEn("");
    setIsAddOpen(false);
    toast.success("ছবিটি সফলভাবে গ্যালারিতে যোগ করা হয়েছে!");
  };

  const handleRemoveImage = (id: string) => {
    onChange(galleryImages.filter((img) => img.id !== id));
    toast.success("ছবিটি গ্যালারি থেকে মুছে ফেলা হয়েছে");
  };

  return (
    <Card className="border-border shadow-sm rounded-3xl">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary shrink-0" />
              <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white">
                হাসপাতাল ফটো গ্যালারি
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              হাসপাতালের মূল ভবন, ওটি, কেবিন, আইসিইউ বা ল্যাবের ছবি যুক্ত করুন যা পাবলিক পেজে দেখাবে।
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1 font-semibold"
            >
              <Camera className="h-3.5 w-3.5 mr-1" />
              {toBanglaNums(galleryImages.length)} / {toBanglaNums(MAX_GALLERY_IMAGES)} টি ছবি
            </Badge>

            {galleryImages.length < MAX_GALLERY_IMAGES && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsAddOpen(true)}
                className="text-xs h-8 cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                ছবি যোগ করুন
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
        {galleryImages.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-border rounded-2xl p-4 bg-muted/20">
            <ImageIcon className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              এখনও কোনো গ্যালারি ছবি যোগ করা হয়নি। ছবি যোগ করতে উপরের বাটনে ক্লিক করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-xs flex flex-col"
              >
                <div className="relative aspect-video w-full bg-slate-950/20 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.captionBn || `Gallery Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105 duration-200"
                  />
                  <div className="absolute top-1.5 right-1.5">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(img.id)}
                      className="h-7 w-7 rounded-lg shadow-sm cursor-pointer opacity-90 hover:opacity-100"
                      title="ছবি মুছুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 min-w-0 bg-background">
                  <p className="text-[11px] font-medium text-foreground truncate">
                    {img.captionBn || img.captionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Photo Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading text-secondary dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              গ্যালারিতে নতুন ছবি যোগ করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              একটি সুন্দর ছবি আপলোড করুন এবং বিবরণ লিখুন (যেমনঃ আধুনিক ওটি, এসি কেবিন)।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddImage} className="space-y-4 pt-2">
            <div>
              <ImageUpload
                value={newImageUrl}
                onChange={setNewImageUrl}
                label="ছবি নির্বাচন করুন *"
                fallbackType="building"
                folder="partners"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                ছবির ক্যাপশন (বাংলা)
              </label>
              <Input
                placeholder="উদাঃ আধুনিক অপারেশন থিয়েটার, ভিআইপি কেবিন"
                value={newCaptionBn}
                onChange={(e) => setNewCaptionBn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                ছবির ক্যাপশন (ইংরেজি - ঐচ্ছিক)
              </label>
              <Input
                placeholder="e.g. Modern Operation Theater, Deluxe Cabin"
                value={newCaptionEn}
                onChange={(e) => setNewCaptionEn(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewImageUrl("");
                  setIsAddOpen(false);
                }}
                className="text-xs h-8 cursor-pointer"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!newImageUrl}
                className="text-xs h-8 bg-primary hover:bg-primary-dark text-white cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                গ্যালারিতে যুক্ত করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
