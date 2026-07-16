"use server";

import { prisma } from "@/lib/prisma";
import { Member, Partner, Transaction } from "@/services/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { setSessionUser, clearSessionUser } from "@/lib/session";
import { sendOtpEmail } from "@/lib/mail";


// Helper to format Date objects as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// --- PARTNERS ACTIONS ---

export async function getPartnersAction(): Promise<Partner[]> {
  try {
    const data = await prisma.partner.findMany({
      orderBy: { createdAt: "desc" },
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
}

export async function addPartnerAction(partner: Omit<Partner, "id">): Promise<Partner> {
  const newPartnerId = `p_${Date.now()}`;
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
  }
}

export async function updatePartnerAction(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
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
  }
}

export async function deletePartnerAction(id: string): Promise<boolean> {
  try {
    await prisma.partner.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error in deletePartnerAction:", error);
    return false;
  }
}

// --- MEMBERS ACTIONS ---

export async function getMembersAction(): Promise<Member[]> {
  try {
    const data = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });

    return data.map((m) => ({
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
      bkashSender: m.bkashSender || undefined,
      bkashTxnId: m.bkashTxnId || undefined,
    }));
  } catch (error) {
    console.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function addMemberAction(
  member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved"> & { password?: string }
): Promise<Member> {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
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
        qrCodeUrl: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://healthclub.feni.dev/verify/${newId}`)}`,
        totalSaved: 0,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
        emailVerified: false,
        verificationCode,
      },
    });

    if (m.email) {
      sendOtpEmail(m.email, verificationCode, m.name).catch((err) => {
        console.error("Failed to send registration OTP email:", err);
      });
    }

    return {
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
      verificationCode: m.verificationCode || undefined,
      bkashSender: m.bkashSender || undefined,
      bkashTxnId: m.bkashTxnId || undefined,
    };
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

    return {
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
      verificationCode: data.verificationCode || undefined,
      bkashSender: data.bkashSender || undefined,
      bkashTxnId: data.bkashTxnId || undefined,
    };
  } catch (error) {
    console.error("Error in getMemberByIdAction:", error);
    return undefined;
  }
}

export async function loginMemberAction(identifier: string, password?: string): Promise<Member | null> {
  try {
    const data = await prisma.member.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier }
        ]
      }
    });

    if (!data) return null;

    // Verify password if provided
    if (password) {
      const isValid = verifyPassword(password, data.password);
      if (!isValid) return null;
    }

    // Check if verified
    if (!data.emailVerified) {
      // Re-trigger OTP and console log
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.member.update({
        where: { id: data.id },
        data: { verificationCode: code }
      });
      if (data.email) {
        sendOtpEmail(data.email, code, data.name).catch((err) => {
          console.error("Failed to send login verification OTP email:", err);
        });
      }
      return {
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
        verificationCode: code,
        bkashSender: data.bkashSender || undefined,
        bkashTxnId: data.bkashTxnId || undefined,
      };
    }

    // Set secure cookies
    const role = data.email === "healthclubfeni@gmail.com" ? "admin" : "user";
    await setSessionUser(data.id, role);

    return {
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
    };
  } catch (error) {
    console.error("Error in loginMemberAction:", error);
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

    // Mark as verified - founding needs manual admin approval
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

    if (nextStatus === "pending_approval") {
      const role = updated.email === "healthclubfeni@gmail.com" ? "admin" : "user";
      await setSessionUser(updated.id, role);
    }

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
    const updated = await prisma.member.update({
      where: { id: memberId },
      data: { status: "pending_approval" }
    });
    
    const role = updated.email === "healthclubfeni@gmail.com" ? "admin" : "user";
    await setSessionUser(updated.id, role);
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
    const updated = await prisma.member.update({
      where: { id: memberId },
      data: {
        status: "pending_approval",
        bkashSender: senderPhone,
        bkashTxnId: txnId,
      }
    });

    const role = updated.email === "healthclubfeni@gmail.com" ? "admin" : "user";
    await setSessionUser(updated.id, role);
    return true;
  } catch (error) {
    console.error("Error in submitBkashPaymentAction:", error);
    return false;
  }
}

export async function updateMemberStatusAction(id: string, status: Member["status"]): Promise<boolean> {
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

export async function updateMemberProfileAction(
  id: string,
  name: string,
  phone: string,
  email: string,
  address?: string,
  birthDate?: string,
  profession?: string,
  profilePictureUrl?: string
): Promise<boolean> {
  try {
    await prisma.member.update({
      where: { id },
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        profession: profession || null,
        profilePictureUrl: profilePictureUrl || null,
      },
    });
    return true;
  } catch (error) {
    console.error("Error in updateMemberProfileAction:", error);
    return false;
  }
}

