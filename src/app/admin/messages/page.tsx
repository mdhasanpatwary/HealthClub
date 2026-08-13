"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  getContactMessagesAction,
  deleteContactMessageAction,
  ContactMessage,
} from "@/app/actions/contactActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ContactMessagesTab } from "../components/ContactMessagesTab";

export default function AdminMessagesPage() {
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await getContactMessagesAction();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load contact messages:", err);
      toast.error("যোগাযোগের বার্তা লোড করতে সমস্যা হয়েছে।");
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

  const handleDelete = async (id: string) => {
    if (confirm(t("admin.dashboard.deleteMessageConfirm"))) {
      try {
        const success = await deleteContactMessageAction(id);
        if (success) {
          toast.success(t("admin.dashboard.messageDeletedSuccess"));
          await loadData();
          window.dispatchEvent(new Event("admin-data-change"));
        } else {
          toast.error(t("admin.dashboard.messageDeletedFailed"));
        }
      } catch {
        toast.error(t("admin.dashboard.messageDeletedFailed"));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Card className="border-border shadow-md">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4 border-b border-border last:border-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContactMessagesTab
        messages={messages}
        onDelete={handleDelete}
        t={t}
        locale={locale}
      />
    </div>
  );
}
