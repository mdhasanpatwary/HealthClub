"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { PaginatedResult } from "@/types/pagination";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  createdAt: string; // ISO string for safe serialization
}

export interface GetPaginatedContactMessagesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getPaginatedContactMessagesAction(
  params?: GetPaginatedContactMessagesParams
): Promise<PaginatedResult<ContactMessage>> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: params?.pageSize || 10,
    };
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const search = params?.search?.trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [totalItems, data] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const messages: ContactMessage[] = data.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));

    return {
      data: messages,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      currentPage: page,
      pageSize,
    };
  } catch (error) {
    logger.error("Error in getPaginatedContactMessagesAction:", error);
    return { data: [], totalItems: 0, totalPages: 1, currentPage: 1, pageSize };
  }
}


/**
 * Adds a new contact message. Accessible by anyone (public).
 */
export async function addContactMessageAction(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.name || !data.phone || !data.message) {
      return { success: false, error: "Name, phone, and message are required." };
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
      },
    });

    return { success: true };
  } catch (error) {
    logger.error("Error in addContactMessageAction:", error);
    return { success: false, error: "Failed to send message." };
  }
}

/**
 * Retrieves all contact messages. Admin only.
 */
export async function getContactMessagesAction(): Promise<ContactMessage[]> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return [];
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return messages.map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    logger.error("Error in getContactMessagesAction:", error);
    return [];
  }
}

/**
 * Deletes a contact message by ID. Admin only.
 */
export async function deleteContactMessageAction(id: string): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return false;
  }

  try {
    await prisma.contactMessage.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    logger.error("Error in deleteContactMessageAction:", error);
    return false;
  }
}
