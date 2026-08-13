"use server";

import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { setSessionUser, clearSessionUser, getSessionUser } from "@/lib/session";
import { sendOtpEmail, sendPasswordResetEmail } from "@/lib/mail";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";

// Helper to format Date objects as YYYY-MM-DD in local time (not UTC).
// Using toISOString() would shift the date to UTC, causing off-by-one errors
// for timezones ahead of UTC (e.g., BDT is UTC+6).
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function stripSensitive(m: Member): Member {
  const safe = { ...m } as Partial<Member>;
  delete safe.password;
  delete safe.verificationCode;
  return safe as Member;
}

// --- MEMBERS ACTIONS ---

export async function addMemberAction(
  member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved"> & { password?: string }
): Promise<Member> {
  const existingPhone = await prisma.member.findUnique({
    where: { phone: member.phone },
  });
  if (existingPhone) {
    throw new Error("এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
  }

  if (member.email) {
    if (member.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      throw new Error("এই ইমেইল অ্যাড্রেসটি দিয়ে সাধারণ অ্যাকাউন্ট তৈরি করা যাবে না।");
    }
    const existingEmail = await prisma.member.findUnique({
      where: { email: member.email },
    });
    if (existingEmail) {
      throw new Error("এই ইমেইল অ্যাড্রেসটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
    }
  }

  const year = new Date().getFullYear();
  const rand = crypto.randomUUID().slice(0, 8).toUpperCase();
  const newId = `HC-${year}-${rand}`;
  
  const joined = new Date();
  const expiry = new Date();
  expiry.setFullYear(joined.getFullYear() + 1); // 1-year membership

  const rawPassword = member.password || "123456";
  const hashedPassword = hashPassword(rawPassword);
  const verificationCode = randomInt(100000, 1000000).toString();

  try {
    const m = await prisma.member.create({
      data: {
        id: newId,
        name: member.name,
        phone: member.phone,
        email: member.email || null,
        password: hashedPassword,
        tier: member.tier,
        status: "inactive",
        joinedDate: joined,
        expiryDate: expiry,
        qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "https://healthclubfeni.vercel.app"}/verify/${newId}`)}`,
        totalSaved: 0,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
        emailVerified: false,
        verificationCode,
        verificationCodeCreatedAt: new Date(),
      },
    });

    if (member.email) {
      sendOtpEmail(member.email, verificationCode, member.name).catch((err) => {
        console.error("Failed to send signup OTP email:", err);
      });
    }

    return {
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member;
  } catch (error: unknown) {
    console.error("Error in addMemberAction:", error);
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      throw new Error("এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।");
    }
    throw error;
  }
}

export async function getMembersAction(): Promise<Member[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });

    return members.map((m) =>
      stripSensitive({
        ...m,
        email: m.email || undefined,
        joinedDate: formatDate(m.joinedDate),
        expiryDate: formatDate(m.expiryDate),
        address: m.address || undefined,
        birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
        profession: m.profession || undefined,
        profilePictureUrl: m.profilePictureUrl || undefined,
      } as Member)
    );
  } catch (error) {
    console.error("Error in getMembersAction:", error);
    return [];
  }
}

export interface PublicMemberVerification {
  id: string;
  name: string;
  tier: "founding" | "premium";
  status: "active" | "inactive" | "pending_payment" | "pending_approval";
  expiryDate: string;
  isExpired: boolean;
}

/**
 * Publicly accessible endpoint for digital card / QR code verification.
 * Strictly redacts and excludes all sensitive PII (phone, email, address, bKash transactions).
 */
export async function getPublicMemberVerificationAction(
  memberId: string
): Promise<PublicMemberVerification | null> {
  try {
    const m = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        tier: true,
        status: true,
        expiryDate: true,
      },
    });

    if (!m) return null;

    const expiryDate = new Date(m.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    const isExpired = expiryDate < new Date();

    return {
      id: m.id,
      name: m.name,
      tier: m.tier as "founding" | "premium",
      status: m.status as "active" | "inactive" | "pending_payment" | "pending_approval",
      expiryDate: formatDate(m.expiryDate),
      isExpired,
    };
  } catch (error) {
    console.error("Error in getPublicMemberVerificationAction:", error);
    return null;
  }
}

/**
 * Secure member retrieval.
 * Requires authenticated session; only the user themselves or an admin can access full profile details.
 */
