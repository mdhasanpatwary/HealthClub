"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Stethoscope,
  Plus,
  Link as LinkIcon,
  Search,
  Building2,
  Calendar,
  Clock,
  Phone,
  Banknote,
  Edit3,
  Unlink,
  Download,
  Users,
  Activity,
  Layers,
} from "lucide-react";
import { Doctor, Partner } from "@/services/db";
import { getPartnerDoctorsAction } from "@/app/actions/partnerDoctorActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToCsv } from "@/lib/exportUtils";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { DoctorAvatar } from "@/components/ui/doctors/DoctorModals";
import { DoctorAvailabilityBadge, DoctorNoticeBanner } from "@/components/ui/doctors/DoctorAvailabilityBadge";
import {
  AddPartnerDoctorModal,
  LinkDoctorModal,
  EditChamberScheduleDialog,
  UnlinkDoctorDialog,
  DEPT_OPTIONS,
} from "./PartnerDoctorModals";
import { toast } from "sonner";

interface PartnerDoctorsTabProps {
  partner: Partner;
}

export function PartnerDoctorsTab({ partner }: PartnerDoctorsTabProps) {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [unlinkingDoctor, setUnlinkingDoctor] = useState<Doctor | null>(null);

  const fetchRoster = useCallback(async () => {
    try {
      const res = await getPartnerDoctorsAction();
      if (res.success) {
        setDoctors(res.doctors);
      } else {
        toast.error(res.error || t("partner.doctors.loadError"));
      }
    } catch {
      toast.error(t("common.error.server"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        fetchRoster();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [fetchRoster]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.degrees.toLowerCase().includes(q) ||
        (doc.roomNo && doc.roomNo.toLowerCase().includes(q)) ||
        doc.visitingDays.toLowerCase().includes(q);

      const matchesDept = selectedDept === "all" || doc.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [doctors, searchQuery, selectedDept]);

  // Statistics
  const totalDoctors = doctors.length;
  const activeChambers = doctors.filter((d) => d.isActive).length;
  const uniqueDepts = useMemo(() => {
    return new Set(doctors.map((d) => d.department)).size;
  }, [doctors]);

  const handleExportCsv = () => {
    if (doctors.length === 0) {
      toast.info(t("partner.doctors.noDoctorsToExport"));
      return;
    }
    exportToCsv(doctors, `${partner.name.replace(/\s+/g, "_")}_doctors`, [
      { header: "Doctor ID", accessor: "id" },
      { header: "Doctor Name", accessor: "name" },
      { header: "Specialty", accessor: "specialty" },
      { header: "Department", accessor: "department" },
      { header: "Degrees", accessor: "degrees" },
      { header: "Designation", accessor: (d) => d.designation || "" },
      { header: "Room No", accessor: (d) => d.roomNo || "" },
      { header: "Visiting Days", accessor: "visitingDays" },
      { header: "Visiting Hours", accessor: "visitingHours" },
      { header: "Serial Phone", accessor: "serialPhone" },
      { header: "Consultation Fee", accessor: (d) => d.consultationFee || "" },
      { header: "Status", accessor: (d) => (d.isActive ? "Active" : "Inactive") },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/80 bg-gradient-to-br from-card to-muted/30 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("partner.doctors.kpiTotal")}
              </p>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {loading ? <Skeleton className="h-7 w-12 inline-block" /> : totalDoctors}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-muted/30 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("partner.doctors.kpiActive")}
              </p>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {loading ? <Skeleton className="h-7 w-12 inline-block" /> : activeChambers}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-gradient-to-br from-card to-muted/30 shadow-sm rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {t("partner.doctors.kpiDepts")}
              </p>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {loading ? <Skeleton className="h-7 w-12 inline-block" /> : uniqueDepts}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Roster Container */}
      <Card className="border-border shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
                <Stethoscope className="h-5 w-5 text-primary" />
                <span>{t("partner.doctors.title")}</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t("partner.doctors.subtitle")}
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <Button
                onClick={handleExportCsv}
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t("partner.doctors.exportCsv")}</span>
              </Button>

              <Button
                onClick={() => setIsLinkOpen(true)}
                variant="secondary"
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
              >
                <LinkIcon className="h-3.5 w-3.5 text-primary" />
                <span>{t("partner.doctors.linkDoctor")}</span>
              </Button>

              <Button
                onClick={() => setIsAddOpen(true)}
                size="sm"
                className="gap-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 shrink-0 cursor-pointer shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t("partner.doctors.addDoctor")}</span>
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("partner.doctors.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl bg-background border-border text-xs sm:text-sm"
              />
            </div>

            <div className="w-full sm:w-64 shrink-0">
              <select
                aria-label={t("partner.doctors.filterAllDepts")}
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{t("partner.doctors.filterAllDepts")}</option>
                {DEPT_OPTIONS.map((dept) => (
                  <option key={dept.value} value={dept.value}>{dept.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/10 space-y-3">
              <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                <Stethoscope className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-foreground">
                {doctors.length === 0
                  ? t("partner.doctors.noDoctors")
                  : t("partner.doctors.noDoctorsFound")}
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {doctors.length === 0
                  ? t("partner.doctors.noDoctorsDesc")
                  : t("partner.doctors.noDoctorsFoundDesc")}
              </p>
              {doctors.length === 0 && (
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    onClick={() => setIsLinkOpen(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs"
                  >
                    {t("partner.doctors.linkDoctor")}
                  </Button>
                  <Button
                    onClick={() => setIsAddOpen(true)}
                    size="sm"
                    className="rounded-xl text-xs bg-primary text-white"
                  >
                    {t("partner.doctors.addDoctor")}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  {/* Doctor Top Header */}
                  <div className="flex items-start gap-3.5">
                    <DoctorAvatar
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shrink-0"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-foreground font-heading group-hover:text-primary transition-colors truncate">
                          {doc.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/30 text-[10px] font-semibold py-0.5 px-2"
                        >
                          {doc.department}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <DoctorAvailabilityBadge doctor={doc} size="sm" />
                      </div>

                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
                        {doc.specialty}
                      </p>

                      {doc.degrees && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{doc.degrees}</p>
                      )}
                      {doc.designation && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">{doc.designation}</p>
                      )}
                    </div>
                  </div>

                  {doc.notice && (
                    <DoctorNoticeBanner notice={doc.notice} compact />
                  )}

                  {/* Chamber Details Badge Box */}
                  <div className="rounded-xl bg-muted/40 dark:bg-slate-900/50 p-3 border border-border/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Building2 className="h-3.5 w-3.5" />
                        {doc.roomNo || t("partner.doctors.noRoomAssigned")}
                      </span>
                      {doc.consultationFee && (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <Banknote className="h-3 w-3" />
                          {doc.consultationFee}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.visitingDays}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.visitingHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2 truncate text-slate-700 dark:text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-semibold">{doc.serialPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                      onClick={() => setEditingDoctor(doc)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-semibold gap-1.5 h-8 border-border hover:border-primary/50 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-primary" />
                      <span>{t("partner.doctors.editChamber")}</span>
                    </Button>

                    <Button
                      onClick={() => setUnlinkingDoctor(doc)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs font-semibold gap-1.5 h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer shrink-0"
                    >
                      <Unlink className="h-3.5 w-3.5" />
                      <span>{t("partner.doctors.unlink")}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddPartnerDoctorModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        partnerPhone={partner.phone}
        onSuccess={fetchRoster}
      />

      <LinkDoctorModal
        isOpen={isLinkOpen}
        onClose={() => setIsLinkOpen(false)}
        partnerPhone={partner.phone}
        onSuccess={fetchRoster}
      />

      <EditChamberScheduleDialog
        doctor={editingDoctor}
        isOpen={Boolean(editingDoctor)}
        onClose={() => setEditingDoctor(null)}
        onSuccess={fetchRoster}
      />

      <UnlinkDoctorDialog
        doctor={unlinkingDoctor}
        isOpen={Boolean(unlinkingDoctor)}
        onClose={() => setUnlinkingDoctor(null)}
        onSuccess={fetchRoster}
      />
    </div>
  );
}
