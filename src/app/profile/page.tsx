"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useLanguage } from "@/components/layout/LanguageProvider";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<Member | null>(null);

  // Profile Form States
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [profileProfession, setProfileProfession] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on mount
  useEffect(() => {
    const currentUser = dbStore.getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    dbStore.getMemberById(currentUser.id).then((freshUser) => {
      const activeUser = freshUser || currentUser;
      setUser(activeUser);
      setProfileName(activeUser.name);
      setProfileEmail(activeUser.email || "");
      setProfilePhone(activeUser.phone);
      setProfileAddress(activeUser.address || "");
      setProfileBirthDate(activeUser.birthDate || "");
      setProfileProfession(activeUser.profession || "");
      setProfilePictureUrl(activeUser.profilePictureUrl || "");
    });
  }, [router]);

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const success = await dbStore.updateMemberProfile(
        user.id,
        profileName,
        profilePhone,
        profileEmail,
        profileAddress,
        profileBirthDate,
        profileProfession,
        profilePictureUrl
      );

      if (success) {
        const updatedUser = {
          ...user,
          name: profileName,
          email: profileEmail,
          phone: profilePhone,
          address: profileAddress,
          birthDate: profileBirthDate,
          profession: profileProfession,
          profilePictureUrl: profilePictureUrl
        };
        dbStore.setCurrentUser(updatedUser);
        setUser(updatedUser);
        toast.success(t("profile.page.profileUpdatedSuccessfully"));
      } else {
        toast.error(t("profile.page.failedToUpdateProfile"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("profile.page.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-muted-foreground">
        {t("profile.page.loading")}
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-[85vh] py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("profile.page.backToDashboard")}
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="border-border shadow-lg bg-background/80 backdrop-blur">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {profilePictureUrl ? (
                <div className="relative h-20 w-20 rounded-2xl border-2 border-primary/20 shrink-0 shadow-md overflow-hidden">
                  <Image 
                    src={profilePictureUrl} 
                    alt={profileName} 
                    fill
                    unoptimized
                    className="object-cover object-left-top"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary border-2 border-primary/20 shrink-0 shadow-md flex items-center justify-center font-bold text-2xl uppercase">
                  {profileName.charAt(0)}
                </div>
              )}
              <div>
                <CardTitle className="font-heading text-xl sm:text-2xl font-bold text-secondary dark:text-white">
                  {t("profile.page.profileSettings")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  {t("profile.page.memberId")}: <span className="font-mono font-semibold text-primary">{user.id}</span>
                  <span className="mx-2 text-border">|</span>
                  {t("profile.page.plan")}: <span className="capitalize font-semibold text-secondary dark:text-white">{user.tier} Member</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Profile Image Upload Component */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border">
                <ImageUpload
                  value={profilePictureUrl}
                  onChange={setProfilePictureUrl}
                  label={t("profile.page.profilePicture")}
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                  {t("profile.page.yourName")}
                </label>
                <Input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="border-border bg-background focus-visible:ring-primary h-11"
                  placeholder={t("profile.page.egMdAbdurRahman")}
                />
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                    {t("profile.page.mobileNumber")}
                  </label>
                  <Input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="border-border bg-background focus-visible:ring-primary h-11"
                    placeholder="e.g., 017xxxxxxxx"
                  />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                    {t("profile.page.emailAddress")}
                  </label>
                  <Input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="border-border bg-background focus-visible:ring-primary h-11"
                    placeholder="e.g., name@domain.com"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                  {t("profile.page.address")}
                </label>
                <Input
                  type="text"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  placeholder={t("profile.page.egMizanRoadFeni")}
                  className="border-border bg-background focus-visible:ring-primary h-11"
                />
              </div>

              {/* Birth Date & Profession Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Birth Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                    {t("profile.page.dateOfBirth")}
                  </label>
                  <Input
                    type="date"
                    value={profileBirthDate}
                    onChange={(e) => setProfileBirthDate(e.target.value)}
                    className="border-border bg-background focus-visible:ring-primary h-11"
                  />
                </div>
                {/* Profession */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-white block">
                    {t("profile.page.profession")}
                  </label>
                  <Input
                    type="text"
                    value={profileProfession}
                    onChange={(e) => setProfileProfession(e.target.value)}
                    placeholder={t("profile.page.egServiceBusinessStudent")}
                    className="border-border bg-background focus-visible:ring-primary h-11"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold h-11 gap-2 rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  <Save className="h-5 w-5" />
                  {isSubmitting ? t("profile.page.saving") : t("profile.page.saveChanges")}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
