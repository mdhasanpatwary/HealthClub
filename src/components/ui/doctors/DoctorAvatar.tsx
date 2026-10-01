import Image from "next/image";
import { Stethoscope } from "lucide-react";

interface DoctorAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function DoctorAvatar({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 64px, 72px",
}: DoctorAvatarProps) {
  const hasValidImage = Boolean(src && src.trim().length > 0);

  return (
    <div
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center ${className}`}
    >
      {hasValidImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          unoptimized={Boolean(typeof src === "string" && src.startsWith("data:"))}
          className="object-cover object-top"
        />
      ) : (
        <Stethoscope className="h-1/2 w-1/2 text-primary/60" />
      )}
    </div>
  );
}
