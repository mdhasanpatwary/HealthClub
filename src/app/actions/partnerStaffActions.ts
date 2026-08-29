"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PartnerStaff, Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { logger } from "@/lib/logger";

const createStaffSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।").max(100),
  username: z
    .string()
    .trim()
    .min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।")
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "ইউজারনেমে শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা, _ এবং - ব্যবহার করা যাবে।"),
  phone: z.string().trim().optional(),
  deskName: z.string().trim().min(2, "ডেস্ক/কাউন্টারের নাম লিখুন।").max(100),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"),
  role: z.enum(["cashier", "manager"]).default("cashier"),
});

const updateStaffSchema = z.object({
  name: z.string().trim().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে।").max(100),
  phone: z.string().trim().optional(),
  deskName: z.string().trim().min(2, "ডেস্ক/কাউন্টারের নাম লিখুন।").max(100),
  role: z.enum(["cashier", "manager"]).default("cashier"),
  isActive: z.boolean().default(true),
});

export type CreatePartnerStaffInput = z.infer<typeof createStaffSchema>;
export type UpdatePartnerStaffInput = z.infer<typeof updateStaffSchema>;

/**
 * Get all staff / cashier accounts for the authenticated partner organization.
 */
export async function getPartnerStaffListAction(): Promise<PartnerStaff[]> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) return [];
  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const staffMembers = await prisma.partnerStaff.findMany({
      where: { partnerId },
      include: {
        _count: { select: { transactions: true } },
        transactions: { select: { amount: true, saved: true } },
      },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return staffMembers.map((staff) => {
      const totalBill = staff.transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalSaved = staff.transactions.reduce((sum, tx) => sum + tx.saved, 0);
      const plainPassword = staff.password.startsWith("enc:")
        ? decryptSecret(staff.password) || undefined
        : undefined;

      return {
        id: staff.id,
        partnerId: staff.partnerId,
        name: staff.name,
        username: staff.username,
        phone: staff.phone || undefined,
        deskName: staff.deskName,
        role: staff.role as "cashier" | "manager",
        plainPassword,
        isActive: staff.isActive,
        createdAt: staff.createdAt.toISOString(),
        updatedAt: staff.updatedAt.toISOString(),
        transactionCount: staff._count.transactions,
        totalBillAmount: totalBill,
        totalSavedAmount: totalSaved,
      };
    });
  } catch (error) {
    logger.error("Error in getPartnerStaffListAction:", error);
    return [];
  }
}

/**
 * Create a new cashier / counter sub-account.
 */
