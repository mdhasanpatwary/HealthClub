import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Points to the service worker source file
  swSrc: "src/sw.ts",
  // Output path for the compiled service worker
  swDest: "public/sw.js",
  // Disable in development (avoids stale cache issues during dev)
  disable: process.env.NODE_ENV === "development",
  // Precaches only essential app shell branding assets from public/ directory
  globPublicPatterns: [
    "icons/**/*.{png,svg,webp}",
    "images/member-card-*.webp",
    "images/health-club-logo.webp",
    "favicon.ico",
  ],
});

const nextConfig: NextConfig = {
  // Explicitly opt into Turbopack for dev — silences the "webpack config without
  // turbopack config" error caused by @serwist/next's webpack plugin.
  // Production builds still use `--webpack` (see package.json) so the SW is generated.
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    optimizePackageImports: ["lucide-react", "sonner", "@base-ui/react"],
    cpus: 4,
    staticGenerationRetryCount: 2,
    staticGenerationMaxConcurrency: 4,
  },
  images: {
    // Disable Vercel on-demand image transformations to stay within free-tier limits and avoid 402 errors.
    // Static assets are already compressed WebP files and remote images serve directly from CDNs.
    unoptimized: true,
    remotePatterns: [
      // Supabase Storage CDN
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "uqtodphwiwzikmhsyiyc.supabase.co" },
      // Unsplash — partner card images
      { protocol: "https", hostname: "images.unsplash.com" },
      // External QR code API (fallback when qrCodeUrl not in DB)
      { protocol: "https", hostname: "api.qrserver.com" },
      // Fenir Doctor images
      { protocol: "https", hostname: "fenirdoctor.com" },
      { protocol: "https", hostname: "www.fenirdoctor.com" },
    ],
    deviceSizes: [384, 512, 640, 750, 828, 1080, 1200, 1920],
    // Responsive image sizes for small UI components (avatars, badges, thumbnails)
    imageSizes: [32, 48, 56, 64, 80, 96, 128, 256, 384],
    // Serve modern AVIF and WebP formats for smaller payloads and faster decode on mobile
    formats: ["image/avif", "image/webp"],
    qualities: [60, 65, 75],
    // Cache optimized images on the edge CDN for 31 days (2,678,400s) to minimize repeat storage egress
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      {
        source: "/doctors",
        destination: "/consultants",
        permanent: true,
      },
      {
        source: "/doctors/:path*",
        destination: "/consultants/:path*",
        permanent: true,
      },
      // Edge-level permanent redirects for legacy doctor IDs (0 Active CPU)
      {
        source: "/consultants/doc_a6446d15",
        destination: "/consultants/asst-prof-dr-abdul-mtin",
        permanent: true,
      },
      // Edge-level permanent redirects for legacy reviewer slugs (0 Active CPU)
      {
        source: "/consultants/dr-zahid-hossain-mazumder",
        destination: "/consultants/dr-jahid-hossain-mazumder",
        permanent: true,
      },
      {
        source: "/consultants/dr-kamrun-nahar-roli",
        destination: "/consultants/asst-prof-dr-kamrun-nahar-rli",
        permanent: true,
      },
      {
        source: "/consultants/dr-salma-akter-gynecologist",
        destination: "/consultants/asst-prof-dr-kamrun-nahar-rli",
        permanent: true,
      },
      {
        source: "/consultants/dr-rokeya-begum-gynecology",
        destination: "/consultants/asst-prof-dr-kamrun-nahar-rli",
        permanent: true,
      },
      {
        source: "/consultants/dr-rokeya-begum-radiologist",
        destination: "/consultants/asst-prof-dr-kamrun-nahar-rli",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-iqbal-hossain-orthopedic",
        destination: "/consultants/dr-md-iqbal-hossain",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-iqbal-hossain-nephrologist",
        destination: "/consultants/dr-saiful-ahsan-rana",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-kamrul-hasan-medicine",
        destination: "/consultants/dr-md-kamrul-hasan",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-kabir-hossain-endocrinologist",
        destination: "/consultants/dr-md-kabir-hossain",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-fahmidul-haque-rion",
        destination: "/consultants/dr-md-fahmidul-hoque-rion",
        permanent: true,
      },
      {
        source: "/consultants/dr-fatematuz-zohra-antara",
        destination: "/consultants/dr-fatematuj-johra-ontra",
        permanent: true,
      },
      {
        source: "/consultants/dr-ashim-kumar-saha",
        destination: "/consultants/assoc-prof-dr-osim-kumar-saha",
        permanent: true,
      },
      {
        source: "/consultants/dr-mohammad-shahadat-hossain-psychiatrist",
        destination: "/consultants/asst-prof-dr-mohammad-shahadat-hossain",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-nizam-uddin-cardiologist",
        destination: "/consultants/dr-muhammad-belal-hossain",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-nazmul-hasan-neurologist",
        destination: "/consultants/dr-osim-kumar-chowdhury",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-saiful-islam-surgeon",
        destination: "/consultants/dr-md-harun-or-rshid",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-saiful-islam-ent",
        destination: "/consultants/dr-asif-uddin",
        permanent: true,
      },
      {
        source: "/consultants/dr-mohammad-zahirul-islam-ent",
        destination: "/consultants/dr-asif-uddin",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-rafiqul-islam-eye",
        destination: "/consultants/dr-brj-gopal-pal",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-ziauddin-ahmed",
        destination: "/consultants/dr-piyas-kanti-pal",
        permanent: true,
      },
      // Edge-level permanent redirects for duplicate doctor slugs (-2 suffix)
      {
        source: "/consultants/dr-md-kamrul-hasan-2",
        destination: "/consultants/dr-md-kamrul-hasan",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-iqbal-hossain-2",
        destination: "/consultants/dr-md-iqbal-hossain",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-fahmidul-hoque-rion-2",
        destination: "/consultants/dr-md-fahmidul-hoque-rion",
        permanent: true,
      },
      {
        source: "/consultants/dr-osim-kumar-chowdhury-2",
        destination: "/consultants/dr-osim-kumar-chowdhury",
        permanent: true,
      },
      {
        source: "/consultants/asst-prof-dr-asma-akter-2",
        destination: "/consultants/asst-prof-dr-asma-akter",
        permanent: true,
      },
      {
        source: "/consultants/asst-prof-dr-deoyan-mushfikur-rahman-2",
        destination: "/consultants/asst-prof-dr-deoyan-mushfikur-rahman",
        permanent: true,
      },
      {
        source: "/consultants/asst-prof-dr-mumtahena-amir-2",
        destination: "/consultants/asst-prof-dr-mumtahena-amir",
        permanent: true,
      },
      {
        source: "/consultants/asst-prof-dr-sirajul-munir-ohi-2",
        destination: "/consultants/asst-prof-dr-sirajul-munir-ohi",
        permanent: true,
      },
      {
        source: "/consultants/dr-champa-kundu-2",
        destination: "/consultants/dr-champa-kundu",
        permanent: true,
      },
      {
        source: "/consultants/dr-e-ke-em-saifur-rahman-2",
        destination: "/consultants/dr-e-ke-em-saifur-rahman",
        permanent: true,
      },
      {
        source: "/consultants/dr-jannatul-ferdous-2",
        destination: "/consultants/dr-jannatul-ferdous",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-mominul-islam-sohag-2",
        destination: "/consultants/dr-md-mominul-islam-sohag",
        permanent: true,
      },
      {
        source: "/consultants/dr-md-rashedul-hasan-2",
        destination: "/consultants/dr-md-rashedul-hasan",
        permanent: true,
      },
      {
        source: "/consultants/dr-shmishtha-de-2",
        destination: "/consultants/dr-shmishtha-de",
        permanent: true,
      },
      {
        source: "/consultants/sayma-akter-2",
        destination: "/consultants/sayma-akter",
        permanent: true,
      },
      // Edge-level redirects for department filter fallbacks & legacy department slugs
      {
        source: "/consultants/department/other",
        destination: "/consultants",
        permanent: true,
      },
      {
        source: "/consultants/department/all",
        destination: "/consultants",
        permanent: true,
      },
      {
        source: "/consultants/department/dental-care",
        destination: "/consultants/department/dental",
        permanent: true,
      },
      {
        source: "/consultants/department/general-medicine",
        destination: "/consultants/department/medicine",
        permanent: true,
      },
      {
        source: "/consultants/department/pediatrics-child",
        destination: "/consultants/department/pediatrics",
        permanent: true,
      },
      {
        source: "/consultants/department/gynecology-obstetrics",
        destination: "/consultants/department/gynecology",
        permanent: true,
      },
      {
        source: "/consultants/department/ent-head-neck",
        destination: "/consultants/department/ent",
        permanent: true,
      },
      {
        source: "/consultants/department/ophthalmology-eye",
        destination: "/consultants/department/eye",
        permanent: true,
      },
      {
        source: "/consultants/department/general-laparoscopic-surgery",
        destination: "/consultants/department/surgery",
        permanent: true,
      },
      {
        source: "/consultants/department/dermatology-venereology",
        destination: "/consultants/department/dermatology",
        permanent: true,
      },
      {
        source: "/consultants/department/nephrology-kidney",
        destination: "/consultants/department/nephrology",
        permanent: true,
      },
      {
        source: "/consultants/department/gastroenterology-liver",
        destination: "/consultants/department/hepatology",
        permanent: true,
      },
      {
        source: "/consultants/department/neurology-stroke",
        destination: "/consultants",
        permanent: true,
      },
      {
        source: "/consultants/department/urology-care",
        destination: "/consultants",
        permanent: true,
      },
      // Edge-level redirect for malformed partner blog URLs
      {
        source: "/partner-hospitals/blog/:path*",
        destination: "/blog/:path*",
        permanent: true,
      },
      // Edge-level redirects for legacy query parameters (0 Active CPU)
      {
        source: "/partner-hospitals",
        has: [{ type: "query", key: "category", value: "hospital" }],
        destination: "/partner-hospitals/category/hospital",
        permanent: true,
      },
      {
        source: "/partner-hospitals",
        has: [{ type: "query", key: "category", value: "diagnostic" }],
        destination: "/partner-hospitals/category/diagnostic",
        permanent: true,
      },
      {
        source: "/partner-hospitals",
        has: [{ type: "query", key: "category", value: "pharmacy" }],
        destination: "/partner-hospitals/category/pharmacy",
        permanent: true,
      },
      {
        source: "/emergency",
        has: [{ type: "query", key: "tab", value: "hotlines" }],
        destination: "/emergency/hotlines",
        permanent: true,
      },
      {
        source: "/emergency",
        has: [{ type: "query", key: "tab", value: "ambulances" }],
        destination: "/emergency/ambulances",
        permanent: true,
      },
      {
        source: "/emergency",
        has: [{ type: "query", key: "tab", value: "donors" }],
        destination: "/emergency/blood-donors",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Static assets: aggressive caching for images, icons, and partner logos
      {
        source: "/_next/static/media/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Public directory Edge CDN caching: 1-year edge TTL (on-demand revalidated via tags/revalidatePath)
      // Prevents hourly cache eviction that triggers massive Vercel Compute / Fast Origin Transfer spikes
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/consultants",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/consultants/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/partner-hospitals",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/partner-hospitals/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/blog",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/blog/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/emergency",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/emergency/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/membership",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/health-tools",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/health-tips",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/health-tips/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=31536000, stale-while-revalidate=86400" },
        ],
      },
      // Security headers for all application routes (allows camera for self domain QR scanning)
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);

