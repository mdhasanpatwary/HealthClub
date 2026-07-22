import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Locale } from "@/lib/i18n";
import { en } from "@/lib/translations.en";
import { bn } from "@/lib/translations.bn";

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
  title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
  description: "হেলথ ক্লাবের সদস্য হয়ে নির্ধারিত পার্টনার হাসপাতাল ও ডায়াগনস্টিক সেন্টারে বিশেষ ডিসকাউন্ট এবং সাশ্রয়ী মূল্যে উন্নত স্বাস্থ্যসেবা উপভোগ করুন।",
  keywords: ["হেলথ ক্লাব", "স্বাস্থ্য কার্ড", "হাসপাতাল ডিসকাউন্ট", "মেডিকেল ডিসকাউন্ট কার্ড", "সাশ্রয়ী চিকিৎসা"],
  icons: {
    icon: "/images/member-card-logo.png",
    shortcut: "/images/member-card-logo.png",
    apple: "/images/member-card-logo.png",
  },
  openGraph: {
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    description: "নির্ধারিত হাসপাতাল ও ল্যাবে ডিসকাউন্ট পেতে আজই হেলথ ক্লাবের ডিজিটাল মেম্বার কার্ড সংগ্রহ করুন।",
  }
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

  return (
    <html lang={locale} className={`${theme} ${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {/* JSON-LD Structured Data for Healthcare Membership Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "হেলথ ক্লাব",
              "alternateName": "Health Club",
              "url": "https://healthclubfeni.vercel.app",
              "logo": "https://healthclubfeni.vercel.app/images/member-card-logo.png",
              "description": "স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী - একটি প্রিমিয়াম স্বাস্থ্য মেম্বারশিপ সার্ভিস।",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+8801783721411",
                "contactType": "customer service",
                "areaServed": "BD",
                "availableLanguage": ["Bengali", "English"]
              }
            })
          }}
        />
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLocale={locale} initialDict={initialDict}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer locale={locale} />
            <Toaster richColors position="top-right" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
