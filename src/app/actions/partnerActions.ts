"use server";

import { randomInt, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Partner, Transaction } from "@/services/db";
import { getSessionUser, setSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { sendPasswordResetEmail } from "@/lib/mail";
import { unstable_cache, updateTag } from "next/cache";
import { parseDiscountPercentage } from "@/lib/utils";

const PARTNERS_TAG = "partners";

export interface PartnerRequest {
  id: string;
  orgName: string;
  category: 'hospital' | 'diagnostic' | 'pharmacy';
  address: string;
  discount: string;
  phone: string;
  email: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

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

export async function addPartnerAction(partner: Omit<Partner, "id">): Promise<Partner> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

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
    throw error;
  } finally {
    updateTag(PARTNERS_TAG);
  }
}

export async function updatePartnerAction(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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

// --- PARTNER REQUESTS ACTIONS ---

export async function addPartnerRequestAction(req: Omit<PartnerRequest, "id" | "status">): Promise<PartnerRequest> {
  const id = `req_${crypto.randomUUID()}`;
  try {
    const data = await prisma.partnerRequest.create({
      data: {
        id,
        orgName: req.orgName,
        category: req.category,
        address: req.address,
        discount: req.discount,
        phone: req.phone,
        email: req.email || null,
        status: "pending"
      }
    });

    return {
      id: data.id,
      orgName: data.orgName,
      category: data.category as PartnerRequest["category"],
      address: data.address,
      discount: data.discount,
      phone: data.phone,
      email: data.email,
      status: data.status as PartnerRequest["status"]
    };
  } catch (error) {
    console.error("Error in addPartnerRequestAction:", error);
    throw error;
  }
}

export async function getPartnerRequestsAction(): Promise<PartnerRequest[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    const data = await prisma.partnerRequest.findMany({
      orderBy: { createdAt: "desc" }
    });

    return data.map((d) => ({
      id: d.id,
      orgName: d.orgName,
      category: d.category as PartnerRequest["category"],
      address: d.address,
      discount: d.discount,
      phone: d.phone,
      email: d.email,
      status: d.status as PartnerRequest["status"]
    }));
  } catch (error) {
    console.error("Error in getPartnerRequestsAction:", error);
    return [];
  }
}

export async function updatePartnerRequestStatusAction(id: string, status: "approved" | "rejected"): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
  try {
    const req = await prisma.partnerRequest.update({
      where: { id },
      data: { status }
    });

    if (status === "approved") {
      const partnerId = `p_${crypto.randomUUID()}`;
      // Generate a secure random 8-character temporary password rather than static 123456
      const tempPassword = randomBytes(4).toString("hex");
      const defaultPassword = hashPassword(tempPassword);
      await prisma.partner.create({
        data: {
          id: partnerId,
          name: req.orgName,
          category: req.category,
          address: req.address,
          discount: req.discount,
          phone: req.phone,
          email: req.email || null,
          password: defaultPassword,
          logoText: req.orgName.substring(0, 5),
        }
      });
    }

    return true;
  } catch (error) {
    console.error("Error in updatePartnerRequestStatusAction:", error);
    return false;
  } finally {
    updateTag(PARTNERS_TAG);
  }
}

