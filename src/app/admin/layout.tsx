import { verifyAdmin } from "@/lib/dal";
import { AdminNav } from "./components/AdminNav";

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

  return (
    <div className="bg-muted/30 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}

