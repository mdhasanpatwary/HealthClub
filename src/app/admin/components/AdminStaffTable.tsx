"use client";

import { AdminUser } from "@/services/db";
import { ROLE_CONFIGS } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit2,
  KeyRound,
  Trash2,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

interface AdminStaffTableProps {
  staffList: AdminUser[];
  currentAdminId: string | null;
  isPending: boolean;
  onToggleStatus: (staff: AdminUser) => void;
  onEdit: (staff: AdminUser) => void;
  onResetPassword: (staff: AdminUser) => void;
  onDelete: (staff: AdminUser) => void;
  locale: "bn" | "en";
}

export function AdminStaffTable({
  staffList,
  currentAdminId,
  isPending,
  onToggleStatus,
  onEdit,
  onResetPassword,
  onDelete,
  locale,
}: AdminStaffTableProps) {
  const isBn = locale === "bn";

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden sm:block border border-border rounded-2xl overflow-hidden bg-card shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
            <tr>
              <th className="p-3.5 pl-4">{isBn ? "এডমিন / স্টাফ" : "Staff Member"}</th>
              <th className="p-3.5">{isBn ? "পারমিশন রোল" : "Role"}</th>
              <th className="p-3.5">{isBn ? "যোগাযোগ" : "Contact"}</th>
              <th className="p-3.5 text-center">{isBn ? "স্ট্যাটাস" : "Status"}</th>
              <th className="p-3.5">{isBn ? "সর্বশেষ লগইন" : "Last Login"}</th>
              <th className="p-3.5 text-right pr-4">{isBn ? "অ্যাকশন" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {staffList.map((staff) => {
              const roleConfig = ROLE_CONFIGS[staff.role];
              const isCurrent = staff.id === currentAdminId;

              return (
                <tr key={staff.id} className="hover:bg-muted/30 transition-colors">
                  {/* Name & Avatar */}
                  <td className="p-3.5 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/20">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <span>{staff.name}</span>
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                            >
                              {isBn ? "আপনি" : "You"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {staff.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-3.5">
                    <Badge variant="outline" className={`text-xs font-bold ${roleConfig.badgeClass}`}>
                      {isBn ? roleConfig.titleBn : roleConfig.titleEn}
                    </Badge>
                  </td>

                  {/* Contact */}
                  <td className="p-3.5 font-mono text-muted-foreground">
                    {staff.phone || "—"}
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        checked={staff.isActive}
                        disabled={isPending || isCurrent}
                        onCheckedChange={() => onToggleStatus(staff)}
                      />
                      <span
                        className={`text-[11px] font-semibold ${
                          staff.isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {staff.isActive ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "নিষ্ক্রিয়" : "Inactive")}
                      </span>
                    </div>
                  </td>

                  {/* Last Login */}
                  <td className="p-3.5 text-muted-foreground">
                    {staff.lastLoginAt ? (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <span>{new Date(staff.lastLoginAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60">{isBn ? "লগইন হয়নি" : "Never"}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label="Staff actions menu"
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-background border border-border p-1">
                        <DropdownMenuItem
                          onClick={() => onEdit(staff)}
                          className="flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-primary" />
                          <span>{isBn ? "তথ্য পরিবর্তন" : "Edit Details"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onResetPassword(staff)}
                          className="flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                          <span>{isBn ? "পাসওয়ার্ড রিসেট" : "Reset Password"}</span>
                        </DropdownMenuItem>

                        {!isCurrent && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(staff)}
                              variant="destructive"
                              className="flex items-center gap-2 text-xs cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{isBn ? "মুছে ফেলুন" : "Delete Account"}</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {staffList.map((staff) => {
          const roleConfig = ROLE_CONFIGS[staff.role];
          const isCurrent = staff.id === currentAdminId;

          return (
            <Card key={staff.id} className="border-border shadow-xs bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/20">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                      <span>{staff.name}</span>
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                        >
                          {isBn ? "আপনি" : "You"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" />
                      <span className="font-mono">{staff.email}</span>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className={`text-[10px] font-bold ${roleConfig.badgeClass}`}>
                  {isBn ? roleConfig.titleBn : roleConfig.titleEn}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground/70" />
                  <span>{staff.phone || "—"}</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {staff.isActive ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "নিষ্ক্রিয়" : "Inactive")}
                  </span>
                  <Switch
                    checked={staff.isActive}
                    disabled={isPending || isCurrent}
                    onCheckedChange={() => onToggleStatus(staff)}
                  />
                </div>
              </div>

              {/* Actions bar for Mobile */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(staff)}
                  className="text-xs h-8 rounded-lg gap-1"
                >
                  <Edit2 className="h-3.5 w-3.5 text-primary" />
                  <span>{isBn ? "এডিট" : "Edit"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResetPassword(staff)}
                  className="text-xs h-8 rounded-lg gap-1"
                >
                  <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                  <span>{isBn ? "পাসওয়ার্ড" : "Pass"}</span>
                </Button>

                {!isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(staff)}
                    className="text-xs h-8 rounded-lg text-destructive hover:bg-destructive/10 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
