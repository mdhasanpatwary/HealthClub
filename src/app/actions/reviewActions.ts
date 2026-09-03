"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { logger } from "@/lib/logger";
import { Review, AdminReviewSummary } from "@/services/db";
import { updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  submitReviewSchema,
  serializeReview,
  canAdminManageReviews,
} from "./reviewHelpers";
import type {
  ReviewWithRelations,
  ReviewEligibilityResult,
  GetPartnerReviewsOptions,
  GetPartnerReviewsResult,
} from "./reviewHelpers";

const PARTNERS_TAG = "partners";

function revalidatePartnerReviewCache(partnerId?: string | null) {
  try {
    updateTag(PARTNERS_TAG);
    updateTag("homepage-partners");
    updateTag("admin-stats");
    revalidateTag(PARTNERS_TAG, "max");
    revalidatePath("/partner-hospitals");
    if (partnerId) revalidatePath(`/partner-hospitals/${partnerId}`);
    revalidatePath("/admin/reviews");
    revalidatePath("/admin/partners");
  } catch (err) {
    logger.warn("Cache revalidation failed in reviewActions:", err);
  }
}

export async function canMemberReviewPartnerAction(
  partnerId: string
): Promise<ReviewEligibilityResult> {
  try {
    const session = await getSessionUser();
    if (!session?.userId) {
      return { canReview: false, reason: "NOT_LOGGED_IN", hasReviewed: false };
    }

    if (session.role === "admin") {
      const adminEmail = session.adminEmail || process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";
      const adminMember = await prisma.member.findFirst({
        where: {
          OR: [{ id: session.userId }, { email: adminEmail }],
        },
      });

      if (!adminMember) {
        return {
          canReview: false,
          reason: "LOGGED_IN_AS_ADMIN",
          hasReviewed: false,
          existingReview: null,
          member: { id: session.userId, name: session.adminName || "Super Admin", tier: "founding" },
        };
      }

      const existingReview = await prisma.review.findFirst({
        where: { memberId: adminMember.id, partnerId },
        include: {
          member: { select: { id: true, name: true, tier: true, profilePictureUrl: true } },
          partner: { select: { id: true, name: true, category: true } },
        },
      });

      return {
        canReview: true,
        reason: "LOGGED_IN_AS_ADMIN",
        hasReviewed: !!existingReview,
        existingReview: existingReview ? serializeReview(existingReview) : null,
        member: { id: adminMember.id, name: adminMember.name || session.adminName || "Super Admin", tier: adminMember.tier || "founding" },
      };
    }

    if (session.role !== "user") {
      return { canReview: false, reason: "NOT_LOGGED_IN", hasReviewed: false };
    }

    const member = await prisma.member.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, tier: true, status: true },
    });

    if (!member || member.status !== "active") {
      return { canReview: false, reason: "INACTIVE_MEMBERSHIP", hasReviewed: false };
    }

    const transaction = await prisma.transaction.findFirst({
      where: { memberId: member.id, partnerId },
      select: { id: true },
    });

    if (!transaction) {
      return {
        canReview: false,
        reason: "NO_TRANSACTION",
        hasReviewed: false,
        member: { id: member.id, name: member.name, tier: member.tier },
      };
    }

    const existingReview = await prisma.review.findFirst({
      where: { memberId: member.id, partnerId },
      include: {
        member: { select: { id: true, name: true, tier: true, profilePictureUrl: true } },
        partner: { select: { id: true, name: true, category: true } },
      },
    });

    return {
      canReview: true,
      reason: "ELIGIBLE",
      hasReviewed: !!existingReview,
      existingReview: existingReview ? serializeReview(existingReview) : null,
      member: { id: member.id, name: member.name, tier: member.tier },
    };
  } catch (error) {
    logger.error("Error checking review eligibility:", error);
    return { canReview: false, reason: "NOT_LOGGED_IN", hasReviewed: false };
  }
}

