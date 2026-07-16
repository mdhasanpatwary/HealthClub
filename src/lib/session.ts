import { cookies } from "next/headers";

/**
 * Sets secure HttpOnly cookies for the logged-in user session.
 */
export async function setSessionUser(userId: string, role: "user" | "admin" = "user") {
  const cookieStore = await cookies();
  cookieStore.set("session_user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  cookieStore.set("session_role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

/**
 * Retrieves the current session user details from cookies.
 */
export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_user_id")?.value;
  const role = cookieStore.get("session_role")?.value;
  return { userId, role };
}

/**
 * Clears the session cookies, effectively logging out the user.
 */
export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user_id");
  cookieStore.delete("session_role");
}
