import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Locale, tServer } from "@/lib/i18n";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { toBanglaNums } from "@/lib/utils";

export default async function Footer({ locale = "bn" }: { locale?: string }) {
  const currentLocale = (locale === "en" ? "en" : "bn") as Locale;
  const t = (key: string) => tServer(currentLocale, key);
  const contact = await getCachedContactSettings();

  const rawHotline = contact.hotline.replace(/[^0-9]/g, "");
  const normalizedHotline = rawHotline.replace(/^(880|88|0)/, "");
  const hotlineTel = `+880${normalizedHotline}`;
  const hotlineDisplay =
    currentLocale === "bn"
      ? toBanglaNums(`+880 ${normalizedHotline}`)
      : `+880 ${normalizedHotline}`;

  const rawWhatsapp = contact.whatsapp.replace(/[^0-9]/g, "");
  const normalizedWhatsapp = rawWhatsapp.replace(/^(880|88|0)/, "");
  const whatsappUrl = `https://wa.me/880${normalizedWhatsapp}`;

  return (
    <footer
      className="relative bg-gradient-to-b from-slate-950 to-[#030712] text-slate-400 border-t border-slate-800/60 overflow-hidden pb-[calc(5rem+env(safe-area-inset-bottom,0px))] min-[992px]:pb-0"
    >
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-primary/5 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Logo & Contact Info */}
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <Image
                src="/images/member-card-logo.webp"
                alt="Health Club Logo"
                width={36}
                height={36}
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-[0_2px_8px_rgba(34,197,94,0.3)] transition-transform duration-300 group-hover:scale-110 shrink-0"
              />
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                {t("layout.footer.health")}{" "}
                <span className="gradient-text">{t("layout.footer.club")}</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              {t("layout.footer.healthcareMadeSimpleAndAffordable")}
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href={contact.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-white/80 tracking-widest uppercase mb-5">
                {t("layout.footer.quickLinks")}
              </h3>
              <ul role="list" className="space-y-3">
                {[
                  { href: "/", label: t("layout.footer.home") },
                  { href: "/consultants", label: t("layout.footer.consultants") },
                  { href: "/partner-hospitals", label: t("layout.footer.partnerHospitals") },
                  { href: "/emergency", label: t("layout.footer.emergencyServices") },
                  { href: "/health-tools", label: t("layout.footer.healthCalculators") },
                  { href: "/health-tips", label: t("layout.footer.healthTips") },
                  { href: "/membership", label: t("layout.footer.membershipPlans") },
                  { href: "/become-partner", label: t("layout.footer.becomeAPartner") },
                  { href: "/about-us", label: t("layout.footer.aboutUs") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/60 group-hover:w-2 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support and Address */}
            <div>
              <h3 className="text-xs font-semibold text-white/80 tracking-widest uppercase mb-5">
                {t("layout.footer.contactAddress")}
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="leading-relaxed">{t("layout.footer.mizanRoadFeni3900")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <a href={`tel:${hotlineTel}`} className="hover:text-white transition-colors">
                    {hotlineDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {t("layout.footer.healthClubAllRightsReserved")}
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              {t("layout.footer.privacyPolicy")}
            </Link>
            <Link href="/terms-conditions" className="hover:text-slate-300 transition-colors">
              {t("layout.footer.termsConditions")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
