"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, CreditCard, ShieldCheck, Edit3, Heart,
  History as HistoryIcon, ZoomIn, ExternalLink, Loader2, Tag
} from "lucide-react";
import { Member, Transaction } from "@/services/db";
import { toBanglaNums } from "@/lib/utils";
import { getMemberProfilePictureAction } from "@/app/actions/memberAdminActions";
import { getTransactionsAction } from "@/app/actions/transactionActions";

interface MemberDetailsDialogProps {
  viewingMember: Member | null;
  onClose: () => void;
  transactions?: Transaction[];
  onToggleStatus: (id: string) => void;
  onEditClick: (member: Member) => void;
}

export function MemberDetailsDialog({
  viewingMember,
  onClose,
  transactions,
  onToggleStatus,
  onEditClick,
}: MemberDetailsDialogProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fetchedPic, setFetchedPic] = useState<string | null>(null);
  const [fetchedMemberId, setFetchedMemberId] = useState<string | null>(null);

  const [fetchedTxs, setFetchedTxs] = useState<Transaction[]>([]);
  const [fetchedTxMemberId, setFetchedTxMemberId] = useState<string | null>(null);

  const memberId = viewingMember?.id;
  const initialPicUrl = viewingMember?.profilePictureUrl;
  const profilePic = initialPicUrl || (fetchedMemberId === memberId ? fetchedPic : null);
  const loadingPic = Boolean(memberId && !initialPicUrl && fetchedMemberId !== memberId);
  const loadingTxs = Boolean(memberId && transactions === undefined && fetchedTxMemberId !== memberId);

  useEffect(() => {
    if (!memberId || initialPicUrl) return;

    let isMounted = true;
    getMemberProfilePictureAction(memberId)
      .then((url) => {
        if (isMounted) {
          setFetchedPic(url);
          setFetchedMemberId(memberId);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFetchedPic(null);
          setFetchedMemberId(memberId);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [memberId, initialPicUrl]);

  useEffect(() => {
    if (!memberId || transactions !== undefined) return;

    let isMounted = true;
    getTransactionsAction(memberId, 10)
      .then((txs) => {
        if (isMounted) {
          setFetchedTxs(txs);
          setFetchedTxMemberId(memberId);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFetchedTxs([]);
          setFetchedTxMemberId(memberId);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [memberId, transactions]);

  if (!viewingMember) return null;

  const memberTxs = transactions !== undefined
    ? transactions.filter((t) => t.memberId === viewingMember.id)
    : (fetchedTxMemberId === memberId ? fetchedTxs : []);

  return (
    <>
      <Dialog open={!!viewingMember} onOpenChange={(open) => {
        if (!open) {
          setIsImagePreviewOpen(false);
          onClose();
        }
      }}>
        <DialogContent className="max-w-md md:max-w-lg border-border bg-background max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (profilePic) {
                    setIsImagePreviewOpen(true);
                  }
                }}
                disabled={!profilePic}
                aria-label={profilePic ? "প্রোফাইল ছবি বড় করে দেখুন" : undefined}
                className={`h-14 w-14 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center shrink-0 shadow-sm relative group text-left ${
                  profilePic 
                    ? "cursor-pointer hover:ring-2 hover:ring-primary/60 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                    : "cursor-default"
                }`}
              >
                {loadingPic ? (
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                ) : profilePic ? (
                  <>
                    <Image 
                      src={profilePic} 
                      alt={viewingMember.name} 
                      width={56}
                      height={56}
                      sizes="56px"
                      unoptimized={Boolean(profilePic.startsWith("data:"))}
                      className="h-full w-full object-cover object-left-top transition-transform duration-200 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <ZoomIn className="h-5 w-5 text-white drop-shadow-md" />
                    </div>
                  </>
                ) : (
                  <User className="h-7 w-7 text-muted-foreground" />
                )}
              </button>
              <div>
                <DialogTitle className="font-heading font-bold text-lg text-secondary">
                  মেম্বার প্রোফাইল বিস্তারিত
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  আইডি: <span className="font-mono font-bold text-primary">{viewingMember.id}</span>
                </p>
              </div>
            </div>
          </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Status Badges */}
          <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">প্ল্যানের ধরন</span>
              <span className="text-xs font-bold text-secondary">
                {viewingMember.tier === "founding" ? "ফাউন্ডিং মেম্বার (১ বছর)" : viewingMember.tier === "premium" ? "প্রিমিয়াম মেম্বার" : "ফ্যামিলি মেম্বার"}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">সদস্যপদ স্ট্যাটাস</span>
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
                  ? "সক্রিয়" 
                  : viewingMember.status === "pending_approval"
                  ? "অনুমোদন পেন্ডিং"
                  : "নিষ্ক্রিয়"}
              </span>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                <span>পুরো নাম</span>
              </div>
              <p className="text-sm font-bold text-secondary">{viewingMember.name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>মোবাইল নম্বর</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.phone}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>ইমেইল</span>
              </div>
              <p className="text-sm text-secondary font-mono break-all">{viewingMember.email || "প্রদান করা হয়নি"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5" />
                <span>মেডিকেল সেবায় মোট সঞ্চয়</span>
              </div>
              <p className="text-sm font-extrabold text-primary font-mono">৳{toBanglaNums(viewingMember.totalSaved || 0)}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>যুক্ত হওয়ার তারিখ</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.joinedDate ? toBanglaNums(viewingMember.joinedDate) : "N/A"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>মেয়াদ উত্তীর্ণের তারিখ</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.expiryDate ? toBanglaNums(viewingMember.expiryDate) : "N/A"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>ঠিকানা</span>
              </div>
              <p className="text-sm text-secondary">{viewingMember.address || "প্রদান করা হয়নি"}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>জন্ম তারিখ</span>
              </div>
              <p className="text-sm font-semibold text-secondary font-mono">{viewingMember.birthDate ? toBanglaNums(viewingMember.birthDate) : "প্রদান করা হয়নি"}</p>
            </div>

            <div className="space-y-1 col-span-1 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span>পেশা</span>
              </div>
              <p className="text-sm text-secondary">{viewingMember.profession || "প্রদান করা হয়নি"}</p>
            </div>

            {viewingMember.referenceCode && (
              <div className="space-y-1 col-span-1 sm:col-span-2 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  <span>ব্যবহৃত রেফারেন্স কোড:</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/30">
                    {viewingMember.referenceCode}
                  </span>
                  {viewingMember.discountAmount ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      ছাড়: ৳{toBanglaNums(viewingMember.discountAmount)}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
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
              মেম্বার ট্রানজেকশন হিস্ট্রি
            </h4>
            {loadingTxs ? (
              <div className="space-y-2 py-2">
                <div className="h-8 bg-muted/40 animate-pulse rounded-xl" />
                <div className="h-8 bg-muted/20 animate-pulse rounded-xl" />
              </div>
            ) : memberTxs.length > 0 ? (
              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">মেডিকেল সেন্টার</TableHead>
                      <TableHead className="text-[10px] font-semibold text-secondary whitespace-nowrap py-2">তারিখ</TableHead>
                      <TableHead className="text-[10px] font-semibold text-secondary text-right whitespace-nowrap py-2">বিল</TableHead>
                      <TableHead className="text-[10px] font-semibold text-primary text-right whitespace-nowrap py-2">সাশ্রয়</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {memberTxs.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-semibold text-secondary py-2">{tx.partnerName}</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono">
                          {tx.date.includes("T") ? toBanglaNums(tx.date.split("T")[0]) : toBanglaNums(tx.date.split(" ")[0].replace(/,$/, ""))}
                        </TableCell>
                        <TableCell className="text-right font-mono py-2">৳{toBanglaNums(tx.amount)}</TableCell>
                        <TableCell className="text-right font-mono text-primary font-bold py-2">৳{toBanglaNums(tx.saved)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 border border-dashed border-border rounded-xl">
                কোনো ট্রানজেকশন রেকর্ড পাওয়া যায়নি
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
                অনুমোদন করুন
              </Button>
            )}
            <div className="flex gap-2 flex-1 w-full">
              <Button 
                onClick={() => onEditClick(profilePic ? { ...viewingMember, profilePictureUrl: profilePic } : viewingMember)}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold gap-1.5"
              >
                <Edit3 className="h-4 w-4" />
                তথ্য এডিট করুন
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 border-border text-secondary font-semibold"
              >
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Profile Picture Preview Modal */}
    {profilePic && (
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-4 sm:p-5 border-border bg-background z-[60] overflow-hidden">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="font-heading font-bold text-base text-secondary flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{viewingMember.name}</span>
              <span className="text-xs text-muted-foreground font-mono font-normal">({viewingMember.id})</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center pt-2 pb-1 gap-3">
            <div className="relative w-full max-h-[65vh] rounded-xl overflow-hidden bg-muted/30 border border-border flex items-center justify-center p-1">
              <Image
                src={profilePic}
                alt={viewingMember.name}
                width={480}
                height={480}
                sizes="(max-width: 640px) 100vw, 480px"
                unoptimized={Boolean(profilePic.startsWith("data:"))}
                className="w-full h-auto max-h-[62vh] object-contain rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between w-full pt-1 text-xs">
              <span className="text-muted-foreground">
                সদস্যের ছবি
              </span>
              <a
                href={profilePic}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-semibold hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>আসল ছবি দেখুন</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}