export async function createPartnerStaffAction(
  input: CreatePartnerStaffInput
): Promise<{ success: boolean; staff?: PartnerStaff; error?: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;
  const parsed = createStaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
  }

  const { name, username, phone, deskName, password, role } = parsed.data;
  const normalizedUsername = username.toLowerCase().trim();

  try {
    const existing = await prisma.partnerStaff.findUnique({
      where: { username: normalizedUsername },
    });
    if (existing) {
      return { success: false, error: `"${normalizedUsername}" ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য ইউজারনেম দিন।` };
    }

    const encryptedPassword = encryptSecret(password);
    const staffId = `staff_${crypto.randomUUID().slice(0, 10)}`;

    const newStaff = await prisma.partnerStaff.create({
      data: {
        id: staffId,
        partnerId,
        name,
        username: normalizedUsername,
        phone: phone || null,
        deskName,
        password: encryptedPassword,
        role,
        isActive: true,
      },
    });

    return {
      success: true,
      staff: {
        id: newStaff.id,
        partnerId: newStaff.partnerId,
        name: newStaff.name,
        username: newStaff.username,
        phone: newStaff.phone || undefined,
        deskName: newStaff.deskName,
        role: newStaff.role as "cashier" | "manager",
        plainPassword: password,
        isActive: newStaff.isActive,
        createdAt: newStaff.createdAt.toISOString(),
        updatedAt: newStaff.updatedAt.toISOString(),
        transactionCount: 0,
        totalBillAmount: 0,
        totalSavedAmount: 0,
      },
    };
  } catch (error) {
    logger.error("Error in createPartnerStaffAction:", error);
    return { success: false, error: "স্টাফ অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Update staff details (Name, Phone, Desk, Role, Active Status).
 */
export async function updatePartnerStaffAction(
  id: string,
  input: UpdatePartnerStaffInput
): Promise<{ success: boolean; staff?: PartnerStaff; error?: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  const parsed = updateStaffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "সঠিক তথ্য দিন।" };
  }

  try {
    const existing = await prisma.partnerStaff.findUnique({
      where: { id },
    });

    if (!existing || existing.partnerId !== partnerId) {
      return { success: false, error: "স্টাফ অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    const updated = await prisma.partnerStaff.update({
      where: { id },
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
        deskName: parsed.data.deskName,
        role: parsed.data.role,
        isActive: parsed.data.isActive,
      },
    });

    return {
      success: true,
      staff: {
        id: updated.id,
        partnerId: updated.partnerId,
        name: updated.name,
        username: updated.username,
        phone: updated.phone || undefined,
        deskName: updated.deskName,
        role: updated.role as "cashier" | "manager",
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    logger.error("Error in updatePartnerStaffAction:", error);
    return { success: false, error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Reset staff password by partner admin.
 */
export async function resetPartnerStaffPasswordAction(
  id: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" };
  }

  try {
    const existing = await prisma.partnerStaff.findUnique({
      where: { id },
    });

    if (!existing || existing.partnerId !== partnerId) {
      return { success: false, message: "স্টাফ অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    const encryptedPassword = encryptSecret(newPassword);

    await prisma.partnerStaff.update({
      where: { id },
      data: { password: encryptedPassword },
    });

    return { success: true, message: `"${existing.name}" এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।` };
  } catch (error) {
    logger.error("Error in resetPartnerStaffPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Toggle staff active/inactive status.
 */
export async function togglePartnerStaffStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const existing = await prisma.partnerStaff.findUnique({
      where: { id },
    });

    if (!existing || existing.partnerId !== partnerId) {
      return { success: false, message: "স্টাফ অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    await prisma.partnerStaff.update({
      where: { id },
      data: { isActive },
    });

    const statusText = isActive ? "সক্রিয়" : "নিষ্ক্রিয়";
    return { success: true, message: `স্টাফ অ্যাকাউন্টটি ${statusText} করা হয়েছে।` };
  } catch (error) {
    logger.error("Error in togglePartnerStaffStatusAction:", error);
    return { success: false, message: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

/**
 * Delete a staff account.
 */
export async function deletePartnerStaffAction(
  id: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const existing = await prisma.partnerStaff.findUnique({
      where: { id },
    });

    if (!existing || existing.partnerId !== partnerId) {
      return { success: false, message: "স্টাফ অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    await prisma.partnerStaff.delete({
      where: { id },
    });

    return { success: true, message: "স্টাফ অ্যাকাউন্টটি সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error) {
    logger.error("Error in deletePartnerStaffAction:", error);
    return { success: false, message: "স্টাফ অ্যাকাউন্টটি মুছতে সমস্যা হয়েছে।" };
  }
}

/**
 * Get active partner staff session details (if current user logged in as staff).
 */
export async function getCurrentPartnerStaffSessionAction(): Promise<{
  isStaff: boolean;
  staff?: {
    id: string;
    name: string;
    deskName: string;
    username?: string;
  };
}> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner_staff" || !session.staffId) {
    return { isStaff: false };
  }

  return {
    isStaff: true,
    staff: {
      id: session.staffId,
      name: session.staffName || "ক্যাশিয়ার",
      deskName: session.deskName || "কাউন্টার ডেস্ক",
    },
  };
}

export interface PartnerStaffStats {
  totalCount: number;
  totalBill: number;
  totalSaved: number;
  todayCount: number;
  todaySaved: number;
  monthCount: number;
  monthSaved: number;
  avgBill: number;
  avgSaved: number;
}

export interface PartnerStaffDetailsResult {
  success: boolean;
  staff?: PartnerStaff;
  transactions?: Transaction[];
  stats?: PartnerStaffStats;
  error?: string;
}

/**
 * Get detailed profile, calculated KPI stats, and full transaction history for a specific staff member.
 */
export async function getPartnerStaffDetailsAction(
  staffId: string
): Promise<PartnerStaffDetailsResult> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
  }

  const partnerId =
    session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const staff = await prisma.partnerStaff.findUnique({
      where: { id: staffId },
    });

    if (!staff || staff.partnerId !== partnerId) {
      return { success: false, error: "স্টাফ অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি।" };
    }

    // Fetch all transactions processed by this staff member
    const txRecords = await prisma.transaction.findMany({
      where: {
        partnerId,
        staffId: staff.id,
      },
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    let totalBill = 0;
    let totalSaved = 0;
    let todayCount = 0;
    let todaySaved = 0;
    let monthCount = 0;
    let monthSaved = 0;

    const transactions: Transaction[] = txRecords.map((t) => {
      totalBill += t.amount;
      totalSaved += t.saved;

      const txDate = new Date(t.date);
      if (txDate >= todayStart) {
        todayCount++;
        todaySaved += t.saved;
      }
      if (txDate >= monthStart) {
        monthCount++;
        monthSaved += t.saved;
      }

      return {
        id: t.id,
        memberId: t.memberId,
        memberName: t.memberName,
        partnerId: t.partnerId,
        partnerName: t.partnerName,
        staffId: t.staffId || undefined,
        staffName: t.staffName || undefined,
        deskName: t.deskName || undefined,
        amount: t.amount,
        saved: t.saved,
        date: t.date.toISOString(),
      };
    });

    const totalCount = transactions.length;
    const avgBill = totalCount > 0 ? Math.round(totalBill / totalCount) : 0;
    const avgSaved = totalCount > 0 ? Math.round(totalSaved / totalCount) : 0;

    const plainPassword = staff.password.startsWith("enc:")
      ? decryptSecret(staff.password) || undefined
      : undefined;

    const partnerStaff: PartnerStaff = {
      id: staff.id,
      partnerId: staff.partnerId,
      name: staff.name,
      username: staff.username,
      phone: staff.phone || undefined,
      deskName: staff.deskName,
      role: staff.role as "cashier" | "manager",
      plainPassword,
      isActive: staff.isActive,
      createdAt: staff.createdAt.toISOString(),
      updatedAt: staff.updatedAt.toISOString(),
      transactionCount: totalCount,
      totalBillAmount: totalBill,
      totalSavedAmount: totalSaved,
    };

    return {
      success: true,
      staff: partnerStaff,
      transactions,
      stats: {
        totalCount,
        totalBill,
        totalSaved,
        todayCount,
        todaySaved,
        monthCount,
        monthSaved,
        avgBill,
        avgSaved,
      },
    };
  } catch (error) {
    logger.error("Error in getPartnerStaffDetailsAction:", error);
    return { success: false, error: "স্টাফের বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে।" };
  }
}
