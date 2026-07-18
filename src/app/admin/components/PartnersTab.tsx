"use client";

import { Search, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Partner } from "@/services/db";

interface PartnersTabProps {
  filteredPartners: Partner[];
  partnerSearch: string;
  setPartnerSearch: (val: string) => void;
  onNewPartnerClick: () => void;
  onEditClick: (p: Partner) => void;
  onDeleteClick: (id: string, name: string) => void;
  t: (key: string) => string;
}

export function PartnersTab({
  filteredPartners,
  partnerSearch,
  setPartnerSearch,
  onNewPartnerClick,
  onEditClick,
  onDeleteClick,
  t,
}: PartnersTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.partnerHealthcareDirectory")}</CardTitle>
          <CardDescription>{t("admin.dashboard.contractedFacilitiesDesc")}</CardDescription>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("admin.dashboard.searchPartnerPlaceholder")}
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>
          <Button onClick={onNewPartnerClick} size="sm" className="bg-primary hover:bg-primary-dark text-white">
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
              {filteredPartners.map((p) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
