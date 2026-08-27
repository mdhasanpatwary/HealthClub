import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import GlobalNoticeBanner from "@/components/layout/GlobalNoticeBanner";
import { getCachedNoticeSetting } from "@/app/actions/systemSettingsActions";
import { Toaster } from "sonner";
import { cookies, headers } from "next/headers";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Locale } from "@/lib/i18n";
import { getDictionary, getNamespacesForRoute } from "@/lib/translations";
import JsonLd from "@/components/seo/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SITE_URL, DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from "@/lib/siteConfig";

// Lazy-load client-only background/interactive components to reduce main layout bundle
const InstallAppBanner = dynamic(() => import("@/components/layout/InstallAppBanner"));
const PushNotificationPrompt = dynamic(() => import("@/components/pwa/PushNotificationPrompt"));
const PwaTracker = dynamic(() => import("@/components/pwa/PwaTracker"));
const WebVitalsTracker = dynamic(() => import("@/components/analytics/WebVitalsTracker"));

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী | Health Club",
    template: "%s | হেলথ ক্লাব",
  },
  description: "হেলথ ক্লাবের ডিজিটাল মেম্বারশিপ কার্ড ব্যবহার করে ফেনী ও দেশের শীর্ষ হাসপাতাল, ল্যাব ও ফার্মেসিতে সর্বোচ্চ ডিসকাউন্ট উপভোগ করুন।",
  keywords: [
    "Health Club",
    "হেলথ ক্লাব",
    "Health Club Feni",
    "হেলথ ক্লাব ফেনী",
    "feni ambulance service",
    "feni ambulance",
    "feni emergency ambulance",
    "ফেনী এ্যাম্বুলেন্স সার্ভিস",
    "ফেনী অ্যাম্বুলেন্স সেবা",
    "feni doctors info",
    "feni doctor list",
    "feni doctor serial number",
    "feni specialist doctors",
    "ফেনী ডাক্তারদের তথ্য",
    "ফেনী ডাক্তার সিরিয়াল",
    "ফেনীর বিশেষজ্ঞ ডাক্তার",
    "feni diagnostic center",
    "feni diagnostic center list",
    "feni pathology lab",
    "feni blood test discount",
    "ফেনী ডায়াগনস্টিক সেন্টার",
    "ফেনী ডায়াগনস্টিক সেন্টার তালিকা",
    "ফেনী ল্যাব টেস্ট",
    "feni hospital list",
    "feni hospital",
    "feni private hospital",
    "feni clinic list",
    "ফেনী হাসপাতাল তালিকা",
    "ফেনী হাসপাতাল",
    "feni blood donor",
    "feni blood bank",
    "ফেনী রক্তদাতা",
    "ফেনীর রক্তের গ্রুপ ডিরেক্টরি",
    "feni pharmacy",
    "feni medicine discount",
    "feni model pharmacy",
    "ফেনী ফার্মেসি",
    "ফেনী ঔষধ ডিসকাউন্ট",
    "স্বাস্থ্য কার্ড",
    "মেডিকেল ডিসকাউন্ট কার্ড",
    "হাসপাতাল ডিসকাউন্ট",
    "ডায়াগনস্টিক ডিসকাউন্ট ফেনী",
    "স্বাস্থ্য মেম্বারশিপ",
    "সাশ্রয়ী চিকিৎসা",
  ],
  authors: [{ name: "Health Club Team", url: SITE_URL }],
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
    types: {
      "text/markdown": [
        { url: "/llms.txt", title: "Health Club LLM Knowledge Base (llms.txt)" },
        { url: "/llms-full.txt", title: "Health Club Full Knowledge Base (llms-full.txt)" },
      ],
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      process.env.GOOGLE_SITE_VERIFICATION ||
      "google526cd03c34c4b84b",
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
  other: {
    "geo.region": "BD-16",
    "geo.placename": "Feni, Chittagong, Bangladesh",
    "geo.position": "23.0159;91.3976",
    "ICBM": "23.0159, 91.3976",
  },
  openGraph: {
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
    url: SITE_URL,
    siteName: "হেলথ ক্লাব (Health Club)",
    locale: "bn_BD",
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";
  const locale = (cookieStore.get("locale")?.value as Locale) || "bn";
  const theme = (cookieStore.get("theme")?.value as "light" | "dark") || "light";

  // Serialize only the active route's translation namespaces (e.g. common + landing)
  const initialNamespaces = getNamespacesForRoute(pathname);
  const initialDict = getDictionary(locale, initialNamespaces);
  const notice = await getCachedNoticeSetting();

  const globalJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "হেলথ ক্লাব",
      "alternateName": ["Health Club", "Health Club Feni"],
      "url": SITE_URL,
      "logo": `${SITE_URL}/images/member-card-logo.png`,
      "description": "স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী - একটি প্রিমিয়াম স্বাস্থ্য মেম্বারশিপ সার্ভিস।",
      "telephone": "+8801886763849",
      "email": "healthclubfeni@gmail.com",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61591616953090",
        "https://wa.me/8801886763849",
        "https://youtube.com"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Feni",
        "addressCountry": "BD"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801886763849",
        "contactType": "customer service",
        "areaServed": "BD",
        "availableLanguage": ["Bengali", "English"]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "হেলথ ক্লাব (Health Club)",
      "url": SITE_URL,
      "inLanguage": ["bn-BD", "en-US"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/consultants?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${theme} ${inter.variable} ${notoSansBengali.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.qrserver.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.qrserver.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {/* Skip to Main Content Link for Keyboard / Screen Reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:outline-hidden focus:ring-2 focus:ring-ring"
        >
          {locale === "en" ? "Skip to main content" : "মূল বিষয়বস্তুতে যান"}
        </a>
        <JsonLd data={globalJsonLd} />
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider
            initialLocale={locale}
            initialDict={initialDict}
            initialNamespaces={initialNamespaces}
          >
            <PwaTracker />
            <GlobalNoticeBanner notice={notice} />
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-hidden">
              {children}
            </main>
            <Footer locale={locale} />
            <BottomNav />
            <InstallAppBanner />
            <PushNotificationPrompt />
            <Toaster richColors position="top-right" />
            <Analytics />
            <GoogleAnalytics />
            <WebVitalsTracker />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
