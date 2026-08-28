"use client";

import { useState } from "react";
import { CheckCircle2, Building2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { addPartnerRequestAction } from "@/app/actions/partnerActions";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { toast } from "sonner";

export default function BecomePartnerPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    orgName: "",
    category: "hospital",
    address: "",
    discount: "",
    contactName: "",
    phone: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPartnerRequestAction({
        orgName: formData.orgName,
        category: formData.category as "hospital" | "diagnostic" | "pharmacy",
        address: formData.address,
        discount: formData.discount,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email || null,
      });
      setSubmitted(true);
      toast.success(t("becomePartner.successTitle"));
      setFormData({
        orgName: "",
        category: "hospital",
        address: "",
        discount: "",
        contactName: "",
        phone: "",
        email: ""
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("common.error");
      toast.error(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary tracking-widest uppercase font-mono">{t("becomePartner.tagline")}</span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary dark:text-white">
            {t("becomePartner.heroTitle")}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("becomePartner.heroSubtitle")}
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
          
          {/* Information & Perks (2 cols) */}
          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
                {t("becomePartner.perksTitle")}
              </h3>
              
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">{t("becomePartner.perk1Title")}</h4>
                    <p className="text-xs mt-0.5">{t("becomePartner.perk1Desc")}</p>
                  </div>
                </li>
                
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">{t("becomePartner.perk2Title")}</h4>
                    <p className="text-xs mt-0.5">{t("becomePartner.perk2Desc")}</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary dark:text-slate-300">{t("becomePartner.perk3Title")}</h4>
                    <p className="text-xs mt-0.5">{t("becomePartner.perk3Desc")}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-muted border border-border flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-secondary dark:text-white">{t("becomePartner.helpTitle")}</p>
                <p className="text-muted-foreground">{t("becomePartner.helpDesc")}</p>
                <p className="font-bold text-primary font-mono">+880 1886763849</p>
              </div>
            </div>
          </div>

          {/* Form Card (3 cols) */}
          <Card className="md:col-span-3 border border-border bg-background/50 backdrop-blur shadow-lg">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto animate-bounce" />
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white">
                    {t("becomePartner.successTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {t("becomePartner.successDesc")}
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4 border-primary text-primary hover:bg-primary-light">
                    {t("becomePartner.newApplication")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading text-xl font-bold text-secondary dark:text-white mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {t("becomePartner.formTitle")}
                  </h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="partner-orgName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.hospitalName")}</label>
                    <Input
                      id="partner-orgName"
                      type="text"
                      name="orgName"
                      required
                      value={formData.orgName}
                      onChange={handleChange}
                      placeholder={t("becomePartner.orgNamePlaceholder")}
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="partner-category" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.category")}</label>
                      <select
                        id="partner-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                      >
                        <option value="hospital">{t("becomePartner.categoryHospital")}</option>
                        <option value="diagnostic">{t("becomePartner.categoryDiagnostic")}</option>
                        <option value="pharmacy">{t("becomePartner.categoryPharmacy")}</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="partner-discount" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.discountOffer")}</label>
                      <Input
                        id="partner-discount"
                        type="text"
                        name="discount"
                        required
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder={t("becomePartner.discountPlaceholder")}
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="partner-address" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.address")}</label>
                    <Input
                      id="partner-address"
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t("becomePartner.addressPlaceholder")}
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="partner-contactName" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.contactPerson")}</label>
                    <Input
                      id="partner-contactName"
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder={t("becomePartner.contactNamePlaceholder")}
                      className="border-border bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="partner-phone" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.phone")}</label>
                      <Input
                        id="partner-phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="017XXXXXXXX"
                        className="border-border bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="partner-email" className="text-xs font-semibold text-secondary dark:text-white cursor-pointer">{t("becomePartner.email")}</label>
                      <Input
                        id="partner-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="partner@hospital.com"
                        className="border-border bg-background"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold">
                    {t("becomePartner.submit")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
