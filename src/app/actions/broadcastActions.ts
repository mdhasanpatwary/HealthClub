"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { sendBroadcastEmail, sendBulkBroadcastEmails } from "@/lib/mail";
import { sendSms, sendBulkSms } from "@/lib/sms";
import { INITIAL_BLOOD_DONORS, BloodDonor } from "@/data/emergencyData";
import { hasAdminPermission } from "@/lib/permissions";

export type BroadcastAudienceType =
  | "all_members"
  | "active_members"
  | "inactive_members"
  | "blood_donors"
  | "partners"
  | "all_users";

export type BroadcastChannel = "email" | "sms" | "in_app";

export interface BroadcastAudienceCounts {
  allMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  bloodDonors: number;
  partners: number;
  totalUniqueUsers: number;
}

export interface SendBroadcastCampaignInput {
  title: string;
  subject?: string;
  message: string;
  audience: BroadcastAudienceType;
  channels: BroadcastChannel[];
  badge?: string;
  actionUrl?: string;
  actionText?: string;
  isTestMode?: boolean;
  testEmail?: string;
  testPhone?: string;
}

export interface BroadcastCampaignRecord {
  id: string;
  title: string;
  subject: string;
  message: string;
  audience: BroadcastAudienceType;
  channels: BroadcastChannel[];
  badge?: string;
  actionUrl?: string;
  actionText?: string;
  recipientCount: number;
  emailSentCount: number;
  smsSentCount: number;
  inAppSentCount: number;
  status: "completed" | "partial" | "failed" | "test";
  createdAt: string;
  sentBy: string;
}

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") return false;
  const role = session.adminRole || "super_admin";
  return hasAdminPermission(role, "send_broadcast");
}

/**
 * Loads emergency donors from relational table or falls back to initial list.
 */
async function getBloodDonorsList(): Promise<BloodDonor[]> {
  try {
    const rows = await prisma.bloodDonor.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        bloodGroup: r.bloodGroup as BloodDonor["bloodGroup"],
        upazila: r.upazila,
        phone: r.phone,
        lastDonated: r.lastDonated,
        isAvailable: r.isAvailable,
        status: r.status as BloodDonor["status"],
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    logger.error("Error reading emergency donors for broadcast:", err);
  }
  return INITIAL_BLOOD_DONORS;
}

/**
 * Fetches real-time counts for audience segmentation.
 */
export async function getBroadcastAudienceCountsAction(): Promise<BroadcastAudienceCounts> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return {
      allMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      bloodDonors: 0,
      partners: 0,
      totalUniqueUsers: 0,
    };
  }

  try {
    const [allMembersCount, activeMembersCount, partnersCount] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: "active" } }),
      prisma.partner.count(),
    ]);

    const donors = await getBloodDonorsList();
    const inactiveMembersCount = Math.max(0, allMembersCount - activeMembersCount);
    const totalUniqueUsers = allMembersCount + partnersCount + donors.length;

    return {
      allMembers: allMembersCount,
      activeMembers: activeMembersCount,
      inactiveMembers: inactiveMembersCount,
      bloodDonors: donors.length,
      partners: partnersCount,
      totalUniqueUsers,
    };
  } catch (error) {
    logger.error("Error fetching broadcast audience counts:", error);
    return {
      allMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      bloodDonors: 0,
      partners: 0,
      totalUniqueUsers: 0,
    };
  }
}

/**
 * Retrieves past broadcast campaigns from system_settings.
 */
export async function getBroadcastCampaignsAction(): Promise<BroadcastCampaignRecord[]> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return [];

  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "broadcast_campaigns" },
    });

    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch (error) {
    logger.error("Error reading broadcast campaigns:", error);
    return [];
  }
}

/**
 * Sends a broadcast campaign to the chosen audience across selected channels.
 */
