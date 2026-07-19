import { Member } from "@/services/db";
import { Heart, Star, ShieldCheck, User } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // Determine card styles based on tier
  let bgStyles = "bg-gradient-to-br from-slate-900 via-[#0d1a2d] to-emerald-950 text-white border border-emerald-500/20";
  let badgeText = "Founding Member";
  let badgeIcon = <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />;
  let badgeBg = "bg-amber-400/15 text-amber-300 border border-amber-400/25";
  let accentColor = "from-amber-500/10 to-transparent";

  if (member.tier === "premium") {
    bgStyles = "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/15";
    badgeText = "Premium Member";
    badgeIcon = <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />;
    badgeBg = "bg-emerald-400/15 text-emerald-300 border border-emerald-400/25";
    accentColor = "from-emerald-500/10 to-transparent";
  }

  // Use stored QR code URL from DB if available (avoids external API call on every render).
  // Falls back to qrserver.com only if not yet generated.
  const verificationUrl = `https://healthclub.com.bd/verify/${member.id}`;
  const qrCodeSrc =
    member.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=0f172a&bgcolor=ffffff`;

  const isExpired = new Date(member.expiryDate) < new Date();

  return (
    <div
      className={`relative w-full max-w-md mx-auto rounded-2xl p-5 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[200px] ${bgStyles}`}
    >
      {/* Decorative background elements */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} pointer-events-none`} />
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -inset-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
      </div>

      {/* Header section */}
      <div className="relative flex justify-between items-start z-10">
        <div>
          <span className="flex items-center space-x-1.5 text-primary">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              হেলথ <span className="gradient-text">ক্লাব</span>
            </span>
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5 tracking-widest uppercase font-mono">
            Healthcare Membership Card
          </p>
        </div>

        {/* Tier Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badgeBg} backdrop-blur-sm`}>
          {badgeIcon}
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="relative flex justify-between items-end mt-5 z-10 gap-3">
        <div className="flex items-center gap-3 min-w-0">

          {/* Profile Picture */}
          <div className="h-16 w-16 rounded-xl border border-white/10 bg-slate-800/70 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
            {member.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.profilePictureUrl}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/30 to-emerald-600/20 flex items-center justify-center">
                <User className="h-7 w-7 text-slate-300" />
              </div>
            )}
          </div>

          <div className="space-y-2 min-w-0">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Member Name</p>
              <p className="text-sm font-bold tracking-wide mt-0.5 font-heading text-white line-clamp-1">
                {member.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Member ID</p>
                <p className="text-[11px] font-semibold tracking-wide font-mono text-emerald-400">
                  {member.id}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Status</p>
                {isExpired ? (
                  <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    EXPIRED
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {member.status.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="relative flex flex-col items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-600/20 shadow-lg shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeSrc}
            alt="Membership QR Code"
            width={72}
            height={72}
            className={`w-[70px] h-[70px] select-none rounded-sm transition-all duration-300 ${isExpired ? "blur-md select-none pointer-events-none opacity-40" : ""}`}
            loading="lazy"
          />
          <span className={`text-[7px] font-bold font-mono tracking-widest uppercase ${isExpired ? "text-rose-600" : "text-slate-600"}`}>
            {isExpired ? "EXPIRED" : "SCAN"}
          </span>
        </div>
      </div>

      {/* Footer section with dates */}
      <div className="relative flex justify-between border-t border-slate-700/30 pt-3 text-[10px] text-slate-500 z-10 font-mono mt-4">
        <div>
          <span className="text-slate-600">JOINED: </span>
          <span className="text-slate-300 font-semibold">{member.joinedDate}</span>
        </div>
        <div>
          <span className="text-slate-600">VALID THRU: </span>
          <span className="text-slate-300 font-semibold">{member.expiryDate}</span>
        </div>
      </div>

    </div>
  );
}
