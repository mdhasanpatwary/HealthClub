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
    logger.error("Error in getPartnerTransactionsAction:", error);
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
    return { success: false, message: "লেনদেনটি সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}
