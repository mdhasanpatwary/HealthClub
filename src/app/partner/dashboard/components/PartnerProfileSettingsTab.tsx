"use client";

import { useState } from "react";
import { Building2, PhoneCall, Clock, Percent, Plus, Trash2, Globe, Image as ImageIcon, Sparkles, ShieldCheck, Tag } from "lucide-react";
import { Partner, DepartmentDiscount } from "@/services/db";
import { authStore } from "@/services/authStore";
import { updatePartnerProfileAction } from "@/app/actions/partnerActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { PartnerCardPreview } from "./PartnerCardPreview";
import { PartnerPasswordCard } from "./PartnerPasswordCard";
import { toast } from "sonner";

interface PartnerProfileSettingsTabProps {
  partner: Partner;
  isStaff?: boolean;
  onProfileUpdated: (updatedPartner: Partner) => void;
}

const PRESET_DEPARTMENTS = [
  { nameKey: "partner.profile.presetPathology", discount: "25%", descKey: "partner.profile.presetPathologyDesc" },
  { nameKey: "partner.profile.presetRadiology", discount: "20%", descKey: "partner.profile.presetRadiologyDesc" },
  { nameKey: "partner.profile.presetCabin", discount: "10%", descKey: "partner.profile.presetCabinDesc" },
  { nameKey: "partner.profile.presetPharmacy", discount: "5%", descKey: "partner.profile.presetPharmacyDesc" },
  { nameKey: "partner.profile.presetDoctor", discount: "15%", descKey: "partner.profile.presetDoctorDesc" },
  { nameKey: "partner.profile.presetAmbulance", discount: "10%", descKey: "partner.profile.presetAmbulanceDesc" },
  { nameKey: "partner.profile.presetDental", discount: "20%", descKey: "partner.profile.presetDentalDesc" },
  { nameKey: "partner.profile.presetSurgery", discount: "15%", descKey: "partner.profile.presetSurgeryDesc" },
];

function createDepartmentDiscountId(prefix = "dept") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
}

