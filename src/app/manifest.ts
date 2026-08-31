import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "হেলথ ক্লাব - স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী",
    short_name: "হেলথ ক্লাব",
    description:
      "হেলথ ক্লাবের ডিজিটাল সদস্য কার্ড ব্যবহার করে সেরা হাসপাতাল ও ডায়াগনস্টিক সেন্টারে ডিসকাউন্ট পান।",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    lang: "bn",
    dir: "ltr",
    categories: ["health", "medical", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/images/member-card-logo.webp",
        sizes: "622x535",
        type: "image/webp",
        form_factor: "wide",
        label: "হেলথ ক্লাব মেম্বার কার্ড",
      },
    ],
  };
}
