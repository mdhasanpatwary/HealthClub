"use client";

import { Search, Edit3, Trash2, Phone, Stethoscope, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Doctor } from "@/services/db";
import { Locale } from "@/lib/i18n";
import { exportToCsv } from "@/lib/exportUtils";

import { Skeleton } from "@/components/ui/skeleton";

interface DoctorsTabProps {
  doctors: Doctor[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  doctorSearch: string;
  setDoctorSearch: (val: string) => void;
  onNewDoctorClick: () => void;
  onEditClick: (doc: Doctor) => void;
  onDeleteClick: (id: string, name: string) => void;
  locale?: Locale;
  t?: (key: string) => string;
  loading?: boolean;
}

export function DoctorsTab({
  doctors,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  doctorSearch,
  setDoctorSearch,
  onNewDoctorClick,
  onEditClick,
  onDeleteClick,
  locale = "bn",
  t = (k) => k,
  loading = false,
}: DoctorsTabProps) {
  const isEn = locale === "en";


  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span>{t("admin.doctors.title")}</span>
          </CardTitle>
          <CardDescription>{t("admin.doctors.desc")}</CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("admin.doctors.searchPlaceholder")}
              value={doctorSearch}
              onChange={(e) => {
                setDoctorSearch(e.target.value);
                onPageChange(1);
              }}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>

          <Button
            onClick={() =>
              exportToCsv(doctors, "healthclub_doctors", [
                { header: "Doctor ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { header: "Specialty", accessor: "specialty" },
                { header: "Department", accessor: "department" },
                { header: "Degrees", accessor: "degrees" },
                { header: "Designation", accessor: (d) => d.designation || "" },
                { header: "Chamber Name", accessor: "chamberName" },
                { header: "Chamber Address", accessor: "chamberAddress" },
                { header: "Visiting Days", accessor: "visitingDays" },
                { header: "Visiting Hours", accessor: "visitingHours" },
                { header: "Serial Phone", accessor: "serialPhone" },
                { header: "Fee", accessor: (d) => d.consultationFee || "" },
              ])
            }
            variant="outline"
            size="sm"
            className="border-border gap-1.5 text-xs font-semibold shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isEn ? "Export CSV" : "এক্সপোর্ট"}</span>
          </Button>

          <Button
            onClick={onNewDoctorClick}
            size="sm"
            className="bg-primary hover:bg-primary-dark text-white shrink-0 font-semibold"
          >
            {t("admin.doctors.addNew")}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">
                  {t("admin.doctors.nameSpecialty")}
                </TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">
                  {t("admin.dashboard.category")}
                </TableHead>
                <TableHead className="font-semibold text-secondary">
                  {t("admin.doctors.chamber")}
                </TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">
                  {t("admin.doctors.visitingHours")}
                </TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">
                  {t("admin.doctors.serialPhone")}
                </TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">
                  {t("admin.renewals.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                    <TableCell>
                      <div className="space-y-1.5 py-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
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
              ) : doctors.length > 0 ? (
                doctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-bold text-secondary whitespace-nowrap">
                      <div>
                        <p>{doc.name}</p>
                        <p
                          className="text-[11px] text-muted-foreground font-normal leading-tight line-clamp-2 overflow-hidden max-w-xs"
                          title={doc.degrees}
                        >
                          {doc.degrees}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {doc.specialty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{doc.chamberName}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.chamberAddress}</p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <p className="font-medium text-foreground">{doc.visitingDays}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.visitingHours}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap text-primary font-semibold">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{doc.serialPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(doc)}
                          aria-label={isEn ? `Edit Dr. ${doc.name}` : `ডাঃ ${doc.name} এর তথ্য এডিট করুন`}
                          className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(doc.id, doc.name)}
                          aria-label={isEn ? `Delete Dr. ${doc.name}` : `ডাঃ ${doc.name} ডিলিট করুন`}
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
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("admin.doctors.noDoctors")}
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
            itemLabel={isEn ? "doctors" : "জন ডাক্তার"}
          />
        )}
      </CardContent>
    </Card>
  );
}

