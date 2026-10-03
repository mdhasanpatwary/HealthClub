"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductItem } from "@/lib/validations/product";
import { toBanglaNums } from "@/lib/utils";
import { OrderButton } from "./OrderButton";
import { Sparkles, ArrowRight, Package } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
}

const FALLBACK_IMAGE = "/images/placeholders/default.webp";

export function ProductCard({ product }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(product.imageUrl || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-0 gap-0 transition-all duration-300 hover:shadow-md hover:border-primary/40">
      {/* Full-Width Edge-to-Edge Image Container (Reduced Height) */}
      <div className="relative h-44 sm:h-48 md:h-52 w-full shrink-0 overflow-hidden bg-muted/30 flex items-center justify-center">
        {imgSrc && !hasError ? (
          <Image
            src={imgSrc}
            alt={product.nameBn}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={imgSrc.startsWith("data:")}
            onError={() => {
              if (imgSrc !== FALLBACK_IMAGE) {
                setImgSrc(FALLBACK_IMAGE);
              } else {
                setHasError(true);
              }
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/60 p-4">
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <span className="text-[11px] font-medium">হেলথ প্রোডাক্ট</span>
          </div>
        )}

        {/* Clickable Overlay Link to Detail Page */}
        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`${product.nameBn} বিস্তারিত দেখুন`}
        />

        {/* Absolute Badges on Top-Left */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5 items-start pointer-events-none">
          {product.featured && (
            <Badge className="bg-amber-500/95 text-white text-[10px] font-bold border-none shadow-sm backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>ফিচার্ড</span>
            </Badge>
          )}
          {product.discountBadge && (
            <Badge className="bg-primary/95 text-white text-[10px] font-semibold border-none shadow-sm backdrop-blur-xs">
              {product.discountBadge}
            </Badge>
          )}
        </div>

        {/* Absolute Stock Badge on Top-Right */}
        <div className="absolute right-3 top-3 z-20 pointer-events-none">
          <Badge
            variant={product.inStock ? "outline" : "destructive"}
            className={`text-[10px] font-semibold shadow-sm backdrop-blur-xs ${
              product.inStock
                ? "bg-background/90 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-destructive/95 text-white border-none"
            }`}
          >
            {product.inStock ? "স্টকে আছে" : "স্টক আউট"}
          </Badge>
        </div>
      </div>

      {/* Content Body */}
      <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
        <div className="space-y-1.5">
          {/* Product Title (Max 2 lines) */}
          <Link href={`/shop/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className="line-clamp-2 text-base font-bold text-foreground leading-snug">
              {product.nameBn}
            </h3>
          </Link>

          {/* Product Description (Max 2 lines) */}
          <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {product.descriptionBn}
          </p>

          {/* Price */}
          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-xl font-black text-foreground">
              ৳{toBanglaNums(product.price)}
            </span>
            {product.regularPrice && product.regularPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through font-medium">
                ৳{toBanglaNums(product.regularPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <div className="flex-1">
            <OrderButton
              productSlug={product.slug}
              productName={product.nameBn}
              productPrice={product.price}
              inStock={product.inStock}
              className="w-full text-xs sm:text-sm py-2"
            />
          </div>
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground shrink-0"
            title="বিস্তারিত দেখুন"
            aria-label={`${product.nameBn} বিস্তারিত দেখুন`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
