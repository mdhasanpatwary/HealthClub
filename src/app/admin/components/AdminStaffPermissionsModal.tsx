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
  locale?: "bn" | "en";
}

export function AdminStaffPermissionsModal({
  isOpen,
  onClose,
  locale = "bn",
}: AdminStaffPermissionsModalProps) {
  const isBn = locale === "bn";

  const permissionRows = [
    {
      category: isBn ? "স্টাফ ও সিস্টেম প্রশাসন" : "Staff & Administration",
      icon: Settings,
      items: [
        {
          name: isBn ? "স্টাফ ম্যানেজমেন্ট ও রোল পরিবর্তন" : "Staff Management & Role Assignment",
          superAdmin: true,
          moderator: false,
          support: false,
        },
        {
          name: isBn ? "সিস্টেম সেটিংস ও লেনদেন কনফিগ" : "System Settings & Tx Config",
          superAdmin: true,
          moderator: false,
          support: false,
        },
        {
          name: isBn ? "আর্থিক ও রাজস্ব অ্যানালিটিক্স" : "Financial & Revenue Analytics",
          superAdmin: true,
          moderator: false,
          support: false,
        },
        {
          name: isBn ? "বাল্ক ডাটা ইম্পোর্ট ও এক্সপোর্ট" : "Bulk Data Import & Export",
          superAdmin: true,
          moderator: false,
          support: false,
        },
      ],
    },
    {
      category: isBn ? "মেম্বারশিপ ও কাস্টমার অপারেশন" : "Membership & Operations",
      icon: Users,
      items: [
        {
          name: isBn ? "মেম্বার তালিকা দেখা ও সার্চ" : "View & Search Member Directory",
          superAdmin: true,
          moderator: false,
          support: true,
        },
        {
          name: isBn ? "মেম্বারশিপ রিনিউয়াল অনুমোদন ও বাতিল" : "Approve & Reject Renewals",
          superAdmin: true,
          moderator: false,
          support: true,
        },
        {
          name: isBn ? "মেম্বারদের ডিসকাউন্ট লেনদেন লগ দেখা" : "View Member Discount Transaction Logs",
          superAdmin: true,
          moderator: false,
          support: true,
        },
        {
          name: isBn ? "নতুন ডিসকাউন্ট লেনদেন তৈরি ও যোগ" : "Record New Discount Transaction",
          superAdmin: true,
          moderator: false,
          support: false,
        },
        {
          name: isBn ? "অংশীদারিত্ব (Partner) আবেদন যাচাই" : "Review Partner Applications",
          superAdmin: true,
          moderator: false,
          support: true,
        },
        {
          name: isBn ? "গ্রাহক অনুসন্ধানের বার্তা দেখা ও হ্যান্ডেল" : "View & Handle Contact Messages",
          superAdmin: true,
          moderator: true,
          support: true,
        },
      ],
    },
    {
      category: isBn ? "চিকিৎসক ও কনটেন্ট নেটওয়ার্ক" : "Medical Network & Content",
      icon: Stethoscope,
      items: [
        {
          name: isBn ? "ডাক্তার ও চেম্বার শিডিউল ব্যবস্থাপনা" : "Doctor Profiles & Schedules",
          superAdmin: true,
          moderator: true,
          support: false,
        },
        {
          name: isBn ? "স্বাস্থ্য টিপস ও মেডিক্যাল আর্টিকেল" : "Health Tips & Medical Blogs",
          superAdmin: true,
          moderator: true,
          support: false,
        },
        {
          name: isBn ? "জরুরি সেবা (রক্তদাতা, অ্যাম্বুলেন্স, হটলাইন)" : "Emergency Network Management",
          superAdmin: true,
          moderator: true,
          support: false,
        },
        {
          name: isBn ? "গণ ব্রডকাস্ট এসএমএস ও ইমেইল নোটিশ" : "Broadcast SMS & Email Notices",
          superAdmin: true,
          moderator: true,
          support: false,
        },
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
                {isBn ? "এডমিন পারমিশন ম্যাট্রিক্স (RBAC)" : "Admin Permissions Matrix (RBAC)"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isBn
                  ? "হেলথ ক্লাব সিস্টেমে বিভিন্ন রোলের অ্যাক্সেস লেভেল ও সক্ষমতার বিবরণী"
                  : "Granular access control & capabilities per administrative role"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Roles Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
          {Object.values(ROLE_CONFIGS).map((conf) => (
            <div
              key={conf.role}
              className="p-3 rounded-2xl border border-border/80 bg-card/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs font-bold ${conf.badgeClass}`}>
                  {isBn ? conf.titleBn : conf.titleEn}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn ? conf.descriptionBn : conf.descriptionEn}
              </p>
            </div>
          ))}
        </div>

        {/* Permissions Comparison Table */}
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
                      <div className="col-span-6 font-medium text-foreground pr-2">
                        {item.name}
                      </div>

                      {/* Super Admin */}
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

                      {/* Moderator */}
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

                      {/* Support */}
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

        {/* Legend / Table Headers Footer */}
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
