"use client";

import React from "react";
import Link from "next/link";
import { Stethoscope, ChevronDown } from "lucide-react";
import { DEPARTMENTS } from "@/components/consultants/consultantData";
import { toBanglaNums } from "@/lib/utils";

interface DepartmentFilterBarProps {
  selectedDept: string;
  departmentCounts: Record<string, number>;
  onDeptChange: (deptId: string) => void;
  isDepartmentPage?: boolean;
}

export function DepartmentFilterBar({
  selectedDept,
  departmentCounts,
  onDeptChange,
  isDepartmentPage = false,
}: DepartmentFilterBarProps) {
  if (isDepartmentPage) return null;

  return (
    <div className="space-y-3">
      {/* Mobile Department Select Field */}
      <div className="block sm:hidden">
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4" />
          </div>
          <select
            id="mobile-department-select"
            aria-label="সকল বিভাগ"
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-3 text-sm font-semibold rounded-2xl border border-border/80 bg-background text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => {
              const count = departmentCounts[dept.id] || 0;
              return (
                <option key={dept.id} value={dept.id} className="bg-popover text-popover-foreground py-1">
                  {dept.labelBn} {count > 0 ? `(${toBanglaNums(count)})` : ""}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Desktop Department Filter Pills */}
      <div className="hidden sm:flex items-center gap-2 pb-2 pt-1 sm:flex-wrap sm:justify-center">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDept === dept.id;
          const count = departmentCounts[dept.id] || 0;
          const href = dept.id === "all" || dept.id === "other" ? "/consultants" : `/consultants/department/${dept.id}`;

          return (
            <Link
              key={dept.id}
              href={href}
              prefetch={false}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-secondary text-white shadow-sm ring-2 ring-secondary/20"
                  : "bg-background hover:bg-muted text-muted-foreground border border-border/70"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{dept.labelBn}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? "bg-white/20 text-white" : "bg-muted-foreground/10 text-muted-foreground"}`}>
                  {toBanglaNums(count)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
