export type PosterFormat = "a4" | "standee";
export type PosterTheme = "emerald" | "slate" | "crimson" | "monochrome";
export type PosterQrTarget = "registration" | "profile" | "dual";

export interface PosterCustomOptions {
  customNotice?: string;
  customDiscountBadge?: string;
  helpline?: string;
  website?: string;
  showAddress: boolean;
  showCategory: boolean;
  showEmergencyPhone: boolean;
  showCutMarks: boolean;
}

export interface PosterThemeConfig {
  id: PosterTheme;
  nameBn: string;
  nameEn: string;
  primary: string;
  primaryDark: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  cardBorder: string;
  qrFg: string;
  qrBg: string;
  headerBg: string;
}

export const POSTER_THEMES: Record<PosterTheme, PosterThemeConfig> = {
  emerald: {
    id: "emerald",
    nameBn: "এমেরাল্ড ট্রাস্ট (অফিসিয়াল)",
    nameEn: "Emerald Trust",
    primary: "#047857",
    primaryDark: "#065f46",
    accent: "#10b981",
    badgeBg: "#ecfdf5",
    badgeText: "#065f46",
    cardBorder: "#a7f3d0",
    qrFg: "#065f46",
    qrBg: "#ffffff",
    headerBg: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
  },
  slate: {
    id: "slate",
    nameBn: "রয়েল স্লেট ও সায়ান",
    nameEn: "Royal Slate",
    primary: "#0f172a",
    primaryDark: "#020617",
    accent: "#0ea5e9",
    badgeBg: "#f0f9ff",
    badgeText: "#0369a1",
    cardBorder: "#bae6fd",
    qrFg: "#0f172a",
    qrBg: "#ffffff",
    headerBg: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
  },
  crimson: {
    id: "crimson",
    nameBn: "রুবি পালস (জরুরি কেয়ার)",
    nameEn: "Ruby Pulse",
    primary: "#be123c",
    primaryDark: "#9f1239",
    accent: "#f43f5e",
    badgeBg: "#fff1f2",
    badgeText: "#9f1239",
    cardBorder: "#fecdd3",
    qrFg: "#881337",
    qrBg: "#ffffff",
    headerBg: "linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)",
  },
  monochrome: {
    id: "monochrome",
    nameBn: "ইকো মনোক্রোম (কালি সাশ্রয়ী)",
    nameEn: "Eco Monochrome",
    primary: "#18181b",
    primaryDark: "#09090b",
    accent: "#27272a",
    badgeBg: "#f4f4f5",
    badgeText: "#18181b",
    cardBorder: "#d4d4d8",
    qrFg: "#09090b",
    qrBg: "#ffffff",
    headerBg: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)",
  },
};
