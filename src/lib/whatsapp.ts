import type React from "react";

/**
 * Normalizes phone numbers to standard WhatsApp format (digits only).
 * Handles Bangladesh local numbers (018...), international (+880...),
 * and raw strings with dashes or spaces.
 */
export function cleanWhatsAppNumber(phone?: string): string {
  if (!phone) return "";
  const raw = phone.trim().replace(/[^0-9]/g, "");
  if (!raw) return "";

  // If already full BD international format starting with 880 (13 digits: 8801XXXXXXXXX)
  if (raw.startsWith("880") && raw.length === 13) {
    return raw;
  }

  // If starts with 88 and followed by 01 (14 digits, e.g., 88018...)
  if (raw.startsWith("8801") && raw.length === 13) {
    return raw;
  }

  // Standard Bangladesh local numbers (11 digits starting with 01, e.g. 01886763849)
  if (raw.startsWith("01") && raw.length === 11) {
    return `880${raw.slice(1)}`;
  }

  // 10 digits without leading 0 (e.g. 1886763849)
  if (raw.startsWith("1") && raw.length === 10) {
    return `880${raw}`;
  }

  // Fallback normalize leading 880 / 88 / 0
  const stripped = raw.replace(/^(880|88|0)/, "");
  if (stripped.length === 10 && stripped.startsWith("1")) {
    return `880${stripped}`;
  }

  return raw;
}

/**
 * Detects whether the current browser session is on a mobile device (Android/iOS/iPad/Tablet).
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const isTouchMac = /Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
  return isMobileUA || isTouchMac;
}

/**
 * Returns a universal web URL (wa.me) suitable for SSR, SEO bots, and static href attributes.
 */
export function getWhatsAppUniversalUrl(phone?: string, message?: string): string {
  const cleanNum = cleanWhatsAppNumber(phone);
  const encodedText = message ? encodeURIComponent(message) : "";
  if (!cleanNum) {
    return encodedText ? `https://api.whatsapp.com/send?text=${encodedText}` : "https://wa.me/";
  }
  return `https://wa.me/${cleanNum}${encodedText ? `?text=${encodedText}` : ""}`;
}

/**
 * Opens WhatsApp dynamically:
 * - On Mobile: Uses direct `whatsapp://send` protocol so the native WhatsApp app opens immediately
 *   without launching an intermediate browser tab or demanding WhatsApp Web QR login.
 * - On Desktop: Uses `https://web.whatsapp.com/send` in a new tab for seamless web chatting.
 */
export function openWhatsApp({
  phone,
  message,
}: {
  phone?: string;
  message?: string;
}): void {
  if (typeof window === "undefined") return;

  const cleanNum = cleanWhatsAppNumber(phone);
  const encodedText = message ? encodeURIComponent(message) : "";
  const isMobile = isMobileDevice();

  if (isMobile) {
    // Native app protocol: directly instructs OS to launch WhatsApp app
    const appParams = [
      cleanNum ? `phone=${cleanNum}` : "",
      encodedText ? `text=${encodedText}` : "",
    ]
      .filter(Boolean)
      .join("&");

    const appUrl = `whatsapp://send?${appParams}`;
    const fallbackUniversalUrl = getWhatsAppUniversalUrl(phone, message);

    const startTime = Date.now();
    window.location.href = appUrl;

    // Fallback if WhatsApp is not installed on the device
    const fallbackTimer = setTimeout(() => {
      if (Date.now() - startTime < 3500 && !document.hidden) {
        window.location.href = fallbackUniversalUrl;
      }
    }, 1500);

    const cleanup = () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("blur", cleanup);
      document.removeEventListener("visibilitychange", cleanup);
    };

    window.addEventListener("blur", cleanup, { once: true });
    document.addEventListener("visibilitychange", cleanup, { once: true });
  } else {
    // Desktop browser: open WhatsApp Web directly in a new tab
    const webParams = [
      cleanNum ? `phone=${cleanNum}` : "",
      encodedText ? `text=${encodedText}` : "",
    ]
      .filter(Boolean)
      .join("&");

    const webUrl = `https://web.whatsapp.com/send?${webParams}`;
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }
}

/**
 * Helper to intercept clicks on WhatsApp buttons/links.
 * Prevents unnecessary browser tab navigation and routes to the proper protocol/URL.
 */
export function handleWhatsAppClick(
  e: React.MouseEvent,
  options: { phone?: string; message?: string }
): void {
  e.preventDefault();
  openWhatsApp(options);
}

/**
 * Helper for sharing text or article URLs via WhatsApp.
 */
export function openWhatsAppShare({
  title,
  url,
  text,
}: {
  title?: string;
  url?: string;
  text?: string;
}): void {
  const fullText = text || [title, url].filter(Boolean).join(" - ");
  openWhatsApp({ message: fullText });
}
