import React from "react";
import { LayoutDashboard, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface DashboardProfileTabProps {
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
        <form onSubmit={handleUpdateProfile} className="space-y-5">

          <ImageUpload
            value={profilePictureUrl}
            onChange={setProfilePictureUrl}
            label={t("dashboard.profile.picture")}
          />

          <div className="space-y-2">
            <label htmlFor="profile-name" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.name")}</label>
            <Input
              id="profile-name"
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profile-phone" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.phone")}</label>
              <Input
                id="profile-phone"
                type="tel"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-email" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.email")}</label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="profile-address" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.address")}</label>
            <Input
              id="profile-address"
              type="text"
              value={profileAddress}
              onChange={(e) => setProfileAddress(e.target.value)}
              placeholder={t("dashboard.profile.addressPlaceholder")}
              className="border-border/60 rounded-xl focus:border-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="profile-dob" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.dob")}</label>
              <Input
                id="profile-dob"
                type="date"
                value={profileBirthDate}
                onChange={(e) => setProfileBirthDate(e.target.value)}
                className="border-border/60 rounded-xl focus:border-primary/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-profession" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("dashboard.profile.profession")}</label>
              <Input
                id="profile-profession"
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
