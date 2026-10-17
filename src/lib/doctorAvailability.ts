import { Doctor } from "@/services/db";

export type DoctorAvailabilityStatus = "available_today" | "closed_today" | "on_leave";

export type DoctorAvailabilityReason = "on_leave" | "marked_unavailable" | "scheduled_off" | "available";

export interface DoctorAvailabilityInfo {
  status: DoctorAvailabilityStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  formattedLeaveDate?: string;
  reason: DoctorAvailabilityReason;
  dayNameBn?: string;
}

export interface DayDefinition {
  index: number;
  names: string[];
  nameBn: string;
  shortBn: string;
}

export const BENGALI_DAYS: DayDefinition[] = [
  { index: 0, names: ["রবিবার", "রবি", "sunday", "sun"], nameBn: "রবিবার", shortBn: "রবি" },
  { index: 1, names: ["সোমবার", "সোম", "monday", "mon"], nameBn: "সোমবার", shortBn: "সোম" },
  { index: 2, names: ["মঙ্গলবার", "মঙ্গল", "tuesday", "tue"], nameBn: "মঙ্গলবার", shortBn: "মঙ্গল" },
  { index: 3, names: ["বুধবার", "বুধ", "wednesday", "wed"], nameBn: "বুধবার", shortBn: "বুধ" },
  { index: 4, names: ["বৃহস্পতিবার", "বৃহস্পতি", "thursday", "thu"], nameBn: "বৃহস্পতিবার", shortBn: "বৃহস্পতি" },
  { index: 5, names: ["শুক্রবার", "শুক্র", "friday", "fri"], nameBn: "শুক্রবার", shortBn: "শুক্র" },
  { index: 6, names: ["শনিবার", "শনি", "saturday", "sat"], nameBn: "শনিবার", shortBn: "শনি" },
];

/**
 * Returns Date mapped to Bangladesh Standard Time (Asia/Dhaka, UTC+6)
 */
export function getBangladeshDate(baseDate: Date = new Date()): Date {
  try {
    const dhakaStr = baseDate.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    return new Date(dhakaStr);
  } catch {
    return baseDate;
  }
}

/**
 * Get current Bangladesh day metadata (name in Bengali, index 0-6)
 */
export function getBangladeshDayInfo(targetDate?: Date): DayDefinition {
  const bdDate = targetDate ? getBangladeshDate(targetDate) : getBangladeshDate();
  const dayIndex = bdDate.getDay();
  return BENGALI_DAYS[dayIndex] || BENGALI_DAYS[0];
}

/**
 * Formats ISO date string to Bengali date format for leave notices
 */
