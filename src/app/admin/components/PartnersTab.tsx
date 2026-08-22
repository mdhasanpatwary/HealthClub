"use client";

import { Search, Edit3, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Partner } from "@/services/db";
import { exportToCsv } from "@/lib/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Locale } from "@/lib/i18n";

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
  onNewPartnerClick,
  onEditClick,
  onDeleteClick,
  locale = "bn",
  t = (k) => k,
  loading = false,
}: PartnersTabProps) {

  const isEn = locale === "en";


  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.partnerHealthcareDirectory")}</CardTitle>
          <CardDescription>{t("admin.dashboard.contractedFacilitiesDesc")}</CardDescription>
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
                      {p.category === "hospital" ? (t ? t("admin.dashboard.hospital") : "Hospital") : p.category === "diagnostic" ? (t ? t("admin.dashboard.diagnostic") : "Diagnostic") : (t ? t("admin.dashboard.pharmacy") : "Pharmacy")}
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
                    {isEn ? "No partners found." : "কোনো পার্টনার প্রতিষ্ঠান পাওয়া যায়নি।"}
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
  );
}

