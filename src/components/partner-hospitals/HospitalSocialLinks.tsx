"use client";

import { Globe, ExternalLink } from "lucide-react";
import { Partner, parsePartnerSocialLinks, formatSocialUrl } from "@/services/db";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  FacebookIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon,
  InstagramIcon,
} from "@/components/ui/SocialBrandIcons";

interface HospitalSocialLinksProps {
  partner: Partner;
  variant?: "chips" | "sidebar";
}

export default function HospitalSocialLinks({
  partner,
  variant = "sidebar",
}: HospitalSocialLinksProps) {
  const { t } = useLanguage();
  const socials = parsePartnerSocialLinks(partner.socialLinks);

  if (!socials) return null;

  const { facebook, whatsapp, website, youtube, linkedin, instagram } = socials;
  const hasAnySocial = Boolean(
    facebook || whatsapp || website || youtube || linkedin || instagram
  );

  if (!hasAnySocial) return null;

  const fbUrl = formatSocialUrl("facebook", facebook);
  const waUrl = formatSocialUrl("whatsapp", whatsapp);
  const webUrl = formatSocialUrl("website", website);
  const ytUrl = formatSocialUrl("youtube", youtube);
  const inUrl = formatSocialUrl("linkedin", linkedin);
  const igUrl = formatSocialUrl("instagram", instagram);

  const handleLinkClick = (platform: string, url?: string) => {
    trackEvent("partner_social_click", {
      partner_id: partner.id,
      partner_name: partner.name,
      platform,
      url: url || "",
    });
  };

  if (variant === "chips") {
    return (
      <div className="flex flex-wrap items-center gap-1.5" aria-label="Social Profiles">
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("whatsapp", waUrl)}
            aria-label={`${partner.name} WhatsApp`}
            className="h-7 px-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
            <span>{t("partnerHospitals.profile.whatsapp")}</span>
          </a>
        )}

        {fbUrl && (
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("facebook", fbUrl)}
            aria-label={`${partner.name} Facebook`}
            className="h-7 px-2.5 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 text-[11px] font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <FacebookIcon className="h-3 w-3 fill-current" />
            <span>{t("partnerHospitals.profile.facebook")}</span>
          </a>
        )}

        {webUrl && (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("website", webUrl)}
            aria-label={`${partner.name} Website`}
            className="h-7 px-2.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{t("partnerHospitals.profile.website")}</span>
          </a>
        )}

        {ytUrl && (
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("youtube", ytUrl)}
            aria-label={`${partner.name} YouTube`}
            className="h-7 px-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <YouTubeIcon className="h-3.5 w-3.5 fill-current" />
          </a>
        )}

        {inUrl && (
          <a
            href={inUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("linkedin", inUrl)}
            aria-label={`${partner.name} LinkedIn`}
            className="h-7 px-2 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 text-[11px] font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <LinkedInIcon className="h-3.5 w-3.5 fill-current" />
          </a>
        )}

        {igUrl && (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("instagram", igUrl)}
            aria-label={`${partner.name} Instagram`}
            className="h-7 px-2 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30 text-[11px] font-bold flex items-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
          >
            <InstagramIcon className="h-3.5 w-3.5 fill-current" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="pt-3 border-t border-border/60 space-y-2.5">
      <div>
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">
          {t("partnerHospitals.profile.socialLinks")}
        </span>
        <p className="text-[11px] text-muted-foreground">
          {t("partnerHospitals.profile.socialSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("whatsapp", waUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <WhatsAppIcon className="h-3.5 w-3.5 mr-2 fill-current shrink-0" />
            <span className="truncate">{t("partnerHospitals.profile.whatsapp")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}

        {fbUrl && (
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("facebook", fbUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-[#1877F2]/30 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <FacebookIcon className="h-3.5 w-3.5 mr-2 fill-current shrink-0" />
            <span className="truncate">{t("partnerHospitals.profile.facebook")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}

        {webUrl && (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("website", webUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <Globe className="h-3.5 w-3.5 mr-2 shrink-0 text-sky-600" />
            <span className="truncate">{t("partnerHospitals.profile.website")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}

        {ytUrl && (
          <a
            href={ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("youtube", ytUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <YouTubeIcon className="h-3.5 w-3.5 mr-2 fill-current shrink-0 text-red-600" />
            <span className="truncate">{t("partnerHospitals.profile.youtube")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}

        {inUrl && (
          <a
            href={inUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("linkedin", inUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-[#0A66C2]/30 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <LinkedInIcon className="h-3.5 w-3.5 mr-2 fill-current shrink-0" />
            <span className="truncate">{t("partnerHospitals.profile.linkedin")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}

        {igUrl && (
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("instagram", igUrl)}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "w-full h-9 rounded-xl border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 font-bold text-xs justify-start px-2.5 shadow-2xs cursor-pointer",
            })}
          >
            <InstagramIcon className="h-3.5 w-3.5 mr-2 fill-current shrink-0" />
            <span className="truncate">{t("partnerHospitals.profile.instagram")}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
          </a>
        )}
      </div>
    </div>
  );
}
