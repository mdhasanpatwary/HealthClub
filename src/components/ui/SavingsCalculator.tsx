"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SavingsCalculator() {
  const [expense, setExpense] = useState<number>(10000);

  // Computations
  const discountRate = 0.10; // Flat 10% discount
  const monthlySavings = Math.round(expense * discountRate);
  const yearlySavings = monthlySavings * 12;
  const individualPlanCost = 500;
  const netYearlySavings = yearlySavings - individualPlanCost;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border border-border/80 bg-background/50 backdrop-blur">
      <CardHeader className="text-center pb-4">
        <CardTitle className="font-heading text-2xl font-bold text-secondary">
          চিকিৎসা খরচ হিসাবকারী (Savings Calculator)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          আপনার আনুমানিক খরচের উপর ভিত্তি করে হেলথ ক্লাবের মেম্বারশিপে কত সঞ্চয় করতে পারবেন তা দেখুন।
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Slider Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-secondary">
              আপনার আনুমানিক মাসিক চিকিৎসা খরচ
            </label>
            <span className="text-2xl font-bold text-primary font-mono">
              ৳{expense.toLocaleString("bn-BD")} <span className="text-sm font-normal text-muted-foreground">BDT</span>
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={expense}
            onChange={(e) => setExpense(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>৳১,০০০</span>
            <span>৳২৫,০০০</span>
            <span>৳৫০,০০০</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">মাসিক আনুমানিক সঞ্চয়</p>
            <p className="text-xl font-bold text-secondary font-mono">৳{monthlySavings.toLocaleString("bn-BD")}</p>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">বাৎসরিক মোট সঞ্চয়</p>
            <p className="text-xl font-bold text-secondary font-mono">৳{yearlySavings.toLocaleString("bn-BD")}</p>
          </div>

          <div className="bg-primary-light/40 dark:bg-primary-dark/20 p-4 rounded-xl border border-primary/20 text-center">
            <p className="text-xs text-primary dark:text-primary-foreground font-semibold mb-1">প্রকৃত নিট বাৎসরিক সঞ্চয়</p>
            <p className="text-2xl font-bold text-primary font-mono">৳{netYearlySavings > 0 ? netYearlySavings.toLocaleString("bn-BD") : 0}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">(৳৫০০ বাৎসরিক ফি বাদে)</p>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground mb-4">
            * পার্টনার হাসপাতাল ও টেস্টের ধরণের উপর ভিত্তি করে ডিসকাউন্টের পরিমাণ পরিবর্তিত হতে পারে।
          </p>
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-medium px-8">
              আজই মেম্বার হোন (ফ্রি)
            </Button>
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}
