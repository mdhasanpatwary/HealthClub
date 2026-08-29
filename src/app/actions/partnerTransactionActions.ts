"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/services/db";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { updateTag } from "next/cache";
import { parseDiscountPercentage } from "@/lib/utils";
import { createMemberNotification } from "./memberNotificationActions";

export async function getPartnerTransactionsAction(): Promise<Transaction[]> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) return [];

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;

  try {
    const data = await prisma.transaction.findMany({
      where: { partnerId },
      orderBy: { date: "desc" },
    });
    return data.map((t) => ({
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
    }));
  } catch (error) {
    logger.error("Error in getPartnerTransactionsAction:", error);
    return [];
  }
}

export async function addPartnerTransactionAction(tx: {
  memberId: string;
  amount: number;
  discountAmount?: number;
}): Promise<{ success: boolean; message: string; messageKey?: string; errorKey?: string }> {
  const session = await getSessionUser();
  if (!session || (session.role !== "partner" && session.role !== "partner_staff")) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।", errorKey: "partner.errors.unauthorized" };
  }

  if (isNaN(tx.amount) || tx.amount <= 0) {
    return { success: false, message: "সঠিক বিলের পরিমাণ ইনপুট দিন।", errorKey: "partner.errors.invalidAmount" };
  }

  const partnerId = session.role === "partner_staff" ? session.partnerId || session.userId : session.userId;
  const isStaff = session.role === "partner_staff";
  const staffId = isStaff ? session.staffId || null : null;
  const staffName = isStaff ? session.staffName || "ক্যাশিয়ার" : "হাসপাতাল অ্যাডমিন";
  const deskName = isStaff ? session.deskName || "কাউন্টার ডেস্ক" : "মূল কাউন্টার / অ্যাডমিন";

  try {
    const [member, partner] = await Promise.all([
      prisma.member.findUnique({
        where: { id: tx.memberId },
        select: { id: true, name: true, status: true, expiryDate: true },
      }),
      prisma.partner.findUnique({
        where: { id: partnerId },
        select: { id: true, name: true, discount: true },
      }),
    ]);

    if (!member) {
      return { success: false, message: "মেম্বার আইডিটি খুঁজে পাওয়া যায়নি।", errorKey: "partner.errors.memberNotFound" };
    }

    if (member.status !== "active") {
      return { success: false, message: "এই মেম্বারশিপটি সক্রিয় নয়।", errorKey: "partner.errors.memberInactive" };
    }

    const currentDate = new Date();
    const expiryDate = new Date(member.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    if (expiryDate < currentDate) {
      return { success: false, message: "এই মেম্বারশিপ কার্ডটির মেয়াদ শেষ হয়ে গেছে।", errorKey: "partner.errors.memberExpired" };
    }

    if (!partner) {
      return { success: false, message: "পার্টনার ডেটা খুঁজে পাওয়া যায়নি।", errorKey: "partner.errors.partnerNotFound" };
    }

    let saved: number;
    if (tx.discountAmount !== undefined && !isNaN(Number(tx.discountAmount))) {
      const customDiscount = Number(tx.discountAmount);
      if (customDiscount < 0) {
        return { success: false, message: "ছাড়ের পরিমাণ ঋণাত্মক হতে পারে না।", errorKey: "partner.errors.negativeDiscount" };
      }
      if (customDiscount > tx.amount) {
        return { success: false, message: "ছাড়ের পরিমাণ মোট বিলের চেয়ে বেশি হতে পারে না।", errorKey: "partner.errors.discountExceedsBill" };
      }
      saved = Math.round(customDiscount);
    } else {
      const discountRate = parseDiscountPercentage(partner.discount);
      const safeRate = Math.min(discountRate, 0.70);
      saved = Math.round(tx.amount * safeRate);
    }

    const txId = `tx_${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          id: txId,
          memberId: member.id,
          memberName: member.name,
          partnerId: partner.id,
          partnerName: partner.name,
          staffId,
          staffName,
          deskName,
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

    // Send in-app notification to the member
    await createMemberNotification({
      memberId: member.id,
      type: "transaction_recorded",
      titleBn: "নতুন ডিসকাউন্ট ট্রানজেকশন যুক্ত হয়েছে",
      titleEn: "New Discount Transaction Recorded",
      messageBn: `"${partner.name}" এ ৳${tx.amount} টাকার বিলে আপনি ৳${saved} সাশ্রয় করেছেন!`,
      messageEn: `You saved ৳${saved} on a ৳${tx.amount} bill at "${partner.name}"!`,
      link: "/dashboard?tab=history",
    });

    return { success: true, message: `লেনদেন সফলভাবে সম্পন্ন হয়েছে! ছাড়ের পরিমাণ: ৳${saved}` };
  } catch (error) {
    logger.error("Error in addPartnerTransactionAction:", error);
    return { success: false, message: "লেনদেনটি সংরক্ষণ করতে সমস্যা হয়েছে。", errorKey: "partner.errors.transactionFailed" };
  }
}
