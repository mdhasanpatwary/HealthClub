"use server";

import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { setSessionUser, clearSessionUser, getSessionUser } from "@/lib/session";
import { sendOtpEmail, sendPasswordResetEmail } from "@/lib/mail";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";

// Helper to format Date objects as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
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
  const year = new Date().getFullYear();
  const rand = crypto.randomUUID().slice(0, 8).toUpperCase();
  const newId = `HC-${year}-${rand}`;
  
  const joined = new Date();
  const expiry = new Date();
  expiry.setFullYear(joined.getFullYear() + 1); // 1-year membership

  const rawPassword = member.password || "123456";
  const hashedPassword = hashPassword(rawPassword);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

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
        qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://healthclubfeni.vercel.app/verify/${newId}`)}`,
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

    if (m.email) {
      sendOtpEmail(m.email, verificationCode, m.name).catch((err) => {
        console.error("Failed to send registration OTP email:", err);
      });
    }

    return stripSensitive({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email || "",
      tier: m.tier as Member["tier"],
      status: m.status as Member["status"],
      joinedDate: formatDate(m.joinedDate),
      expiryDate: formatDate(m.expiryDate),
      qrCodeUrl: m.qrCodeUrl || undefined,
      totalSaved: m.totalSaved,
      address: m.address || "",
      birthDate: m.birthDate ? formatDate(m.birthDate) : "",
      profession: m.profession || "",
      profilePictureUrl: m.profilePictureUrl || "",
      emailVerified: m.emailVerified,
      bkashSender: m.bkashSender || undefined,
      bkashTxnId: m.bkashTxnId || undefined,
    });
  } catch (error) {
    console.error("Error in addMemberAction:", error);
    throw error;
  }
}

export async function getMemberByIdAction(id: string): Promise<Member | undefined> {
  try {
    const data = await prisma.member.findFirst({
      where: {
        OR: [
          { id },
          { phone: id },
          { email: id }
        ]
      }
    });

    if (!data) return undefined;

    return stripSensitive({
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      tier: data.tier as Member["tier"],
      status: data.status as Member["status"],
      joinedDate: formatDate(data.joinedDate),
      expiryDate: formatDate(data.expiryDate),
      qrCodeUrl: data.qrCodeUrl || undefined,
      totalSaved: data.totalSaved,
      address: data.address || "",
      birthDate: data.birthDate ? formatDate(data.birthDate) : "",
      profession: data.profession || "",
      profilePictureUrl: data.profilePictureUrl || "",
      emailVerified: data.emailVerified,
      bkashSender: data.bkashSender || undefined,
      bkashTxnId: data.bkashTxnId || undefined,
    });
  } catch (error) {
    console.error("Error in getMemberByIdAction:", error);
    return undefined;
  }
}

