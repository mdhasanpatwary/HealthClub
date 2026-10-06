"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  productSchema,
  ProductFormValues,
  ProductItem,
} from "@/lib/validations/product";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/productAdminActions";
import { toast } from "sonner";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onSuccess: () => void;
}

type ProductDialogFormValues = ProductFormValues & {
  featuresText?: string;
};

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(product);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductDialogFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameBn: "",
      nameEn: "",
      slug: "",
      price: 0,
      regularPrice: null,
      discountBadge: "১০-৩০% মেম্বার ছাড়",
      category: "medical_device",
      categoryBn: "মেডিকেল ডিভাইস",
      descriptionBn: "",
      descriptionEn: "",
      imageUrl: "",
      inStock: true,
      featured: false,
      isActive: true,
      order: 0,
      featuresText: "",
    },
  });

  const watchImageUrl = useWatch({ control, name: "imageUrl" });
  const watchInStock = useWatch({ control, name: "inStock" });
  const watchFeatured = useWatch({ control, name: "featured" });
  const watchIsActive = useWatch({ control, name: "isActive" });

  useEffect(() => {
    if (product) {
      reset({
        nameBn: product.nameBn,
        nameEn: product.nameEn,
        slug: product.slug,
        price: product.price,
        regularPrice: product.regularPrice ?? null,
        discountBadge: product.discountBadge ?? "১০-৩০% মেম্বার ছাড়",
        category: product.category,
        categoryBn: product.categoryBn ?? "",
        descriptionBn: product.descriptionBn,
        descriptionEn: product.descriptionEn ?? "",
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        featured: product.featured,
        isActive: product.isActive ?? true,
        order: product.order,
        featuresText: product.featuresBn ? product.featuresBn.join("\n") : "",
      });
    } else {
      reset({
        nameBn: "",
        nameEn: "",
        slug: "",
        price: 0,
        regularPrice: null,
        discountBadge: "১০-৩০% মেম্বার ছাড়",
        category: "medical_device",
        categoryBn: "মেডিকেল ডিভাইস",
        descriptionBn: "",
        descriptionEn: "",
        imageUrl: "",
        inStock: true,
        featured: false,
        isActive: true,
        order: 0,
        featuresText: "",
      });
    }
  }, [product, reset, open]);

  const handleNameEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("nameEn", val, { shouldValidate: true });
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };


  const onSubmit = async (values: ProductDialogFormValues) => {
    setSubmitting(true);
    try {
      const featuresArray = (values.featuresText || "")
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload: ProductFormValues = {
        nameBn: values.nameBn,
        nameEn: values.nameEn,
        slug: values.slug,
        price: values.price,
        regularPrice: values.regularPrice,
        discountBadge: values.discountBadge,
        category: values.category,
        categoryBn: values.categoryBn,
        descriptionBn: values.descriptionBn,
        descriptionEn: values.descriptionEn,
        imageUrl: values.imageUrl,
        inStock: values.inStock,
        featured: values.featured,
        isActive: values.isActive ?? true,
        order: values.order,
        featuresBn: featuresArray.length > 0 ? featuresArray : null,
      };

      if (isEditing && product) {
        const res = await updateProductAction(product.id, payload);
        if (res.success) {
          toast.success("প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে।");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.error || "আপডেট ব্যর্থ হয়েছে।");
        }
      } else {
        const res = await createProductAction(payload);
        if (res.success) {
          toast.success("নতুন প্রোডাক্ট সফলভাবে যুক্ত করা হয়েছে।");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(res.error || "যুক্ত করা সম্ভব হয়নি।");
        }
      }
    } catch {
      toast.error("সার্ভার সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {isEditing ? "প্রোডাক্ট সম্পাদনা করুন" : "নতুন প্রোডাক্ট যুক্ত করুন"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                শপ পেজে প্রদর্শিত পণ্যের বিবরণ ও মূল্য নির্ধারণ করুন
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Bengali & English Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nameBn" className="text-xs font-semibold">
                প্রোডাক্টের নাম (বাংলা) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameBn"
                placeholder="যেমন: ওমরণ ডিজিটাল বিপি মেশিন"
                {...register("nameBn")}
              />
              {errors.nameBn && (
                <p className="text-[11px] text-destructive">{errors.nameBn.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nameEn" className="text-xs font-semibold">
                প্রোডাক্টের নাম (ইংরেজি) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameEn"
                placeholder="e.g. Omron Digital BP Monitor"
                {...register("nameEn", { onChange: handleNameEnChange })}
              />
              {errors.nameEn && (
                <p className="text-[11px] text-destructive">{errors.nameEn.message}</p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs font-semibold">
              ইউআরএল স্লাগ (ইংরেজি নাম অনুযায়ী অটো-জেনারেট হয়) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="e.g. omron-digital-bp-monitor"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-[11px] text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold">
                মূল্য (টাকা) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="যেমন: ২৫০০"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-[11px] text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regularPrice" className="text-xs font-semibold">
                পূর্বের/বাজার মূল্য (টাকা - ঐচ্ছিক)
              </Label>
              <Input
                id="regularPrice"
                type="number"
                placeholder="যেমন: ২৮০০"
                {...register("regularPrice", {
                  setValueAs: (v) => (v === "" || isNaN(v) ? null : Number(v)),
                })}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              প্রোডাক্টের ছবি <span className="text-destructive">*</span>
            </Label>
            <ImageUpload
              value={watchImageUrl || ""}
              onChange={(url) => setValue("imageUrl", url, { shouldValidate: true })}
              label="ছবি আপলোড করুন"
              folder="products"
            />
            <p className="text-[11px] text-muted-foreground">
              ⚡ অটো-কম্প্রেশন সক্রিয়: হাই-রেজ্যুলেশন ছবিও স্বয়ংক্রিয়ভাবে অপ্টিমাইজ ও কম্প্রেস হয়ে দ্রুত লোড হবে।
            </p>
            {errors.imageUrl && (
              <p className="text-[11px] text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="descriptionBn" className="text-xs font-semibold">
              বাংলা বিবরণ <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descriptionBn"
              rows={3}
              placeholder="প্রোডাক্টের বিস্তারিত বিবরণ লিখুন..."
              {...register("descriptionBn")}
            />
            {errors.descriptionBn && (
              <p className="text-[11px] text-destructive">{errors.descriptionBn.message}</p>
            )}
          </div>

          {/* Key Features (line by line) */}
          <div className="space-y-1.5">
            <Label htmlFor="featuresText" className="text-xs font-semibold">
              মূল বৈশিষ্ট্যসমূহ (প্রতি লাইনে একটি করে বৈশিষ্ট্য লিখুন)
            </Label>
            <Textarea
              id="featuresText"
              rows={3}
              placeholder={"সঠিক রিডিং ও মেমোরি সংরক্ষণ\nসহজে বহনযোগ্য ও রিচার্জেবল\n১ বছরের ওয়ারেন্টি"}
              {...register("featuresText")}
            />
          </div>

          {/* Switches: isActive, inStock, featured */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center gap-2.5">
              <Switch
                id="isActive"
                checked={watchIsActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive" className="cursor-pointer text-xs font-semibold">
                {watchIsActive ? (
                  <span className="text-emerald-600 font-bold">ওয়েবসাইটে দৃশ্যমান</span>
                ) : (
                  <span className="text-amber-600 font-bold">লুকানো (হাইড)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center gap-2.5">
              <Switch
                id="inStock"
                checked={watchInStock}
                onCheckedChange={(checked) => setValue("inStock", checked)}
              />
              <Label htmlFor="inStock" className="cursor-pointer text-xs font-semibold">
                {watchInStock ? (
                  <span className="text-emerald-600 font-bold">স্টকে আছে (In Stock)</span>
                ) : (
                  <span className="text-rose-600 font-bold">স্টক শেষ (Out of Stock)</span>
                )}
              </Label>
            </div>

            <div className="flex items-center gap-2.5">
              <Switch
                id="featured"
                checked={watchFeatured}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
              <Label htmlFor="featured" className="cursor-pointer text-xs font-semibold">
                ফিচার্ড প্রোডাক্ট
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              বাতিল
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "আপডেট করুন"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  সংরক্ষণ করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
