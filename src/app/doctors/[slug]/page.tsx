import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DoctorRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/consultants/${slug}`);
}
