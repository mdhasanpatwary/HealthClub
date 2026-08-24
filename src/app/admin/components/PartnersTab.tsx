"use client";

import { useState } from "react";
import { Search, Edit3, Trash2, Download, Building2, Activity, Pill, LayoutGrid, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Partner } from "@/services/db";
import { exportToCsv } from "@/lib/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNum, Locale } from "@/lib/i18n";
import { BulkImportDialog } from "./BulkImportDialog";

interface PartnersTabProps {
  partners: Partner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  partnerSearch: string;
  setPartnerSearch: (val: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts?: {
    all: number;
    hospital: number;
    diagnostic: number;
    pharmacy: number;
  };
  onNewPartnerClick: () => void;
  onEditClick: (p: Partner) => void;
  onDeleteClick: (id: string, name: string) => void;
  locale?: Locale;
  t?: (key: string) => string;
  loading?: boolean;
}

export function PartnersTab({
  partners,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  partnerSearch,
  setPartnerSearch,
  activeCategory,
  onCategoryChange,
  categoryCounts,
  onNewPartnerClick,
  onEditClick,
  onDeleteClick,
  locale = "bn",
  t = (k) => k,
  loading = false,
}: PartnersTabProps) {
  const isEn = locale === "en";
  const [isImportOpen, setIsImportOpen] = useState(false);

  const categories = [
    {
      id: "all",
      label: isEn ? "All Facilities" : "সকল প্রতিষ্ঠান",
      icon: LayoutGrid,
      count: categoryCounts?.all,
    },
    {
      id: "hospital",
      label: isEn ? "Hospitals" : "হাসপাতাল",
      icon: Building2,
      count: categoryCounts?.hospital,
    },
    {
      id: "diagnostic",
      label: isEn ? "Diagnostic Centers" : "ডায়াগনস্টিক",
      icon: Activity,
      count: categoryCounts?.diagnostic,
    },
    {
      id: "pharmacy",
      label: isEn ? "Pharmacies" : "ফার্মেসি",
      icon: Pill,
      count: categoryCounts?.pharmacy,
    },
  ];

  return (
    <>
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-secondary">
              {t("admin.dashboard.partnerHealthcareDirectory")}
            </CardTitle>
            <CardDescription>
              {t("admin.dashboard.contractedFacilitiesDesc")}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t ? t("admin.dashboard.searchPartnerPlaceholder") : "Search partners..."}
                value={partnerSearch}
                onChange={(e) => {
                  setPartnerSearch(e.target.value);
                  onPageChange(1);
                }}
                className="pl-9 h-9 border-border bg-background"
              />
            </div>

            <Button
              onClick={() => setIsImportOpen(true)}
              variant="outline"
              size="sm"
              className="border-border gap-1.5 text-xs font-semibold shrink-0"
            >
              <UploadCloud className="h-3.5 w-3.5 text-primary" />
              <span>{isEn ? "Bulk Import" : "বাল্ক ইম্পোর্ট"}</span>
            </Button>

            <Button
              onClick={() =>
                exportToCsv(partners, "healthclub_partners", [
                  { header: "Partner ID", accessor: "id" },
                  { header: "Name", accessor: "name" },
                  { header: "Category", accessor: "category" },
                  { header: "Discount Rate", accessor: "discount" },
                  { header: "Phone", accessor: "phone" },
                  { header: "Email", accessor: (p) => p.email || "" },
                  { header: "Address", accessor: "address" },
                ])
              }
              variant="outline"
              size="sm"
              className="border-border gap-1.5 text-xs font-semibold shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isEn ? "Export CSV" : "এক্সপোর্ট"}</span>
            </Button>
            <Button onClick={onNewPartnerClick} size="sm" className="bg-primary hover:bg-primary-dark text-white shrink-0">
              {t ? t("admin.dashboard.newPartnerTitle") : "New Partner"}
            </Button>
          </div>
        </CardHeader>

      {/* Category Filter Tabs */}
      <div className="px-6 py-2.5 border-y border-border/60 bg-muted/20 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onCategoryChange(cat.id);
                onPageChange(1);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {formatNum(cat.count, locale)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t ? t("admin.dashboard.name") : "Name"}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t ? t("admin.dashboard.category") : "Category"}</TableHead>
                <TableHead className="font-semibold text-secondary">{t ? t("admin.dashboard.addressLabel") : "Address"}</TableHead>
                <TableHead className="font-semibold text-primary whitespace-nowrap">{t ? t("admin.dashboard.discountRate") : "Discount"}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t ? t("admin.dashboard.hotline") : "Hotline"}</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t ? t("admin.dashboard.action") : "Action"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 font-mono" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Skeleton className="h-7 w-7 rounded-md" />
                        <Skeleton className="h-7 w-7 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : partners.length > 0 ? (
                partners.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold text-secondary whitespace-nowrap">{p.name}</TableCell>
                    <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                      {p.category === "hospital" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                          <Building2 className="h-3 w-3" />
                          {t ? t("admin.dashboard.hospital") : "Hospital"}
                        </span>
                      ) : p.category === "diagnostic" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 text-xs font-medium">
                          <Activity className="h-3 w-3" />
                          {t ? t("admin.dashboard.diagnostic") : "Diagnostic"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium">
                          <Pill className="h-3 w-3" />
                          {t ? t("admin.dashboard.pharmacy") : "Pharmacy"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.address}</TableCell>
                    <TableCell className="font-bold text-primary font-heading whitespace-nowrap">{p.discount}</TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{p.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(p)}
                          aria-label={isEn ? `Edit ${p.name}` : `${p.name} এর তথ্য এডিট করুন`}
                          className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(p.id, p.name)}
                          aria-label={isEn ? `Delete ${p.name}` : `${p.name} ডিলিট করুন`}
                          className="h-8 w-8 text-destructive hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    {isEn ? "No facilities found." : "কোনো চিকিৎসাকেন্দ্র বা পার্টনার পাওয়া যায়নি।"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={[10, 20, 50, 100]}
            locale={locale}
            t={t}
            itemLabel={isEn ? "facilities" : "টি প্রতিষ্ঠান"}
          />
        )}
      </CardContent>
    </Card>

    {isImportOpen && (
      <BulkImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        entityType="partners"
        onSuccess={() => {
          onPageChange(1);
          window.dispatchEvent(new Event("admin-data-change"));
        }}
      />
    )}
  </>
  );
}


