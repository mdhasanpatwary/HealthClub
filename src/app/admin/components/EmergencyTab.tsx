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
  getEmergencyCountsAdminAction,
  approveBloodDonorAction,
  approveAmbulanceAction,
  deleteBloodDonorAction,
  toggleBloodDonorAvailabilityAction,
  deleteAmbulanceAction,
} from "@/app/actions/emergencyAdminActions";
import {
  getPaginatedHotlinesAdminAction,
  deleteHotlineAction,
} from "@/app/actions/emergencyHotlineActions";
import { exportEmergencyData } from "@/lib/emergencyExport";
import { toast } from "sonner";
import { toBanglaNums } from "@/lib/utils";
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
      toast.error("জরুরি সেবার তথ্য লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }, [activeSubTab, page, pageSize, debouncedSearch, selectedGroup, selectedUpazila, ambulanceTypeFilter, statusFilter]);

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
      toast.success("স্ট্যাটাস পরিবর্তন হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || "আপডেট ব্যর্থ হয়েছে");
    }
  };

  const handleApproveDonor = async (id: string) => {
    const res = await approveBloodDonorAction(id);
    if (res.success) {
      toast.success("রক্তদাতা সফলভাবে অনুমোদিত হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || "অনুমোদন ব্যর্থ হয়েছে");
    }
  };

  const handleApproveAmbulance = async (id: string) => {
    const res = await approveAmbulanceAction(id);
    if (res.success) {
      toast.success("অ্যাম্বুলেন্স সার্ভিস অনুমোদিত হয়েছে!");
      loadData();
    } else {
      toast.error(res.error || "অনুমোদন ব্যর্থ হয়েছে");
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
        toast.success("সফলভাবে মুছে ফেলা হয়েছে!");
        setDeleteModalOpen(false);
        setDeletingItem(null);
        loadData();
      } else {
        toast.error(res.error || "মুছে ফেলা ব্যর্থ হয়েছে");
      }
    } catch {
      toast.error("সমস্যা দেখা দিয়েছে");
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
              <span>জরুরি স্বাস্থ্য সেবা ব্যবস্থাপনা</span>
            </CardTitle>
            <CardDescription className="text-xs">
              ফেনীর রক্তদাতা, অ্যাম্বুলেন্স সার্ভিস এবং অক্সিজেন ও জরুরি হটলাইন পরিচালনা করুন।
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
              <span>রক্তদাতা</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {toBanglaNums(counts.donors)}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "ambulances" ? "default" : "ghost"}
              onClick={() => { setActiveSubTab("ambulances"); setSearch(""); setPage(1); }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5 flex-1 sm:flex-initial shrink-0 justify-center"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>অ্যাম্বুলেন্স</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {toBanglaNums(counts.ambulances)}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "hotlines" ? "default" : "ghost"}
              onClick={() => { setActiveSubTab("hotlines"); setSearch(""); setPage(1); }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5 flex-1 sm:flex-initial shrink-0 justify-center"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>হটলাইন ও অক্সিজেন</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {toBanglaNums(counts.hotlines)}
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
      <EmergencyDeleteDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen} itemName={deletingItem?.name} deleting={deleting} onConfirm={confirmDelete} />
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
