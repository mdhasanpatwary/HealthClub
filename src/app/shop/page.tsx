import type { Metadata } from "next";
import { ShoppingBag, ShieldCheck, Truck, Percent, MessageCircle, PackageOpen } from "lucide-react";
import { getProductsAction } from "@/app/actions/productActions";
import { ProductCard } from "./components/ProductCard";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

export const dynamic = "force-static";
export const revalidate = false; // Pure static SSG (on-demand revalidated on admin updates)

export const metadata: Metadata = {
  title: "হেলথ ক্লাব শপ - জরুরি মেডিকেল ডিভাইস ও হেলথ কেয়ার প্রোডাক্ট",
  description:
    "ডিজিটাল বিপি মেশিন, নেবুলাইজার, গ্লুকোমিটার, থার্মোমিটার ও জরুরি হোম হেলথকেয়ার প্রোডাক্ট সরাসরি ফেসবুক পেজে মেসেজ দিয়ে সহজে অর্ডার করুন। মেম্বারদের জন্য বিশেষ ছাড় ও ক্যাশ অন ডেলিভারি।",
  keywords: [
    "Health Club Shop",
    "মেডিকেল ইকুইপমেন্ট ফেনী",
    "বিপি মেশিন ফেনী",
    "নেবুলাইজার দাম",
    "গ্লুকোমিটার স্ট্রিপ",
    "মেডিকেল সামগ্রী অনলাইন",
    "Health Club Feni",
  ],
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: "হেলথ ক্লাব শপ - জরুরি মেডিকেল ডিভাইস ও হেলথ কেয়ার প্রোডাক্ট",
    description:
      "ডিজিটাল বিপি মেশিন, নেবুলাইজার, গ্লুকোমিটার, থার্মোমিটার ও জরুরি হোম হেলথকেয়ার প্রোডাক্ট সহজে অর্ডার করুন।",
    url: `${SITE_URL}/shop`,
    siteName: "Health Club",
    locale: "bn_BD",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "হেলথ ক্লাব শপ - জরুরি মেডিকেল ডিভাইস ও হেলথ কেয়ার প্রোডাক্ট",
    description:
      "ডিজিটাল বিপি মেশিন, নেবুলাইজার, গ্লুকোমিটার, থার্মোমিটার ও জরুরি হোম হেলথকেয়ার প্রোডাক্ট সহজে অর্ডার করুন।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default async function ShopPage() {
  const products = await getProductsAction();

  // Structured Schema.org ItemList for Products
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "হেলথ ক্লাব শপ - মেডিকেল ও হেলথকেয়ার প্রোডাক্ট ক্যাটালগ",
    description: "জরুরি স্বাস্থ্য ডিভাইস ও হোম হেলথকেয়ার পণ্যের তালিকা",
    url: `${SITE_URL}/shop`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.nameBn,
        alternateName: product.nameEn,
        image: product.imageUrl,
        description: product.descriptionBn,
        url: `${SITE_URL}/shop/${product.slug}`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "BDT",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-muted/30 min-h-screen py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>সহজ ম্যানুয়াল অর্ডার প্রক্রিয়া</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              হেলথ ক্লাব <span className="text-primary">প্রোডাক্ট শপ</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              জরুরি মেডিকেল ইকুইপমেন্ট ও হোম হেলথকেয়ার ডিভাইস সরাসরি ফেসবুক পেজে মেসেজ পাঠিয়ে অর্ডার করুন। কোনো কার্ড বা পেমেন্ট গেটওয়ের ঝামেলা নেই।
            </p>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">সরাসরি মেসেজে অর্ডার</h4>
                <p className="text-[11px] text-muted-foreground">লিংক পাঠিয়ে সহজেই বুক করুন</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">অরিজিনাল ব্র্যান্ড</h4>
                <p className="text-[11px] text-muted-foreground">১০০% আসল প্রোডাক্টের নিশ্চয়তা</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Percent className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">মেম্বার বিশেষ ছাড়</h4>
                <p className="text-[11px] text-muted-foreground">১০-৩০% পর্যন্ত বিশেষ সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-[11px] text-muted-foreground">পণ্য হাতে পেয়ে মূল্য পরিশোধ</p>
              </div>
            </div>
          </div>

          {/* Static Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-card rounded-3xl border border-dashed border-border/80 p-8 max-w-md mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-4">
                <PackageOpen className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                বর্তমানে কোনো প্রোডাক্ট যুক্ত নেই
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                শীঘ্রই নতুন মেডিকেল প্রোডাক্ট ও হেলথকেয়ার ডিভাইস যুক্ত করা হবে।
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
