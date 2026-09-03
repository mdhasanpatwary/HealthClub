"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AdminRole, AdminUser } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { hashPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

const createAdminUserSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।").max(100),
  email: z.string().trim().email("সঠিক ইমেইল অ্যাড্রেস লিখুন।").toLowerCase(),
  phone: z.string().trim().optional(),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"),
  role: z.enum(["super_admin", "content_moderator", "support_staff"]),
});

const updateAdminUserSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।").max(100),
  phone: z.string().trim().optional(),
  role: z.enum(["super_admin", "content_moderator", "support_staff"]),
  isActive: z.boolean().default(true),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;

/**
 * Ensures the authenticated user is an active super admin.
 */
async function verifySuperAdmin(): Promise<{ authorized: boolean; userId?: string; error?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { authorized: false, error: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে এডমিন হিসেবে লগইন করুন।" };
  }

  if (session.adminRole !== "super_admin") {
    return { authorized: false, error: "এই কাজটির জন্য শুধুমাত্র সুপার এডমিনের অনুমতি রয়েছে।" };
  }

  return { authorized: true, userId: session.userId };
}

/**
 * Get all database-backed admin staff accounts.
 */
export async function getAdminUsersListAction(): Promise<AdminUser[]> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return [];
  }

  try {
    const users = await prisma.adminUser.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || undefined,
      role: u.role as AdminRole,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : undefined,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt ? u.updatedAt.toISOString() : undefined,
    }));
  } catch (error) {
    logger.error("Error in getAdminUsersListAction:", error);
    return [];
  }
}

/**
 * Create a new admin or staff account with granular role.
 */
export async function createAdminUserAction(
  input: CreateAdminUserInput
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const parsed = createAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
  }

  const { name, email, phone, password, role } = parsed.data;

  try {
    // Check if email is already taken
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return { success: false, error: `"${email}" ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।` };
    }

    if (phone) {
      const existingPhone = await prisma.adminUser.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return { success: false, error: `"${phone}" মোবাইল নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে।` };
      }
    }

    const hashedPassword = hashPassword(password);
    const adminId = `admin_${crypto.randomUUID().slice(0, 10)}`;

    const newUser = await prisma.adminUser.create({
      data: {
        id: adminId,
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role,
        isActive: true,
      },
    });

    revalidatePath("/admin/staff");

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || undefined,
        role: newUser.role as AdminRole,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error("Error in createAdminUserAction:", error);
    return { success: false, error: "এডমিন অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Update staff details (Name, Phone, Role, Active Status).
 */
export async function updateAdminUserAction(
  id: string,
  input: UpdateAdminUserInput
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const parsed = updateAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
  }

  try {
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "এডমিন অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    if (auth.userId === id && !parsed.data.isActive) {
      return { success: false, error: "আপনি নিজের অ্যাকাউন্ট নিষ্ক্রিয় করতে পারবেন না।" };
    }

    // Safeguard: Check if demoting or deactivating the last active super_admin
    if (existing.role === "super_admin" && (parsed.data.role !== "super_admin" || !parsed.data.isActive)) {
      const superAdminCount = await prisma.adminUser.count({
        where: {
          role: "super_admin",
          isActive: true,
          id: { not: id },
        },
      });

      if (superAdminCount === 0) {
        return { success: false, error: "সিস্টেমে কমপক্ষে একজন সক্রিয় সুপার এডমিন থাকা আবশ্যক।" };
      }
    }

    if (parsed.data.phone) {
      const phoneConflict = await prisma.adminUser.findFirst({
        where: {
          phone: parsed.data.phone,
          id: { not: id },
        },
      });
      if (phoneConflict) {
        return { success: false, error: `"${parsed.data.phone}" মোবাইল নম্বরটি অন্য অ্যাকাউন্টে ব্যবহৃত হচ্ছে।` };
      }
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
        isActive: parsed.data.isActive,
      },
    });

    revalidatePath("/admin/staff");

    return {
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone || undefined,
        role: updated.role as AdminRole,
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error("Error in updateAdminUserAction:", error);
    return { success: false, error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Toggle admin user active/inactive status.
 */
export async function toggleAdminUserStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  if (auth.userId === id && !isActive) {
    return { success: false, message: "আপনি নিজের অ্যাকাউন্ট নিষ্ক্রিয় করতে পারবেন না।" };
  }

  try {
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: "এডমিন অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    if (existing.role === "super_admin" && !isActive) {
      const superAdminCount = await prisma.adminUser.count({
        where: {
          role: "super_admin",
          isActive: true,
          id: { not: id },
        },
      });

      if (superAdminCount === 0) {
        return { success: false, message: "সিস্টেমে কমপক্ষে একজন সক্রিয় সুপার এডমিন থাকা আবশ্যক।" };
      }
    }

    await prisma.adminUser.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/staff");

    const statusText = isActive ? "সক্রিয়" : "নিষ্ক্রিয়";
    return { success: true, message: `"${existing.name}" এর অ্যাকাউন্ট ${statusText} করা হয়েছে।` };
  } catch (error) {
    logger.error("Error in toggleAdminUserStatusAction:", error);
    return { success: false, message: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Reset admin user password.
 */
export async function resetAdminUserPasswordAction(
  id: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
  }

  try {
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: "এডমিন অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    const hashedPassword = hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { success: true, message: `"${existing.name}" এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।` };
  } catch (error) {
    logger.error("Error in resetAdminUserPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete an admin user account.
 */
export async function deleteAdminUserAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const auth = await verifySuperAdmin();
  if (!auth.authorized) {
    return { success: false, message: auth.error || "অননুমোদিত অ্যাক্সেস।" };
  }

  if (auth.userId === id) {
    return { success: false, message: "আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না।" };
  }

  try {
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: "এডমিন অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    if (existing.role === "super_admin") {
      const superAdminCount = await prisma.adminUser.count({
        where: {
          role: "super_admin",
          isActive: true,
          id: { not: id },
        },
      });

      if (superAdminCount === 0) {
        return { success: false, message: "সিস্টেমের একমাত্র সুপার এডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না।" };
      }
    }

    await prisma.adminUser.delete({
      where: { id },
    });

    revalidatePath("/admin/staff");

    return { success: true, message: "এডমিন অ্যাকাউন্টটি সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error) {
    logger.error("Error in deleteAdminUserAction:", error);
    return { success: false, message: "অ্যাকাউন্ট মুছতে সমস্যা হয়েছে।" };
  }
}

/**
 * Get the current active admin session details.
 */
export async function getCurrentAdminSessionAction(): Promise<{
  isAdmin: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
  };
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return { isAdmin: false };
  }

  return {
    isAdmin: true,
    user: {
      id: session.userId,
      name: session.adminName || "এডমিন",
      email: session.adminEmail || "",
      role: (session.adminRole || "super_admin") as AdminRole,
    },
  };
}
