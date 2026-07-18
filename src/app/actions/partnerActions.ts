"use server";

import { prisma } from "@/lib/prisma";
import { Partner } from "@/services/db";
import { getSessionUser } from "@/lib/session";

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