export async function loginPartnerAction(
  identifier: string,
  password: string
): Promise<{ success: boolean; partner?: Partner; error?: string }> {
  try {
    if (!identifier || !password) {
      return { success: false, error: "মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।" };
    }

    const data = await prisma.partner.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier }
        ]
      }
    });

    if (!data) {
      return { success: false, error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।" };
    }

    if (!data.password) {
      return { success: false, error: "আপনার পাসওয়ার্ড সেট করা নেই। দয়া করে অ্যাডমিনের সাথে যোগাযোগ করুন।" };
    }

    const isValid = verifyPassword(password, data.password);
    if (!isValid) {
      return { success: false, error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।" };
    }

    await setSessionUser(data.id, "partner");

    return {
      success: true,
      partner: {
        id: data.id,
        name: data.name,
        category: data.category as Partner["category"],
        address: data.address,
        discount: data.discount,
        phone: data.phone,
        logoText: data.logoText,
        mapLink: data.mapLink || undefined,
        imageUrl: data.imageUrl || undefined,
      }
    };
  } catch (error) {
    console.error("Error in loginPartnerAction:", error);
    return { success: false, error: "লগইন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।" };
  }
}

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
    const saved = Math.round(tx.amount * discountRate);
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

    // Invalidate admin stats cache
    updateTag("admin-stats");

    return { success: true, message: `লেনদেন সফলভাবে সম্পন্ন হয়েছে! ছাড়ের পরিমাণ: ৳${saved}` };
  } catch (error) {
    console.error("Error in addPartnerTransactionAction:", error);
    return { success: false, message: "লেনদেনটি সংরক্ষণ করতে সমস্যা হয়েছে।" };
  }
}

export async function changePartnerPasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  if (!currentPassword || !newPassword) {
    return { success: false, message: "সকল তথ্য প্রদান করুন।" };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।" };
  }

  try {
    const partner = await prisma.partner.findUnique({
      where: { id: session.userId }
    });

    if (!partner) {
      return { success: false, message: "পার্টনার খুঁজে পাওয়া যায়নি।" };
    }

    if (!partner.password) {
      return { success: false, message: "পূর্বে কোনো পাসওয়ার্ড সেট করা নেই। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।" };
    }

    const isValid = verifyPassword(currentPassword, partner.password);
    if (!isValid) {
      return { success: false, message: "বর্তমান পাসওয়ার্ডটি সঠিক নয়।" };
    }

    const hashed = hashPassword(newPassword);
    await prisma.partner.update({
      where: { id: partner.id },
      data: { password: hashed }
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।" };
  } catch (error) {
    console.error("Error in changePartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" };
  }
}

export async function requestPartnerPasswordResetAction(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) {
      return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };
    }

    const partner = await prisma.partner.findFirst({
      where: { email }
    });

    // Prevent partner account enumeration with generic response
    if (!partner) {
      return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
    }

    const otp = randomInt(100000, 1000000).toString();
    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        verificationCode: otp,
        verificationCodeCreatedAt: new Date(),
      }
    });

    sendPasswordResetEmail(partner.email || "", otp, partner.name).catch((err) => {
      console.error("Failed to send partner password reset OTP email:", err);
    });

    return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
  } catch (error) {
    console.error("Error in requestPartnerPasswordResetAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে।" };
  }
}

const MAX_PARTNER_OTP_ATTEMPTS = 5;

export async function resetPartnerPasswordAction(
  email: string,
  code: string,
  rawNewPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email || !code || !rawNewPassword) {
      return { success: false, message: "সব তথ্য প্রদান করুন।" };
    }

    const partner = await prisma.partner.findFirst({
      where: { email }
    });

    if (!partner) {
      return { success: false, message: "পার্টনার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (!partner.verificationCode || !partner.verificationCodeCreatedAt) {
      return { success: false, message: "রিসেট অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    // --- Brute-force protection: track failed reset attempts ---
    let storedCode = partner.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_PARTNER_OTP_ATTEMPTS) {
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    // Check OTP validity (15 minutes window)
    const codeTime = new Date(partner.verificationCodeCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const diffMinutes = (currentTime - codeTime) / (1000 * 60);

    if (diffMinutes > 15) {
      return { success: false, message: "ভেরিফিকেশন কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.partner.update({
        where: { id: partner.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` }
      });
      const remaining = MAX_PARTNER_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ভেরিফিকেশন কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const hashedPassword = hashPassword(rawNewPassword);

    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeCreatedAt: null
      }
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে।" };
  } catch (error) {
    console.error("Error in resetPartnerPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}