export async function submitReviewAction(
  rawInput: { partnerId: string; rating: number; comment?: string | null }
): Promise<{ success: boolean; review?: Review; message: string; error?: string }> {
  try {
    const validated = submitReviewSchema.safeParse(rawInput);
    if (!validated.success) {
      return { success: false, error: "VALIDATION_ERROR", message: validated.error.issues[0]?.message || "তথ্য সঠিক নয়।" };
    }

    const { partnerId, rating, comment } = validated.data;
    const session = await getSessionUser();
    if (!session?.userId) {
      return { success: false, error: "UNAUTHORIZED", message: "রিভিউ দিতে মেম্বার একাউন্টে লগইন করুন।" };
    }

    let memberIdToUse: string;

    if (session.role === "admin") {
      const adminEmail = session.adminEmail || process.env.ADMIN_EMAIL || "healthclubfeni@gmail.com";
      const adminMember = await prisma.member.findFirst({
        where: {
          OR: [{ id: session.userId }, { email: adminEmail }],
        },
      });
      if (!adminMember) {
        return {
          success: false,
          error: "NO_MEMBER",
          message: "রিভিউ প্রদানের জন্য এডমিন অ্যাকাউন্টের সাথে যুক্ত মেম্বার প্রোফাইল প্রয়োজন।",
        };
      }
      memberIdToUse = adminMember.id;
    } else if (session.role === "user") {
      const member = await prisma.member.findUnique({
        where: { id: session.userId },
        select: { id: true, status: true },
      });
      if (!member || member.status !== "active") {
        return { success: false, error: "FORBIDDEN", message: "শুধুমাত্র একটিভ মেম্বারগণ রিভিউ প্রদান করতে পারবেন।" };
      }
      const transaction = await prisma.transaction.findFirst({
        where: { memberId: member.id, partnerId },
        select: { id: true },
      });
      if (!transaction) {
        return { success: false, error: "NO_TRANSACTION", message: "এই প্রতিষ্ঠানে সেবা বা ডিসকাউন্ট গ্রহণের পর রিভিউ দেওয়া যাবে।" };
      }
      memberIdToUse = member.id;
    } else {
      return { success: false, error: "UNAUTHORIZED", message: "রিভিউ দিতে মেম্বার একাউন্টে লগইন করুন।" };
    }

    const existing = await prisma.review.findFirst({
      where: { memberId: memberIdToUse, partnerId },
    });

    let savedReview: ReviewWithRelations;

    if (existing) {
      savedReview = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          comment: comment?.trim() || null,
          status: session.role === "admin" ? "approved" : "pending",
          adminFeedback: session.role === "admin" ? "Admin Verified" : null,
          updatedAt: new Date(),
        },
        include: {
          member: { select: { id: true, name: true, tier: true, profilePictureUrl: true } },
          partner: { select: { id: true, name: true, category: true } },
        },
      });
    } else {
      savedReview = await prisma.review.create({
        data: {
          memberId: memberIdToUse,
          partnerId,
          rating,
          comment: comment?.trim() || null,
          status: session.role === "admin" ? "approved" : "pending",
          adminFeedback: session.role === "admin" ? "Admin Verified" : null,
        },
        include: {
          member: { select: { id: true, name: true, tier: true, profilePictureUrl: true } },
          partner: { select: { id: true, name: true, category: true } },
        },
      });
    }

    revalidatePartnerReviewCache(partnerId);

    return {
      success: true,
      review: serializeReview(savedReview),
      message: session.role === "admin"
        ? "এডমিন রিভিউ সফলভাবে সংরক্ষিত এবং প্রকাশিত হয়েছে।"
        : "আপনার রিভিউ সফলভাবে জমা হয়েছে। এডমিন অনুমোদনের পর এটি প্রকাশিত হবে।",
    };
  } catch (error) {
    logger.error("Error submitting review:", error);
    return { success: false, error: "SERVER_ERROR", message: "রিভিউ জমা দিতে সমস্যা হয়েছে।" };
  }
}

