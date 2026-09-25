"use client";

import { useState } from "react";
import {
  Building2,
  PhoneCall,
  Clock,
  Percent,
  Globe,
  ShieldCheck,
  Truck,
  MapPin,
} from "lucide-react";
import {
  Partner,
  DepartmentDiscount,
  PartnerFacilityItem,
  PartnerGalleryImage,
  PartnerSocialLinks,
  parsePartnerSocialLinks,
  parsePartnerGallery,
  formatSocialUrl,
} from "@/services/db";
import { parsePartnerFacilities, getDefaultFacilities } from "@/lib/facilities";
import { FENI_UPAZILAS } from "@/data/feniLocations";
import { authStore } from "@/services/authStore";
import { updatePartnerProfileAction } from "@/app/actions/partnerActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { PartnerCardPreview } from "./PartnerCardPreview";
import { PartnerPasswordCard } from "./PartnerPasswordCard";
import { PartnerSocialLinksCard } from "./PartnerSocialLinksCard";
import { PartnerDepartmentDiscountsCard } from "./PartnerDepartmentDiscountsCard";
import { PartnerFacilitiesCard } from "./PartnerFacilitiesCard";
import { PartnerGalleryCard } from "./PartnerGalleryCard";
import { toast } from "sonner";

interface PartnerProfileSettingsTabProps {
  partner: Partner;
  isStaff?: boolean;
  onProfileUpdated: (updatedPartner: Partner) => void;
}

