import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
    // Serve modern formats (WebP/AVIF) where supported
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
