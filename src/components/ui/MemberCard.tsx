import { forwardRef } from "react";
import { Member } from "@/services/db";
import { Star, ShieldCheck, User } from "lucide-react";

interface MemberCardProps {
  member: Member;
}

const MemberCard = forwardRef<HTMLDivElement, MemberCardProps>(function MemberCard(
  { member },
  ref
) {
  // Determine card tier badge & accent styling
  let badgeText = "Founding Member";
  let badgeIcon = <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />;
  let badgeBg = "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm";
  let borderAccent = "border-emerald-500/30";

  if (member.tier === "premium") {
    badgeText = "Premium Member";
    badgeIcon = <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
    badgeBg = "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm";
    borderAccent = "border-emerald-400/30";
  }

  // Use stored QR code URL from DB if available (avoids external API call on every render).
  const verificationUrl = `https://healthclubfeni.vercel.app/verify/${member.id}`;
  const qrCodeSrc =
    member.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}&color=0f172a&bgcolor=ffffff`;

  const isExpired = new Date(member.expiryDate) < new Date();

  return (
    <div
      ref={ref}
      lang="en"
      translate="no"
      className={`notranslate relative w-full max-w-md mx-auto rounded-2xl p-3.5 sm:p-5 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[200px] sm:min-h-[220px] bg-slate-950 text-white border ${borderAccent}`}
      style={{
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
        backgroundColor: "#020617",
        ...({
          "--font-heading": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
          "--font-sans": "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
        } as React.CSSProperties),
      }}
    >
      {/* Custom Generated Background Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen pointer-events-none rounded-2xl"
        style={{ backgroundImage: "url('/images/member-card-bg.png')" }}
      />

      {/* Radial ambient glow & glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/60 to-emerald-950/80 pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute -inset-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
      </div>

      {/* Header section with branded 3D logo badge */}
      <div className="relative flex justify-between items-center z-10 gap-1.5 sm:gap-2">
        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          {/* Branded Logo Emblem */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/member-card-logo.png"
            alt="Health Club Logo Emblem"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.4)] shrink-0"
          />
          <div className="min-w-0">
            <div className="font-heading text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1 leading-tight">
              <span>Health</span>
              <span className="text-emerald-400">Club</span>
            </div>
            <p className="text-[7.5px] sm:text-[9px] text-emerald-200/70 tracking-widest uppercase font-mono mt-0.5">
              Digital Healthcare Card
            </p>
          </div>
        </div>

        {/* Tier Badge */}
        <div
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-xs font-bold shrink-0 ${badgeBg} backdrop-blur-md`}
        >
          {badgeIcon}
          <span className="whitespace-nowrap">{badgeText}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="relative flex items-center mt-3.5 sm:mt-5 z-10 gap-2 sm:gap-3">
        {/* Profile Picture */}
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl border border-emerald-400/30 bg-slate-900/80 overflow-hidden flex items-center justify-center shrink-0 shadow-lg relative">
          {member.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.profilePictureUrl}
              alt={member.name}
              className="h-full w-full object-cover object-left-top"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-emerald-500/20 to-slate-800 flex items-center justify-center">
              <User className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-300" />
            </div>
          )}
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
          <div>
            <p className="text-[7.5px] sm:text-[9px] text-slate-400 uppercase tracking-widest font-mono">
              Member Name
            </p>
            <p className="text-xs sm:text-sm font-bold tracking-wide mt-0.5 font-heading text-white truncate drop-shadow-sm">
              {member.name}
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <div className="min-w-0">
              <p className="text-[7px] sm:text-[8px] text-slate-400 uppercase tracking-widest font-mono">
                Member ID
              </p>
              <p className="text-[9px] sm:text-[11px] font-semibold font-mono text-emerald-400 truncate">
                {member.id}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-[7px] sm:text-[8px] text-slate-400 uppercase tracking-widest font-mono">
                Status
              </p>
              {isExpired ? (
                <p className="text-[9px] sm:text-[11px] font-bold text-rose-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  EXPIRED
                </p>
              ) : (
                <p className="text-[9px] sm:text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  {member.status.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="relative flex flex-col items-center gap-0.5 sm:gap-1 bg-white p-1 sm:p-1.5 rounded-xl border border-emerald-400/20 shadow-xl shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeSrc}
            alt="Membership QR Code"
            width={72}
            height={72}
            className={`w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] select-none rounded-sm transition-all duration-300 ${
              isExpired ? "blur-md select-none pointer-events-none opacity-40" : ""
            }`}
            loading="lazy"
            crossOrigin="anonymous"
          />
          <span
            className={`text-[6px] sm:text-[7px] font-bold font-mono tracking-widest uppercase ${
              isExpired ? "text-rose-600" : "text-slate-700"
            }`}
          >
            {isExpired ? "EXPIRED" : "SCAN ME"}
          </span>
        </div>
      </div>

      {/* Footer section with dates */}
      <div className="relative flex justify-between border-t border-white/10 pt-2 sm:pt-3 text-[8.5px] sm:text-[10px] text-slate-400 z-10 font-mono mt-2.5 sm:mt-4 gap-2">
        <div className="min-w-0">
          <span className="text-slate-400">JOINED: </span>
          <span className="text-emerald-300 font-semibold">{member.joinedDate}</span>
        </div>
        <div className="shrink-0">
          <span className="text-slate-400">VALID THRU: </span>
          <span className="text-emerald-300 font-semibold">{member.expiryDate}</span>
        </div>
      </div>
    </div>
  );
});

export default MemberCard;
