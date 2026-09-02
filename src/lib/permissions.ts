import { AdminRole } from "@/services/db";

export type AdminPermissionKey =
  | "manage_staff"
  | "manage_settings"
  | "view_analytics"
  | "bulk_import"
  | "manage_members"
  | "approve_renewals"
  | "view_transactions"
  | "manage_transactions"
  | "manage_partners"
  | "manage_partner_requests"
  | "manage_doctors"
  | "manage_health_tips"
  | "manage_emergency"
  | "send_broadcast"
  | "manage_notifications"
  | "manage_messages"
  | "view_pwa";

export interface RoleConfig {
  role: AdminRole;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  badgeClass: string;
  allowedRoutes: string[];
  permissions: AdminPermissionKey[];
}

export const ROLE_CONFIGS: Record<AdminRole, RoleConfig> = {
  super_admin: {
    role: "super_admin",
    titleBn: "সুপার এডমিন",
    titleEn: "Super Admin",
    descriptionBn: "সম্পূর্ণ সিস্টেম অ্যাক্সেস, স্টাফ ম্যানেজমেন্ট, সেটিংস ও আর্থিক অ্যানালিটিক্স",
    descriptionEn: "Full system control, staff management, system settings & financial reports",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    allowedRoutes: [
      "/admin",
      "/admin/members",
      "/admin/renewals",
      "/admin/transactions",
      "/admin/analytics",
      "/admin/doctors",
      "/admin/partners",
      "/admin/partner-requests",
      "/admin/emergency",
      "/admin/health-tips",
      "/admin/broadcast",
      "/admin/notifications",
      "/admin/messages",
      "/admin/pwa",
      "/admin/import",
      "/admin/settings",
      "/admin/settings/backup",
      "/admin/staff",
    ],
    permissions: [
      "manage_staff",
      "manage_settings",
      "view_analytics",
      "bulk_import",
      "manage_members",
      "approve_renewals",
      "view_transactions",
      "manage_transactions",
      "manage_partners",
      "manage_partner_requests",
      "manage_doctors",
      "manage_health_tips",
      "manage_emergency",
      "send_broadcast",
      "manage_notifications",
      "manage_messages",
      "view_pwa",
    ],
  },
  content_moderator: {
    role: "content_moderator",
    titleBn: "কন্টেন্ট মডারেটর",
    titleEn: "Content Moderator",
    descriptionBn: "ডাক্তার, স্বাস্থ্য টিপস, জরুরি সেবা ও ব্রডকাস্ট ক্যাম্পেইন পরিচালনা",
    descriptionEn: "Manage doctors, health tips, emergency services & broadcast campaigns",
    badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    allowedRoutes: [
      "/admin",
      "/admin/doctors",
      "/admin/health-tips",
      "/admin/emergency",
      "/admin/broadcast",
      "/admin/notifications",
      "/admin/messages",
    ],
    permissions: [
      "manage_doctors",
      "manage_health_tips",
      "manage_emergency",
      "send_broadcast",
      "manage_notifications",
      "manage_messages",
    ],
  },
  support_staff: {
    role: "support_staff",
    titleBn: "সাপোর্ট স্টাফ",
    titleEn: "Support Staff",
    descriptionBn: "মেম্বার তালিকা, নবায়ন অনুমোদন, লেনদেন লগ ও গ্রাহক বার্তা পরিচালনা",
    descriptionEn: "Handle members, renewals, discount logs, partner requests & messages",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    allowedRoutes: [
      "/admin",
      "/admin/members",
      "/admin/renewals",
      "/admin/transactions",
      "/admin/partners",
      "/admin/partner-requests",
      "/admin/notifications",
      "/admin/messages",
    ],
    permissions: [
      "manage_members",
      "approve_renewals",
      "view_transactions",
      "manage_partners",
      "manage_partner_requests",
      "manage_notifications",
      "manage_messages",
    ],
  },
};

/**
 * Checks if a given role is allowed to access an admin route path.
 */
export function canAccessAdminRoute(role: AdminRole | undefined, pathname: string): boolean {
  if (!role) return false;
  const config = ROLE_CONFIGS[role];
  if (!config) return false;

  // Super admin can access everything
  if (role === "super_admin") return true;

  // Clean pathname query strings or trailing slashes
  const cleanPath = pathname.split("?")[0].replace(/\/$/, "");

  // /admin is always accessible
  if (cleanPath === "/admin" || cleanPath === "") return true;

  return config.allowedRoutes.some((route) => {
    return cleanPath === route || cleanPath.startsWith(route + "/");
  });
}

/**
 * Checks if a given role has a specific capability permission.
 */
export function hasAdminPermission(
  role: AdminRole | undefined,
  permission: AdminPermissionKey
): boolean {
  if (!role) return false;
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.permissions.includes(permission);
}

/**
 * Returns the localized label for a role.
 */
export function getRoleLabel(role: AdminRole, locale: "bn" | "en" = "bn"): string {
  const config = ROLE_CONFIGS[role];
  if (!config) return role;
  return locale === "bn" ? config.titleBn : config.titleEn;
}

/**
 * Checks if a user object represents an administrator.
 * Validates against:
 * 1. Admin ID prefix (`admin_...`)
 * 2. Dedicated admin session role (`role === 'admin'`)
 * 3. Configured root admin email
 */
export function isAdminUser(
  user: { id?: string; email?: string; role?: string; adminRole?: AdminRole } | null | undefined
): boolean {
  if (!user) return false;
  if (user.id && user.id.startsWith("admin_")) return true;
  if (user.role === "admin" || Boolean(user.adminRole)) return true;
  const rootAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "healthclubfeni@gmail.com").toLowerCase();
  if (user.email && user.email.toLowerCase() === rootAdminEmail) return true;
  return false;
}