export function PartnerProfileSettingsTab({
  partner,
  isStaff,
  onProfileUpdated,
}: PartnerProfileSettingsTabProps) {
  const { t } = useLanguage();

  // Basic Form States
  const [name, setName] = useState(partner.name || "");
  const [address, setAddress] = useState(partner.address || "");
  const [phone, setPhone] = useState(partner.phone || "");
  const [emergencyPhone, setEmergencyPhone] = useState(partner.emergencyPhone || "");
  const [workingHours, setWorkingHours] = useState(partner.workingHours || "");
  const [discount, setDiscount] = useState(partner.discount || "");
  const [mapLink, setMapLink] = useState(partner.mapLink || "");
  const [imageUrl, setImageUrl] = useState(partner.imageUrl || "");

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

  const [departmentDiscounts, setDepartmentDiscounts] = useState<DepartmentDiscount[]>(parseInitialDiscounts());
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDiscount, setNewDeptDiscount] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddPreset = (preset: typeof PRESET_DEPARTMENTS[0]) => {
    const deptName = t(preset.nameKey);
    const deptDescription = t(preset.descKey);
    const exists = departmentDiscounts.some(
      (d) => d.name.toLowerCase() === deptName.toLowerCase()
    );
    if (exists) {
      toast.info(`"${deptName}" ${t("partner.profile.presetAlreadyAdded")}`);
      return;
    }
    const newItem: DepartmentDiscount = {
      id: createDepartmentDiscountId(),
      name: deptName,
      discount: preset.discount,
      description: deptDescription,
    };
    setDepartmentDiscounts((prev) => [...prev, newItem]);
    toast.success(`"${deptName}" ${t("partner.profile.presetAdded")}`);
  };

  const handleAddCustomDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptDiscount.trim()) {
      toast.error(t("partner.profile.fillDeptNameAndRate"));
      return;
    }
    const newItem: DepartmentDiscount = {
      id: createDepartmentDiscountId(),
      name: newDeptName.trim(),
      discount: newDeptDiscount.trim(),
      description: newDeptDesc.trim() || undefined,
    };
    setDepartmentDiscounts((prev) => [...prev, newItem]);
    setNewDeptName("");
    setNewDeptDiscount("");
    setNewDeptDesc("");
    setShowAddDeptForm(false);
    toast.success(t("partner.profile.deptAddedSuccess"));
  };

  const handleRemoveDept = (id?: string, name?: string) => {
    setDepartmentDiscounts((prev) => prev.filter((d) => (id ? d.id !== id : d.name !== name)));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim() || !discount.trim()) {
      toast.error(t("partner.profile.fillRequiredFields"));
      return;
    }

    setSaving(true);
    try {
      const res = await updatePartnerProfileAction({
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        discount: discount.trim(),
        emergencyPhone: emergencyPhone.trim() || undefined,
        workingHours: workingHours.trim() || undefined,
        mapLink: mapLink.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        departmentDiscounts: JSON.stringify(departmentDiscounts),
      });

      if (res.success && res.partner) {
        authStore.setCurrentPartner(res.partner);
        toast.success(t("partner.profile.updateSuccess"));
        onProfileUpdated(res.partner);
      } else {
        toast.error(res.error || t("partner.profile.updateFailed"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Settings Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Card 1: Basic Information */}
            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
                <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t("partner.profile.basicInfo")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t("partner.profile.basicInfoDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-name" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      {t("partner.profile.orgName")} *
                    </label>
                    <Input
                      id="partner-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={t("partner.profile.orgNamePlaceholder")}
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-address" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      {t("partner.profile.address")} *
                    </label>
                    <Input
                      id="partner-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder={t("partner.profile.addressPlaceholder")}
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-phone" className="text-xs font-semibold text-secondary dark:text-slate-200">
                      {t("partner.profile.phone")} *
                    </label>
                    <Input
                      id="partner-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder={t("partner.profile.phonePlaceholder")}
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-emergency-phone" className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <PhoneCall className="h-3.5 w-3.5" />
                      {t("partner.profile.emergencyPhone")}
                    </label>
                    <Input
                      id="partner-emergency-phone"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder={t("partner.profile.emergencyPhonePlaceholder")}
                      className="h-10 rounded-xl border-border bg-amber-500/5 focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-working-hours" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {t("partner.profile.workingHours")}
                    </label>
                    <Input
                      id="partner-working-hours"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      placeholder={t("partner.profile.workingHoursPlaceholder")}
                      className="h-10 rounded-xl border-border"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="partner-discount" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Percent className="h-3.5 w-3.5 text-primary" />
                      {t("partner.profile.baselineDiscount")} *
                    </label>
                    <Input
                      id="partner-discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      required
                      placeholder={t("partner.profile.baselineDiscountPlaceholder")}
                      className="h-10 rounded-xl border-border font-bold text-primary"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-map-link" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-primary" />
                      {t("partner.profile.mapLink")}
                    </label>
                    <Input
                      id="partner-map-link"
                      value={mapLink}
                      onChange={(e) => setMapLink(e.target.value)}
                      placeholder={t("partner.profile.mapLinkPlaceholder")}
                      className="h-10 rounded-xl border-border text-xs"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="partner-image-url" className="text-xs font-semibold text-secondary dark:text-slate-200 flex items-center gap-1">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      {t("partner.profile.imageUrl")}
                    </label>
                    <Input
                      id="partner-image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder={t("partner.profile.imageUrlPlaceholder")}
                      className="h-10 rounded-xl border-border text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Department Discount Breakdown Editor */}
            <Card className="border-border shadow-sm rounded-3xl">
              <CardHeader className="p-5 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
                      <Tag className="h-5 w-5 text-primary" />
                      {t("partner.profile.departmentDiscountsTitle")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-0.5">
                      {t("partner.profile.departmentDiscountsSubtitle")}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1">
                    {departmentDiscounts.length} {t("partner.profile.deptsActive")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0 space-y-5">
                {/* Presets Bar */}
                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-border">
                  <p className="text-xs font-bold text-secondary dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    {t("partner.profile.quickPresets")}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRESET_DEPARTMENTS.map((preset) => {
                      const deptName = t(preset.nameKey);
                      const isAdded = departmentDiscounts.some(
                        (d) => d.name.toLowerCase() === deptName.toLowerCase()
                      );
                      return (
                        <button
                          key={preset.nameKey}
                          type="button"
                          onClick={() => handleAddPreset(preset)}
                          disabled={isAdded}
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isAdded
                              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed"
                              : "bg-background text-secondary dark:text-slate-200 border-border hover:border-primary hover:text-primary hover:bg-primary/5 shadow-xs"
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                          <span>{deptName}</span>
                          <span className="font-bold text-primary font-mono ml-0.5">({preset.discount})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Custom Department Form Toggle */}
                {!showAddDeptForm ? (
                  <Button
                    type="button"
                    onClick={() => setShowAddDeptForm(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 font-semibold text-xs gap-1.5 h-9 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    {t("partner.profile.addDepartment")}
                  </Button>
                ) : (
                  <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3 animate-in fade-in duration-150">
                    <p className="text-xs font-bold text-primary">{t("partner.profile.addCustomDeptTitle")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <Input
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          placeholder={t("partner.profile.deptNameCustomPlaceholder")}
                          className="h-9 text-xs rounded-xl bg-background border-border"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Input
                          value={newDeptDiscount}
                          onChange={(e) => setNewDeptDiscount(e.target.value)}
                          placeholder={t("partner.profile.deptDiscountPlaceholder")}
                          className="h-9 text-xs rounded-xl bg-background border-border"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <Input
                          value={newDeptDesc}
                          onChange={(e) => setNewDeptDesc(e.target.value)}
                          placeholder={t("partner.profile.deptNotePlaceholder")}
                          className="h-9 text-xs rounded-xl bg-background border-border"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddDeptForm(false)}
                        className="h-8 text-xs rounded-xl cursor-pointer"
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddCustomDept}
                        size="sm"
                        className="h-8 text-xs rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold cursor-pointer"
                      >
                        {t("common.add")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Added Department Discounts List */}
                {departmentDiscounts.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground p-4">
                    {t("partner.profile.noDepartmentDiscounts")}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {departmentDiscounts.map((dept, index) => (
                      <div
                        key={dept.id || index}
                        className="p-3.5 rounded-2xl border border-border bg-background shadow-xs flex items-start justify-between gap-3 group hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-xs text-secondary dark:text-white truncate">
                              {dept.name}
                            </p>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 text-[10px] font-extrabold font-mono px-2 py-0.5">
                              {dept.discount}
                            </Badge>
                          </div>
                          {dept.description && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {dept.description}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveDept(dept.id, dept.name)}
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/20 gap-2 cursor-pointer"
              >
                <ShieldCheck className="h-5 w-5" />
                {saving ? t("partner.profile.saving") : t("partner.profile.saveChanges")}
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
          />
        </div>
      </div>
    </div>
  );
}
