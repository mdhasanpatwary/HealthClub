"use client";

import { useState, useMemo } from "react";
import { Search, Edit3, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Partner } from "@/services/db";
import { exportToCsv } from "@/lib/exportUtils";
import { Locale } from "@/lib/i18n";

interface PartnersTabProps {
  filteredPartners: Partner[];
  partnerSearch: string;
  setPartnerSearch: (val: string) => void;
  onNewPartnerClick: () => void;
  onEditClick: (p: Partner) => void;
  onDeleteClick: (id: string, name: string) => void;
  locale?: Locale;
  t: (key: string) => string;
}

export function PartnersTab({
  filteredPartners,
  partnerSearch,
  setPartnerSearch,
  onNewPartnerClick,
  onEditClick,
  onDeleteClick,
  locale = "bn",
  t,
}: PartnersTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(filteredPartners.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedPartners = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredPartners.slice(startIndex, startIndex + pageSize);
  }, [filteredPartners, safeCurrentPage, pageSize]);

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
              placeholder={t("admin.dashboard.searchPartnerPlaceholder")}
              value={partnerSearch}
              onChange={(e) => {
                setPartnerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>
          <Button
            onClick={() =>
              exportToCsv(filteredPartners, "healthclub_partners", [
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
            {t("admin.dashboard.newPartnerTitle")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.name")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.category")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.dashboard.addressLabel")}</TableHead>
                <TableHead className="font-semibold text-primary whitespace-nowrap">{t("admin.dashboard.discountRate")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.hotline")}</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {paginatedPartners.length > 0 ? (
                paginatedPartners.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold text-secondary whitespace-nowrap">{p.name}</TableCell>
                    <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                      {p.category === "hospital" ? t("admin.dashboard.hospital") : p.category === "diagnostic" ? t("admin.dashboard.diagnostic") : t("admin.dashboard.pharmacy")}
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
                          className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(p.id, p.name)}
                          className="h-8 w-8 text-destructive hover:text-rose-600 hover:bg-rose-50"
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
        {filteredPartners.length > 0 && (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredPartners.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
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
