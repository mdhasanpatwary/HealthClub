"use server";

import { prisma } from "@/lib/prisma";
import { Partner, Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { unstable_cache, updateTag } from "next/cache";
import { parseDiscountPercentage } from "@/lib/utils";
import {
  addPartnerRequestAction as _addPartnerRequestAction,
  getPartnerRequestsAction as _getPartnerRequestsAction,
  updatePartnerRequestStatusAction as _updatePartnerRequestStatusAction,
  loginPartnerAction as _loginPartnerAction,
  changePartnerPasswordAction as _changePartnerPasswordAction,
  requestPartnerPasswordResetAction as _requestPartnerPasswordResetAction,
  resetPartnerPasswordAction as _resetPartnerPasswordAction,
} from "./partnerRequestActions";

export async function addPartnerRequestAction(...args: Parameters<typeof _addPartnerRequestAction>) {
  return _addPartnerRequestAction(...args);
}

export async function getPartnerRequestsAction() {
  return _getPartnerRequestsAction();
}

export async function updatePartnerRequestStatusAction(id: string, status: "approved" | "rejected") {
  return _updatePartnerRequestStatusAction(id, status);
}

export async function loginPartnerAction(identifier: string, password: string) {
  return _loginPartnerAction(identifier, password);
}

export async function changePartnerPasswordAction(currentPassword: string, newPassword: string) {
  return _changePartnerPasswordAction(currentPassword, newPassword);
}

export async function requestPartnerPasswordResetAction(email: string) {
  return _requestPartnerPasswordResetAction(email);
}

export async function resetPartnerPasswordAction(email: string, code: string, rawNewPassword: string) {
  return _resetPartnerPasswordAction(email, code, rawNewPassword);
}

const PARTNERS_TAG = "partners";

// --- PARTNERS ACTIONS ---

/**
 * Cached partner list — avoids hitting the DB on every page that shows partners.
 * Invalidated via "partners" tag on add/update/delete mutations.
 */
export const getPartnersAction = unstable_cache(
  async (): Promise<Partner[]> => {
    try {
      const data = await prisma.partner.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          category: true,
          address: true,
          discount: true,
          phone: true,
          logoText: true,
          mapLink: true,
          imageUrl: true,
        },
      });

      return data.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category as Partner["category"],
        address: p.address,
        discount: p.discount,
        phone: p.phone,
        logoText: p.logoText,
        mapLink: p.mapLink || undefined,
        imageUrl: p.imageUrl || undefined,
      }));
    } catch (error) {
      console.error("Error in getPartnersAction:", error);
      return [];
    }
  },
  ["partners-list"],
  { revalidate: 60, tags: [PARTNERS_TAG] }
);

export async function addPartnerAction(partner: Omit<Partner, "id">): Promise<Partner | { error: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return { error: "অননুমোদিত অ্যাক্সেস।" };

  const newPartnerId = `p_${crypto.randomUUID()}`;
  try {
    const p = await prisma.partner.create({
      data: {
        id: newPartnerId,
        name: partner.name,
        category: partner.category,
        address: partner.address,
        discount: partner.discount,
        phone: partner.phone,
        logoText: partner.logoText,
        mapLink: partner.mapLink || null,
        imageUrl: partner.imageUrl || null,
      },
    });

    return {
      id: p.id,
      name: p.name,
      category: p.category as Partner["category"],
      address: p.address,
      discount: p.discount,
      phone: p.phone,
      logoText: p.logoText,
      mapLink: p.mapLink || undefined,
      imageUrl: p.imageUrl || undefined,
    };
  } catch (error) {
    console.error("Error in addPartnerAction:", error);
    return { error: "পার্টনার যোগ করতে সমস্যা হয়েছে।" };
  } finally {
    updateTag(PARTNERS_TAG);
  }
}

export async function updatePartnerAction(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;

  try {
    await prisma.partner.update({
      where: { id },
      data: {
        name: partner.name,
        category: partner.category,
        address: partner.address,
        discount: partner.discount,
        phone: partner.phone,
        logoText: partner.logoText,
        mapLink: partner.mapLink || null,
        imageUrl: partner.imageUrl || null,
      },
    });
    return true;
  } catch (error) {
    console.error("Error in updatePartnerAction:", error);
    return false;
  } finally {
    updateTag(PARTNERS_TAG);
  }
}

export async function deletePartnerAction(id: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;

  try {
    await prisma.partner.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error in deletePartnerAction:", error);
    return false;
  } finally {
    updateTag(PARTNERS_TAG);
  }
}

// --- PARTNER TRANSACTIONS ---

export async function getPartnerTransactionsAction(): Promise<Transaction[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") return [];
  try {
    const data = await prisma.transaction.findMany({
      where: { partnerId: session.userId },
      orderBy: { date: "desc" },
    });
    return data.map((t) => ({
      id: t.id,
      memberId: t.memberId,
      memberName: t.memberName,
      partnerId: t.partnerId,
      partnerName: t.partnerName,
      amount: t.amount,
      saved: t.saved,
      date: t.date.toISOString(),
    }));
  } catch (error) {
    console.error("Error in getPartnerTransactionsAction:", error);
    return [];
  }
}

export async function addPartnerTransactionAction(tx: {
  memberId: string;
  amount: number;
}): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  if (isNaN(tx.amount) || tx.amount <= 0) {
    return { success: false, message: "সঠিক বিলের পরিমাণ ইনপুট দিন।" };
  }

  try {
    const [member, partner] = await Promise.all([
      prisma.member.findUnique({
        where: { id: tx.memberId },
        select: { id: true, name: true, status: true, expiryDate: true },
      }),
      prisma.partner.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, discount: true },
      }),
    ]);

    if (!member) {
      return { success: false, message: "মেম্বার আইডিটি খুঁজে পাওয়া যায়নি।" };
    }

    if (member.status !== "active") {
      return { success: false, message: "এই মেম্বারশিপটি সক্রিয় নয়।" };
    }

    const currentDate = new Date();
    const expiryDate = new Date(member.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    if (expiryDate < currentDate) {
      return { success: false, message: "এই মেম্বারশিপ কার্ডটির মেয়াদ শেষ হয়ে গেছে।" };
    }

    if (!partner) {
      return { success: false, message: "পার্টনার ডেটা খুঁজে পাওয়া যায়নি।" };
    }

    const discountRate = parseDiscountPercentage(partner.discount);
    const safeRate = Math.min(discountRate, 0.70);
    const saved = Math.round(tx.amount * safeRate);
    const txId = `tx_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: txId,
          memberId: member.id,
          memberName: member.name,
          partnerId: partner.id,
          partnerName: partner.name,
          amount: tx.amount,
          saved: saved,
        },
      }),
      prisma.member.update({
        where: { id: member.id },
        data: {
          totalSaved: {
            increment: saved,
          },
        },
      }),
    ]);

    updateTag("admin-stats");

    return { success: true, message: `লেনদেন সফলভাবে সম্পন্ন হয়েছে! ছাড়ের পরিমাণ: ৳${saved}` };
  } catch (error) {
    console.error("Error in addPartnerTransactionAction:", error);
    return { success: false, message: "লেনদেনটি সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}