export async function loginMemberAction(
  identifier: string, 
  password: string
): Promise<{ success: boolean; member?: Member; error?: string }> {
  try {
    if (!identifier || !password) {
      return { success: false, error: "মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড দিন।" };
    }

    const data = await prisma.member.findFirst({
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

    const isValid = verifyPassword(password, data.password);
    if (!isValid) {
      return { success: false, error: "ভুল মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড।" };
    }

    if (data.status === "inactive") {
      return { success: false, error: "আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে এডমিনের সাথে যোগাযোগ করুন।" };
    }

    if (data.status === "pending_approval") {
      return { success: false, error: "আপনার অ্যাকাউন্টটি এখনো অনুমোদিত হয়নি। অনুগ্রহ করে এডমিন অনুমোদনের জন্য অপেক্ষা করুন।" };
    }

    if (!data.emailVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.member.update({
        where: { id: data.id },
        data: { 
          verificationCode: code,
          verificationCodeCreatedAt: new Date(),
        }
      });
      if (data.email) {
        sendOtpEmail(data.email, code, data.name).catch((err) => {
          console.error("Failed to send login verification OTP email:", err);
        });
      }
      return {
        success: true,
        error: "PENDING_VERIFICATION",
        member: stripSensitive({
          id: data.id,
          name: data.name,
          phone: data.phone,
          email: data.email || "",
          tier: data.tier as Member["tier"],
          status: "inactive",
          joinedDate: formatDate(data.joinedDate),
          expiryDate: formatDate(data.expiryDate),
          qrCodeUrl: data.qrCodeUrl || undefined,
          totalSaved: data.totalSaved,
          address: data.address || "",
          birthDate: data.birthDate ? formatDate(data.birthDate) : "",
          profession: data.profession || "",
          profilePictureUrl: data.profilePictureUrl || "",
          emailVerified: false,
          bkashSender: data.bkashSender || undefined,
          bkashTxnId: data.bkashTxnId || undefined,
        })
      };
    }

    const role = data.email === ADMIN_EMAIL ? "admin" : "user";
    await setSessionUser(data.id, role);

    return {
      success: true,
      member: stripSensitive({
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email || "",
        tier: data.tier as Member["tier"],
        status: data.status as Member["status"],
        joinedDate: formatDate(data.joinedDate),
        expiryDate: formatDate(data.expiryDate),
        qrCodeUrl: data.qrCodeUrl || undefined,
        totalSaved: data.totalSaved,
        address: data.address || "",
        birthDate: data.birthDate ? formatDate(data.birthDate) : "",
        profession: data.profession || "",
        profilePictureUrl: data.profilePictureUrl || "",
        emailVerified: data.emailVerified,
        bkashSender: data.bkashSender || undefined,
        bkashTxnId: data.bkashTxnId || undefined,
      })
    };
  } catch (error) {
    console.error("Error in loginMemberAction:", error);
    return { success: false, error: "সার্ভার ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।" };
  }
}

export async function loginAdminAction(identifier: string, password: string): Promise<Member | null> {
  try {
    if (!identifier || !password) return null;
    if (identifier !== ADMIN_EMAIL) return null;

    let admin = await prisma.member.findFirst({
      where: { email: ADMIN_EMAIL }
    });

    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    if (!admin) {
      const hashedPw = hashPassword(adminPassword);
      admin = await prisma.member.create({
        data: {
          id: "HC-ADMIN-01",
          name: "হেলথ ক্লাব এডমিন",
          phone: "01700000000",
          email: ADMIN_EMAIL,
          password: hashedPw,
          tier: "founding",
          status: "active",
          joinedDate: new Date(),
          expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          totalSaved: 0,
          emailVerified: true
        }
      });
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) return null;

    await setSessionUser(admin.id, "admin");

    return stripSensitive({
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      email: admin.email || "",
      tier: admin.tier as Member["tier"],
      status: admin.status as Member["status"],
      joinedDate: formatDate(admin.joinedDate),
      expiryDate: formatDate(admin.expiryDate),
      qrCodeUrl: admin.qrCodeUrl || undefined,
      totalSaved: admin.totalSaved,
      address: admin.address || "",
      birthDate: admin.birthDate ? formatDate(admin.birthDate) : "",
      profession: admin.profession || "",
      profilePictureUrl: admin.profilePictureUrl || "",
      emailVerified: admin.emailVerified
    });
  } catch (error) {
    console.error("Error in loginAdminAction:", error);
    return null;
  }
}

export async function verifyEmailOtpAction(email: string, code: string): Promise<{ success: boolean; member?: Member; requiresPayment?: boolean; message?: string }> {
  try {
    const data = await prisma.member.findFirst({
      where: { email }
    });

    if (!data) {
      return { success: false, message: "অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (data.verificationCode !== code) {
      return { success: false, message: "ভুল ওটিপি কোড।" };
    }

    if (data.verificationCodeCreatedAt) {
      const fifteenMinutes = 15 * 60 * 1000;
      if (Date.now() - new Date(data.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
        return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে (১৫ মিনিট পার হয়েছে)। অনুগ্রহ করে নতুন কোড পাঠান।" };
      }
    }

    const nextStatus: Member["status"] = data.tier === "founding" ? "pending_approval" : "pending_payment";
    const updated = await prisma.member.update({
      where: { id: data.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        status: nextStatus
      }
    });

    const memberObj: Member = {
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      email: updated.email || "",
      tier: updated.tier as Member["tier"],
      status: updated.status as Member["status"],
      joinedDate: formatDate(updated.joinedDate),
      expiryDate: formatDate(updated.expiryDate),
      qrCodeUrl: updated.qrCodeUrl || undefined,
      totalSaved: updated.totalSaved,
      address: updated.address || "",
      birthDate: updated.birthDate ? formatDate(updated.birthDate) : "",
      profession: updated.profession || "",
      profilePictureUrl: updated.profilePictureUrl || "",
      emailVerified: true,
      bkashSender: updated.bkashSender || undefined,
      bkashTxnId: updated.bkashTxnId || undefined,
    };

    return {
      success: true,
      member: memberObj,
      requiresPayment: nextStatus === "pending_payment"
    };
  } catch (error) {
    console.error("Error in verifyEmailOtpAction:", error);
    return { success: false, message: "সার্ভার ত্রুটি।" };
  }
}

export async function logoutMemberAction(): Promise<boolean> {
  await clearSessionUser();
  return true;
}

export async function completePaymentAction(memberId: string): Promise<boolean> {
  try {
    await prisma.member.update({
      where: { id: memberId },
      data: { status: "pending_approval" }
    });
    return true;
  } catch (error) {
    console.error("Error in completePaymentAction:", error);
    return false;
  }
}

export async function submitBkashPaymentAction(
  memberId: string,
  senderPhone: string,
  txnId: string
): Promise<boolean> {
  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        status: "pending_approval",
        bkashSender: senderPhone,
        bkashTxnId: txnId,
      }
    });

    return true;
  } catch (error) {
    console.error("Error in submitBkashPaymentAction:", error);
    return false;
  }
}

