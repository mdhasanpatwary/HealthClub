"use client";

import { useState, useEffect, useCallback } from "react";
import { Siren, Droplet, Truck, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
} from "@/data/emergencyData";
import {
  getPaginatedDonorsAdminAction,
  getPaginatedAmbulancesAdminAction,
  getPaginatedHotlinesAdminAction,
  getEmergencyCountsAdminAction,
  approveBloodDonorAction,
  approveAmbulanceAction,
  deleteBloodDonorAction,
  toggleBloodDonorAvailabilityAction,
  deleteAmbulanceAction,
  deleteHotlineAction,
} from "@/app/actions/emergencyAdminActions";
import { exportEmergencyData } from "@/lib/emergencyExport";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useDebounce } from "@/hooks/useDebounce";
import { EmergencyDonorDialog } from "./EmergencyDonorDialog";
import { EmergencyAmbulanceDialog } from "./EmergencyAmbulanceDialog";
import { EmergencyHotlineDialog } from "./EmergencyHotlineDialog";
import { EmergencyDeleteDialog } from "./emergency/EmergencyDeleteDialog";
import { EmergencyDonorsList } from "./emergency/EmergencyDonorsList";
import { EmergencyAmbulancesList } from "./emergency/EmergencyAmbulancesList";
import { EmergencyHotlinesList } from "./emergency/EmergencyHotlinesList";
import { EmergencyFilterBar } from "./emergency/EmergencyFilterBar";
import { BulkImportDialog } from "./BulkImportDialog";

