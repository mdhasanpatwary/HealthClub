"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductItem, PRODUCT_CATEGORIES } from "@/lib/validations/product";
import { ProductTable } from "./ProductTable";
import { ProductDialog } from "./ProductDialog";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { toBanglaNums } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AdminProductsClientProps {
  initialProducts: ProductItem[];
}

export function AdminProductsClient({
  initialProducts,
}: AdminProductsClientProps) {
  const router = useRouter();
  const products = initialProducts;
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);

  // Sync state if server revalidates
  const handleRefresh = () => {
    router.refresh();
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setDialogOpen(true);
  };

  const handleOpenDelete = (p: ProductItem) => {
    setDeletingProduct(p);
    setDeleteDialogOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock).length;
    const outOfStock = total - inStock;
    const featured = products.filter((p) => p.featured).length;
    return { total, inStock, outOfStock, featured };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>প্রোডাক্ট শপ ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            হেলথ ক্লাব শপের মেডিকেল ইকুইপমেন্ট ও প্রোডাক্ট তালিকা নিয়ন্ত্রণ করুন
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 shadow-xs shrink-0">
          <Plus className="h-4 w-4" />
          <span>নতুন প্রোডাক্ট</span>
        </Button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none">
                {toBanglaNums(stats.total)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">মোট প্রোডাক্ট</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none text-emerald-600 dark:text-emerald-400">
                {toBanglaNums(stats.inStock)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">স্টকে আছে</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none text-rose-600 dark:text-rose-400">
                {toBanglaNums(stats.outOfStock)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">স্টক আউট</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold leading-none text-amber-600 dark:text-amber-400">
                {toBanglaNums(stats.featured)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">ফিচার্ড আইটেম</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="প্রোডাক্ট নাম বা স্লাগ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        <div className="w-full sm:w-56">
          <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="ক্যাটাগরি ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল ক্যাটাগরি</SelectItem>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.labelBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onStockChanged={handleRefresh}
      />

      {/* Add / Edit Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSuccess={handleRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={deletingProduct}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
