import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Points to the service worker source file
  swSrc: "src/sw.ts",
  // Output path for the compiled service worker
  swDest: "public/sw.js",
  // Disable in development (avoids stale cache issues during dev)
  disable: process.env.NODE_ENV === "development",
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
  },
  images: {
    remotePatterns: [
      // Unsplash — partner card images
      { protocol: "https", hostname: "images.unsplash.com" },
      // External QR code API (fallback when qrCodeUrl not in DB)
      { protocol: "https", hostname: "api.qrserver.com" },
      // Fenir Doctor images
      { protocol: "https", hostname: "fenirdoctor.com" },
      { protocol: "https", hostname: "www.fenirdoctor.com" },
    ],
    // Serve modern formats (WebP/AVIF) where supported
    formats: ["image/avif", "image/webp"],
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
    ];
  },
  async headers() {
    return [
      // Static assets: aggressive caching for images, icons, and partner logos
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