export async function getMemberByIdAction(idOrPhone: string): Promise<Member | null> {
  const session = await getSessionUser();
  if (!session) return null;

  try {
    // If regular user, only allow fetching their own profile
    if (session.role === "user" && session.userId !== idOrPhone) {
      const self = await prisma.member.findUnique({
        where: { id: session.userId },
        select: { phone: true, email: true },
      });
      if (self?.phone !== idOrPhone && self?.email !== idOrPhone) {
        return null;
      }
    }

    const selectFields = {
      id: true,
      name: true,
      phone: true,
      email: true,
      tier: true,
      status: true,
      joinedDate: true,
      expiryDate: true,
      qrCodeUrl: true,
      totalSaved: true,
      address: true,
      birthDate: true,
      profession: true,
      profilePictureUrl: true,
      emailVerified: true,
      bkashSender: true,
      bkashTxnId: true,
      renewalStatus: true,
      renewalBkashSender: true,
      renewalBkashTxnId: true,
    };

    let m = await prisma.member.findUnique({
      where: { id: idOrPhone },
      select: selectFields,
    });

    if (!m) {
      m = await prisma.member.findFirst({
        where: {
          OR: [{ phone: idOrPhone }, { email: idOrPhone }],
        },
        select: selectFields,
      });
    }

    if (!m) return null;

    return {
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email || undefined,
      tier: m.tier as Member["tier"],
      status: m.status as Member["status"],
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      qrCodeUrl: m.qrCodeUrl || undefined,
      totalSaved: m.totalSaved,
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
      emailVerified: m.emailVerified,
      bkashSender: m.bkashSender || undefined,
      bkashTxnId: m.bkashTxnId || undefined,
      renewalStatus: m.renewalStatus || undefined,
      renewalBkashSender: m.renewalBkashSender || undefined,
      renewalBkashTxnId: m.renewalBkashTxnId || undefined,
    } as Member;
  } catch (error) {
    console.error("Error in getMemberByIdAction:", error);
    return null;
  }
}

export async function updateMemberStatusAction(
  id: string,
  status: Member["status"]
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  try {
    await prisma.member.update({
      where: { id },
      data: { status },
    });
    return true;
  } catch (error) {
    console.error("Error in updateMemberStatusAction:", error);
    return false;
  }
}

export async function loginMemberAction(
  identifier: string,
  passwordInput: string
): Promise<{ success: boolean; member?: Member; message?: string; error?: string }> {
  try {
    const isEmail = identifier.includes("@");
    // Try email or phone lookup first (both are indexed unique columns)
    let m = isEmail
      ? await prisma.member.findUnique({ where: { email: identifier } })
      : await prisma.member.findUnique({ where: { phone: identifier } });

    // Fallback: try membership ID (e.g., HC-2026-ABCD1234) if phone lookup returned nothing
    if (!m && !isEmail) {
      m = await prisma.member.findUnique({ where: { id: identifier } });
    }

    if (!m) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    const isValid = verifyPassword(passwordInput, m.password);
    if (!isValid) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "মেম্বারশিপ আইডি, ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
    }

    const safeMember = stripSensitive({
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member);

    if (m.email && !m.emailVerified) {
      return { 
        success: true, 
        error: "PENDING_VERIFICATION",
        message: "আপনার ইমেইল ভেরিফাই করা হয়নি। অনুগ্রহ করে ইমেইল ভেরিফিকেশন সম্পন্ন করুন।",
        member: safeMember,
      };
    }

    await setSessionUser(safeMember.id, "user");

    return { success: true, member: safeMember };
  } catch (error) {
    console.error("Error in loginMemberAction:", error);
    return { success: false, error: "SERVER_ERROR", message: "লগইন করতে সমস্যা হয়েছে।" };
  }
}

export async function loginAdminAction(identifier: string, passwordInput: string): Promise<Member | null> {
  try {
    // Do the lookup directly — avoids setting a "user" session just to overwrite it with "admin"
    const isEmail = identifier.includes("@");
    let m = isEmail
      ? await prisma.member.findUnique({ where: { email: identifier } })
      : await prisma.member.findUnique({ where: { phone: identifier } });

    if (!m && !isEmail) {
      m = await prisma.member.findUnique({ where: { id: identifier } });
    }

    if (!m || m.email !== ADMIN_EMAIL) return null;

    const isValid = verifyPassword(passwordInput, m.password);
    if (!isValid) return null;

    const safeMember = stripSensitive({
      ...m,
      email: m.email || undefined,
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      address: m.address || undefined,
      birthDate: m.birthDate ? formatDate(m.birthDate) : undefined,
      profession: m.profession || undefined,
      profilePictureUrl: m.profilePictureUrl || undefined,
    } as Member);

    // Set session once as admin — no intermediate "user" session write
    await setSessionUser(safeMember.id, "admin");
    return safeMember;
  } catch (error) {
    console.error("Error in loginAdminAction:", error);
    return null;
  }
}

export async function logoutUserAction(): Promise<boolean> {
  try {
    await clearSessionUser();
    return true;
  } catch (error) {
    console.error("Error in logoutUserAction:", error);
    return false;
  }
}

