"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { dbStore } from "@/services/dbStore";
import { Partner } from "@/services/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PartnersTab } from "../components/PartnersTab";
import { PartnerDialog } from "../components/PartnerDialog";

export default function AdminPartnersPage() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerSearch, setPartnerSearch] = useState("");

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
  });

  const loadData = useCallback(async () => {
    try {
      const data = await dbStore.getPartners();
      setPartners(data);
    } catch (err) {
      console.error("Failed to load partners:", err);
      toast.error("পার্টনার হাসপাতালের তালিকা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const notifyChange = () => {
    window.dispatchEvent(new Event("admin-data-change"));
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.phone || !newPartner.discount) {
      toast.error("নাম, মোবাইল নম্বর ও ছাড়ের হার পূরণ করুন।");
      return;
    }

    try {
      if (editingPartner) {
        const success = await dbStore.updatePartner(editingPartner.id, {
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl,
        });
        if (!success) throw new Error("Update failed");
      } else {
        await dbStore.addPartner({
          name: newPartner.name,
          category: newPartner.category,
          address: newPartner.address,
          discount: newPartner.discount,
          phone: newPartner.phone,
          logoText: newPartner.logoText || newPartner.name.substring(0, 5),
          mapLink: newPartner.mapLink,
          imageUrl: newPartner.imageUrl,
        });
      }

      setNewPartner({
        name: "",
        category: "hospital",
        address: "",
        discount: "",
        phone: "",
        logoText: "",
        mapLink: "",
        imageUrl: "",
      });
      setEditingPartner(null);
      setIsPartnerOpen(false);
      await loadData();
      notifyChange();
      toast.success(editingPartner ? t("admin.dashboard.partnerUpdatedSuccess") : t("admin.dashboard.partnerAddedSuccess"));
    } catch {
      toast.error(editingPartner ? t("admin.dashboard.partnerUpdatedFailed") : t("admin.dashboard.partnerAddedFailed"));
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    if (confirm(t("admin.dashboard.confirmDeletePartner").replace("${name}", name))) {
      try {
        const success = await dbStore.deletePartner(id);
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

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.address.toLowerCase().includes(partnerSearch.toLowerCase())
  );

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
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
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
        filteredPartners={filteredPartners}
        partnerSearch={partnerSearch}
        setPartnerSearch={setPartnerSearch}
        onNewPartnerClick={() => {
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
          });
          setIsPartnerOpen(true);
        }}
        onDeleteClick={handleDeletePartner}
        locale={locale}
        t={t}
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