export function PartnerProfileSettingsTab({
  partner,
  isStaff,
  onProfileUpdated,
}: PartnerProfileSettingsTabProps) {

  // Basic Form States
  const [name, setName] = useState(partner.name || "");
  const [address, setAddress] = useState(partner.address || "");
  const [upazila, setUpazila] = useState(partner.upazila || "feni-sadar");
  const [phone, setPhone] = useState(partner.phone || "");
  const [emergencyPhone, setEmergencyPhone] = useState(partner.emergencyPhone || "");
  const [ambulancePhone, setAmbulancePhone] = useState(partner.ambulancePhone || "");
  const [workingHours, setWorkingHours] = useState(partner.workingHours || "");
  const [discount, setDiscount] = useState(partner.discount || "");
  const [mapLink, setMapLink] = useState(partner.mapLink || "");
  const [imageUrl, setImageUrl] = useState(partner.imageUrl || "");
  const [socialLinks, setSocialLinks] = useState<PartnerSocialLinks>(
    parsePartnerSocialLinks(partner.socialLinks) || {}
  );

  const handleSocialLinkChange = (field: keyof PartnerSocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [field]: value }));
  };

  // Department Discounts State
  const parseInitialDiscounts = (): DepartmentDiscount[] => {
    if (!partner.departmentDiscounts) return [];
    try {
      const parsed = JSON.parse(partner.departmentDiscounts);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [departmentDiscounts, setDepartmentDiscounts] = useState<DepartmentDiscount[]>(
    parseInitialDiscounts()
  );

  // Healthcare Facilities State
  const [facilities, setFacilities] = useState<PartnerFacilityItem[]>(() => {
    const custom = parsePartnerFacilities(partner.facilities);
    if (custom && custom.length > 0) return custom;
    return getDefaultFacilities(partner.category, partner.emergencyPhone);
  });

  // Photo Gallery State
  const [galleryImages, setGalleryImages] = useState<PartnerGalleryImage[]>(() =>
    parsePartnerGallery(partner.galleryImages)
  );

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim() || !discount.trim()) {
      toast.error("দয়া করে সকল বাধ্যতামূলক তথ্য পূরণ করুন।");
      return;
    }

    setSaving(true);
    try {
      const cleanSocialLinks: PartnerSocialLinks = {};
      (Object.keys(socialLinks) as Array<keyof PartnerSocialLinks>).forEach((k) => {
        const val = socialLinks[k]?.trim();
        if (val) cleanSocialLinks[k] = formatSocialUrl(k, val);
      });

      const res = await updatePartnerProfileAction({
        name: name.trim(),
        address: address.trim(),
        upazila: upazila || "feni-sadar",
        phone: phone.trim(),
        discount: discount.trim(),
        emergencyPhone: emergencyPhone.trim() || undefined,
        ambulancePhone: ambulancePhone.trim() || undefined,
        workingHours: workingHours.trim() || undefined,
        mapLink: mapLink.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        departmentDiscounts: JSON.stringify(departmentDiscounts),
        socialLinks: JSON.stringify(cleanSocialLinks),
        facilities: JSON.stringify(facilities),
        galleryImages: JSON.stringify(galleryImages),
      });

      if (res.success && res.partner) {
        authStore.setCurrentPartner(res.partner);
        toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে");
        onProfileUpdated(res.partner);
      } else {
        toast.error(res.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-heading text-secondary dark:text-white">
          প্রতিষ্ঠান প্রোফাইল ও সেটিংস
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          পাবলিক ডিরেক্টরিতে প্রদর্শিত হাসপাতালের নাম, ঠিকানা, ডিসকাউন্ট ও ছবি পরিচালনা করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Card 1: Core Details */}
            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
                <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  প্রাথমিক তথ্য ও যোগাযোগের বিবরণ
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-0.5">
                  এই তথ্যগুলো হেলথ ক্লাব ডিরেক্টরিতে রোগীদের জন্য উন্মুক্ত থাকবে
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-name" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      প্রতিষ্ঠানের নাম *
                    </label>
                    <Input
                      id="partner-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="উদাঃ আল-বারাকাহ ডায়াগনস্টিক কমপ্লেক্স"
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-address" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      প্রতিষ্ঠানের পূর্ণ ঠিকানা *
                    </label>
                    <Input
                      id="partner-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="উদাঃ মিজান রোড, ট্রাঙ্ক রোড মোড়, ফেনী"
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  {/* Upazila Selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="partner-upazila" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      উপজেলা (এলাকা) *
                    </label>
                    <select
                      id="partner-upazila"
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      {FENI_UPAZILAS.filter((u) => u.id !== "all").map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nameBn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-phone" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      অফিসিয়াল ফোন নম্বর *
                    </label>
                    <Input
                      id="partner-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="উদাঃ ০১৭১১-XXXXXX"
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  {/* Emergency Hotline */}
                  <div className="space-y-1.5">
                    <label htmlFor="partner-emergency-phone" className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <PhoneCall className="h-3.5 w-3.5" />
                      জরুরি হটলাইন নম্বর (ঐচ্ছিক)
                    </label>
                    <Input
                      id="partner-emergency-phone"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="উদাঃ ০১৭১২-XXXXXX"
                      className="h-10 rounded-xl border-border bg-amber-500/5 focus:border-amber-500"
                    />
                  </div>

                  {/* Dedicated Ambulance Hotline */}
                  <div className="space-y-1.5">
                    <label htmlFor="partner-ambulance-phone" className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      জরুরি অ্যাম্বুলেন্স হটলাইন
                    </label>
                    <Input
                      id="partner-ambulance-phone"
                      value={ambulancePhone}
                      onChange={(e) => setAmbulancePhone(e.target.value)}
                      placeholder="উদাঃ ০১৮XXXXXXXX"
                      className="h-10 rounded-xl border-border bg-rose-500/5 focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-working-hours" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      সেবা প্রদানের সময়সূচি
                    </label>
                    <Input
                      id="partner-working-hours"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder="উদাঃ প্রতিদিন সকাল ৮টা - রাত ১০টা (জরুরি সেবা ২৪ ঘণ্টা)"
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-discount" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-primary" />
                      ন্যূনতম ডিসকাউন্ট হার (বেসলাইন) *
                    </label>
                    <Input
                      id="partner-discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      required
                      placeholder="উদাঃ ২০% বা ১৫%"
                      className="h-10 rounded-xl border-border font-bold text-primary"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-map-link" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      গুগল ম্যাপ লোকেশন লিংক (ঐচ্ছিক)
                    </label>
                    <Input
                      id="partner-map-link"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="h-10 rounded-xl border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <ImageUpload
                      value={imageUrl}
                      onChange={setImageUrl}
                      label="প্রতিষ্ঠানের লোগো বা ভবনের ছবি"
                      fallbackType="building"
                      folder="partners"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Social Media & Web Links */}
            <PartnerSocialLinksCard
              socialLinks={socialLinks}
              onChange={handleSocialLinkChange}
            />

            {/* Card 3: Department Discount Breakdown Editor */}
            <PartnerDepartmentDiscountsCard
              departmentDiscounts={departmentDiscounts}
              setDepartmentDiscounts={setDepartmentDiscounts}
            />

            {/* Card 4: Healthcare Facilities & Infrastructure */}
            <PartnerFacilitiesCard
              facilities={facilities}
              onChange={setFacilities}
              category={partner.category}
            />

            {/* Card 5: Hospital Photo Gallery */}
            <PartnerGalleryCard
              galleryImages={galleryImages}
              onChange={setGalleryImages}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-5 w-5" />
                {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তনগুলো সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>

          {/* Partner Password & Security Card - Visible only to Main Partner Admin */}
          {!isStaff && <PartnerPasswordCard />}
        </div>

        {/* Live Preview Column (4 Cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <PartnerCardPreview
            partner={partner}
            name={name}
            address={address}
            discount={discount}
            emergencyPhone={emergencyPhone}
            workingHours={workingHours}
            imageUrl={imageUrl}
            departmentDiscounts={departmentDiscounts}
            socialLinks={socialLinks}
          />
        </div>
      </div>
    </div>
  );
}
