"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, CreditCard, ShieldCheck, Edit3, Heart,
  History as HistoryIcon
} from "lucide-react";
import { Member, Transaction } from "@/services/db";
import { formatNum, Locale } from "@/lib/i18n";

interface MemberDetailsDialogProps {
  viewingMember: Member | null;
  onClose: () => void;
  transactions: Transaction[];
  onToggleStatus: (id: string) => void;
  onEditClick: (member: Member) => void;
  locale: Locale;
  t: (key: string) => string;
}

export function MemberDetailsDialog({
  viewingMember,
  onClose,
  transactions,
  onToggleStatus,
  onEditClick,
  locale,
  t,
}: MemberDetailsDialogProps) {
  if (!viewingMember) return null;

  return (
    <Dialog open={!!viewingMember} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-md md:max-w-lg border-border bg-background max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              {viewingMember.profilePictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={viewingMember.profilePictureUrl} alt={viewingMember.name} className="h-full w-full object-cover object-left-top" />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <DialogTitle className="font-heading font-bold text-lg text-secondary">
                {t("admin.dashboard.memberProfileDetailsTitle")}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("admin.dashboard.memberIdLabel")} <span className="font-mono font-bold text-primary">{viewingMember.id}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Status Badges */}
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.planTypeLabel")}</span>
              <span className="text-xs font-bold text-secondary capitalize">
                {viewingMember.tier === "founding" ? t("admin.dashboard.tierFounding1Year") : viewingMember.tier === "premium" ? t("admin.dashboard.tierPremium") : t("admin.dashboard.tierFamily")}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">{t("admin.dashboard.membershipStatusLabel")}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                viewingMember.status === "active" 
                  ? "bg-green-50 text-green-600 border border-green-200" 
                  : viewingMember.status === "pending_approval"
                  ? "bg-amber-50 text-amber-600 border border-amber-200"
                  : "bg-rose-50 text-rose-600 border border-rose-200"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  viewingMember.status === "active" 
                    ? "bg-green-500" 
                    : viewingMember.status === "pending_approval"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`} />
                {viewingMember.status === "active" 
                  ? t("admin.dashboard.active") 
                  : viewingMember.status === "pending_approval"
                  ? "অনুমোদন পেন্ডিং"
                  : t("admin.dashboard.inactive")}
              </span>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.name")}</span>
              </div>
              <p className="text-sm font-bold text-secondary">{viewingMember.name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.mobileNumberLabel")}</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.phone}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.emailLabel")}</span>
              </div>
              <p className="text-sm text-secondary font-mono break-all">{viewingMember.email || t("admin.dashboard.notProvided")}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.totalMedicalSavings")}</span>
              </div>
              <p className="text-sm font-extrabold text-primary font-mono">৳{formatNum(viewingMember.totalSaved || 0, locale)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.joinedDateLabel")}</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.joinedDate || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.expiryDateLabel")}</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.expiryDate || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.addressLabel")}</span>
              </div>
              <p className="text-sm text-secondary">{viewingMember.address || t("admin.dashboard.notProvided")}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.birthDateLabel")}</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.birthDate || t("admin.dashboard.notProvided")}</p>
            </div>

            <div className="space-y-1 col-span-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{t("admin.dashboard.professionLabel")}</span>
              </div>
              <p className="text-sm text-secondary">{viewingMember.profession || t("admin.dashboard.notProvided")}</p>
            </div>
          </div>

          {/* bKash Payment Details */}
          {viewingMember.bkashSender && viewingMember.bkashTxnId && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-heading">
                <CreditCard className="h-4 w-4" />
                বিকাশ পেমেন্ট তথ্য (bKash Payment Details)
              </h4>
              <div className="grid grid-cols-2 text-xs gap-y-1.5 font-mono">
                <span className="text-muted-foreground font-sans">প্রেরক বিকাশ নম্বর:</span>
                <span className="font-semibold text-secondary">{viewingMember.bkashSender}</span>
                <span className="text-muted-foreground font-sans">ট্রানজেকশন আইডি (TxnID):</span>
                <span className="font-semibold text-secondary select-all">{viewingMember.bkashTxnId}</span>
              </div>
            </div>
          )}

          {/* Member Transactions */}
          <div className="border-t border-border pt-4">
            <h4 className="text-xs font-bold text-secondary uppercase font-mono tracking-wider mb-2 flex items-center gap-1">
              <HistoryIcon className="h-4 w-4 text-primary" />
              {t("admin.dashboard.txLogDesc")}
            </h4>
            {transactions.filter(t => t.memberId === viewingMember.id).length > 0 ? (
              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">{t("admin.dashboard.medicalCenter")}</TableHead>
                      <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">{t("admin.dashboard.date")}</TableHead>
                      <TableHead className="text-[10px] font-semibold text-secondary text-right whitespace-nowrap py-2">{t("admin.dashboard.bill")}</TableHead>
                      <TableHead className="text-[10px] font-semibold text-primary text-right whitespace-nowrap py-2">{t("admin.dashboard.savings")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {transactions
                      .filter(t => t.memberId === viewingMember.id)
                      .map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-semibold text-secondary py-2">{tx.partnerName}</TableCell>
                          <TableCell className="text-muted-foreground py-2 font-mono">
                            {tx.date.includes("T") ? tx.date.split("T")[0] : tx.date.split(" ")[0].replace(/,$/, "")}
                          </TableCell>
                          <TableCell className="text-right font-mono py-2">৳{tx.amount}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold py-2">৳{tx.saved}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 border border-dashed border-border rounded-xl">
                {t("admin.dashboard.noTxsFound")}
              </p>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
            {viewingMember.status === "pending_approval" && (
              <Button
                onClick={() => onToggleStatus(viewingMember.id)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-1.5 flex-1"
              >
                <ShieldCheck className="h-4 w-4" />
                অনুমোদন ও সক্রিয় করুন (Approve & Activate)
              </Button>
            )}
            <div className="flex gap-2 flex-1 w-full">
              <Button 
                onClick={() => onEditClick(viewingMember)}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5"
              >
                <Edit3 className="h-4 w-4" />
                {t("admin.dashboard.editButton")}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-border text-secondary font-semibold"
              >
                {t("admin.dashboard.closeButton")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
