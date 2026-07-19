"use server";

import { prisma } from "@/lib/prisma";
import { Member } from "@/services/db";
import { getSessionUser } from "@/lib/session";

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

export async function getMembersAction(): Promise<Member[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return [];
  try {
    const data = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });

    return data.map((m) => stripSensitive({
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
    }));
  } catch (error) {
    console.error("Error in getMembersAction:", error);
    return [];
  }
}

export async function updateMemberStatusAction(id: string, status: Member["status"]): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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
  const session = await getSessionUser();
  if (!session || (session.userId !== id && session.role !== "admin")) throw new Error("Unauthorized");
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
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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
  if (!session || session.role !== "admin") throw new Error("Unauthorized");
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
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId }
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
  if (!session || session.role !== "admin") throw new Error("Unauthorized");

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