export function EmergencyTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeSubTab, setActiveSubTab] = useState<"donors" | "ambulances" | "hotlines">("donors");
  const [loading, setLoading] = useState(true);

  // Tab counts state
  const [counts, setCounts] = useState<{
    donors: number;
    ambulances: number;
    hotlines: number;
  }>({
    donors: 0,
    ambulances: 0,
    hotlines: 0,
  });

  // Data states
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceService[]>([]);
  const [hotlines, setHotlines] = useState<EmergencyHotline[]>([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search & Filter
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all");
  const [ambulanceTypeFilter, setAmbulanceTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog & modal states
  const [donorDialogOpen, setDonorDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const [ambulanceDialogOpen, setAmbulanceDialogOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<AmbulanceService | null>(null);
  const [hotlineDialogOpen, setHotlineDialogOpen] = useState(false);
  const [editingHotline, setEditingHotline] = useState<EmergencyHotline | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    name: string;
    type: "donor" | "ambulance" | "hotline";
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [countsRes, listRes] = await Promise.all([
        getEmergencyCountsAdminAction(),
        activeSubTab === "donors"
          ? getPaginatedDonorsAdminAction({
              page,
              pageSize,
              search: debouncedSearch,
              group: selectedGroup,
              upazila: selectedUpazila,
              status: statusFilter,
            })
          : activeSubTab === "ambulances"
          ? getPaginatedAmbulancesAdminAction({
              page,
              pageSize,
              search: debouncedSearch,
              type: ambulanceTypeFilter,
              status: statusFilter,
            })
          : getPaginatedHotlinesAdminAction({
              page,
              pageSize,
              search: debouncedSearch,
            }),
      ]);

      if (countsRes) {
        setCounts({
          donors: countsRes.donors,
          ambulances: countsRes.ambulances,
          hotlines: countsRes.hotlines,
        });
      }

      if (activeSubTab === "donors") {
        setDonors(listRes.data as BloodDonor[]);
      } else if (activeSubTab === "ambulances") {
        setAmbulances(listRes.data as AmbulanceService[]);
      } else {
        setHotlines(listRes.data as EmergencyHotline[]);
      }
      setTotalItems(listRes.totalItems);
      setTotalPages(listRes.totalPages);
    } catch {
      toast.error(isEn ? "Failed to load emergency data" : "জরুরি সেবার তথ্য লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }, [activeSubTab, page, pageSize, debouncedSearch, selectedGroup, selectedUpazila, ambulanceTypeFilter, statusFilter, isEn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) loadData();
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleToggleAvailability = async (id: string) => {
    const res = await toggleBloodDonorAvailabilityAction(id);
    if (res.success) {
      toast.success(isEn ? "Availability status updated!" : "স্ট্যাটাস পরিবর্তন হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || (isEn ? "Failed to update status" : "আপডেট ব্যর্থ হয়েছে"));
    }
  };

  const handleApproveDonor = async (id: string) => {
    const res = await approveBloodDonorAction(id);
    if (res.success) {
      toast.success(isEn ? "Blood donor approved & live in directory!" : "রক্তদাতা সফলভাবে অনুমোদিত হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || (isEn ? "Failed to approve donor" : "অনুমোদন ব্যর্থ হয়েছে"));
    }
  };

  const handleApproveAmbulance = async (id: string) => {
    const res = await approveAmbulanceAction(id);
    if (res.success) {
      toast.success(isEn ? "Ambulance service approved & live in directory!" : "অ্যাম্বুলেন্স সার্ভিস অনুমোদিত হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || (isEn ? "Failed to approve ambulance" : "অনুমোদন ব্যর্থ হয়েছে"));
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      let res: { success: boolean; error?: string };
      if (deletingItem.type === "donor") {
        res = await deleteBloodDonorAction(deletingItem.id);
      } else if (deletingItem.type === "ambulance") {
        res = await deleteAmbulanceAction(deletingItem.id);
      } else {
        res = await deleteHotlineAction(deletingItem.id);
      }

      if (res.success) {
        toast.success(isEn ? "Deleted successfully!" : "সফলভাবে মুছে ফেলা হয়েছে!");
        setDeleteModalOpen(false);
        setDeletingItem(null);
        loadData();
      } else {
        toast.error(res.error || (isEn ? "Failed to delete" : "মুছে ফেলা ব্যর্থ হয়েছে"));
      }
    } catch {
      toast.error(isEn ? "Error deleting item" : "সমস্যা দেখা দিয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    exportEmergencyData(activeSubTab, donors, ambulances, hotlines);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-secondary dark:text-white flex items-center gap-2">
              <Siren className="h-5 w-5 text-rose-600" />
              <span>{isEn ? "Emergency Services Management" : "জরুরি স্বাস্থ্য সেবা ব্যবস্থাপনা"}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {isEn
                ? "Manage blood donors, ambulances, and emergency hotlines in Feni."
                : "ফেনীর রক্তদাতা, অ্যাম্বুলেন্স সার্ভিস এবং অক্সিজেন ও জরুরি হটলাইন পরিচালনা করুন।"}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border w-full sm:w-auto">
            <Button
              size="sm"
              variant={activeSubTab === "donors" ? "default" : "ghost"}
              onClick={() => { setActiveSubTab("donors"); setSearch(""); setPage(1); }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5 flex-1 sm:flex-initial shrink-0 justify-center"
            >
              <Droplet className="h-3.5 w-3.5" />
              <span>{isEn ? "Blood Donors" : "রক্তদাতা"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {formatNum(counts.donors, locale)}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "ambulances" ? "default" : "ghost"}
              onClick={() => { setActiveSubTab("ambulances"); setSearch(""); setPage(1); }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5 flex-1 sm:flex-initial shrink-0 justify-center"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{isEn ? "Ambulances" : "অ্যাম্বুলেন্স"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {formatNum(counts.ambulances, locale)}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "hotlines" ? "default" : "ghost"}
              onClick={() => { setActiveSubTab("hotlines"); setSearch(""); setPage(1); }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5 flex-1 sm:flex-initial shrink-0 justify-center"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{isEn ? "Hotlines & Oxygen" : "হটলাইন ও অক্সিজেন"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {formatNum(counts.hotlines, locale)}
              </Badge>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <EmergencyFilterBar
            activeSubTab={activeSubTab}
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            selectedGroup={selectedGroup}
            onGroupChange={(val) => {
              setSelectedGroup(val);
              setPage(1);
            }}
            selectedUpazila={selectedUpazila}
            onUpazilaChange={(val) => {
              setSelectedUpazila(val);
              setPage(1);
            }}
            ambulanceTypeFilter={ambulanceTypeFilter}
            onAmbulanceTypeChange={(val) => {
              setAmbulanceTypeFilter(val);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            onImportClick={() => setImportDialogOpen(true)}
            onExportClick={handleExport}
            onAddClick={() => {
              if (activeSubTab === "donors") {
                setEditingDonor(null);
                setDonorDialogOpen(true);
              } else if (activeSubTab === "ambulances") {
                setEditingAmbulance(null);
                setAmbulanceDialogOpen(true);
              } else {
                setEditingHotline(null);
                setHotlineDialogOpen(true);
              }
            }}
            isEn={isEn}
          />

          {activeSubTab === "donors" ? (
            <EmergencyDonorsList
              donors={donors}
              totalItems={totalItems}
              totalPages={totalPages}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              isEn={isEn}
              onEdit={(d) => {
                setEditingDonor(d);
                setDonorDialogOpen(true);
              }}
              onDelete={(id, name) => {
                setDeletingItem({ id, name, type: "donor" });
                setDeleteModalOpen(true);
              }}
              onToggleStatus={handleToggleAvailability}
              onApprove={handleApproveDonor}
              loading={loading}
            />
          ) : activeSubTab === "ambulances" ? (
            <EmergencyAmbulancesList
              ambulances={ambulances}
              totalItems={totalItems}
              totalPages={totalPages}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              isEn={isEn}
              onEdit={(a) => {
                setEditingAmbulance(a);
                setAmbulanceDialogOpen(true);
              }}
              onDelete={(id, name) => {
                setDeletingItem({ id, name, type: "ambulance" });
                setDeleteModalOpen(true);
              }}
              onApprove={handleApproveAmbulance}
              loading={loading}
            />
          ) : (
            <EmergencyHotlinesList
              hotlines={hotlines}
              totalItems={totalItems}
              totalPages={totalPages}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              isEn={isEn}
              onEdit={(h) => {
                setEditingHotline(h);
                setHotlineDialogOpen(true);
              }}
              onDelete={(id, name) => {
                setDeletingItem({ id, name, type: "hotline" });
                setDeleteModalOpen(true);
              }}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EmergencyDonorDialog open={donorDialogOpen} onOpenChange={setDonorDialogOpen} donor={editingDonor} onSuccess={loadData} />
      <EmergencyAmbulanceDialog open={ambulanceDialogOpen} onOpenChange={setAmbulanceDialogOpen} ambulance={editingAmbulance} onSuccess={loadData} />
      <EmergencyHotlineDialog open={hotlineDialogOpen} onOpenChange={setHotlineDialogOpen} hotline={editingHotline} onSuccess={loadData} />
      <EmergencyDeleteDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen} itemName={deletingItem?.name} isEn={isEn} deleting={deleting} onConfirm={confirmDelete} />
      {importDialogOpen && (
        <BulkImportDialog
          isOpen={importDialogOpen}
          onClose={() => setImportDialogOpen(false)}
          entityType={activeSubTab}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
