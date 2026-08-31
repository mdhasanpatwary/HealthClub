import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { AdminRole } from "@/services/db";

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET is not configured in production environment variables.");
    }
    logger.warn("⚠️ [SECURITY WARNING] SESSION_SECRET is not set in .env. Please configure a 32+ byte secret key.");
    return new TextEncoder().encode("health-club-dev-only-ephemeral-secret-32-chars!!");
  }
  return new TextEncoder().encode(secret);
}

const encodedKey = getSessionSecret();

export interface SessionPayload {
  userId: string;
  role: "user" | "admin" | "partner" | "partner_staff";
  adminRole?: AdminRole;
  adminName?: string;
  adminEmail?: string;
  staffId?: string;
  staffName?: string;
  deskName?: string;
  staffRole?: "cashier" | "manager";
  partnerId?: string;
  staffUpdatedAt?: number;
  expiresAt: Date;
}

/**
 * Encrypts the session payload into a signed JWT.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypts and verifies a JWT session token.
 */
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      role: payload.role as "user" | "admin" | "partner" | "partner_staff",
      adminRole: payload.adminRole as AdminRole | undefined,
      adminName: payload.adminName as string | undefined,
      adminEmail: payload.adminEmail as string | undefined,
      staffId: payload.staffId as string | undefined,
      staffName: payload.staffName as string | undefined,
      deskName: payload.deskName as string | undefined,
      staffRole: payload.staffRole as ("cashier" | "manager") | undefined,
      partnerId: payload.partnerId as string | undefined,
      staffUpdatedAt: typeof payload.staffUpdatedAt === "number" ? payload.staffUpdatedAt : undefined,
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch {
    return null;
  }
}

/**
 * Validates that an active partner staff account is still enabled, exists, and
 * has not had their status deactivated or password reset after token issuance.
 */
async function verifyActivePartnerStaff(
  staffId: string,
  tokenStaffUpdatedAt?: number
): Promise<boolean> {
  try {
    const { prisma } = await import("@/lib/prisma");
    const staff = await prisma.partnerStaff.findUnique({
      where: { id: staffId },
      select: { id: true, isActive: true, updatedAt: true },
    });

    if (!staff || !staff.isActive) {
      return false;
    }

    if (tokenStaffUpdatedAt) {
      const dbUpdatedAt = staff.updatedAt.getTime();
      // Allow 1000ms clock skew / tolerance for token generation precision
      if (dbUpdatedAt > tokenStaffUpdatedAt + 1000) {
        return false;
      }
    }

    return true;
  } catch (error) {
    logger.error("[AUTH] Error verifying active partner staff session:", error);
    return false;
  }
}

/**
 * Creates a secure HttpOnly cookie session for the logged-in user.
 */
export async function setSessionUser(
  userId: string,
  role: "user" | "admin" | "partner" | "partner_staff" = "user",
  metadata?: {
    adminRole?: AdminRole;
    adminName?: string;
    adminEmail?: string;
    staffId?: string;
    staffName?: string;
    deskName?: string;
    staffRole?: "cashier" | "manager";
    partnerId?: string;
    staffUpdatedAt?: number;
  }
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
  const session = await encrypt({
    userId,
    role,
    ...metadata,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Retrieves and verifies the current session from cookies.
 * Returns the decrypted session payload, or null if invalid/missing/revoked.
 */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);
  if (!session) return null;

  // Immediate session invalidation for partner staff if deactivated or password reset
  if (session.role === "partner_staff" && session.staffId) {
    const isValid = await verifyActivePartnerStaff(session.staffId, session.staffUpdatedAt);
    if (!isValid) {
      logger.warn(`[AUTH] Revoking invalid/deactivated partner_staff session for staffId: ${session.staffId}`);
      try {
        cookieStore.delete("session");
      } catch {
        // Readonly in RSC render pass
      }
      return null;
    }
  }

  return session;
}

/**
 * Clears the session cookie, effectively logging out the user.
 */
export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
