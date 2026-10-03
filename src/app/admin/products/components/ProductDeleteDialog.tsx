"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductItem } from "@/lib/validations/product";
import { deleteProductAction } from "@/app/actions/productAdminActions";
import { toast } from "sonner";

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductItem | null;
  onSuccess: () => void;
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    try {
      const res = await deleteProductAction(product.id);
      if (res.success) {
        toast.success(`"${product.nameBn}" মুছে ফেলা হয়েছে।`);
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(res.error || "মুছে ফেলা সম্ভব হয়নি।");
      }
    } catch {
      toast.error("সার্ভার ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                প্রোডাক্ট ডিলিট নিশ্চিত করুন
              </DialogTitle>
              <DialogDescription className="text-xs">
                এই প্রোডাক্টটি স্থায়ীভাবে মুছে ফেলা হবে।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 text-sm text-foreground">
          আপনি কি নিশ্চিত যে আপনি{" "}
          <strong className="text-destructive font-semibold">
            {product?.nameBn} ({product?.nameEn})
          </strong>{" "}
          মুছে ফেলতে চান?
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            বাতিল
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            ডিলিট করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
