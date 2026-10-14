/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from "serwist";
import {
  Serwist,
  NetworkFirst,
  CacheFirst,
  ExpirationPlugin,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// ---------------------------------------------------------------------------
// High-Priority Offline Caching Strategies
// ---------------------------------------------------------------------------

const customOfflineCache: RuntimeCaching[] = [
  // 1. Next.js Static JS Chunks (immutable hashes) - Cache First with 30-day TTL
  {
    matcher: /\/_next\/static.+\.js$/i,
    handler: new CacheFirst({
      cacheName: "hc-static-js-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },

  // 2. Next.js Static Stylesheets - Cache First with 30-day TTL
  {
    matcher: /\/_next\/static.+\.css$/i,
    handler: new CacheFirst({
      cacheName: "hc-static-css-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },

  // 3. Digital Member Card & Emergency HTML Pages - Network First with Fast Timeout Fallback
  // Matches full document navigations (not RSC requests) to avoid cache collision
  {
    matcher: ({ request, url: { pathname }, sameOrigin }) =>
      sameOrigin &&
      (request.destination === "document" ||
        request.mode === "navigate" ||
        (request.headers.get("Accept")?.includes("text/html") ?? false)) &&
      !request.headers.get("RSC") &&
      (pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/emergency" ||
        pathname.startsWith("/emergency/") ||
        pathname === "/partner-hospitals" ||
        pathname.startsWith("/partner-hospitals/") ||
        pathname === "/offline"),
    handler: new NetworkFirst({
      cacheName: "hc-critical-html-pages",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          maxAgeFrom: "last-used",
        }),
      ],
      networkTimeoutSeconds: 3,
    }),
  },

  // 4. Critical RSC Flight Payloads for Dashboard & Emergency Routes
  // Cached separately from HTML to prevent App Router stream/HTML payload corruption
  {
    matcher: ({ request, url: { pathname }, sameOrigin }) =>
      sameOrigin &&
      request.headers.get("RSC") === "1" &&
      (pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/emergency" ||
        pathname.startsWith("/emergency/") ||
        pathname === "/partner-hospitals" ||
        pathname.startsWith("/partner-hospitals/")),
    handler: new NetworkFirst({
      cacheName: "hc-critical-rsc-payloads",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          maxAgeFrom: "last-used",
        }),
      ],
      networkTimeoutSeconds: 3,
    }),
  },

  // 5. Member Card QR Code Generator Service - Cache First with long TTL
  {
    matcher: ({ url, sameOrigin }) =>
      (sameOrigin && url.pathname.startsWith("/api/qr")) ||
      (url.hostname === "api.qrserver.com" && url.pathname.startsWith("/v1/create-qr-code")),
    handler: new CacheFirst({
      cacheName: "hc-member-qr-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 128,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },

  // 6. Member Card Assets, Logos, and Background Textures - Cache First
  {
    matcher: ({ url: { pathname }, sameOrigin }) =>
      sameOrigin &&
      (pathname.startsWith("/images/member-card-") ||
        pathname.startsWith("/icons/") ||
        pathname.startsWith("/images/logo") ||
        pathname === "/favicon.ico"),
    handler: new CacheFirst({
      cacheName: "hc-card-branding-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },

  // 7. Supabase CDN Avatars and Profile Images - Cache First
  {
    matcher: ({ url }) =>
      url.hostname.includes("supabase.co") && url.pathname.includes("/storage/v1/object/public/"),
    handler: new CacheFirst({
      cacheName: "hc-member-avatars-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          maxAgeFrom: "last-used",
        }),
      ],
    }),
  },
];

// Filter precache entries to ensure all core runtime, layout, styles, and offline chunks
// are precached, while excluding heavy administrative panels (admin & partner portal)
// to keep the initial SW install lightweight and blazing fast.
const manifestEntries = (self.__SW_MANIFEST || []).filter((entry) => {
  const url = typeof entry === "string" ? entry : entry.url;
  // Exclude admin and partner dashboard chunks (not required for public offline app)
  if (url.includes("/app/admin/") || url.includes("/app/partner/") || url.includes("/app/api/")) {
    return false;
  }
  // Exclude text documentation and sourcemaps
  if (url.endsWith(".txt") || url.endsWith(".map")) {
    return false;
  }
  return true;
});

const precacheEntries: (PrecacheEntry | string)[] = [
  ...manifestEntries,
  { url: "/offline", revision: "1.0.0" },
];

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...customOfflineCache, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document" || request.mode === "navigate";
        },
      },
    ],
  },
});

serwist.addEventListeners();

// Cleanup obsolete legacy cache names from earlier app versions on activate
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const legacyCaches = ["hc-critical-offline-pages", "hc-partner-hospitals-cache"];
        await Promise.all(
          cacheNames.map((name) => {
            if (legacyCaches.includes(name)) {
              return caches.delete(name);
            }
            return Promise.resolve(false);
          })
        );
      } catch {
        // Cache cleanup failure should not block activation
      }
    })()
  );
});

  // ---------------------------------------------------------------------------
  // Web Push Notifications Engine
  // ---------------------------------------------------------------------------

  self.addEventListener("push", (event: ExtendableEvent) => {
    const pushEvent = event as unknown as {
      data?: {
        json: () => Record<string, unknown>;
        text: () => string;
      };
    };
    if (!pushEvent.data) return;

    try {
      let payload: {
        title?: string;
        body?: string;
        message?: string;
        icon?: string;
        badge?: string;
        url?: string;
        link?: string;
        tag?: string;
        requireInteraction?: boolean;
        data?: Record<string, unknown>;
      };

      try {
        payload = pushEvent.data.json() as typeof payload;
      } catch {
        payload = {
          title: "হেলথ ক্লাব (Health Club)",
          body: pushEvent.data.text(),
        };
      }

      const title = payload.title || "হেলথ ক্লাব (Health Club)";
      const body = payload.body || payload.message || "";
      const targetUrl = payload.url || payload.link || "/";

      const options: NotificationOptions = {
        body,
        icon: payload.icon || "/icons/icon-192.png",
        badge: payload.badge || "/icons/icon-192.png",
        tag: payload.tag || "health-club-push",
        requireInteraction: payload.requireInteraction ?? false,
        data: {
          url: targetUrl,
          ...payload.data,
        },
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } catch {
      event.waitUntil(
        self.registration.showNotification("হেলথ ক্লাব (Health Club)", {
          body: "আপনার একটি নতুন স্বাস্থ্য বিজ্ঞপ্তি রয়েছে।",
          icon: "/icons/icon-192.png",
          data: { url: "/" },
        })
      );
    }
  });

  self.addEventListener("notificationclick", (event: ExtendableEvent) => {
    const notifEvent = event as unknown as {
      notification: Notification & { close: () => void; data?: { url?: string } };
    };

    notifEvent.notification.close();

    const targetUrl = (notifEvent.notification.data && notifEvent.notification.data.url) || "/";

    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ("url" in client && (client as WindowClient).url.includes(targetUrl) && "focus" in client) {
            return (client as WindowClient).focus();
          }
        }
        if (clientList.length > 0 && "focus" in clientList[0] && "navigate" in clientList[0]) {
          (clientList[0] as WindowClient).focus();
          return (clientList[0] as WindowClient).navigate(targetUrl);
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
    );
  });
