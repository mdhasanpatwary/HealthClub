"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Edit2, Trash2, ExternalLink, PackageCheck, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProductItem } from "@/lib/validations/product";
import { toBanglaNums, cn } from "@/lib/utils";
import { toggleProductStockAction } from "@/app/actions/productAdminActions";
import { toast } from "sonner";

interface ProductTableProps {
  products: ProductItem[];
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
  onStockChanged: () => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onStockChanged,
}: ProductTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleStockToggle = async (product: ProductItem, currentStatus: boolean) => {
    setTogglingId(product.id);
    try {
      const res = await toggleProductStockAction(product.id, !currentStatus);
      if (res.success) {
        toast.success(
          !currentStatus
            ? `"${product.nameBn}" এখন স্টকে এভেইলএবল।`
            : `"${product.nameBn}" স্টক শেষ হিসেবে চিহ্নিত হয়েছে।`
        );
        onStockChanged();
      } else {
        toast.error(res.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি।");
    } finally {
      setTogglingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
        <PackageCheck className="h-10 w-10 mx-auto mb-2 text-muted-foreground/60" />
        <p className="text-sm font-semibold">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
        <p className="text-xs text-muted-foreground mt-1">
          উপরে &quot;নতুন প্রোডাক্ট&quot; বাটনে ক্লিক করে প্রথম প্রোডাক্টটি যোগ করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-14">ছবি</TableHead>
              <TableHead>নাম ও স্লাগ</TableHead>
              <TableHead>মূল্য</TableHead>
              <TableHead>স্টক স্ট্যাটাস</TableHead>
              <TableHead className="text-right">একশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                {/* Thumbnail Image */}
                <TableCell>
                  <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.nameBn}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized={product.imageUrl.startsWith("data:")}
                    />
                  </div>
                </TableCell>

                {/* Name & Slug */}
                <TableCell>
                  <div className="min-w-[160px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">
                        {product.nameBn}
                      </span>
                      {product.featured && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                          ফিচার্ড
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      /{product.slug}
                    </div>
                  </div>
                </TableCell>


                {/* Price */}
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      ৳{toBanglaNums(product.price)}
                    </div>
                    {product.regularPrice && (
                      <div className="text-[11px] text-muted-foreground line-through">
                        ৳{toBanglaNums(product.regularPrice)}
                      </div>
                    )}
                    {product.discountBadge && (
                      <span className="inline-block text-[10px] text-primary bg-primary/10 px-1 rounded font-medium">
                        {product.discountBadge}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Stock Switch */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {togglingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <Switch
                        checked={product.inStock}
                        onCheckedChange={() => handleStockToggle(product, product.inStock)}
                        aria-label="Toggle Stock"
                      />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        product.inStock
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500 font-semibold"
                      }`}
                    >
                      {product.inStock ? "ইন স্টক" : "স্টক আউট"}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/shop/${product.slug}`}
                      target="_blank"
                      title="প্রোডাক্ট প্রিভিউ"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(product)}
                      title="সম্পাদনা"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(product)}
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