export const logoutMemberAction = logoutUserAction;

export async function updateMemberProfileAction(
  id: string,
  updates: Partial<Pick<Member, "name" | "phone" | "email" | "address" | "birthDate" | "profession" | "profilePictureUrl">>
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || (session.userId !== id && session.role !== "admin")) return false;

  // Security: Prevent regular users from setting their email to ADMIN_EMAIL
  if (updates.email && updates.email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && session.role !== "admin") {
    console.warn(`[SECURITY] Prevented non-admin user ${id} from claiming ADMIN_EMAIL ${ADMIN_EMAIL}`);
    return false;
  }

  try {
    await prisma.member.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.email !== undefined && { email: updates.email || null }),
        ...(updates.address !== undefined && { address: updates.address || null }),
        ...(updates.birthDate !== undefined && {
          birthDate: updates.birthDate ? new Date(updates.birthDate) : null,
        }),
        ...(updates.profession !== undefined && { profession: updates.profession || null }),
        ...(updates.profilePictureUrl !== undefined && { profilePictureUrl: updates.profilePictureUrl || null }),
      },
    });
    return true;
  } catch (error) {
    console.error("Error in updateMemberProfileAction:", error);
    return false;
  }
}

const MAX_OTP_ATTEMPTS = 5;

export async function verifyEmailOtpAction(
  email: string,
  code: string
): Promise<{ success: boolean; member?: Member; message?: string; requiresPayment?: boolean }> {
  try {
    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (!member.verificationCode || !member.verificationCodeCreatedAt) {
      return { success: false, message: "ভেরিফিকেশন অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    // --- Brute-force protection: track failed attempts ---
    // Store attempt count as prefix in verificationCode: "attempts:3:XXXXXX"
    let storedCode = member.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    if (storedCode !== code) {
      // Increment attempt counter
      const newAttempts = attempts + 1;
      await prisma.member.update({
        where: { id: member.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` },
      });
      const remaining = MAX_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ওটিপি কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const nextStatus = member.tier === "founding" ? "active" : member.status;
    const updated = await prisma.member.update({
      where: { id: member.id },
      data: {
        status: nextStatus,
        emailVerified: true,
        verificationCode: null,
        verificationCodeCreatedAt: null,
      },
    });

    const safeMember = stripSensitive({
      ...updated,
      email: updated.email || undefined,
      joinedDate: formatDate(updated.joinedDate),
      expiryDate: formatDate(updated.expiryDate),
      address: updated.address || undefined,
      birthDate: updated.birthDate ? formatDate(updated.birthDate) : undefined,
      profession: updated.profession || undefined,
      profilePictureUrl: updated.profilePictureUrl || undefined,
    } as Member);

    await setSessionUser(safeMember.id, "user");

    const requiresPayment = updated.tier === "premium" && updated.status === "inactive" && !updated.bkashTxnId;

    return { success: true, member: safeMember, requiresPayment };
  } catch (error) {
    console.error("Error in verifyEmailOtpAction:", error);
    return { success: false, message: "ইমেইল ভেরিফাই করতে সমস্যা হয়েছে।" };
  }
}

export async function submitBkashPaymentAction(
  memberId: string,
  bkashSender: string,
  bkashTxnId: string
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || (session.userId !== memberId && session.role !== "admin")) return false;
  try {
    // Skip the pre-check findUnique — update throws P2025 if not found, which we catch
    await prisma.member.update({
      where: { id: memberId },
      data: {
        bkashSender,
        bkashTxnId,
        status: "pending_approval",
      },
    });
    return true;
  } catch (error: unknown) {
    // P2025 = record not found — treat as false rather than throwing
    if ((error as { code?: string })?.code === "P2025") return false;
    console.error("Error in submitBkashPaymentAction:", error);
    return false;
  }
}

export async function resendVerificationCodeAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার খুঁজে পাওয়া যায়নি।" };
    }

    const code = randomInt(100000, 1000000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationCode: code,
        verificationCodeCreatedAt: new Date(),
      },
    });

    if (member.email) {
      sendOtpEmail(member.email, code, member.name).catch((err) => {
        console.error("Failed to send resend OTP email:", err);
      });
    }
    return { success: true, message: "নতুন ওটিপি কোড পাঠানো হয়েছে!" };
  } catch (error) {
    console.error("Error in resendVerificationCodeAction:", error);
    return { success: false, message: "কোড পুনরায় পাঠাতে সমস্যা হয়েছে।" };
  }
}

export async function requestPasswordResetAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!email) {
      return { success: false, message: "অনুগ্রহ করে ইমেইল অ্যাড্রেসটি দিন।" };
    }

    const member = await prisma.member.findFirst({
      where: { email },
    });

    // Prevent account enumeration by returning a neutral generic message even if email not found
    if (!member) {
      return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
    }

    const otp = randomInt(100000, 1000000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationCode: otp,
        verificationCodeCreatedAt: new Date(),
      },
    });

    sendPasswordResetEmail(member.email || "", otp, member.name).catch((err) => {
      console.error("Failed to send password reset OTP email:", err);
    });

    return { success: true, message: "যদি এই ইমেইলটি আমাদের সিস্টেমে নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
  } catch (error) {
    console.error("Error in requestPasswordResetAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে।" };
  }
}

export async function resetPasswordAction(
  email: string,
  code: string,
  rawNewPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (!email || !code || !rawNewPassword) {
      return { success: false, message: "সব তথ্য প্রদান করুন।" };
    }

    const member = await prisma.member.findFirst({
      where: { email },
    });

    if (!member) {
      return { success: false, message: "মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (!member.verificationCode || !member.verificationCodeCreatedAt) {
      return { success: false, message: "রিসেট অনুরোধ পাওয়া যায়নি বা কোড ইতিমধ্যে ব্যবহৃত হয়েছে।" };
    }

    // --- Brute-force protection: track failed reset attempts ---
    let storedCode = member.verificationCode;
    let attempts = 0;
    const attemptMatch = storedCode.match(/^attempts:(\d+):(.+)$/);
    if (attemptMatch) {
      attempts = parseInt(attemptMatch[1], 10);
      storedCode = attemptMatch[2];
    }

    if (attempts >= MAX_OTP_ATTEMPTS) {
      return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
    }

    const fifteenMinutes = 15 * 60 * 1000;
    if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
      return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে (১৫ মিনিট পার হয়েছে)। অনুগ্রহ করে আবার নতুন কোড পাঠান।" };
    }

    if (storedCode !== code) {
      const newAttempts = attempts + 1;
      await prisma.member.update({
        where: { id: member.id },
        data: { verificationCode: `attempts:${newAttempts}:${storedCode}` },
      });
      const remaining = MAX_OTP_ATTEMPTS - newAttempts;
      if (remaining <= 0) {
        return { success: false, message: "অনেকবার ভুল কোড দেওয়া হয়েছে। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
      return { success: false, message: `ভুল ওটিপি কোড। আর ${remaining}টি সুযোগ বাকি।` };
    }

    const hashedPassword = hashPassword(rawNewPassword);
    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeCreatedAt: null,
      },
    });

    return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" };
  } catch (error) {
    console.error("Error in resetPasswordAction:", error);
    return { success: false, message: "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।" };
  }
}

export async function requestRenewalAction(
  bkashSender: string,
  bkashTxnId: string,
  profession?: string
): Promise<{ success: boolean; message: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "user") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    if (!bkashSender || !bkashTxnId) {
      return { success: false, message: "বিকাশ নম্বর এবং ট্রানজেকশন আইডি দিন।" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      renewalStatus: "pending",
      renewalBkashSender: bkashSender,
      renewalBkashTxnId: bkashTxnId,
    };

    if (profession) {
      updateData.profession = profession;
    }

    await prisma.member.update({
      where: { id: session.userId },
      data: updateData,
    });

    return { success: true, message: "রিনিউয়াল অনুরোধ সফলভাবে পাঠানো হয়েছে! এডমিন যাচাইয়ের পর অ্যাক্টিভ করা হবে।" };
  } catch (error) {
    console.error("Error in requestRenewalAction:", error);
    return { success: false, message: "রিনিউয়াল অনুরোধ পাঠাতে সমস্যা হয়েছে।" };
  }
}

export async function verifyMemberForPartnerAction(
  memberId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; member?: any; message?: string }> {
  const session = await getSessionUser();
  if (!session || session.role !== "partner") {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    // Only fetch the columns returned to the partner — avoids transferring password, codes, etc.
    const data = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        tier: true,
        status: true,
        expiryDate: true,
        totalSaved: true,
        profilePictureUrl: true,
      },
    });

    if (!data) {
      return { success: false, message: "মেম্বারশিপ আইডি পাওয়া যায়নি।" };
    }

    const expiryDate = new Date(data.expiryDate);
    expiryDate.setHours(23, 59, 59, 999);
    const isExpired = expiryDate < new Date();

    return {
      success: true,
      member: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || "",
        tier: data.tier,
        status: data.status,
        expiryDate: formatDate(data.expiryDate),
        totalSaved: data.totalSaved,
        profilePictureUrl: data.profilePictureUrl || "",
        isExpired,
      },
    };
  } catch (error) {
    console.error("Error in verifyMemberForPartnerAction:", error);
    return { success: false, message: "মেম্বার যাচাই করতে সমস্যা হয়েছে।" };
  }
}
