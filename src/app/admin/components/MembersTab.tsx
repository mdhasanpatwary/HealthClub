"use client";

import Image from "next/image";
import { Search, User, Edit3, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Member } from "@/services/db";
import { toBanglaNums } from "@/lib/utils";
import { exportToCsv } from "@/lib/exportUtils";

import { Skeleton } from "@/components/ui/skeleton";

interface MembersTabProps {
  members: Member[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  memberSearch: string;
  setMemberSearch: (val: string) => void;
  onNewMemberClick: () => void;
  onViewMemberClick: (m: Member) => void;
  onToggleStatus: (id: string) => void;
  onEditClick: (m: Member) => void;
  onDeleteClick: (id: string, name: string) => void;
  loading?: boolean;
}

export function MembersTab({
  members,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  memberSearch,
  setMemberSearch,
  onNewMemberClick,
  onViewMemberClick,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  loading = false,
}: MembersTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">নিবন্ধিত মেম্বারবৃন্দ</CardTitle>
          <CardDescription>মেম্বারদের তথ্য, সাবস্ক্রিপশন স্ট্যাটাস ও সঞ্চয় পর্যবেক্ষণ করুন</CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
              value={memberSearch}
              onChange={(e) => {
                setMemberSearch(e.target.value);
                onPageChange(1);
              }}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>
          <Button
            onClick={() =>
              exportToCsv(members, "healthclub_members", [
                { header: "Member ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { header: "Phone", accessor: "phone" },
                { header: "Email", accessor: (m) => m.email || "" },
                { header: "Tier", accessor: "tier" },
                { header: "Status", accessor: "status" },
                { header: "Joined Date", accessor: "joinedDate" },
                { header: "Expiry Date", accessor: "expiryDate" },
                { header: "Total Saved (BDT)", accessor: "totalSaved" },
                { header: "Reference Code", accessor: (m) => m.referenceCode || "" },
                { header: "Discount (BDT)", accessor: (m) => m.discountAmount || 0 },
                { header: "Address", accessor: (m) => m.address || "" },
              ])
            }
            variant="outline"
            size="sm"
            className="border-border gap-1.5 text-xs font-semibold shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>এক্সপোর্ট CSV</span>
          </Button>
          <Button onClick={onNewMemberClick} size="sm" className="bg-primary hover:bg-primary-dark text-white shrink-0">
            নতুন মেম্বার যুক্ত করুন
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">মেম্বার আইডি</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">নাম</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">মোবাইল নম্বর</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">প্ল্যান / টিয়ার</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">মোট সাশ্রয়</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">স্ট্যাটাস</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {loading ? (
                Array.from({ length: Math.min(pageSize, 10) }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-4 w-20 font-mono" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 font-mono" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Skeleton className="h-7 w-7 rounded-md" />
                        <Skeleton className="h-7 w-7 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : members.length > 0 ? (
                members.map((m) => (
                  <TableRow 
                    key={m.id} 
                    onClick={() => onViewMemberClick(m)} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-mono text-primary font-bold whitespace-nowrap">{m.id}</TableCell>
                    <TableCell className="font-bold text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full border border-border/80 bg-primary/10 text-primary font-bold text-xs overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative select-none">
                          {m.profilePictureUrl ? (
                            <Image
                              src={m.profilePictureUrl}
                              alt={m.name}
                              width={32}
                              height={32}
                              sizes="32px"
                              unoptimized={Boolean(m.profilePictureUrl.startsWith("data:"))}
                              className="h-full w-full object-cover object-left-top"
                            />
                          ) : (
                            <span>{m.name?.trim().charAt(0).toUpperCase() || <User className="h-4 w-4 text-primary" />}</span>
                          )}
                        </div>
                        <div>
                          <span>{m.name}</span>
                          {m.email && <span className="block text-[10px] text-muted-foreground font-normal font-mono">{m.email}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono whitespace-nowrap">{m.phone}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      <div className="font-semibold">
                        {m.tier === "founding" ? "ফাউন্ডিং মেম্বার" : m.tier === "premium" ? "প্রিমিয়াম মেম্বার" : "ফ্যামিলি মেম্বার"}
                      </div>
                      {m.referenceCode && (
                        <span className="inline-block mt-0.5 text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                          রেফ: {m.referenceCode}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-semibold whitespace-nowrap">৳{toBanglaNums(m.totalSaved || 0)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === "active" 
                          ? "bg-green-50 text-green-600 border border-green-200" 
                          : m.status === "pending_approval"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-rose-50 text-rose-600 border border-rose-200"
                      }`}>
                        {m.status === "active" 
                          ? "সক্রিয়" 
                          : m.status === "pending_approval"
                          ? "অনুমোদন পেন্ডিং"
                          : "নিষ্ক্রিয়"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(m.id);
                          }}
                          className={`text-[10px] h-8 px-2.5 font-bold ${m.status === "active" ? "text-rose-600 hover:bg-rose-50" : "text-primary hover:bg-primary-light"}`}
                        >
                          {m.status === "active" ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick(m);
                          }}
                          aria-label={`${m.name} এর তথ্য এডিট করুন`}
                          className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(m.id, m.name);
                          }}
                          aria-label={`${m.name} ডিলিট করুন`}
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
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                    কোনো মেম্বার পাওয়া যায়নি
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
            itemLabel="জন মেম্বার"
          />
        )}
      </CardContent>
    </Card>
  );
}

