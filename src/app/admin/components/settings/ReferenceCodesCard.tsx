"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tag, Plus, Trash2, CheckCircle2, XCircle, Save, Loader2,
  Sparkles, Gift, AlertCircle
} from "lucide-react";
import {
  getAdminReferenceCodesAction,
  saveAdminReferenceCodesAction,
} from "@/app/actions/referenceCodeActions";
import type { ReferenceCodeItem, ReferenceDiscountType } from "@/lib/referenceCodes";
import { toast } from "sonner";

export function ReferenceCodesCard() {
  const [codes, setCodes] = useState<ReferenceCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // New Code Form State
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<ReferenceDiscountType>("free");
  const [newValue, setNewValue] = useState<number>(100);
  const [newLabelBn, setNewLabelBn] = useState("");
  const [newLabelEn, setNewLabelEn] = useState("");

  useEffect(() => {
    let isMounted = true;
    getAdminReferenceCodesAction()
      .then((data) => {
        if (isMounted) {
          setCodes(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("রেফারেন্স কোড তালিকা লোড করতে সমস্যা হয়েছে।");
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleActive = (index: number) => {
    setCodes((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCode = (codeToDelete: string) => {
    setCodes((prev) => prev.filter((c) => c.code !== codeToDelete));
    toast.info(`${codeToDelete} সরানো হয়েছে। প্রয়োগ করতে সংরক্ষণ করুন।`);
  };

  const handleAddCode = () => {
    const cleanCode = newCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!cleanCode) {
      toast.error("সঠিক রেফারেন্স কোড লিখুন।");
      return;
    }

    if (codes.some((c) => c.code === cleanCode)) {
      toast.error("এই কোডটি ইতিমধ্যে তালিকায় আছে।");
      return;
    }

    const val = newType === "free" ? 100 : Number(newValue) || 0;
    if (newType !== "free" && val <= 0) {
      toast.error("সঠিক ছাড়ের পরিমাণ লিখুন।");
      return;
    }

    const defaultLabelBn =
      newType === "free"
        ? "১০০% ফ্রি মেম্বারশিপ অফার"
        : newType === "percent"
        ? `${val}% স্পেশাল ডিসকাউন্ট`
        : `৳${val} স্পেশাল ডিসকাউন্ট`;

    const defaultLabelEn =
      newType === "free"
        ? "100% Free Membership Offer"
        : newType === "percent"
        ? `${val}% Special Discount`
        : `৳${val} Special Discount`;

    const newItem: ReferenceCodeItem = {
      code: cleanCode,
      type: newType,
      value: val,
      isActive: true,
      labelBn: newLabelBn.trim() || defaultLabelBn,
      labelEn: newLabelEn.trim() || defaultLabelEn,
    };

    setCodes((prev) => [newItem, ...prev]);
    setNewCode("");
    setNewType("free");
    setNewValue(100);
    setNewLabelBn("");
    setNewLabelEn("");
    setIsAdding(false);
    toast.success("কোড যোগ করা হয়েছে। সংরক্ষণ বাটনে চাপুন।");
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await saveAdminReferenceCodesAction(codes);
      if (res.success) {
        toast.success("রেফারেন্স কোড তালিকা সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("রেফারেন্স কোড সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span>রেফারেন্স ও ডিসকাউন্ট কোড ব্যবস্থাপনা</span>
          </CardTitle>
          <CardDescription className="text-xs">
            মেম্বারশিপ ফি সম্পূর্ণ ফ্রি (১০০%) অথবা আংশিক ছাড়ের জন্য রেফারেন্স কোড নির্ধারণ করুন
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {!isAdding && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="text-xs h-8 gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>নতুন কোড</span>
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving || loading}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>সংরক্ষণ করুন</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Code Form */}
        {isAdding && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 space-y-3.5 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-secondary dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                নতুন রেফারেন্স কোড তৈরি করুন
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                বাতিল
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="new-code-name" className="text-xs font-semibold">
                  কোড (যেমন: FREECLUB)
                </Label>
                <Input
                  id="new-code-name"
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="FREECLUB"
                  className="h-9 uppercase font-mono tracking-wider text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-code-type" className="text-xs font-semibold">
                  ছাড়ের ধরন
                </Label>
                <select
                  id="new-code-type"
                  value={newType}
                  onChange={(e) => {
                    const t = e.target.value as ReferenceDiscountType;
                    setNewType(t);
                    if (t === "free") setNewValue(100);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="free">১০০% সম্পূর্ণ ফ্রি (পেমেন্ট ছাড়া)</option>
                  <option value="percent">শতকরা ছাড় (%)</option>
                  <option value="fixed">নির্দিষ্ট টাকা ছাড় (৳)</option>
                </select>
              </div>

              {newType !== "free" && (
                <div className="space-y-1">
                  <Label htmlFor="new-code-value" className="text-xs font-semibold">
                    {newType === "percent"
                      ? "ছাড়ের শতকরা হার (%)"
                      : "ছাড়ের টাকা (৳)"}
                  </Label>
                  <Input
                    id="new-code-value"
                    type="number"
                    min={1}
                    max={newType === "percent" ? 100 : 5000}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="new-code-label-bn" className="text-xs font-semibold">
                  বিবরণ (বাংলা)
                </Label>
                <Input
                  id="new-code-label-bn"
                  type="text"
                  value={newLabelBn}
                  onChange={(e) => setNewLabelBn(e.target.value)}
                  placeholder={newType === "free" ? "১০০% ফ্রি মেম্বারশিপ অফার" : "৫০% মেম্বার ডিসকাউন্ট"}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-code-label-en" className="text-xs font-semibold">
                  বিবরণ (ইংরেজি)
                </Label>
                <Input
                  id="new-code-label-en"
                  type="text"
                  value={newLabelEn}
                  onChange={(e) => setNewLabelEn(e.target.value)}
                  placeholder={newType === "free" ? "100% Free Membership Offer" : "50% Member Discount"}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" size="sm" onClick={handleAddCode} className="text-xs h-8 cursor-pointer">
                <Plus className="h-3.5 w-3.5 mr-1" />
                তালিকায় যুক্ত করুন
              </Button>
            </div>
          </div>
        )}

        {/* Existing Codes Table */}
        {loading ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
            রেফারেন্স কোড লোড হচ্ছে...
          </div>
        ) : codes.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            <AlertCircle className="h-5 w-5 mx-auto mb-1 text-muted-foreground/60" />
            কোনো রেফারেন্স কোড তৈরি করা নেই।
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold">কোড</th>
                  <th className="p-3 font-semibold">সুবিধা / ছাড়</th>
                  <th className="p-3 font-semibold hidden sm:table-cell">বিবরণ</th>
                  <th className="p-3 font-semibold text-center">অবস্থা</th>
                  <th className="p-3 font-semibold text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {codes.map((item, idx) => {
                  const isFree = item.type === "free" || item.value >= 100;
                  return (
                    <tr key={item.code} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-secondary dark:text-white">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-border">
                          {item.code}
                        </span>
                      </td>
                      <td className="p-3">
                        {isFree ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <Gift className="h-3 w-3" />
                            ১০০% ফ্রি
                          </span>
                        ) : item.type === "percent" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            {item.value}% ছাড়
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            ৳{item.value} ছাড়
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">
                        {item.labelBn || item.labelEn}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(idx)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {item.isActive ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              সক্রিয়
                            </span>
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" />
                              নিষ্ক্রিয়
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteCode(item.code)}
                          aria-label={`Delete ${item.code}`}
                          className="text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Helpful Tips Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-secondary dark:text-white">
              রেফারেল তথ্য: 
            </span>
            ইতিমধ্যে নিবন্ধিত যে কোনো সক্রিয় মেম্বারের মোবাইল নম্বর বা আইডি স্বয়ংক্রিয় রেফারেল হিসেবে ২০% ছাড় দেয়। আর এখানে তৈরি করা কোডগুলো দিয়ে মেম্বারশিপ ১০০% ফ্রি অথবা ইচ্ছামতো ছাড় দেওয়া যাবে। পরিবর্তন শেষে অবশ্যই &apos;সংরক্ষণ করুন&apos; বাটনে চাপুন।
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
