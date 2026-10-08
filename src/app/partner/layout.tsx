import type { Metadata } from "next";
import { getSessionUser } from "@/lib/session";
import { PartnerImpersonationBanner } from "@/components/partner/PartnerImpersonationBanner";

export const metadata: Metadata = {
  title: "Partner Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  const isImpersonating = Boolean(session?.impersonatorAdminId);

  return (
    <>
      {isImpersonating && (
        <PartnerImpersonationBanner
          adminName={session?.impersonatorAdminName || "সুপার অ্যাডমিন"}
        />
      )}
      {children}
    </>
  );
}
