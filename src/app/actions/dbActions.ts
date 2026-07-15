"use server";

import { prisma } from "@/lib/prisma";
import { Member, Partner, Transaction } from "@/services/db";

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
    }));
  } catch (error) {
    console.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function addMemberAction(
  member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved">
): Promise<Member> {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const newId = `HC-${year}-${rand}`;
  
  const joined = new Date();
  const expiry = new Date();
  expiry.setFullYear(joined.getFullYear() + 1); // 1-year membership

  try {
    const m = await prisma.member.create({
      data: {
        id: newId,
        name: member.name,
        phone: member.phone,
        email: member.email || null,
        tier: member.tier,
        status: "active",
        joinedDate: joined,
        expiryDate: expiry,
        qrCodeUrl: member.qrCodeUrl || null,
        totalSaved: 0,
        address: member.address || null,
        birthDate: member.birthDate ? new Date(member.birthDate) : null,
        profession: member.profession || null,
        profilePictureUrl: member.profilePictureUrl || null,
      },
    });

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
    };
  } catch (error) {
    console.error("Error in getMemberByIdAction:", error);
    return undefined;
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

    // Simulated revenue based on individual/family plans (500 BDT/year, 1500 BDT/year)
    // Founding tier is free (0 BDT)
    const revenue = members.reduce((sum, m) => {
      if (m.tier === "individual") return sum + 500;
      if (m.tier === "family") return sum + 1500;
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
