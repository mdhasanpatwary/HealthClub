import { verifyAdmin } from "@/lib/dal";

/**
 * Admin layout — server-side auth guard.
 * verifyAdmin() reads the JWT cookie and redirects to /dashboard
 * if the session is missing or not role=admin. This runs on every
 * request before the admin page renders, preventing any client-side
 * localStorage manipulation from accessing admin UI.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyAdmin();
  return <>{children}</>;
}
