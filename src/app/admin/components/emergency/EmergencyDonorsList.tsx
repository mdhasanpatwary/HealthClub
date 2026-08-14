"use client";

import { BloodDonor, UPAZILAS_FENI } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, Trash2, Phone } from "lucide-react";

interface EmergencyDonorsListProps {
  donors: BloodDonor[];
  isEn: boolean;
  onEdit: (donor: BloodDonor) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
}

export function EmergencyDonorsList({
  donors,
  isEn,
  onEdit,
  onDelete,
  onToggleStatus,
}: EmergencyDonorsListProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[60px]">{isEn ? "Group" : "গ্রুপ"}</TableHead>
            <TableHead>{isEn ? "Name" : "নাম"}</TableHead>
            <TableHead>{isEn ? "Upazila" : "উপজেলা"}</TableHead>
            <TableHead>{isEn ? "Phone" : "মোবাইল"}</TableHead>
            <TableHead>{isEn ? "Last Donated" : "সর্বশেষ দান"}</TableHead>
            <TableHead>{isEn ? "Status" : "স্ট্যাটাস"}</TableHead>
            <TableHead className="text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                {isEn ? "No blood donors found matching criteria." : "কোনো রক্তদাতার তথ্য পাওয়া যায়নি।"}
              </TableCell>
            </TableRow>
          ) : (
            donors.map((d) => {
              const upazilaObj = UPAZILAS_FENI.find((u) => u.id === d.upazila);
              return (
                <TableRow key={d.id} className="hover:bg-muted/30">
                  <TableCell>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                      {d.bloodGroup}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {d.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {isEn ? upazilaObj?.nameEn || d.upazila : upazilaObj?.nameBn || d.upazila}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    <a href={`tel:${d.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {d.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {d.lastDonated}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(d.id)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                        d.isAvailable
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                      }`}
                    >
                      {d.isAvailable ? (isEn ? "Available" : "প্রস্তুত") : (isEn ? "Unavailable" : "অপ্রস্তুত")}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(d)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(d.id, `${d.name} (${d.bloodGroup})`)}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
