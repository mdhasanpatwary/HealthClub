import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Locale } from "@/lib/i18n";
import { tServer } from "@/lib/i18n.server";
import { getCachedContactSettings } from "@/app/actions/systemSettingsActions";
import { toBanglaNums } from "@/lib/utils";
import {
  FacebookIcon,
  WhatsAppIcon,
  YouTubeIcon,
  InstagramIcon,
  XIcon,
  LinkedInIcon,
} from "@/components/ui/SocialBrandIcons";

function formatSocialUrl(url?: string): string {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

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
  const whatsappUrl = normalizedWhatsapp ? `https://wa.me/880${normalizedWhatsapp}` : "";

  const socialLinks = [
    {
      key: "facebook",
      url: formatSocialUrl(contact.facebookUrl),
      label: "Facebook",
      icon: FacebookIcon,
      hoverClass: "hover:bg-blue-600/20 hover:border-blue-600/30 hover:text-white",
    },
    {
      key: "whatsapp",
      url: whatsappUrl,
      label: "WhatsApp",
      icon: WhatsAppIcon,
      hoverClass: "hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-white",
    },
    {
      key: "youtube",
      url: formatSocialUrl(contact.youtubeUrl),
      label: "YouTube",
      icon: YouTubeIcon,
      hoverClass: "hover:bg-red-500/20 hover:border-red-500/30 hover:text-white",
    },
    {
      key: "instagram",
      url: formatSocialUrl(contact.instagramUrl),
      label: "Instagram",
      icon: InstagramIcon,
      hoverClass: "hover:bg-pink-500/20 hover:border-pink-500/30 hover:text-white",
    },
    {
      key: "x",
      url: formatSocialUrl(contact.xUrl),
      label: "X (Twitter)",
      icon: XIcon,
      hoverClass: "hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white",
    },
    {
      key: "linkedin",
      url: formatSocialUrl(contact.linkedinUrl),
      label: "LinkedIn",
      icon: LinkedInIcon,
      hoverClass: "hover:bg-blue-700/20 hover:border-blue-700/30 hover:text-white",
    },
  ].filter((item) => Boolean(item.url));

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
                style={{ width: "auto", height: "auto" }}
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
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {socialLinks.map(({ key, url, label, icon: Icon, hoverClass }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 transition-all duration-200 ${hoverClass}`}
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4 fill-current" />
                  </a>
                ))}
              </div>
            )}
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
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {t("layout.footer.healthClubAllRightsReserved")}
          </p>
          <div className="flex space-x-6 text-xs text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {t("layout.footer.privacyPolicy")}
            </Link>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">
              {t("layout.footer.termsConditions")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