export async function getPartnerReviewsAction(
  partnerId: string,
  options?: GetPartnerReviewsOptions
): Promise<GetPartnerReviewsResult> {
  try {
    const page = Math.max(Number(options?.page || 1), 1);
    const pageSize = Math.max(Number(options?.pageSize || 5), 1);
    const ratingFilter = options?.rating ? Number(options.rating) : undefined;

    const where = {
      partnerId,
      status: "approved",
      ...(ratingFilter ? { rating: ratingFilter } : {}),
    };

    const [filteredCount, rawReviews, allApprovedReviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          member: { select: { id: true, name: true, tier: true, profilePictureUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.findMany({
        where: { partnerId, status: "approved" },
        select: { rating: true },
      }),
    ]);

    const totalApproved = allApprovedReviews.length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;

    for (const r of allApprovedReviews) {
      const star = Math.min(Math.max(r.rating, 1), 5) as 1 | 2 | 3 | 4 | 5;
      distribution[star] = (distribution[star] || 0) + 1;
      ratingSum += r.rating;
    }

    const averageRating = totalApproved > 0 ? Number((ratingSum / totalApproved).toFixed(1)) : 0;
    const totalPages = Math.ceil(filteredCount / pageSize) || 1;

    return {
      success: true,
      reviews: rawReviews.map(serializeReview),
      stats: { averageRating, totalReviews: totalApproved, distribution },
      totalItems: filteredCount,
      totalPages,
      currentPage: page,
      pageSize,
      hasMore: page < totalPages,
    };
  } catch (error) {
    logger.error("Error fetching partner reviews:", error);
    return {
      success: false,
      reviews: [],
      stats: { averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize: 5,
      hasMore: false,
    };
  }
}

export async function getAdminReviewsAction(filters?: {
  status?: string;
  partnerId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{
  success: boolean;
  data: Review[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  summary: AdminReviewSummary;
}> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin" || !canAdminManageReviews(session.adminRole)) {
      throw new Error("UNAUTHORIZED");
    }

    const page = Math.max(Number(filters?.page || 1), 1);
    const pageSize = Math.max(Number(filters?.pageSize || 10), 1);
    const status = filters?.status && filters.status !== "all" ? filters.status : undefined;
    const partnerId = filters?.partnerId && filters.partnerId !== "all" ? filters.partnerId : undefined;
    const search = filters?.search?.trim();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;
    if (partnerId) where.partnerId = partnerId;
    if (search) {
      where.OR = [
        { member: { name: { contains: search, mode: "insensitive" } } },
        { member: { phone: { contains: search, mode: "insensitive" } } },
        { partner: { name: { contains: search, mode: "insensitive" } } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    const [totalItems, rawReviews, allCounts, approvedStats] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        include: {
          member: { select: { id: true, name: true, tier: true, phone: true, profilePictureUrl: true } },
          partner: { select: { id: true, name: true, category: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.review.aggregate({
        where: { status: "approved" },
        _avg: { rating: true },
      }),
    ]);

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let totalCount = 0;

    for (const group of allCounts) {
      totalCount += group._count._all;
      if (group.status === "pending") pendingCount = group._count._all;
      if (group.status === "approved") approvedCount = group._count._all;
      if (group.status === "rejected") rejectedCount = group._count._all;
    }

    const summary: AdminReviewSummary = {
      total: totalCount,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      averageRating: approvedStats._avg.rating ? Number(approvedStats._avg.rating.toFixed(1)) : 0,
    };

    return {
      success: true,
      data: rawReviews.map(serializeReview),
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize) || 1,
      currentPage: page,
      summary,
    };
  } catch (error) {
    logger.error("Error fetching admin reviews:", error);
    return {
      success: false,
      data: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      summary: { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: 0 },
    };
  }
}

export async function moderateReviewAction(
  reviewId: string,
  status: "approved" | "rejected",
  adminFeedback?: string | null
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin" || !canAdminManageReviews(session.adminRole)) {
      return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        status,
        adminFeedback: adminFeedback?.trim() || null,
        updatedAt: new Date(),
      },
      include: {
        member: { select: { id: true, name: true } },
        partner: { select: { id: true, name: true } },
      },
    });

    try {
      await prisma.memberNotification.create({
        data: {
          memberId: review.memberId,
          type: "system",
          titleBn: status === "approved" ? "রিভিউ অনুমোদিত হয়েছে" : "রিভিউ মডারেশন আপডেট",
          titleEn: status === "approved" ? "Review Approved" : "Review Moderation Update",
          messageBn:
            status === "approved"
              ? `${review.partner?.name || "হাসপাতাল"}-এর জন্য আপনার দেওয়া রিভিউটি অনুমোদিত এবং প্রকাশিত হয়েছে।`
              : `${review.partner?.name || "হাসপাতাল"}-এর জন্য দেওয়া রিভিউটি অনুমোদিত হয়নি। ${
                  adminFeedback ? `মন্তব্য: ${adminFeedback}` : ""
                }`,
          messageEn:
            status === "approved"
              ? `Your review for ${review.partner?.name || "partner"} has been approved and published.`
              : `Your review for ${review.partner?.name || "partner"} was not approved. ${
                  adminFeedback ? `Note: ${adminFeedback}` : ""
                }`,
          link: `/partner-hospitals/${review.partnerId}`,
        },
      });
    } catch (notifErr) {
      logger.warn("Could not create member notification for review moderation:", notifErr);
    }

    revalidatePartnerReviewCache(review.partnerId);

    return {
      success: true,
      message: status === "approved" ? "রিভিউ সফলভাবে অনুমোদিত হয়েছে।" : "রিভিউ বাতিল করা হয়েছে।",
    };
  } catch (error) {
    logger.error("Error moderating review:", error);
    return { success: false, message: "রিভিউ মডারেশন করতে সমস্যা হয়েছে।" };
  }
}

export async function deleteReviewAction(
  reviewId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin" || !canAdminManageReviews(session.adminRole)) {
      return { success: false, message: "অননুমোদিত অ্যাক্সেস।" };
    }

    const review = await prisma.review.delete({
      where: { id: reviewId },
      select: { partnerId: true },
    });

    revalidatePartnerReviewCache(review.partnerId);

    return { success: true, message: "রিভিউটি সফলভাবে মুছে ফেলা হয়েছে।" };
  } catch (error) {
    logger.error("Error deleting review:", error);
    return { success: false, message: "রিভিউ মুছে ফেলতে সমস্যা হয়েছে।" };
  }
}
