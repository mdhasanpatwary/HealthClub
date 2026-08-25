import { permanentRedirect } from "next/navigation";

export default function DoctorsPage() {
  permanentRedirect("/consultants");
}
