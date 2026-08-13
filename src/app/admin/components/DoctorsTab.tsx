"use client";

import { Search, Edit3, Trash2, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Doctor } from "@/services/db";

interface DoctorsTabProps {
  filteredDoctors: Doctor[];
  doctorSearch: string;
  setDoctorSearch: (val: string) => void;
  onNewDoctorClick: () => void;
  onEditClick: (doc: Doctor) => void;
  onDeleteClick: (id: string, name: string) => void;
}

export function DoctorsTab({
  filteredDoctors,
  doctorSearch,
  setDoctorSearch,
  onNewDoctorClick,
  onEditClick,
  onDeleteClick,
}: DoctorsTabProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-secondary flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span>ডাক্তার ও কনসালট্যান্ট তালিকা</span>
          </CardTitle>
          <CardDescription>
            বিশেষজ্ঞ চিকিৎসকদের তালিকা, চেম্বার শিডিউল ও সিরিয়াল নম্বর ম্যানেজমেন্ট।
          </CardDescription>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ডাক্তারের নাম বা বিভাগ খুঁজুন..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="pl-9 h-9 border-border bg-background"
            />
          </div>
          <Button
            onClick={onNewDoctorClick}
            size="sm"
            className="bg-primary hover:bg-primary-dark text-white shrink-0 font-semibold"
          >
            + নতুন ডাক্তার যুক্ত করুন
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">ডাক্তারের নাম</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">স্পেশালিটি / বিভাগ</TableHead>
                <TableHead className="font-semibold text-secondary">চেম্বার ও ঠিকানা</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">রোগী দেখার দিন ও সময়</TableHead>
                <TableHead className="font-semibold text-secondary whitespace-nowrap">সিরিয়াল নম্বর</TableHead>
                <TableHead className="font-semibold text-secondary text-right whitespace-nowrap">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs sm:text-sm">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-bold text-secondary whitespace-nowrap">
                      <div>
                        <p>{doc.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono font-normal">
                          {doc.degrees}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {doc.specialty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{doc.chamberName}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.chamberAddress}</p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div>
                        <p className="font-medium text-foreground">{doc.visitingDays}</p>
                        <p className="text-[11px] text-muted-foreground">{doc.visitingHours}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap text-primary font-semibold">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{doc.serialPhone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditClick(doc)}
                          className="h-8 w-8 text-primary hover:text-primary-dark hover:bg-primary-light"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteClick(doc.id, doc.name)}
                          className="h-8 w-8 text-destructive hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    কোনো ডাক্তারের তথ্য পাওয়া যায়নি।
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
