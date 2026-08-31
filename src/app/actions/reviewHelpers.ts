import { z } from "zod";
import { Review, ReviewStatus, PartnerReviewStats } from "@/services/db";

export const submitReviewSchema = z.object({
  partnerId: z.string().min(1, "Partner ID is required"),
  rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(1000, "Review comment cannot exceed 1000 characters").optional().nullable(),
});

export interface ReviewWithRelations {
  id: string;
  memberId: string;
  partnerId: string;
  rating: number;
  comment: string | null;
  status: string;
  adminFeedback: string | null;
  createdAt: Date;
  updatedAt: Date;
  member?: { id: string; name: string; tier: string; phone?: string; profilePictureUrl: string | null } | null;
  partner?: { id: string; name: string; category: string } | null;
}

export function serializeReview(r: ReviewWithRelations): Review {
  return {
    id: r.id,
    memberId: r.memberId,
    partnerId: r.partnerId,
    rating: r.rating,
    comment: r.comment,
    status: r.status as ReviewStatus,
    adminFeedback: r.adminFeedback,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    member: r.member
      ? { id: r.member.id, name: r.member.name, tier: r.member.tier, phone: r.member.phone, profilePictureUrl: r.member.profilePictureUrl }
      : undefined,
    partner: r.partner ? { id: r.partner.id, name: r.partner.name, category: r.partner.category } : undefined,
  };
}

export type ReviewEligibilityReason =
  | "NOT_LOGGED_IN"
  | "LOGGED_IN_AS_ADMIN"
  | "INACTIVE_MEMBERSHIP"
  | "NO_TRANSACTION"
  | "ELIGIBLE";

export interface ReviewEligibilityResult {
  canReview: boolean;
  reason: ReviewEligibilityReason;
  hasReviewed: boolean;
  existingReview?: Review | null;
  member?: {
    id: string;
    name: string;
    tier: string;
  };
}

export interface GetPartnerReviewsOptions {
  page?: number;
  pageSize?: number;
  rating?: number | null;
}

export interface GetPartnerReviewsResult {
  success: boolean;
  reviews: Review[];
  stats: PartnerReviewStats;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}
