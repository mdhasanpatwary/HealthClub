"use client";

import { useState } from "react";
import { Tag, Sparkles, Plus, Trash2 } from "lucide-react";
import { DepartmentDiscount } from "@/services/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRESET_DEPARTMENTS, createDepartmentDiscountId } from "./presetDepartments";
import { toast } from "sonner";

interface PartnerDepartmentDiscountsCardProps {
  departmentDiscounts: DepartmentDiscount[];
  setDepartmentDiscounts: React.Dispatch<React.SetStateAction<DepartmentDiscount[]>>;
  t: (key: string) => string;
}

export function PartnerDepartmentDiscountsCard({
  departmentDiscounts,
  setDepartmentDiscounts,
  t,
}: PartnerDepartmentDiscountsCardProps) {
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptDiscount, setNewDeptDiscount] = useState("");
  const [newDeptDesc, setNewDeptDesc] = useState("");
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);

  const handleAddPreset = (preset: (typeof PRESET_DEPARTMENTS)[0]) => {
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
    setDepartmentDiscounts((prev) =>
      prev.filter((d) => (id ? d.id !== id : d.name !== name))
    );
  };

  return (
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
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1"
          >
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
                  <span className="font-bold text-primary font-mono ml-0.5">
                    ({preset.discount})
                  </span>
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
            <p className="text-xs font-bold text-primary">
              {t("partner.profile.addCustomDeptTitle")}
            </p>
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
                  title={t("common.delete")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
