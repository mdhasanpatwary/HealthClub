"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Trash2, Droplet, Truck, Loader2, PlusCircle } from "lucide-react";
import {
  convertContactMessageToEmergencyAction,
} from "@/app/actions/contactActions";
import type { ContactMessage } from "@/app/actions/contactActions";
import { toast } from "sonner";
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
  onRefresh?: () => void;
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
  onRefresh,
  loading = false,
}: ContactMessagesTabProps) {
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("bn-BD", {
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

  const handleConvertToEmergency = async (id: string, type: "donor" | "ambulance") => {
    setConvertingId(id);
    try {
      const res = await convertContactMessageToEmergencyAction(id);
      if (res.success) {
        if (type === "donor") {
          toast.success(`${res.name || "রক্তদাতা"} সফলভাবে রক্তদাতা তালিকায় যুক্ত হয়েছে!`);
        } else {
          toast.success(`${res.name || "অ্যাম্বুলেন্স"} সফলভাবে অ্যাম্বুলেন্স তালিকায় যুক্ত হয়েছে!`);
        }
        window.dispatchEvent(new Event("admin-data-change"));
        onRefresh?.();
      } else {
        toast.error(res.error || "যুক্ত করতে সমস্যা হয়েছে।");
      }
    } catch {
      toast.error("ডাটাবেজে যুক্ত করতে সমস্যা হয়েছে।");
    } finally {
      setConvertingId(null);
    }
  };

  const getMessageType = (msg: string) => {
    if (msg.includes("রক্তদাতা") || msg.includes("রক্তের গ্রুপ")) return "donor";
    if (msg.includes("অ্যাম্বুলেন্স") || msg.includes("এম্বুলেন্স")) return "ambulance";
    return null;
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold text-secondary">
          যোগাযোগের বার্তা
        </CardTitle>
        <CardDescription>
          ব্যবহারকারীদের পাঠানো যোগাযোগের তথ্যের তালিকা ও জরুরি নিবন্ধন ব্যবস্থাপনা
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto border border-border rounded-xl bg-background">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-secondary min-w-[160px] w-[180px]">
                  প্রেরকের নাম
                </TableHead>
                <TableHead className="font-semibold text-secondary min-w-[130px] w-[150px]">
                  ফোন নম্বর
                </TableHead>
                <TableHead className="font-semibold text-secondary min-w-[150px] w-[180px]">
                  ইমেইল
                </TableHead>
                <TableHead className="font-semibold text-secondary min-w-[280px]">
                  বার্তা
                </TableHead>
                <TableHead className="font-semibold text-secondary min-w-[150px] w-[160px]">
                  তারিখ ও সময়
                </TableHead>
                <TableHead className="font-semibold text-secondary text-right min-w-[120px] w-[140px]">
                  অ্যাকশন
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
                    কোনো যোগাযোগের বার্তা পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => {
                  const emergencyType = getMessageType(msg.message);
                  const isProcessing = convertingId === msg.id;

                  return (
                    <TableRow key={msg.id} className="hover:bg-muted/20 border-b border-border/60">
                      <TableCell className="font-bold text-secondary align-top py-3">
                        <div>{msg.name}</div>
                        {emergencyType === "donor" && (
                          <Badge
                            variant="secondary"
                            className="mt-1 gap-1 text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                          >
                            <Droplet className="h-3 w-3 fill-rose-500 text-rose-500" />
                            <span>রক্তদাতা নিবন্ধন</span>
                          </Badge>
                        )}
                        {emergencyType === "ambulance" && (
                          <Badge
                            variant="secondary"
                            className="mt-1 gap-1 text-[10px] bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
                          >
                            <Truck className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                            <span>অ্যাম্বুলেন্স নিবন্ধন</span>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-secondary align-top py-3">
                        <a
                          href={`tel:${msg.phone}`}
                          className="hover:underline hover:text-primary transition-colors inline-block"
                        >
                          {msg.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top py-3">
                        {msg.email ? (
                          <a
                            href={`mailto:${msg.email}`}
                            className="hover:underline hover:text-primary transition-colors break-all"
                          >
                            {msg.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-secondary whitespace-pre-wrap max-w-md break-words align-top py-3 leading-relaxed">
                        {msg.message}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top py-3 whitespace-nowrap">
                        {formatDate(msg.createdAt)}
                      </TableCell>
                      <TableCell className="text-right align-top py-3">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap sm:flex-nowrap">
                          {emergencyType === "donor" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToEmergency(msg.id, "donor")}
                              disabled={isProcessing}
                              className="h-8 px-2 text-[11px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/50 cursor-pointer"
                              title="রক্তদাতা ডাটাবেজে যুক্ত করুন"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                  <span>রক্তদাতা যোগ</span>
                                </>
                              )}
                            </Button>
                          )}

                          {emergencyType === "ambulance" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToEmergency(msg.id, "ambulance")}
                              disabled={isProcessing}
                              className="h-8 px-2 text-[11px] font-bold text-cyan-700 border-cyan-200 hover:bg-cyan-50 dark:border-cyan-800 dark:hover:bg-cyan-950/50 cursor-pointer"
                              title="অ্যাম্বুলেন্স ডাটাবেজে যুক্ত করুন"
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                                  <span>অ্যাম্বুলেন্স যোগ</span>
                                </>
                              )}
                            </Button>
                          )}

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(msg.id)}
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 rounded-lg cursor-pointer shrink-0"
                            title="মুছে ফেলুন"
                            aria-label={`মুছে ফেলুন ${msg.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
            itemLabel="টি বার্তা"
          />
        )}
      </CardContent>
    </Card>
  );
}


