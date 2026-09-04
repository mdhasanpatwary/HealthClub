import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

const PENDING_REG_COOKIE_NAME = "hc_pending_registration";
const PENDING_REG_EXPIRY_SECONDS = 15 * 60; // 15 minutes

function getPendingRegSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET is not configured in production.");
    }
    return new TextEncoder().encode("health-club-dev-pending-reg-secret-32-chars!!");
  }
  return new TextEncoder().encode(`pending_reg:${secret}`);
}

const pendingRegKey = getPendingRegSecret();

export interface PendingRegistrationData {
  name: string;
  phone: string;
  email: string;
  hashedPassword: string;
  tier: "founding" | "premium";
  address?: string;
  birthDate?: string;
  profession?: string;
  profilePictureUrl?: string;
}

export interface PendingRegistrationTokenPayload extends PendingRegistrationData {
  otpCode: string;
  attempts: number;
  expiresAt: string;
}

/**
 * Encrypts and signs the pending registration payload into a JWT.
 */
async function signPendingRegistrationToken(
  data: PendingRegistrationData,
  otpCode: string,
  attempts = 0
): Promise<string> {
  const expiresAt = new Date(Date.now() + PENDING_REG_EXPIRY_SECONDS * 1000);

  // Strip large profilePictureUrl (base64 data URLs) so JWT stays ~500 bytes, well under the 4096-byte browser cookie limit
  const safeData = { ...data };
  if (safeData.profilePictureUrl && (safeData.profilePictureUrl.startsWith("data:") || safeData.profilePictureUrl.length > 500)) {
    delete safeData.profilePictureUrl;
  }

  return new SignJWT({
    ...safeData,
    otpCode,
    attempts,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${PENDING_REG_EXPIRY_SECONDS}s`)
    .sign(pendingRegKey);
}

/**
 * Decrypts and verifies the pending registration JWT token.
 */
async function verifyPendingRegistrationToken(token: string): Promise<PendingRegistrationTokenPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, pendingRegKey, {
      algorithms: ["HS256"],
    });
    return {
      name: payload.name as string,
      phone: payload.phone as string,
      email: payload.email as string,
      hashedPassword: payload.hashedPassword as string,
      tier: payload.tier as "founding" | "premium",
      address: payload.address as string | undefined,
      birthDate: payload.birthDate as string | undefined,
      profession: payload.profession as string | undefined,
      profilePictureUrl: payload.profilePictureUrl as string | undefined,
      otpCode: payload.otpCode as string,
      attempts: typeof payload.attempts === "number" ? payload.attempts : 0,
      expiresAt: payload.expiresAt as string,
    };
  } catch (err) {
    logger.warn("[PENDING REG] Invalid or expired pending registration token:", err);
    return null;
  }
}

/**
 * Stores a pending registration in a secure HttpOnly cookie.
 */
export async function setPendingRegistration(data: PendingRegistrationData, otpCode: string): Promise<void> {
  const token = await signPendingRegistrationToken(data, otpCode, 0);
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + PENDING_REG_EXPIRY_SECONDS * 1000);

  cookieStore.set(PENDING_REG_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_REG_EXPIRY_SECONDS,
    expires,
    path: "/",
  });
}

/**
 * Retrieves the active pending registration from the cookie.
 */
export async function getPendingRegistration(): Promise<PendingRegistrationTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PENDING_REG_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyPendingRegistrationToken(token);
}

/**
 * Updates the verification attempts counter for the active pending registration.
 */
export async function updatePendingRegistrationAttempts(
  current: PendingRegistrationTokenPayload,
  attempts: number
): Promise<void> {
  const token = await signPendingRegistrationToken(
    {
      name: current.name,
      phone: current.phone,
      email: current.email,
      hashedPassword: current.hashedPassword,
      tier: current.tier,
      address: current.address,
      birthDate: current.birthDate,
      profession: current.profession,
      profilePictureUrl: current.profilePictureUrl,
    },
    current.otpCode,
    attempts
  );

  const cookieStore = await cookies();
  const expires = new Date(current.expiresAt);

  cookieStore.set(PENDING_REG_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_REG_EXPIRY_SECONDS,
    expires,
    path: "/",
  });
}

/**
 * Generates and stores a new OTP for the active pending registration (resend OTP).
 */
export async function updatePendingRegistrationOtp(
  current: PendingRegistrationTokenPayload,
  newOtpCode: string
): Promise<void> {
  const token = await signPendingRegistrationToken(
    {
      name: current.name,
      phone: current.phone,
      email: current.email,
      hashedPassword: current.hashedPassword,
      tier: current.tier,
      address: current.address,
      birthDate: current.birthDate,
      profession: current.profession,
      profilePictureUrl: current.profilePictureUrl,
    },
    newOtpCode,
    0
  );

  const cookieStore = await cookies();
  const expires = new Date(Date.now() + PENDING_REG_EXPIRY_SECONDS * 1000);

  cookieStore.set(PENDING_REG_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PENDING_REG_EXPIRY_SECONDS,
    expires,
    path: "/",
  });
}

/**
 * Clears the pending registration cookie once verified or discarded.
 */
export async function clearPendingRegistration(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_REG_COOKIE_NAME);
}
