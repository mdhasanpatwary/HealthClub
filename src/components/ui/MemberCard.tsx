import { Member } from "@/services/db";
import { Heart, Star, ShieldCheck, User } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  // Determine card styles based on tier
  const isFamily = member.tier === "family";

  let bgStyles = "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-emerald-500/30";
  let badgeText = "Founding Member";
  let badgeIcon = <Star className="h-4 w-4 fill-amber-400 text-amber-400" />;
  let badgeBg = "bg-amber-400/20 text-amber-300 border border-amber-400/30";

  if (member.tier === "individual") {
    bgStyles = "bg-gradient-to-br from-emerald-900 via-emerald-850 to-slate-950 text-white border border-emerald-500/20";
    badgeText = "Individual Member";
    badgeIcon = <ShieldCheck className="h-4 w-4 text-emerald-400" />;
    badgeBg = "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30";
  } else if (isFamily) {
    bgStyles = "bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950 text-white border border-blue-500/30";
    badgeText = "Family Member";
    badgeIcon = <Heart className="h-4 w-4 fill-emerald-400 text-emerald-400" />;
    badgeBg = "bg-blue-400/20 text-blue-300 border border-blue-400/30";
  }

  // Generate QR Code URL
  // We point the QR code to our local verification page
  const verificationUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${member.id}`
    : `https://healthclub.com.bd/verify/${member.id}`;
  
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className={`relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 overflow-hidden shadow-2xl flex flex-col justify-between ${bgStyles}`}>
      
      {/* Decorative Blur Background circles */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="flex items-center space-x-1.5 text-primary">
            <Heart className="h-5 w-5 fill-primary text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              হেলথ <span className="text-primary">ক্লাব</span>
            </span>
          </span>
          <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider uppercase font-mono">
            Healthcare Membership Card
          </p>
        </div>

        {/* Tier Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeBg}`}>
          {badgeIcon}
          <span>{badgeText}</span>
        </div>
      </div>

      <div className="flex justify-between items-end mt-4 z-10 gap-3">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="h-16 w-16 rounded-xl border border-slate-700/50 bg-slate-800/80 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
            {member.profilePictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.profilePictureUrl} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Member Name</p>
              <p className="text-base font-bold tracking-wide mt-0.5 font-heading text-white line-clamp-1">
                {member.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Member ID</p>
                <p className="text-xs font-semibold tracking-wider font-mono text-emerald-400">
                  {member.id}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Status</p>
                <p className="text-[10px] font-semibold tracking-wide text-green-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  ACTIVE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-xl border border-slate-700/30 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeSrc}
            alt="Membership QR Code"
            width={72}
            height={72}
            className="w-18 h-18 select-none"
            loading="lazy"
          />
          <span className="text-[8px] font-semibold text-slate-700 font-mono">SCAN TO VERIFY</span>
        </div>
      </div>

      {/* Footer section with dates */}
      <div className="flex justify-between border-t border-slate-700/40 pt-3 text-[10px] text-slate-400 z-10 font-mono mt-4">
        <div>
          <span>JOINED: </span>
          <span className="text-slate-300 font-semibold">{member.joinedDate}</span>
        </div>
        <div>
          <span>VALID THRU: </span>
          <span className="text-slate-300 font-semibold">{member.expiryDate}</span>
        </div>
      </div>

    </div>
  );
}
