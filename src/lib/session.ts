import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

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
  staffId?: string;
  staffName?: string;
  deskName?: string;
  partnerId?: string;
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
      staffId: payload.staffId as string | undefined,
      staffName: payload.staffName as string | undefined,
      deskName: payload.deskName as string | undefined,
      partnerId: payload.partnerId as string | undefined,
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch {
    return null;
  }
}

/**
 * Creates a secure HttpOnly cookie session for the logged-in user.
 */
export async function setSessionUser(
  userId: string,
  role: "user" | "admin" | "partner" | "partner_staff" = "user",
  metadata?: {
    staffId?: string;
    staffName?: string;
    deskName?: string;
    partnerId?: string;
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
 * Returns the decrypted session payload, or null if invalid/missing.
 */
export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  return decrypt(sessionCookie);
}

/**
 * Clears the session cookie, effectively logging out the user.
 */
export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
