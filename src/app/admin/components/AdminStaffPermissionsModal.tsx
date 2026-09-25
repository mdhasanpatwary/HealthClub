"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, X, Shield, Users, Stethoscope, Settings } from "lucide-react";
import { ROLE_CONFIGS } from "@/lib/permissions";

interface AdminStaffPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminStaffPermissionsModal({
  isOpen,
  onClose,
}: AdminStaffPermissionsModalProps) {
  const permissionRows = [
    {
      category: "স্টাফ ও সিস্টেম প্রশাসন",
      icon: Settings,
      items: [
        { name: "স্টাফ ম্যানেজমেন্ট ও রোল পরিবর্তন", superAdmin: true, moderator: false, support: false },
        { name: "সিস্টেম সেটিংস ও লেনদেন কনফিগ", superAdmin: true, moderator: false, support: false },
        { name: "আর্থিক ও রাজস্ব অ্যানালিটিক্স", superAdmin: true, moderator: false, support: false },
        { name: "বাল্ক ডাটা ইম্পোর্ট ও এক্সপোর্ট", superAdmin: true, moderator: false, support: false },
      ],
    },
    {
      category: "মেম্বারশিপ ও কাস্টমার অপারেশন",
      icon: Users,
      items: [
        { name: "মেম্বার তালিকা দেখা ও সার্চ", superAdmin: true, moderator: false, support: true },
        { name: "মেম্বারশিপ রিনিউয়াল অনুমোদন ও বাতিল", superAdmin: true, moderator: false, support: true },
        { name: "মেম্বারদের ডিসকাউন্ট লেনদেন লগ দেখা", superAdmin: true, moderator: false, support: true },
        { name: "নতুন ডিসকাউন্ট লেনদেন তৈরি ও যোগ", superAdmin: true, moderator: false, support: false },
        { name: "অংশীদারিত্ব (Partner) আবেদন যাচাই", superAdmin: true, moderator: false, support: true },
        { name: "গ্রাহক অনুসন্ধানের বার্তা দেখা ও হ্যান্ডেল", superAdmin: true, moderator: true, support: true },
      ],
    },
    {
      category: "চিকিৎসক ও কনটেন্ট নেটওয়ার্ক",
      icon: Stethoscope,
      items: [
        { name: "ডাক্তার ও চেম্বার শিডিউল ব্যবস্থাপনা", superAdmin: true, moderator: true, support: false },
        { name: "স্বাস্থ্য টিপস ও মেডিক্যাল আর্টিকেল", superAdmin: true, moderator: true, support: false },
        { name: "হাসপাতাল রিভিউ ও রেটিং মডারেশন", superAdmin: true, moderator: true, support: true },
        { name: "জরুরি সেবা (রক্তদাতা, অ্যাম্বুলেন্স, হটলাইন)", superAdmin: true, moderator: true, support: false },
        { name: "গণ ব্রডকাস্ট এসএমএস ও ইমেইল নোটিশ", superAdmin: true, moderator: true, support: false },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6 bg-background/95 backdrop-blur-xl border border-border">
        <DialogHeader className="space-y-2 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold font-heading text-secondary dark:text-white">
                এডমিন পারমিশন ম্যাট্রিক্স (RBAC)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                হেলথ ক্লাব সিস্টেমে বিভিন্ন রোলের অ্যাক্সেস লেভেল ও সক্ষমতার বিবরণী
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
          {Object.values(ROLE_CONFIGS).map((conf) => (
            <div
              key={conf.role}
              className="p-3 rounded-2xl border border-border/80 bg-card/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs font-bold ${conf.badgeClass}`}>
                  {conf.titleBn}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{conf.descriptionBn}</p>
            </div>
          ))}
        </div>

        <div className="mt-2 space-y-4">
          {permissionRows.map((cat, catIdx) => {
            const CatIcon = cat.icon;
            return (
              <div key={catIdx} className="border border-border/60 rounded-2xl overflow-hidden bg-card/40">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/40 text-xs font-bold text-secondary dark:text-white">
                  <CatIcon className="h-4 w-4 text-primary" />
                  <span>{cat.category}</span>
                </div>

                <div className="divide-y divide-border/30">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="grid grid-cols-12 items-center px-4 py-2.5 text-xs hover:bg-muted/20 transition-colors"
                    >
                      <div className="col-span-6 font-medium text-foreground pr-2">{item.name}</div>

                      <div className="col-span-2 text-center flex justify-center items-center">
                        {item.superAdmin ? (
                          <div className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 text-center flex justify-center items-center">
                        {item.moderator ? (
                          <div className="h-6 w-6 rounded-full bg-blue-500/15 text-blue-600 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 text-center flex justify-center items-center">
                        {item.support ? (
                          <div className="h-6 w-6 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-6 text-[11px] font-semibold text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>সুপার এডমিন</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>কন্টেন্ট মডারেটর</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>সাপোর্ট স্টাফ</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
