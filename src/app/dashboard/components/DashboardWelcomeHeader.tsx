import Link from "next/link";
import { Heart, Clock, AlertTriangle, CreditCard } from "lucide-react";
import { Member } from "@/services/db";
import { Button } from "@/components/ui/button";
import { formatNum, Locale } from "@/lib/i18n";
import { MemberNotificationBell } from "./MemberNotificationBell";

interface DashboardWelcomeHeaderProps {
  user: Member;
  t: (key: string) => string;
  locale: Locale;
  daysRemaining: number | null;
  isExpired: boolean;
}

export function DashboardWelcomeHeader({
  user,
  t,
  locale,
  daysRemaining,
  isExpired,
}: DashboardWelcomeHeaderProps) {
  const statusConfig = {
    active: {
      label: t("dashboard.welcome.statusActive"),
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      dot: "bg-emerald-500 animate-pulse",
    },
    inactive: {
      label: t("dashboard.welcome.statusInactive"),
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      dot: "bg-rose-500",
    },
    pending_approval: {
      label: t("dashboard.welcome.statusPendingApproval"),
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      dot: "bg-amber-500 animate-pulse",
    },
    pending_payment: {
      label: t("dashboard.welcome.statusPendingPayment"),
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      dot: "bg-blue-500 animate-pulse",
    },
  };

  const status = statusConfig[user.status as keyof typeof statusConfig] || statusConfig.inactive;

  return (
    <>
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-secondary rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-xl">
        {/* Background dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Top green accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profilePictureUrl}
                  alt={user.name}
                  className="h-14 w-14 rounded-2xl object-cover object-left-top border-2 border-white/20 shadow-lg"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-xl font-heading shadow-lg border-2 border-white/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 shadow" />
            </div>

            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5 flex items-center gap-1.5">
                <Heart className="h-3 w-3 fill-primary text-primary" />
                {t("dashboard.welcome.subtitle")}
              </p>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">
                {t("dashboard.welcome.title").replace("{name}", user.name)}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {t("dashboard.welcome.memberId")}{" "}
                <span className="font-mono font-semibold text-primary">{user.id}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="capitalize font-semibold text-slate-300">
                  {t("dashboard.welcome.memberTier").replace(
                    "{tier}",
                    user.tier?.toLowerCase() === "founding"
                      ? t("dashboard.welcome.tierFounding")
                      : user.tier?.toLowerCase() === "premium"
                      ? t("dashboard.welcome.tierPremium")
                      : t("dashboard.welcome.tierGeneral")
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* Status badge & Notification Bell */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <MemberNotificationBell />
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${status.badge}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inactive Premium Member Offline Payment Banner */}
      {user.status === "inactive" && user.tier === "premium" && (
        <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-amber-500/10 border-2 border-rose-500/30 dark:border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-[#e2125d] text-white flex items-center justify-center shrink-0 shadow-md font-bold text-xs">
              bKash
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-secondary dark:text-white flex items-center gap-2">
                <span>{t("dashboard.payment.inactivePremiumTitle")}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-wide">
                  {t("dashboard.welcome.statusInactive")}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("dashboard.payment.inactivePremiumDesc")}
              </p>
            </div>
          </div>
          <Link href={`/register/payment?memberId=${user.id}`} className="shrink-0">
            <Button size="sm" className="bg-[#e2125d] hover:bg-[#c00f4f] text-white font-bold shadow-md w-full sm:w-auto cursor-pointer">
              <CreditCard className="h-4 w-4 mr-1.5" />
              {t("dashboard.payment.payNowButton")}
            </Button>
          </Link>
        </div>
      )}

      {/* Pending Approval Banner */}
      {user.status === "pending_approval" && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3.5 text-amber-800 dark:text-amber-300 animate-in fade-in duration-200">
          <Clock className="h-5 w-5 shrink-0 animate-pulse text-amber-600 dark:text-amber-400" />
          <div className="text-xs sm:text-sm font-semibold flex-1">
            {t("dashboard.payment.pendingApprovalDesc")}
          </div>
        </div>
      )}

      {/* Expiry / Renewal Banners */}
      {user.renewalStatus === "pending" ? (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3.5 text-blue-700 dark:text-blue-400 animate-in fade-in duration-200">
          <Clock className="h-5 w-5 shrink-0 animate-pulse text-blue-500" />
          <div className="text-sm font-semibold flex-1">
            {t("dashboard.renewal.pendingPaymentApproval")}
          </div>
        </div>
      ) : isExpired ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-destructive animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
            <div className="text-sm font-bold">
              {t("dashboard.renewal.expired")}
            </div>
          </div>
          <Link href="/dashboard/renew">
            <Button variant="destructive" size="sm" className="shrink-0">
              {t("dashboard.renewal.renewButton")}
            </Button>
          </Link>
        </div>
      ) : daysRemaining !== null && daysRemaining <= 30 && daysRemaining >= 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-700 dark:text-amber-500 animate-in fade-in duration-200">
          <div className="flex items-center gap-3.5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-sm font-bold">
              {t("dashboard.renewal.warning").replace("{daysRemaining}", formatNum(daysRemaining, locale))}
            </div>
          </div>
          <Link href="/dashboard/renew">
            <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 shrink-0">
              {t("dashboard.renewal.renewButtonShort")}
            </Button>
          </Link>
        </div>
      ) : null}
    </>
  );
}
