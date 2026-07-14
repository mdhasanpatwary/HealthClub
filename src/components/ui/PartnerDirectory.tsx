"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Hospital, ShieldAlert, Truck, Pill, HeartHandshake } from "lucide-react";
import { dbStore } from "@/services/dbStore";
import { Partner } from "@/services/db";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PartnerDirectoryProps {
  limit?: number;
  showFilters?: boolean;
}

export default function PartnerDirectory({ limit, showFilters = true }: PartnerDirectoryProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setPartners(dbStore.getPartners());
  }, []);

  // Filter partners
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Apply limit if specified
  const displayedPartners = limit ? filteredPartners.slice(0, limit) : filteredPartners;

  // Category Icon Renderer
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hospital":
        return <Hospital className="h-6 w-6 text-emerald-600" />;
      case "diagnostic":
        return <ShieldAlert className="h-6 w-6 text-indigo-600" />;
      case "pharmacy":
        return <Pill className="h-6 w-6 text-amber-600" />;
      default:
        return <HeartHandshake className="h-6 w-6 text-primary" />;
    }
  };

  // Category Label translation
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hospital":
        return "হাসপাতাল";
      case "diagnostic":
        return "ডায়াগনস্টিক";
      case "pharmacy":
        return "ফার্মেসী";
      default:
        return "স্বাস্থ্যসেবা";
    }
  };

  const categories = [
    { value: "all", label: "সব ক্যাটাগরি" },
    { value: "hospital", label: "হাসপাতাল" },
    { value: "diagnostic", label: "ডায়াগনস্টিক সেন্টার" },
    { value: "pharmacy", label: "ফার্মেসী" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="হাসপাতাল বা এলাকার নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border bg-background"
          />
        </div>

        {/* Category Filter Pills */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Directory Grid */}
      {displayedPartners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPartners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-all duration-300 border-border bg-background/50 backdrop-blur group flex flex-col justify-between">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Top Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                      {getCategoryIcon(partner.category)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-border">
                      {getCategoryLabel(partner.category)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg font-bold text-secondary dark:text-white line-clamp-1">
                      {partner.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="line-clamp-1">{partner.address}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Discount & Call */}
                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Discount Rate</p>
                    <p className="text-base font-bold text-primary font-heading">
                      {partner.discount}
                    </p>
                  </div>

                  <a href={`tel:${partner.phone}`}>
                    <Button variant="outline" size="sm" className="gap-1 border-primary text-primary hover:bg-primary-light">
                      <Phone className="h-3.5 w-3.5" />
                      কল করুন
                    </Button>
                  </a>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">কোন পার্টনার হাসপাতাল বা ল্যাব খুঁজে পাওয়া যায়নি।</p>
        </div>
      )}

    </div>
  );
}
