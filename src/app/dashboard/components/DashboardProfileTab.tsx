import React from "react";
import { LayoutDashboard, Save, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface DashboardProfileTabProps {
  saveSuccess: boolean;
  handleUpdateProfile: (e: React.FormEvent) => void;
  profilePictureUrl: string;
  setProfilePictureUrl: (url: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  profilePhone: string;
  setProfilePhone: (phone: string) => void;
  profileEmail: string;
  setProfileEmail: (email: string) => void;
  profileAddress: string;
  setProfileAddress: (address: string) => void;
  profileBirthDate: string;
  setProfileBirthDate: (dob: string) => void;
  profileProfession: string;
  setProfileProfession: (profession: string) => void;
  t: (key: string) => string;
}

export function DashboardProfileTab({
  saveSuccess,
  handleUpdateProfile,
  profilePictureUrl,
  setProfilePictureUrl,
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  profileEmail,
  setProfileEmail,
  profileAddress,
  setProfileAddress,
  profileBirthDate,
  setProfileBirthDate,
  profileProfession,
  setProfileProfession,
  t,
}: DashboardProfileTabProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/30 dark:bg-slate-900/40">
        <CardTitle className="font-heading text-base font-bold text-secondary dark:text-white flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-primary" />
          {t("dashboard.profile.title")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.profile.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {saveSuccess && (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{t("dashboard.profile.success")}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-5">

          <ImageUpload
            value={profilePictureUrl}
            onChange={setProfilePictureUrl}
            label={t("dashboard.profile.picture")}
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.name")}</label>
            <Input
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.phone")}</label>
              <Input
                type="tel"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.email")}</label>
              <Input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.address")}</label>
            <Input
              type="text"
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
              placeholder={t("dashboard.profile.addressPlaceholder")}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.dob")}</label>
              <Input
                type="date"
                value={profileBirthDate}
                onChange={(e) => setProfileBirthDate(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary dark:text-white">{t("dashboard.profile.profession")}</label>
              <Input
                type="text"
                value={profileProfession}
                onChange={(e) => setProfileProfession(e.target.value)}
                placeholder={t("dashboard.profile.professionPlaceholder")}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
          </div>

          <div className="pt-1">
            <Button type="submit" size="lg" className="w-full">
              <Save className="h-4 w-4" />
              {t("dashboard.profile.saveButton")}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
