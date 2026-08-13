"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartnerRequest } from "@/services/db";

interface PartnerRequestsTabProps {
  partnerRequests: PartnerRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  t?: (key: string) => string;
}

export function PartnerRequestsTab({
  partnerRequests,
  onApprove,
  onReject,
  t = (k) => k,
}: PartnerRequestsTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          {t("admin.partnerRequests.title")}
        </CardTitle>
        <CardDescription>
          {t("admin.partnerRequests.desc")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.orgAddress")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.category")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.discountRate")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.contact")}</TableHead>
                <TableHead className="font-semibold text-secondary">{t("admin.partnerRequests.status")}</TableHead>
                <TableHead className="font-semibold text-secondary text-right">{t("admin.partnerRequests.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("admin.partnerRequests.noRequests")}
                  </TableCell>
                </TableRow>
              ) : (
                partnerRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/20 border-b border-border/60">
                    <TableCell>
                      <div className="font-bold text-secondary">{req.orgName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{req.address}</div>
                    </TableCell>
                    <TableCell className="capitalize text-xs font-semibold">
                      {req.category === "hospital" ? "হাসপাতাল" : req.category === "diagnostic" ? "ডায়াগনস্টিক" : "ফার্মেসি"}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {req.discount}
                    </TableCell>
                    <TableCell className="text-xs space-y-0.5">
                      {req.contactName && <div className="font-semibold text-secondary dark:text-white">{req.contactName}</div>}
                      <div>মোবাইল: <span className="font-semibold">{req.phone}</span></div>
                      {req.email && <div className="text-muted-foreground">{req.email}</div>}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : req.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}>
                        {req.status === "pending" ? "পেন্ডিং" : req.status === "approved" ? "অনুমোদিত" : "বাতিলকৃত"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => onApprove(req.id)}
                            className="bg-primary hover:bg-primary-dark text-white text-xs h-7 py-1 px-3 animate-pulse"
                          >
                            {t("admin.partnerRequests.approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(req.id)}
                            className="text-destructive border-destructive/20 hover:bg-destructive/10 text-xs h-7 py-1 px-3"
                          >
                            {t("admin.partnerRequests.reject")}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
