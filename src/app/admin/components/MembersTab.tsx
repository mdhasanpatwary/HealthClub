"use client";

import { Search, User, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Member } from "@/services/db";
import { formatNum, Locale } from "@/lib/i18n";

interface MembersTabProps {
  filteredMembers: Member[];
  memberSearch: string;
  setMemberSearch: (val: string) => void;
  onNewMemberClick: () => void;
  onViewMemberClick: (m: Member) => void;
  onToggleStatus: (id: string) => void;
  onEditClick: (m: Member) => void;
  onDeleteClick: (id: string, name: string) => void;
  locale: Locale;
  t: (key: string) => string;
}

export function MembersTab({
  filteredMembers,
  memberSearch,
  setMemberSearch,
  onNewMemberClick,
  onViewMemberClick,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  locale,
  t,
}: MembersTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary">{t("admin.dashboard.registeredMembers")}</CardTitle>
          <CardDescription>{t("admin.dashboard.manageCustomersDesc")}</CardDescription>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("admin.dashboard.searchMemberPlaceholder")}
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>
          <Button onClick={onNewMemberClick} size="sm" className="bg-primary hover:bg-primary-dark text-white">
            {t("admin.dashboard.newMember")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.memberId")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.name")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.phoneNumber")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.plan")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.totalSavings")}</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">{t("admin.dashboard.status")}</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">{t("admin.dashboard.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {filteredMembers.map((m) => (
                <TableRow 
                  key={m.id} 
                  onClick={() => onViewMemberClick(m)} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono text-primary font-bold whitespace-nowrap">{m.id}</TableCell>
                  <TableCell className="font-bold text-secondary whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                        {m.profilePictureUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.profilePictureUrl} alt={m.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <span>{m.name}</span>
                        {m.email && <span className="block text-[10px] text-muted-foreground font-normal font-mono">{m.email}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono whitespace-nowrap">{m.phone}</TableCell>
                  <TableCell className="capitalize text-xs font-semibold whitespace-nowrap">
                    {m.tier === "founding" ? t("admin.dashboard.tierFounding") : m.tier === "premium" ? t("admin.dashboard.tierPremium") : t("admin.dashboard.tierFamily")}
                  </TableCell>
                  <TableCell className="font-mono font-semibold whitespace-nowrap">৳{formatNum(m.totalSaved || 0, locale)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === "active" 
                        ? "bg-green-50 text-green-600 border border-green-200" 
                        : m.status === "pending_approval"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-rose-50 text-rose-600 border border-rose-200"
                    }`}>
                      {m.status === "active" 
                        ? t("admin.dashboard.active") 
                        : m.status === "pending_approval"
                        ? "অনুমোদন পেন্ডিং"
                        : t("admin.dashboard.inactive")}
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
                        {m.status === "active" ? t("admin.dashboard.deactivate") : t("admin.dashboard.activate")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(m);
                        }}
                        className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light"
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
