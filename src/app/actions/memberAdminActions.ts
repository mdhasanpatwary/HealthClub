"use server";

import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { getSessionUser } from "@/lib/session";

// Helper to format Date objects as YYYY-MM-DD in local time (not UTC).
// Using toISOString() would shift the date to UTC, causing off-by-one errors
// for timezones ahead of UTC (e.g., BDT is UTC+6).
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}



export async function getMembersAction(): Promise<Member[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    // Select only needed columns — excludes password, verificationCode at DB level
    const data = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      select: {
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
        bkashSender: true,
        bkashTxnId: true,
        renewalStatus: true,
        renewalBkashSender: true,
        renewalBkashTxnId: true,
      },
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
      renewalStatus: m.renewalStatus || undefined,
      renewalBkashSender: m.renewalBkashSender || undefined,
      renewalBkashTxnId: m.renewalBkashTxnId || undefined,
    } as Member));
  } catch (error) {
    console.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function updateMemberStatusAction(id: string, status: Member["status"]): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  try {
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };

    if (status === "active") {
      const now = new Date();
      updateData.joinedDate = now;
      const expiry = new Date(now);
      expiry.setFullYear(now.getFullYear() + 1);
      updateData.expiryDate = expiry;
      updateData.renewalStatus = null;
      updateData.renewalBkashSender = null;
      updateData.renewalBkashTxnId = null;
    }

    await prisma.member.update({
      where: { id },
      data: updateData,
    });
    return true;
  } catch (error) {
    console.error("Error in updateMemberStatusAction:", error);
    return false;
  }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";

export async function updateMemberProfileAction(
  id: string,
  nameOrUpdates: string | Partial<Pick<Member, "name" | "phone" | "email" | "address" | "birthDate" | "profession" | "profilePictureUrl">>,
  phone?: string,
  email?: string,
  address?: string,
  birthDate?: string,
  profession?: string,
  profilePictureUrl?: string
): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || (session.userId !== id && session.role !== "admin")) return false;

  const updates = typeof nameOrUpdates === "object"
    ? nameOrUpdates
    : {
        name: nameOrUpdates,
        phone,
        email,
        address,
        birthDate,
        profession,
        profilePictureUrl,
      };

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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    console.warn("Unauthorized attempt to update member");
    return false;
  }
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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    console.warn("Unauthorized attempt to delete member");
    return false;
  }
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

export async function approveMemberRenewalAction(memberId: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    console.warn("Unauthorized attempt to approve renewal");
    return false;
  }

  try {
    // Only fetch the single column needed to compute the new expiry date
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { expiryDate: true },
    });

    if (!member) return false;

    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
    const newExpiry = new Date(baseDate);
    newExpiry.setFullYear(baseDate.getFullYear() + 1);

    await prisma.member.update({
      where: { id: memberId },
      data: {
        renewalStatus: "none",
        renewalBkashSender: null,
        renewalBkashTxnId: null,
        status: "active",
        expiryDate: newExpiry,
      }
    });

    return true;
  } catch (error) {
    console.error("Error in approveMemberRenewalAction:", error);
    return false;
  }
}

export async function rejectMemberRenewalAction(memberId: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    console.warn("Unauthorized attempt to reject renewal");
    return false;
  }

  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        renewalStatus: "none",
        renewalBkashSender: null,
        renewalBkashTxnId: null,
      }
    });
    return true;
  } catch (error) {
    console.error("Error in rejectMemberRenewalAction:", error);
    return false;
  }
}
