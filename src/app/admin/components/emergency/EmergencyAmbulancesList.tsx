"use client";

import { AmbulanceService } from "@/data/emergencyData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit3, Trash2, Phone } from "lucide-react";

interface EmergencyAmbulancesListProps {
  ambulances: AmbulanceService[];
  isEn: boolean;
  onEdit: (ambulance: AmbulanceService) => void;
  onDelete: (id: string, name: string) => void;
}

export function EmergencyAmbulancesList({
  ambulances,
  isEn,
  onEdit,
  onDelete,
}: EmergencyAmbulancesListProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[100px]">{isEn ? "Type" : "ধরন"}</TableHead>
            <TableHead>{isEn ? "Service / Agency" : "অ্যাম্বুলেন্স / এজেন্সি"}</TableHead>
            <TableHead>{isEn ? "Stand / Location" : "স্ট্যান্ড / এলাকা"}</TableHead>
            <TableHead>{isEn ? "Phone" : "মোবাইল"}</TableHead>
            <TableHead>{isEn ? "Hours" : "সময়"}</TableHead>
            <TableHead className="text-right">{isEn ? "Actions" : "অ্যাকশন"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ambulances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                {isEn ? "No ambulance services found." : "কোনো অ্যাম্বুলেন্স পাওয়া যায়নি।"}
              </TableCell>
            </TableRow>
          ) : (
            ambulances.map((a) => (
              <TableRow key={a.id} className="hover:bg-muted/30">
                <TableCell>
                  <Badge className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold border-cyan-500/20 text-[10px]">
                    {a.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-xs text-foreground">
                  {a.name}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {a.location}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  <a href={`tel:${a.phone}`} className="text-primary hover:underline flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {a.phone}
                  </a>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {a.availableHours}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(a)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(a.id, a.name)}
                      className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
