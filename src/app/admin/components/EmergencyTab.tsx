"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Siren,
  Search,
  Plus,
  Droplet,
  Truck,
  PhoneCall,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  UPAZILAS_FENI,
  BLOOD_GROUPS,
} from "@/data/emergencyData";
import {
  getPaginatedDonorsAdminAction,
  getPaginatedAmbulancesAdminAction,
  getPaginatedHotlinesAdminAction,
  deleteBloodDonorAction,
  toggleBloodDonorAvailabilityAction,
  deleteAmbulanceAction,
  deleteHotlineAction,
} from "@/app/actions/emergencyAdminActions";
import { exportEmergencyData } from "@/lib/emergencyExport";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { useDebounce } from "@/hooks/useDebounce";

import { EmergencyDonorDialog } from "./EmergencyDonorDialog";
import { EmergencyAmbulanceDialog } from "./EmergencyAmbulanceDialog";
import { EmergencyHotlineDialog } from "./EmergencyHotlineDialog";
import { EmergencyDeleteDialog } from "./emergency/EmergencyDeleteDialog";
import { EmergencyDonorsList } from "./emergency/EmergencyDonorsList";
import { EmergencyAmbulancesList } from "./emergency/EmergencyAmbulancesList";
import { EmergencyHotlinesList } from "./emergency/EmergencyHotlinesList";




export function EmergencyTab() {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const [activeSubTab, setActiveSubTab] = useState<"donors" | "ambulances" | "hotlines">("donors");
  const [loading, setLoading] = useState(true);

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

  // Dialog & modal states
  const [donorDialogOpen, setDonorDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const [ambulanceDialogOpen, setAmbulanceDialogOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<AmbulanceService | null>(null);
  const [hotlineDialogOpen, setHotlineDialogOpen] = useState(false);
  const [editingHotline, setEditingHotline] = useState<EmergencyHotline | null>(null);
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
      if (activeSubTab === "donors") {
        const res = await getPaginatedDonorsAdminAction({
          page,
          pageSize,
          search: debouncedSearch,
          group: selectedGroup,
          upazila: selectedUpazila,
        });
        setDonors(res.data);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
      } else if (activeSubTab === "ambulances") {
        const res = await getPaginatedAmbulancesAdminAction({
          page,
          pageSize,
          search: debouncedSearch,
        });
        setAmbulances(res.data);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
      } else {
        const res = await getPaginatedHotlinesAdminAction({
          page,
          pageSize,
          search: debouncedSearch,
        });
        setHotlines(res.data);
        setTotalItems(res.totalItems);
        setTotalPages(res.totalPages);
      }
    } catch {
      toast.error(isEn ? "Failed to load emergency data" : "জরুরি সেবার তথ্য লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }, [activeSubTab, page, pageSize, debouncedSearch, selectedGroup, selectedUpazila, isEn]);

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

          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border">
            <Button
              size="sm"
              variant={activeSubTab === "donors" ? "default" : "ghost"}
              onClick={() => {
                setActiveSubTab("donors");
                setSearch("");
                setPage(1);
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <Droplet className="h-3.5 w-3.5" />
              <span>{isEn ? "Blood Donors" : "রক্তদাতা"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {activeSubTab === "donors" ? totalItems : donors.length}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "ambulances" ? "default" : "ghost"}
              onClick={() => {
                setActiveSubTab("ambulances");
                setSearch("");
                setPage(1);
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{isEn ? "Ambulances" : "অ্যাম্বুলেন্স"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {activeSubTab === "ambulances" ? totalItems : ambulances.length}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "hotlines" ? "default" : "ghost"}
              onClick={() => {
                setActiveSubTab("hotlines");
                setSearch("");
                setPage(1);
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{isEn ? "Hotlines & Oxygen" : "হটলাইন ও অক্সিজেন"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {activeSubTab === "hotlines" ? totalItems : hotlines.length}
              </Badge>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={
                    activeSubTab === "donors"
                      ? isEn ? "Search donor by name, phone..." : "নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                      : activeSubTab === "ambulances"
                      ? isEn ? "Search ambulance by agency, area..." : "অ্যাম্বুলেন্স বা এলাকা খুঁজুন..."
                      : isEn ? "Search hotline or oxygen..." : "হটলাইন বা অক্সিজেন খুঁজুন..."
                  }
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 h-9 text-xs border-border bg-background"
                />
              </div>

              {activeSubTab === "donors" && (
                <>
                  <select
                    value={selectedGroup}
                    onChange={(e) => {
                      setSelectedGroup(e.target.value);
                      setPage(1);
                    }}
                    className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
                  >
                    <option value="all">{isEn ? "All Blood Groups" : "সকল রক্তের গ্রুপ"}</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedUpazila}
                    onChange={(e) => {
                      setSelectedUpazila(e.target.value);
                      setPage(1);
                    }}
                    className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
                  >
                    {UPAZILAS_FENI.map((u) => (
                      <option key={u.id} value={u.id}>
                        {isEn ? u.nameEn : u.nameBn}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="text-xs h-9 font-semibold gap-1.5 border-border"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isEn ? "Export" : "এক্সপোর্ট"}</span>
              </Button>

              {activeSubTab === "donors" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingDonor(null);
                    setDonorDialogOpen(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 font-bold gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isEn ? "Add Donor" : "রক্তদাতা যুক্ত করুন"}</span>
                </Button>
              )}

              {activeSubTab === "ambulances" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingAmbulance(null);
                    setAmbulanceDialogOpen(true);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs h-9 font-bold gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isEn ? "Add Ambulance" : "অ্যাম্বুলেন্স যুক্ত করুন"}</span>
                </Button>
              )}

              {activeSubTab === "hotlines" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingHotline(null);
                    setHotlineDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary-dark text-white text-xs h-9 font-bold gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isEn ? "Add Hotline" : "হটলাইন যুক্ত করুন"}</span>
                </Button>
              )}
            </div>
          </div>

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
      <EmergencyDonorDialog
        open={donorDialogOpen}
        onOpenChange={setDonorDialogOpen}
        donor={editingDonor}
        onSuccess={loadData}
      />

      <EmergencyAmbulanceDialog
        open={ambulanceDialogOpen}
        onOpenChange={setAmbulanceDialogOpen}
        ambulance={editingAmbulance}
        onSuccess={loadData}
      />

      <EmergencyHotlineDialog
        open={hotlineDialogOpen}
        onOpenChange={setHotlineDialogOpen}
        hotline={editingHotline}
        onSuccess={loadData}
      />

      <EmergencyDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        itemName={deletingItem?.name}
        isEn={isEn}
        deleting={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