export async function resendVerificationCodeAction(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const member = await prisma.member.findFirst({
      where: { email }
    });

    if (!member) {
      return { success: false, message: "মেম্বার খুঁজে পাওয়া যায়নি।" };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: { 
        verificationCode: code,
        verificationCodeCreatedAt: new Date(),
      }
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
      where: { email }
    });

    if (!member) {
      return { success: false, message: "এই ইমেইল দিয়ে কোনো মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.member.update({
      where: { id: member.id },
      data: {
        verificationCode: otp,
        verificationCodeCreatedAt: new Date(),
      }
    });

    sendPasswordResetEmail(member.email || "", otp, member.name).catch((err) => {
      console.error("Failed to send password reset OTP email:", err);
    });

    return { success: true, message: "আপনার ইমেইলে পাসওয়ার্ড রিসেট ওটিপি কোড পাঠানো হয়েছে।" };
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
      where: { email }
    });

    if (!member) {
      return { success: false, message: "মেম্বার অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।" };
    }

    if (member.verificationCode !== code) {
      return { success: false, message: "ভুল ওটিপি কোড।" };
    }

    if (member.verificationCodeCreatedAt) {
      const fifteenMinutes = 15 * 60 * 1000;
      if (Date.now() - new Date(member.verificationCodeCreatedAt).getTime() > fifteenMinutes) {
        return { success: false, message: "ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে (১৫ মিনিট পার হয়েছে)। অনুগ্রহ করে আবার নতুন কোড পাঠান।" };
      }
    }

    const hashedPassword = hashPassword(rawNewPassword);
    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationCodeCreatedAt: null
      }
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
    const data = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!data) {
      return { success: false, message: "মেম্বারশিপ আইডি পাওয়া যায়নি।" };
    }

    const isExpired = new Date(data.expiryDate) < new Date();

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
