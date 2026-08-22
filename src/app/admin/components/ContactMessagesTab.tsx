"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Trash2 } from "lucide-react";
import { ContactMessage } from "@/app/actions/contactActions";
import { Locale } from "@/lib/i18n";

import { Skeleton } from "@/components/ui/skeleton";

interface ContactMessagesTabProps {
  messages: ContactMessage[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
  locale: string;
  loading?: boolean;
}

export function ContactMessagesTab({
  messages,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
  t,
  locale,
  loading = false,
}: ContactMessagesTabProps) {

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          {t("admin.dashboard.contactMessages")}
        </CardTitle>
        <CardDescription>
          {locale === "bn"
            ? "ব্যবহারকারীদের পাঠানো যোগাযোগের তথ্যের তালিকা"
            : "List of contact messages sent by visitors"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary w-[200px]">
                  {t("admin.dashboard.senderName")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[180px]">
                  {t("admin.dashboard.senderPhone")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[200px]">
                  {t("admin.dashboard.senderEmail")}
                </TableHead>
                <TableHead className="font-semibold text-secondary">
                  {t("admin.dashboard.senderMessage")}
                </TableHead>
                <TableHead className="font-semibold text-secondary w-[180px]">
                  {t("admin.dashboard.sentDate")}
                </TableHead>
                <TableHead className="font-semibold text-secondary text-right w-[80px]">
                  {t("admin.dashboard.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent border-b border-border/60">
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32 font-mono" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-36" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("admin.dashboard.noMessages")}
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id} className="hover:bg-muted/20 border-b border-border/60">
                    <TableCell className="font-bold text-secondary">
                      {msg.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-secondary">
                      {msg.phone}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {msg.email || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-secondary whitespace-pre-wrap max-w-md break-words">
                      {msg.message}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(msg.id)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg cursor-pointer"
                        title={t("admin.dashboard.delete")}
                        aria-label={`${t("admin.dashboard.delete")} ${msg.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
            locale={locale as Locale}
            t={t}
            itemLabel={locale === "bn" ? "টি বার্তা" : "messages"}
          />
        )}
      </CardContent>
    </Card>
  );
}

