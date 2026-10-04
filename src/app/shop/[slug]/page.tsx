import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  getProductBySlugAction,
  getAllProductSlugsAction,
  getProductsAction,
} from "@/app/actions/productActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OrderButton } from "../components/OrderButton";
import { ProductCard } from "../components/ProductCard";
import { SITE_URL } from "@/lib/siteConfig";
import { toBanglaNums } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";
import { getProductJsonLd } from "@/lib/seo/productSchema";

export const revalidate = false; // Pure static SSG (zero ISR writes, on-demand revalidation only)

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugsAction();
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    return {
      title: "প্রোডাক্ট পাওয়া যায়নি | হেলথ ক্লাব শপ",
      description: "অনুরোধকৃত প্রোডাক্টটি খুঁজে পাওয়া যায়নি।",
    };
  }

  const title = `${product.nameBn} (${product.nameEn}) - মূল্য ৳${toBanglaNums(product.price)} | হেলথ ক্লাব শপ`;
  const description =
    product.descriptionBn.length > 155
      ? `${product.descriptionBn.slice(0, 152)}...`
      : product.descriptionBn;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/shop/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/shop/${product.slug}`,
      siteName: "Health Club",
      locale: "bn_BD",
      type: "website",
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.nameBn,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const allCategoryProducts = await getProductsAction({ category: product.category });
  const relatedProducts = allCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  // Standardized Google-compliant Merchant listings Schema.org Product
  const jsonLd = getProductJsonLd(product);

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bg-muted/30 min-h-screen py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-foreground">হোম</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-foreground">শপ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.nameBn}
            </span>
          </nav>

          {/* Product Overview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Product Image */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-4">
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-card border border-border/80 p-6 flex items-center justify-center shadow-xs">
                  {/* Badges */}
                  <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
                    {product.featured && (
                      <Badge className="bg-amber-500 text-white text-xs font-bold border-none shadow-xs flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>ফিচার্ড</span>
                      </Badge>
                    )}
                    {product.discountBadge && (
                      <Badge className="bg-primary text-white text-xs font-semibold border-none shadow-xs">
                        {product.discountBadge}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute right-4 top-4 z-10">
                    <Badge
                      variant={product.inStock ? "outline" : "destructive"}
                      className={`text-xs font-bold ${
                        product.inStock
                          ? "bg-background text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-destructive text-white"
                      }`}
                    >
                      {product.inStock ? "স্টকে এভেইলএবল" : "স্টক শেষ"}
                    </Badge>
                  </div>

                  <div className="relative h-full w-full">
                    <Image
                      src={product.imageUrl || "/images/placeholders/default.webp"}
                      alt={product.nameBn}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain"
                      unoptimized={(product.imageUrl || "").startsWith("data:")}
                    />
                  </div>
                </div>

                {/* Delivery & Assurance Pills */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-card border border-border/70 text-center">
                    <ShieldCheck className="h-5 w-5 mx-auto text-primary mb-1" />
                    <span className="text-[11px] font-semibold text-foreground block">১০০% আসল</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card border border-border/70 text-center">
                    <Truck className="h-5 w-5 mx-auto text-sky-500 mb-1" />
                    <span className="text-[11px] font-semibold text-foreground block">ক্যাশ ডেলিভারি</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-card border border-border/70 text-center">
                    <RotateCcw className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                    <span className="text-[11px] font-semibold text-foreground block">ওয়ারেন্টি সাপোর্ট</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Ordering */}
            <div className="lg:col-span-7 space-y-6">
              {/* Titles & Category */}
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs font-semibold text-primary">
                  {product.categoryBn || product.category}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                  {product.nameBn}
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  {product.nameEn}
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">অফার মূল্য</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-foreground">
                      ৳{toBanglaNums(product.price)}
                    </span>
                    {product.regularPrice && product.regularPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through font-semibold">
                        ৳{toBanglaNums(product.regularPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {product.discountBadge && (
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block font-medium">সুবিধা</span>
                    <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {product.discountBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* Ordering CTA Box */}
              <Card className="rounded-3xl border-2 border-primary/30 bg-primary/5 dark:bg-primary/10 overflow-hidden shadow-xs">
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        ফেসবুক পেজে সরাসরি অর্ডার করুন
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        কোনো অনলাইন পেমেন্ট লাগবে না, মেসেজ দিলেই অর্ডার কনফার্ম হবে
                      </p>
                    </div>
                  </div>

                  <OrderButton
                    productSlug={product.slug}
                    productName={product.nameBn}
                    productPrice={product.price}
                    inStock={product.inStock}
                    size="lg"
                    label="অর্ডার করতে ইনবক্স করুন"
                    className="w-full text-base py-3"
                  />

                  {/* Ordering Process Instructions */}
                  <div className="pt-2 border-t border-primary/20 text-xs text-muted-foreground space-y-1.5">
                    <div className="font-semibold text-foreground">অর্ডার করার সহজ ধাপ:</div>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                      <li>বাটনে ক্লিক করলেই সরাসরি ফেসবুক পেজ ইনবক্সে চ্যাট ওপেন হবে</li>
                      <li>প্রোডাক্টের রেফারেন্স সহ মেসেজ সেন্ড করলেই প্রতিনিধি আপনার সাথে যোগাযোগ করে দ্রুত ডেলিভারি নিশ্চিত করবেন</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Key Features */}
              {product.featuresBn && product.featuresBn.length > 0 && (
                <div className="space-y-3 p-5 rounded-2xl bg-card border border-border/80">
                  <h3 className="text-sm font-bold text-foreground">মূল বৈশিষ্ট্যসমূহ:</h3>
                  <ul className="space-y-2">
                    {product.featuresBn.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3 p-5 rounded-2xl bg-card border border-border/80">
                <h3 className="text-sm font-bold text-foreground">প্রোডাক্ট বিবরণ:</h3>
                <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {product.descriptionBn}
                </div>
                {product.descriptionEn && (
                  <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-sans">
                    {product.descriptionEn}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">সম্পর্কিত অন্যান্য প্রোডাক্ট</h2>
                  <p className="text-xs text-muted-foreground">এই ক্যাটাগরির আরও কিছু প্রয়োজনীয় স্বাস্থ্য সামগ্রী</p>
                </div>
                <Link href="/shop" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <span>সব দেখুন</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
