import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorRedirectPage({ params }: PageProps) {
  const { id } = await params;
  permanentRedirect(`/consultants/${id}`);
}
