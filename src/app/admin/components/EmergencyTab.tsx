"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Siren,
  Search,
  Plus,
  Trash2,
  Droplet,
  Truck,
  PhoneCall,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  UPAZILAS_FENI,
  BLOOD_GROUPS,
} from "@/data/emergencyData";
import {
  getEmergencyDataAction,
  deleteBloodDonorAction,
  toggleBloodDonorAvailabilityAction,
  deleteAmbulanceAction,
  deleteHotlineAction,
} from "@/app/actions/emergencyAdminActions";
import { exportToCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { EmergencyDonorDialog } from "./EmergencyDonorDialog";
import { EmergencyAmbulanceDialog } from "./EmergencyAmbulanceDialog";
import { EmergencyHotlineDialog } from "./EmergencyHotlineDialog";
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

  // Search & Filter
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("all");

  // Dialog states
  const [donorDialogOpen, setDonorDialogOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);

  const [ambulanceDialogOpen, setAmbulanceDialogOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<AmbulanceService | null>(null);

  const [hotlineDialogOpen, setHotlineDialogOpen] = useState(false);
  const [editingHotline, setEditingHotline] = useState<EmergencyHotline | null>(null);

  // Delete modal
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
      const res = await getEmergencyDataAction();
      setDonors(res.bloodDonors);
      setAmbulances(res.ambulances);
      setHotlines(res.hotlines);
    } catch (err) {
      console.error(err);
      toast.error(isEn ? "Failed to load emergency data" : "জরুরি সেবার তথ্য লোড করতে ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }, [isEn]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) loadData();
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  // Filtered lists
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search);
      const matchGroup = selectedGroup === "all" || d.bloodGroup === selectedGroup;
      const matchUpazila = selectedUpazila === "all" || d.upazila === selectedUpazila;
      return matchSearch && matchGroup && matchUpazila;
    });
  }, [donors, search, selectedGroup, selectedUpazila]);

  const filteredAmbulances = useMemo(() => {
    return ambulances.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search)
    );
  }, [ambulances, search]);

  const filteredHotlines = useMemo(() => {
    return hotlines.filter(
      (h) =>
        h.titleBn.toLowerCase().includes(search.toLowerCase()) ||
        h.titleEn.toLowerCase().includes(search.toLowerCase()) ||
        h.phone.includes(search)
    );
  }, [hotlines, search]);

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
    } catch (err) {
      console.error(err);
      toast.error(isEn ? "Error deleting item" : "সমস্যা দেখা দিয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    if (activeSubTab === "donors") {
      exportToCsv(filteredDonors, "healthclub_blood_donors", [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Blood Group", accessor: "bloodGroup" },
        { header: "Upazila", accessor: "upazila" },
        { header: "Phone", accessor: "phone" },
        { header: "Last Donated", accessor: "lastDonated" },
        { header: "Available", accessor: (d) => (d.isAvailable ? "Yes" : "No") },
      ]);
    } else if (activeSubTab === "ambulances") {
      exportToCsv(filteredAmbulances, "healthclub_ambulances", [
        { header: "ID", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Type", accessor: "type" },
        { header: "Location", accessor: "location" },
        { header: "Phone", accessor: "phone" },
        { header: "Hours", accessor: "availableHours" },
      ]);
    } else {
      exportToCsv(filteredHotlines, "healthclub_emergency_hotlines", [
        { header: "ID", accessor: "id" },
        { header: "Title (BN)", accessor: "titleBn" },
        { header: "Title (EN)", accessor: "titleEn" },
        { header: "Category", accessor: "category" },
        { header: "Phone", accessor: "phone" },
        { header: "Description", accessor: "descriptionBn" },
      ]);
    }
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
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <Droplet className="h-3.5 w-3.5" />
              <span>{isEn ? "Blood Donors" : "রক্তদাতা"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {donors.length}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "ambulances" ? "default" : "ghost"}
              onClick={() => {
                setActiveSubTab("ambulances");
                setSearch("");
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{isEn ? "Ambulances" : "অ্যাম্বুলেন্স"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {ambulances.length}
              </Badge>
            </Button>

            <Button
              size="sm"
              variant={activeSubTab === "hotlines" ? "default" : "ghost"}
              onClick={() => {
                setActiveSubTab("hotlines");
                setSearch("");
              }}
              className="text-xs h-8 rounded-lg font-bold gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{isEn ? "Hotlines & Oxygen" : "হটলাইন ও অক্সিজেন"}</span>
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {hotlines.length}
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs border-border bg-background"
                />
              </div>

              {activeSubTab === "donors" && (
                <>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
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
                    onChange={(e) => setSelectedUpazila(e.target.value)}
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

          {loading ? (
            <div className="py-12 flex justify-center items-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>{isEn ? "Loading emergency directory..." : "তথ্য লোড হচ্ছে..."}</span>
            </div>
          ) : activeSubTab === "donors" ? (
            <EmergencyDonorsList
              donors={filteredDonors}
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
            />
          ) : activeSubTab === "ambulances" ? (
            <EmergencyAmbulancesList
              ambulances={filteredAmbulances}
              isEn={isEn}
              onEdit={(a) => {
                setEditingAmbulance(a);
                setAmbulanceDialogOpen(true);
              }}
              onDelete={(id, name) => {
                setDeletingItem({ id, name, type: "ambulance" });
                setDeleteModalOpen(true);
              }}
            />
          ) : (
            <EmergencyHotlinesList
              hotlines={filteredHotlines}
              isEn={isEn}
              onEdit={(h) => {
                setEditingHotline(h);
                setHotlineDialogOpen(true);
              }}
              onDelete={(id, name) => {
                setDeletingItem({ id, name, type: "hotline" });
                setDeleteModalOpen(true);
              }}
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

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <span>{isEn ? "Confirm Deletion" : "মুছে ফেলার নিশ্চিতকরণ"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isEn
                ? `Are you sure you want to permanently remove "${deletingItem?.name}"?`
                : `আপনি কি নিশ্চিত যে "${deletingItem?.name}" স্থায়ীভাবে মুছে ফেলতে চান?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              {isEn ? "Cancel" : "বাতিল"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
              className="font-bold"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  {isEn ? "Deleting..." : "মুছে ফেলা হচ্ছে..."}
                </>
              ) : (
                isEn ? "Delete Permanently" : "মুছে ফেলুন"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
