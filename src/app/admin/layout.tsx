import { verifyAdmin } from "@/lib/dal";

/**
 * Admin layout — server-side auth guard.
 * verifyAdmin() reads the JWT cookie and redirects to /login/admin
 * if unauthenticated, or to /dashboard if role is not admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyAdmin();

  return (
    <div className="bg-muted/30 min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