export async function updateMemberAction(
  id: string,
  member: {
    name: string;
    phone: string;
    email: string;
    tier: Member["tier"];
    address?: string;
    birthDate?: string;
    profession?: string;
    profilePictureUrl?: string;
  }
): Promise<boolean> {
  try {
    await prisma.member.update({
      where: { id },
      data: {
        name: member.name,
        phone: member.phone,
        email: member.email || null,
        tier: member.tier,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
      },
    });
    return true;
  } catch (error) {
    console.error("Error in updateMemberAction:", error);
    return false;
  }
}

export async function deleteMemberAction(id: string): Promise<boolean> {
  try {
    await prisma.member.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error("Error in deleteMemberAction:", error);
    return false;
  }
}

// --- TRANSACTIONS ACTIONS ---

export async function getTransactionsAction(): Promise<Transaction[]> {
  try {
    const data = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    return data.map((t) => ({
      id: t.id,
      memberId: t.memberId,
      memberName: t.memberName,
      partnerId: t.partnerId,
      partnerName: t.partnerName,
      amount: t.amount,
      saved: t.saved,
      date: new Date(t.date).toLocaleString("en-US", { hour12: true }),
    }));
  } catch (error) {
    console.error("Error in getTransactionsAction:", error);
    return [];
  }
}

export async function addTransactionAction(tx: Omit<Transaction, "id" | "date">): Promise<Transaction> {
  const newTxId = `tx_${Date.now()}`;
  const now = new Date();

  try {
    // Run transaction and member savings update as a single atomic database transaction
    const result = await prisma.$transaction(async (prismaTx) => {
      // 1. Create transaction record
      const t = await prismaTx.transaction.create({
        data: {
          id: newTxId,
          memberId: tx.memberId,
          memberName: tx.memberName,
          partnerId: tx.partnerId,
          partnerName: tx.partnerName,
          amount: tx.amount,
          saved: tx.saved,
          date: now,
        },
      });

      // 2. Increment member savings
      await prismaTx.member.update({
        where: { id: tx.memberId },
        data: {
          totalSaved: { increment: tx.saved },
        },
      });

      return t;
    });

    return {
      id: result.id,
      memberId: result.memberId,
      memberName: result.memberName,
      partnerId: result.partnerId,
      partnerName: result.partnerName,
      amount: result.amount,
      saved: result.saved,
      date: new Date(result.date).toLocaleString("en-US", { hour12: true }),
    };
  } catch (error) {
    console.error("Error in addTransactionAction:", error);
    throw error;
  }
}

// --- ANALYTICS ACTION ---

export async function getStatsAction() {
  try {
    const members = await prisma.member.findMany();
    const partners = await prisma.partner.findMany();
    const transactions = await prisma.transaction.findMany();

    const activeMembers = members.filter((m) => m.status === "active").length;
    const totalSaved = members.reduce((sum, m) => sum + (m.totalSaved || 0), 0);
    const totalTransactions = transactions.length;

    // Simulated revenue based on premium plans (500 BDT/year)
    // Founding tier is free (0 BDT)
    const revenue = members.reduce((sum, m) => {
      if (m.tier === "premium" && m.status === "active") return sum + 500;
      return sum;
    }, 0);

    return {
      totalMembers: members.length,
      activeMembers,
      partnerCount: partners.length,
      totalSaved,
      totalTransactions,
      revenue,
    };
  } catch (error) {
    console.error("Error in getStatsAction:", error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      partnerCount: 0,
      totalSaved: 0,
      totalTransactions: 0,
      revenue: 0,
    };
  }
}

// --- PARTNER REQUESTS ACTIONS ---

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

export async function addPartnerRequestAction(req: Omit<PartnerRequest, "id" | "status">): Promise<PartnerRequest> {
  const id = `req_${Date.now()}`;
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
  try {
    // 1. Update the request status
    const req = await prisma.partnerRequest.update({
      where: { id },
      data: { status }
    });

    // 2. If approved, copy the partner details to the partners table
    if (status === "approved") {
      const partnerId = `p_${Date.now()}`;
      await prisma.partner.create({
        data: {
          id: partnerId,
          name: req.orgName,
          category: req.category,
          address: req.address,
          discount: req.discount,
          phone: req.phone,
          logoText: req.orgName.substring(0, 5),
        }
      });
    }

    return true;
  } catch (error) {
    console.error("Error in updatePartnerRequestStatusAction:", error);
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
      data: { verificationCode: code }
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