export async function sendBroadcastCampaignAction(
  input: SendBroadcastCampaignInput
): Promise<{ success: boolean; message: string; campaign?: BroadcastCampaignRecord }> {
  const session = await getSessionUser();
  if (
    !session ||
    session.role !== "admin" ||
    !hasAdminPermission(session.adminRole || "super_admin", "send_broadcast")
  ) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস। ব্রডকাস্ট পাঠানোর অনুমতি আপনার নেই।" };
  }

  if (!input.title.trim() || !input.message.trim()) {
    return { success: false, message: "শিরোনাম ও বার্তার বিবরণ প্রদান করা আবশ্যক।" };
  }

  if (!input.channels || input.channels.length === 0) {
    return { success: false, message: "কমপক্ষে একটি প্রেরণের মাধ্যম (ইমেইল, এসএমএস বা অ্যাপ বিজ্ঞপ্তি) নির্বাচন করুন।" };
  }

  const subject = input.subject?.trim() || input.title.trim();
  const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Handle Test Mode
  if (input.isTestMode) {
    let emailSent = false;
    let smsSent = false;

    if (input.channels.includes("email")) {
      const targetEmail = input.testEmail || process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";
      emailSent = await sendBroadcastEmail({
        to: targetEmail,
        recipientName: "এডমিন (টেস্ট)",
        subject: `[TEST] ${subject}`,
        title: input.title,
        message: input.message,
        badge: input.badge || "টেস্ট নোটিশ",
        actionUrl: input.actionUrl,
        actionText: input.actionText,
      });
    }

    if (input.channels.includes("sms")) {
      const targetPhone = input.testPhone || "01886763849";
      const smsRes = await sendSms(targetPhone, `${input.title}\n\n${input.message}`);
      smsSent = smsRes.success;
    }

    return {
      success: true,
      message: `টেস্ট বার্তা সফলভাবে পাঠানো হয়েছে (ইমেইল: ${emailSent ? "সফল" : "বাদ/ব্যর্থ"}, এসএমএস: ${
        smsSent ? "সফল" : "বাদ/ব্যর্থ"
      })।`,
    };
  }

  // 2. Resolve Recipients
  interface Recipient {
    id: string;
    name: string;
    email?: string | null;
    phone: string;
    type: "member" | "partner" | "donor";
  }

  const recipients: Recipient[] = [];

  try {
    if (
      input.audience === "all_members" ||
      input.audience === "active_members" ||
      input.audience === "inactive_members" ||
      input.audience === "all_users"
    ) {
      const whereClause =
        input.audience === "active_members"
          ? { status: "active" }
          : input.audience === "inactive_members"
          ? { status: { not: "active" } }
          : {};

      const members = await prisma.member.findMany({
        where: whereClause,
        select: { id: true, name: true, email: true, phone: true },
      });

      members.forEach((m) => {
        recipients.push({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          type: "member",
        });
      });
    }

    if (input.audience === "partners" || input.audience === "all_users") {
      const partners = await prisma.partner.findMany({
        select: { id: true, name: true, email: true, phone: true },
      });

      partners.forEach((p) => {
        recipients.push({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          type: "partner",
        });
      });
    }

    if (input.audience === "blood_donors" || input.audience === "all_users") {
      const donors = await getBloodDonorsList();
      donors.forEach((d) => {
        recipients.push({
          id: d.id,
          name: d.name,
          email: null,
          phone: d.phone,
          type: "donor",
        });
      });
    }

    // Deduplicate by phone
    const seenPhones = new Set<string>();
    const uniqueRecipients: Recipient[] = [];
    for (const r of recipients) {
      if (!seenPhones.has(r.phone)) {
        seenPhones.add(r.phone);
        uniqueRecipients.push(r);
      }
    }

    let emailSentCount = 0;
    let smsSentCount = 0;
    let inAppSentCount = 0;

    // 3. Dispatch Email Channel
    if (input.channels.includes("email")) {
      const emailRecipients = uniqueRecipients
        .filter((r) => r.email && r.email.includes("@"))
        .map((r) => ({ email: r.email as string, name: r.name }));

      if (emailRecipients.length > 0) {
        const emailResult = await sendBulkBroadcastEmails(emailRecipients, {
          subject,
          title: input.title,
          message: input.message,
          badge: input.badge,
          actionUrl: input.actionUrl,
          actionText: input.actionText,
        });
        emailSentCount = emailResult.sent;
      }
    }

    // 4. Dispatch SMS Channel
    if (input.channels.includes("sms")) {
      const phones = uniqueRecipients.map((r) => r.phone).filter(Boolean);
      if (phones.length > 0) {
        const smsText = `${input.title}\n\n${input.message}${input.actionUrl ? `\nবিস্তারিত: ${input.actionUrl}` : ""}`;
        const smsResult = await sendBulkSms(phones, smsText);
        smsSentCount = smsResult.sent;
      }
    }

    // 5. Dispatch In-App Member Notifications
    if (input.channels.includes("in_app")) {
      const memberRecipients = uniqueRecipients.filter((r) => r.type === "member");
      if (memberRecipients.length > 0) {
        const notifData = memberRecipients.map((m) => ({
          id: `notif_${crypto.randomUUID()}`,
          memberId: m.id,
          type: "system",
          titleBn: input.title,
          titleEn: input.subject || input.title,
          messageBn: input.message,
          messageEn: input.message,
          link: input.actionUrl || "/dashboard",
          isRead: false,
        }));

        const result = await prisma.memberNotification.createMany({
          data: notifData,
          skipDuplicates: true,
        });
        inAppSentCount = result.count;
      }
    }

    // 6. Record Campaign in System Settings
    const campaignRecord: BroadcastCampaignRecord = {
      id: campaignId,
      title: input.title,
      subject,
      message: input.message,
      audience: input.audience,
      channels: input.channels,
      badge: input.badge,
      actionUrl: input.actionUrl,
      actionText: input.actionText,
      recipientCount: uniqueRecipients.length,
      emailSentCount,
      smsSentCount,
      inAppSentCount,
      status: "completed",
      createdAt: new Date().toISOString(),
      sentBy: session.userId || "Admin",
    };

    const existingCampaigns = await getBroadcastCampaignsAction();
    const updatedCampaigns = [campaignRecord, ...existingCampaigns].slice(0, 50); // Keep last 50

    await prisma.systemSetting.upsert({
      where: { key: "broadcast_campaigns" },
      create: { key: "broadcast_campaigns", value: JSON.stringify(updatedCampaigns) },
      update: { value: JSON.stringify(updatedCampaigns) },
    });

    revalidatePath("/admin/broadcast");
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `ক্যাম্পেইন সফলভাবে সম্প্রচার করা হয়েছে! (${uniqueRecipients.length} জন প্রাপক, ইমেইল: ${emailSentCount}, এসএমএস: ${smsSentCount}, ইন-অ্যাপ: ${inAppSentCount})`,
      campaign: campaignRecord,
    };
  } catch (error) {
    logger.error("Error executing broadcast campaign:", error);
    return {
      success: false,
      message: "ক্যাম্পেইন সম্প্রচার করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}

/**
 * Deletes a campaign from campaign history.
 */
export async function deleteBroadcastCampaignAction(
  campaignId: string
): Promise<{ success: boolean; message: string }> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
  }

  try {
    const campaigns = await getBroadcastCampaignsAction();
    const updated = campaigns.filter((c) => c.id !== campaignId);

    await prisma.systemSetting.upsert({
      where: { key: "broadcast_campaigns" },
      create: { key: "broadcast_campaigns", value: JSON.stringify(updated) },
      update: { value: JSON.stringify(updated) },
    });

    revalidatePath("/admin/broadcast");
    return { success: true, message: "ক্যাম্পেইন রেকর্ড সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error) {
    logger.error("Error deleting broadcast campaign:", error);
    return { success: false, message: "ক্যাম্পেইন রেকর্ড মুছতে সমস্যা হয়েছে।" };
  }
}
