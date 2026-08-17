"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  createdAt: string; // ISO string for safe serialization
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
    console.error("Error in addContactMessageAction:", error);
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
    console.error("Error in getContactMessagesAction:", error);
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
    console.error("Error in deleteContactMessageAction:", error);
    return false;
  }
}
