"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { Partner } from "@/services/db";
import {
  getPaginatedPartnersAdminAction,
  updatePartnerAction,
  addPartnerAction,
  deletePartnerAction,
  resetPartnerPasswordByAdminAction,
} from "@/app/actions/partnerActions";
import { getStatsAction } from "@/app/actions/transactionActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";
import { PartnersTab } from "../components/PartnersTab";
import { PartnerDialog } from "../components/PartnerDialog";

function AdminPartnersContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category");
  const initialCategory =
    urlCategory && ["hospital", "diagnostic", "pharmacy"].includes(urlCategory)
      ? urlCategory
      : "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [partnerSearch, setPartnerSearch] = useState("");
  const debouncedSearch = useDebounce(partnerSearch, 300);

  const [categoryCounts, setCategoryCounts] = useState({
    all: 0,
    hospital: 0,
    diagnostic: 0,
    pharmacy: 0,
  });

  // Dialog States
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    category: "hospital" as Partner["category"],
    address: "",
    discount: "",
    phone: "",
    logoText: "",
    mapLink: "",
    imageUrl: "",
    upazila: "feni-sadar",
  });

  // Sync category if URL parameter changes
  useEffect(() => {
    if (urlCategory && ["hospital", "diagnostic", "pharmacy"].includes(urlCategory)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(urlCategory);
      setPage(1);
    } else if (!urlCategory) {
      setActiveCategory("all");
    }
  }, [urlCategory]);

  const loadCounts = useCallback(async () => {
    try {
      const stats = await getStatsAction();
      setCategoryCounts({
        all: stats.partnerCount,
        hospital: stats.partnerHospitals,
        diagnostic: stats.partnerDiagnostics,
        pharmacy: stats.partnerPharmacies,
      });
    } catch {
      // Ignore background counts error
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const res = await getPaginatedPartnersAdminAction({
        page,
        pageSize,
        search: debouncedSearch,
        category: activeCategory !== "all" ? activeCategory : undefined,
      });
      setPartners(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("পার্টনারদের তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, activeCategory]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
        loadCounts();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadData, loadCounts]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    const qs = newParams.toString();
    router.replace(`/admin/partners${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const notifyChange = () => {
    window.dispatchEvent(new Event("admin-data-change"));
    loadCounts();
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone || !newPartner.discount) {
      toast.error("নাম, মোবাইল নম্বর ও ছাড়ের হার পূরণ করুন।");
      return;
    }

    try {
      if (editingPartner) {
        const success = await updatePartnerAction(editingPartner.id, {
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl,
          upazila: newPartner.upazila || "feni-sadar",
        });
        if (!success) throw new Error("Update failed");
      } else {
        await addPartnerAction({
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl,
          upazila: newPartner.upazila || "feni-sadar",
        });
      }

      setNewPartner({
        name: "",
        category: (activeCategory !== "all" ? activeCategory : "hospital") as Partner["category"],
        address: "",
        discount: "",
        phone: "",
        logoText: "",
        mapLink: "",
        imageUrl: "",
        upazila: "feni-sadar",
      });
      setEditingPartner(null);
      setIsPartnerOpen(false);
      await loadData();
      notifyChange();
      toast.success(
        editingPartner
          ? t("admin.dashboard.partnerUpdatedSuccess")
          : t("admin.dashboard.partnerAddedSuccess")
      );
    } catch {
      toast.error(
        editingPartner
          ? t("admin.dashboard.partnerUpdatedFailed")
          : t("admin.dashboard.partnerAddedFailed")
      );
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (confirm(t("admin.dashboard.confirmDeletePartner").replace("${name}", name))) {
      try {
        const success = await deletePartnerAction(id);
        if (success) {
          toast.success(t("admin.dashboard.partnerDeletedSuccess"));
          await loadData();
          notifyChange();
        } else {
          toast.error(t("admin.dashboard.partnerDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.partnerDeletedFailed"));
      }
    }
  };

  const handleResetPassword = async (p: Partner) => {
    if (confirm(`আপনি কি "${p.name}" এর পাসওয়ার্ড ডিফল্ট "123456"-এ রিসেট করতে চান?`)) {
      try {
        const res = await resetPartnerPasswordByAdminAction(p.id, "123456");
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message || "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে।");
        }
      } catch {
        toast.error("সার্ভার ত্রুটি।");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <Skeleton className="h-9 w-48 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartnersTab
        partners={partners}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
        partnerSearch={partnerSearch}
        setPartnerSearch={setPartnerSearch}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryCounts={categoryCounts}
        onNewPartnerClick={() => {
          setEditingPartner(null);
          setNewPartner({
            name: "",
            category: (activeCategory !== "all" ? activeCategory : "hospital") as Partner["category"],
            address: "",
            discount: "",
            phone: "",
            logoText: "",
            mapLink: "",
            imageUrl: "",
            upazila: "feni-sadar",
          });
          setIsPartnerOpen(true);
        }}
        onEditClick={(p) => {
          setEditingPartner(p);
          setNewPartner({
            name: p.name,
            category: p.category,
            address: p.address,
            discount: p.discount,
            phone: p.phone,
            logoText: p.logoText || "",
            mapLink: p.mapLink || "",
            imageUrl: p.imageUrl || "",
            upazila: p.upazila || "feni-sadar",
          });
          setIsPartnerOpen(true);
        }}
        onDeleteClick={handleDeletePartner}
        onResetPasswordClick={handleResetPassword}
        locale={locale}
        t={t}
        loading={loading}
      />

      {isPartnerOpen && (
        <PartnerDialog
          isOpen={isPartnerOpen}
          onClose={() => {
            setIsPartnerOpen(false);
            setEditingPartner(null);
            setNewPartner({
              name: "",
              category: "hospital",
              address: "",
              discount: "",
              phone: "",
              logoText: "",
              mapLink: "",
              imageUrl: "",
              upazila: "feni-sadar",
            });
          }}
          editingPartner={editingPartner}
          newPartner={newPartner}
          setNewPartner={setNewPartner}
          onSubmit={handleSavePartner}
          t={t}
        />
      )}
    </div>
  );
}

export default function AdminPartnersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <AdminPartnersContent />
    </Suspense>
  );
}

