"use client";

import { Search, Plus, Download, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UPAZILAS_FENI,
  BLOOD_GROUPS,
  AMBULANCE_TYPES,
} from "@/data/emergencyData";

interface EmergencyFilterBarProps {
  activeSubTab: "donors" | "ambulances" | "hotlines";
  search: string;
  onSearchChange: (val: string) => void;
  selectedGroup: string;
  onGroupChange: (val: string) => void;
  selectedUpazila: string;
  onUpazilaChange: (val: string) => void;
  ambulanceTypeFilter: string;
  onAmbulanceTypeChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onAddClick: () => void;
}

export function EmergencyFilterBar({
  activeSubTab,
  search,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  selectedUpazila,
  onUpazilaChange,
  ambulanceTypeFilter,
  onAmbulanceTypeChange,
  statusFilter,
  onStatusChange,
  onImportClick,
  onExportClick,
  onAddClick,
}: EmergencyFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              activeSubTab === "donors"
                ? "নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                : activeSubTab === "ambulances"
                ? "অ্যাম্বুলেন্স বা এলাকা খুঁজুন..."
                : "হটলাইন বা অক্সিজেন খুঁজুন..."
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs border-border bg-background"
          />
        </div>

        {activeSubTab === "donors" && (
          <>
            <select
              value={selectedGroup}
              onChange={(e) => onGroupChange(e.target.value)}
              className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
            >
              <option value="all">সকল রক্তের গ্রুপ</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            <select
              value={selectedUpazila}
              onChange={(e) => onUpazilaChange(e.target.value)}
              className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
            >
              {UPAZILAS_FENI.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameBn}
                </option>
              ))}
            </select>
          </>
        )}

        {activeSubTab === "ambulances" && (
          <select
            value={ambulanceTypeFilter}
            onChange={(e) => onAmbulanceTypeChange(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none"
          >
            <option value="all">সকল ধরন</option>
            {AMBULANCE_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.nameBn}</option>
            ))}
          </select>
        )}

        {(activeSubTab === "donors" || activeSubTab === "ambulances") && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-md border border-border bg-background focus:outline-none font-medium"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="approved">অনুমোদিত</option>
            <option value="pending">অপেক্ষমাণ</option>
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onImportClick}
          className="text-xs h-9 font-semibold gap-1.5 border-border"
        >
          <UploadCloud className="h-3.5 w-3.5 text-primary" />
          <span>বাল্ক ইম্পোর্ট</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportClick}
          className="text-xs h-9 font-semibold gap-1.5 border-border"
        >
          <Download className="h-3.5 w-3.5" />
          <span>এক্সপোর্ট</span>
        </Button>

        {activeSubTab === "donors" && (
          <Button
            size="sm"
            onClick={onAddClick}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 font-bold gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>রক্তদাতা যুক্ত করুন</span>
          </Button>
        )}

        {activeSubTab === "ambulances" && (
          <Button
            size="sm"
            onClick={onAddClick}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs h-9 font-bold gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>অ্যাম্বুলেন্স যুক্ত করুন</span>
          </Button>
        )}

        {activeSubTab === "hotlines" && (
          <Button
            size="sm"
            onClick={onAddClick}
            className="bg-primary hover:bg-primary-dark text-white text-xs h-9 font-bold gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>হটলাইন যুক্ত করুন</span>
          </Button>
        )}
      </div>
    </div>
  );
}
