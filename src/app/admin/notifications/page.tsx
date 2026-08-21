"use client";

import { useState } from "react";
import {
  CheckCheck,
  Search,
  Trash2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { useLanguage } from "@/components/layout/LanguageProvider";
import { formatNum } from "@/lib/i18n";
import { useAdminNotifications } from "@/app/admin/hooks/useAdminNotifications";
import { AdminNotificationItem } from "@/app/actions/adminNotificationActions";
import { NotificationCard } from "./components/NotificationCard";
import { NotificationKpiGrid } from "./components/NotificationKpiGrid";

export default function AdminNotificationsPage() {
  const { locale, t } = useLanguage();
  const isBn = locale === "bn";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    loading,
    summary,
    items,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    unreadCount,
    readSet,
    setCurrentPage,
    setPageSize,
    setCategory,
    setSearch,
    setUnreadOnly,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllRead,
    refetchNotifications,
  } = useAdminNotifications({
    page: 1,
    pageSize: 10,
    category: "all",
    search: "",
    unreadOnly: false,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchNotifications();
    setRefreshing(false);
  };

  const handleSearchInputChange = (val: string) => {
    setSearchQuery(val);
    setSearch(val);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCategory(cat);
  };

  const handleToggleUnreadOnly = () => {
    const nextVal = !filterUnreadOnly;
    setFilterUnreadOnly(nextVal);
    setUnreadOnly(nextVal);
  };

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t("admin.notifications.title") || "বিজ্ঞপ্তি ও অ্যাকশন সেন্টার"}
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-rose-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                {formatNum(unreadCount, locale)} {isBn ? "অপঠিত" : "unread"}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t("admin.notifications.desc") ||
              "নতুন মেম্বারশিপ আবেদন, নবায়ন, পার্টনার রিকোয়েস্ট ও বার্তার রিয়েল-টাইম নোটিফিকেশন"}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="rounded-xl text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            >
              <CheckCheck className="h-4 w-4 text-primary" />
              <span>{t("admin.notifications.markAllRead") || "সব পঠিত করুন"}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={clearAllRead}
            className="rounded-xl text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer text-muted-foreground hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t("admin.notifications.clearRead") || "পঠিত মুছুন"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw
              className={`h-4 w-4 text-muted-foreground ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <NotificationKpiGrid
        summary={summary}
        totalCount={summary.items.length}
        unreadCount={unreadCount}
        locale={locale}
        t={t}
      />

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-muted/20 p-3 sm:p-4 rounded-2xl border border-border/80">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={
                t("admin.notifications.searchPlaceholder") ||
                "বিজ্ঞপ্তি, প্রেরকের নাম বা নম্বর খুঁজুন..."
              }
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background border-border text-xs"
            />
          </div>

          {/* Unread Only Toggle */}
          <Button
            type="button"
            variant={filterUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={handleToggleUnreadOnly}
            className="rounded-xl text-xs font-semibold shrink-0 gap-1.5 h-10 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>
              {t("admin.notifications.unread") || "শুধুমাত্র অপঠিত"} (
              {formatNum(unreadCount, locale)})
            </span>
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
          {[
            { id: "all", label: t("admin.notifications.all") || "সকল বিজ্ঞপ্তি" },
            { id: "actions", label: t("admin.notifications.actionRequired") || "প্রয়োজনীয় কাজ" },
            { id: "renewal", label: t("admin.notifications.renewals") || "নবায়ন আবেদন" },
            { id: "partner_request", label: t("admin.notifications.partnerRequests") || "অংশীদার আবেদন" },
            { id: "message", label: t("admin.notifications.messages") || "বার্তা" },
            { id: "member_new", label: t("admin.notifications.members") || "সদস্য আপডেট" },
            { id: "member_expiring", label: isBn ? "মেয়াদ শেষ হবে" : "Expiring" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCategorySelect(tab.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer select-none font-semibold ${
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-2 border-border p-12 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
              <CheckCheck className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">
              {t("admin.notifications.allCaughtUp") || "সব ক্লিয়ার! কোনো বিজ্ঞপ্তি পাওয়া যায়নি।"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {isBn
                ? "নতুন মেম্বারশিপ নিবন্ধন, নবায়ন বা পার্টনার আবেদন আসলে এখানে রিয়েল-টাইমে প্রদর্শিত হবে।"
                : "New membership applications, renewals or partner requests will show here automatically."}
            </p>
          </Card>
        ) : (
          items.map((item: AdminNotificationItem) => {
            const isRead = readSet.has(item.id);
            return (
              <NotificationCard
                key={item.id}
                item={item}
                isRead={isRead}
                locale={locale}
                onMarkRead={markAsRead}
                onDismiss={dismissNotification}
                dismissText={t("admin.notifications.dismiss") || "মুছে ফেলুন"}
                markAsReadText={t("admin.notifications.markAsRead") || "পঠিত করুন"}
              />
            );
          })
        )}
      </div>

      {/* Server-Side Pagination Component */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
          locale={locale}
          t={t}
          itemLabel={isBn ? "টি বিজ্ঞপ্তি" : "notifications"}
          className="rounded-2xl border border-border/80 shadow-xs bg-card/60"
        />
      )}
    </div>
  );
}