export function formatLeaveDate(dateStr: string): string {
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("bn-BD", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Determines whether a doctor's visitingDays schedule matches a specific day-of-week index (0 = Sun, 6 = Sat).
 */
export function isAvailableOnDay(visitingDays?: string | null, targetDayIndex?: number): boolean {
  if (!visitingDays || !visitingDays.trim()) return true;

  const text = visitingDays.toLowerCase().trim();
  const dayIdx = targetDayIndex !== undefined ? targetDayIndex : getBangladeshDayInfo().index;
  const todayDef = BENGALI_DAYS[dayIdx];
  if (!todayDef) return true;

  // 1. Explicit exception / closed day check (e.g. "শুক্রবার ব্যতীত", "শুক্রবার ছাড়া", "শুক্রবার বন্ধ")
  for (const name of todayDef.names) {
    const offPattern = new RegExp(`${name}[\\s]*(ব্যতীত|ছাড়া|বাদে|বন্ধ)`, "i");
    const reverseOffPattern = new RegExp(`(ব্যতীত|ছাড়া|বাদে|বন্ধ)[\\s]*${name}`, "i");
    if (offPattern.test(text) || reverseOffPattern.test(text)) {
      return false;
    }
  }

  // 2. Everyday check (প্রতিদিন / দৈনিক / daily / everyday)
  const isEveryday =
    text.includes("প্রতিদিন") ||
    text.includes("সব দিন") ||
    text.includes("দৈনিক") ||
    text.includes("daily") ||
    text.includes("everyday");

  if (isEveryday) {
    return true;
  }

  // 3. Day range check (e.g. "শনিবার থেকে বৃহস্পতিবার", "শনি - বৃহস্পতি", "রবিবার থেকে বৃহস্পতিবার")
  // Bangladesh weekly calendar sequence: Saturday(6) -> Sunday(0) -> Monday(1) -> Tuesday(2) -> Wednesday(3) -> Thursday(4) -> Friday(5)
  const bdWeekOrder = [6, 0, 1, 2, 3, 4, 5];
  const rangePattern =
    /(শনিবার|রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার|শুক্রবার|শনি|রবি|সোম|মঙ্গল|বুধ|বৃহস্পতি|শুক্র)\s*(?:থেকে|হইতে|হতে|-|to)\s*(শনিবার|রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার|শুক্রবার|শনি|রবি|সোম|মঙ্গল|বুধ|বৃহস্পতি|শুক্র)/i;
  const rangeMatch = text.match(rangePattern);

  if (rangeMatch) {
    const startName = rangeMatch[1];
    const endName = rangeMatch[2];
    const startIdx = BENGALI_DAYS.find((d) => d.names.includes(startName))?.index;
    const endIdx = BENGALI_DAYS.find((d) => d.names.includes(endName))?.index;

    if (startIdx !== undefined && endIdx !== undefined) {
      const startPos = bdWeekOrder.indexOf(startIdx);
      const endPos = bdWeekOrder.indexOf(endIdx);
      const targetPos = bdWeekOrder.indexOf(dayIdx);

      if (startPos !== -1 && endPos !== -1 && targetPos !== -1) {
        if (startPos <= endPos) {
          if (targetPos >= startPos && targetPos <= endPos) return true;
        } else {
          // Wrapped around week boundary
          if (targetPos >= startPos || targetPos <= endPos) return true;
        }
      }
    }
  }

  // 4. If ANY specific day of the week is explicitly named in the schedule text:
  const anyDayMentioned = BENGALI_DAYS.some((d) =>
    d.names.some((name) => text.includes(name))
  );

  if (!anyDayMentioned) {
    // Generic schedule (e.g., "যোগাযোগ সাপেক্ষে / প্রতি সপ্তাহে নির্ধারিত দিনে"), on-call availability
    return true;
  }

  // 5. Explicitly specified days: check if today's day is listed
  return todayDef.names.some((name) => text.includes(name));
}

/**
 * Checks whether doctor is available today taking into account onLeaveUntil, availableToday, and day schedule.
 */
export function isDoctorAvailableToday(
  doctor: Pick<Doctor, "availableToday" | "onLeaveUntil"> & { visitingDays?: string | null },
  targetDate?: Date
): boolean {
  const bdDate = targetDate ? getBangladeshDate(targetDate) : getBangladeshDate();
  const todayStr = `${bdDate.getFullYear()}-${String(bdDate.getMonth() + 1).padStart(2, "0")}-${String(bdDate.getDate()).padStart(2, "0")}`;

  // 1. Check if doctor is on leave
  if (doctor.onLeaveUntil) {
    const rawDate = typeof doctor.onLeaveUntil === "string" ? doctor.onLeaveUntil.slice(0, 10) : "";
    if (rawDate && rawDate >= todayStr) {
      return false;
    }
  }

  // 2. Check if admin or partner explicitly marked doctor as unavailable today
  if (doctor.availableToday === false) {
    return false;
  }

  // 3. Check day-of-week schedule
  return isAvailableOnDay(doctor.visitingDays, bdDate.getDay());
}

/**
 * Resolves complete doctor availability status, badges, styling, and labels.
 */
export function getDoctorAvailabilityInfo(
  doctor: Pick<Doctor, "availableToday" | "onLeaveUntil"> & { visitingDays?: string | null },
  targetDate?: Date
): DoctorAvailabilityInfo {
  const bdDate = targetDate ? getBangladeshDate(targetDate) : getBangladeshDate();
  const todayStr = `${bdDate.getFullYear()}-${String(bdDate.getMonth() + 1).padStart(2, "0")}-${String(bdDate.getDate()).padStart(2, "0")}`;
  const dayInfo = getBangladeshDayInfo(bdDate);

  if (doctor.onLeaveUntil) {
    const rawDate = typeof doctor.onLeaveUntil === "string" ? doctor.onLeaveUntil.slice(0, 10) : "";
    if (rawDate && rawDate >= todayStr) {
      const formattedDate = formatLeaveDate(doctor.onLeaveUntil);
      return {
        status: "on_leave",
        label: `ছুটিতে আছেন (${formattedDate} পর্যন্ত)`,
        badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
        dotClass: "bg-amber-500",
        formattedLeaveDate: formattedDate,
        reason: "on_leave",
        dayNameBn: dayInfo.nameBn,
      };
    }
  }

  if (doctor.availableToday === false) {
    return {
      status: "closed_today",
      label: "আজ চেম্বার বন্ধ",
      badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
      dotClass: "bg-rose-500",
      reason: "marked_unavailable",
      dayNameBn: dayInfo.nameBn,
    };
  }

  const isScheduledToday = isAvailableOnDay(doctor.visitingDays, bdDate.getDay());
  if (!isScheduledToday) {
    return {
      status: "closed_today",
      label: "আজ চেম্বার বন্ধ",
      badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
      dotClass: "bg-rose-500",
      reason: "scheduled_off",
      dayNameBn: dayInfo.nameBn,
    };
  }

  return {
    status: "available_today",
    label: "আজ চেম্বার খোলা",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dotClass: "bg-emerald-500",
    reason: "available",
    dayNameBn: dayInfo.nameBn,
  };
}

/**
 * Detects if the user query contains today-related intent (e.g. "আজকের ডাক্তার", "আজ শিশু ডাক্তার", "today")
 * and extracts the cleaned query without the "today" keyword.
 */
export function extractTodayIntent(query: string): { hasTodayIntent: boolean; cleanedQuery: string } {
  const trimmed = query.trim();
  if (!trimmed) {
    return { hasTodayIntent: false, cleanedQuery: "" };
  }

  const todayRegex = /(?:^|\s)(আজকের|আজকে|আজ|today)(?:\s|$)/gi;
  const hasTodayIntent = todayRegex.test(trimmed);

  if (!hasTodayIntent) {
    return { hasTodayIntent: false, cleanedQuery: trimmed };
  }

  const cleaned = trimmed.replace(todayRegex, " ").replace(/\s+/g, " ").trim();
  return { hasTodayIntent: true, cleanedQuery: cleaned };
}
