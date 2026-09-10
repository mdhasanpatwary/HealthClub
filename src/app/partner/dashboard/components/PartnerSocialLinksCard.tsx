"use client";

import { Share2, Globe } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PartnerSocialLinks } from "@/services/db";
import {
  FacebookIcon,
  WhatsAppIcon,
  YouTubeIcon,
  LinkedInIcon,
  InstagramIcon,
} from "@/components/ui/SocialBrandIcons";

interface PartnerSocialLinksCardProps {
  socialLinks: PartnerSocialLinks;
  onChange: (field: keyof PartnerSocialLinks, value: string) => void;
}

export function PartnerSocialLinksCard({
  socialLinks,
  onChange,
}: PartnerSocialLinksCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="border-border shadow-xs rounded-3xl overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4 bg-muted/20 border-b border-border/50">
        <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
            <Share2 className="h-4 w-4" />
          </div>
          <span>{t("partner.profile.socialLinksTitle")}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {t("partner.profile.socialLinksSubtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Facebook */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-facebook"
              className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center shrink-0">
                <FacebookIcon className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.facebook")}</span>
            </Label>
            <Input
              id="partner-social-facebook"
              type="text"
              value={socialLinks.facebook || ""}
              onChange={(e) => onChange("facebook", e.target.value)}
              placeholder={t("partner.profile.facebookPlaceholder")}
              className="h-10 rounded-xl border-border text-xs"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-whatsapp"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.whatsapp")}</span>
            </Label>
            <Input
              id="partner-social-whatsapp"
              type="text"
              value={socialLinks.whatsapp || ""}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              placeholder={t("partner.profile.whatsappPlaceholder")}
              className="h-10 rounded-xl border-border bg-emerald-500/5 focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Official Website */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-website"
              className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Globe className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.website")}</span>
            </Label>
            <Input
              id="partner-social-website"
              type="text"
              value={socialLinks.website || ""}
              onChange={(e) => onChange("website", e.target.value)}
              placeholder={t("partner.profile.websitePlaceholder")}
              className="h-10 rounded-xl border-border text-xs"
            />
          </div>

          {/* YouTube */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-youtube"
              className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <YouTubeIcon className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.youtube")}</span>
            </Label>
            <Input
              id="partner-social-youtube"
              type="text"
              value={socialLinks.youtube || ""}
              onChange={(e) => onChange("youtube", e.target.value)}
              placeholder={t("partner.profile.youtubePlaceholder")}
              className="h-10 rounded-xl border-border text-xs"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-linkedin"
              className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center shrink-0">
                <LinkedInIcon className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.linkedin")}</span>
            </Label>
            <Input
              id="partner-social-linkedin"
              type="text"
              value={socialLinks.linkedin || ""}
              onChange={(e) => onChange("linkedin", e.target.value)}
              placeholder={t("partner.profile.linkedinPlaceholder")}
              className="h-10 rounded-xl border-border text-xs"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <Label
              htmlFor="partner-social-instagram"
              className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1.5"
            >
              <div className="h-4 w-4 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <InstagramIcon className="h-2.5 w-2.5" />
              </div>
              <span>{t("partner.profile.instagram")}</span>
            </Label>
            <Input
              id="partner-social-instagram"
              type="text"
              value={socialLinks.instagram || ""}
              onChange={(e) => onChange("instagram", e.target.value)}
              placeholder={t("partner.profile.instagramPlaceholder")}
              className="h-10 rounded-xl border-border text-xs"
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
