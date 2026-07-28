import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import InstallAppBanner from "@/components/layout/InstallAppBanner";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Locale } from "@/lib/i18n";
import { en } from "@/lib/translations.en";
import { bn } from "@/lib/translations.bn";
import JsonLd from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://healthclubfeni.vercel.app"),
  title: {
    default: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | Health Club",
    template: "%s | হেলথ ক্লাব",
  },
  description: "হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে ফেনী ও দেশের শীর্ষ হাসপাতাল, ল্যাব ও ফার্মেসিতে সর্বোচ্চ ডিসকাউন্ট উপভোগ করুন।",
  keywords: [
    "হেলথ ক্লাব",
    "Health Club",
    "স্বাস্থ্য কার্ড",
    "মেডিকেল ডিসকাউন্ট কার্ড",
    "হাসপাতাল ডিসকাউন্ট",
    "ডায়াগনস্টিক ডিসকাউন্ট ফেনী",
    "স্বাস্থ্য মেম্বারশিপ",
    "সাশ্রয়ী চিকিৎসা",
  ],
  authors: [{ name: "Health Club Team", url: "https://healthclubfeni.vercel.app" }],
  creator: "Health Club",
  publisher: "Health Club",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
    url: "https://healthclubfeni.vercel.app",
    siteName: "হেলথ ক্লাব (Health Club)",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/images/member-card-logo.png",
        width: 800,
        height: 600,
        alt: "Health Club Digital Membership Card Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
    images: ["/images/member-card-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const theme = (cookieStore.get("theme")?.value as "light" | "dark") || "light";
  // Serialize only the active locale's dictionary — halves the client JS bundle
  const initialDict = locale === "en" ? en : bn;

  const globalJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "হেলথ ক্লাব",
      "alternateName": ["Health Club", "Health Club Feni"],
      "url": "https://healthclubfeni.vercel.app",
      "logo": "https://healthclubfeni.vercel.app/images/member-card-logo.png",
      "description": "স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী - একটি প্রিমিয়াম স্বাস্থ্য মেম্বারশিপ সার্ভিস।",
      "telephone": "+8801783721411",
      "email": "healthclubfeni@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Feni",
        "addressCountry": "BD"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801783721411",
        "contactType": "customer service",
        "areaServed": "BD",
        "availableLanguage": ["Bengali", "English"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "হেলথ ক্লাব (Health Club)",
      "url": "https://healthclubfeni.vercel.app",
      "inLanguage": ["bn-BD", "en-US"]
    }
  ];

  return (
    <html lang={locale} className={`${theme} ${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <JsonLd data={globalJsonLd} />
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale} initialDict={initialDict}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer locale={locale} />
            <BottomNav />
            <InstallAppBanner />
            <Toaster richColors position="top-right" />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
