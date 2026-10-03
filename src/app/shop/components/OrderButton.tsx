"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/siteConfig";
import { toBanglaNums } from "@/lib/utils";

interface OrderButtonProps {
  productSlug: string;
  productName: string;
  productPrice: number;
  inStock?: boolean;
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  label?: string;
}

export function OrderButton({
  productSlug,
  productName,
  productPrice,
  inStock = true,
  size = "default",
  className,
  label = "অর্ডার করুন",
}: OrderButtonProps) {
  const [opening, setOpening] = useState(false);

  const handleOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.warning("এই প্রোডাক্টটি বর্তমানে স্টক আউট। স্টক এলে অবহিত করা হবে।");
      return;
    }

    setOpening(true);

    const productUrl = `${SITE_URL}/shop/${productSlug}`;
    const orderMessage = `আসসালামু আলাইকুম, আমি হেলথ ক্লাব শপ থেকে এই প্রোডাক্টটি অর্ডার করতে চাই:\n\n📦 প্রোডাক্ট: ${productName}\n💰 মূল্য: ৳${toBanglaNums(productPrice)}\n🔗 লিংক: ${productUrl}`;

    // Silently copy to clipboard in background as convenience without alert/toast
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(orderMessage).catch(() => {});
      }
    } catch {
      // silently ignore
    }

    toast.info("ফেসবুক মেসেঞ্জারে ওপেন হচ্ছে...", {
      duration: 2500,
    });

    // Messenger link with ref parameter & text fallback
    // Meta Messenger Platform passes ref parameter (e.g. order_omron_bp) to Page Inbox / automated messaging
    const cleanRef = `order_${productSlug.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 50)}`;
    const messengerUrl = `https://m.me/healthclubfeni?ref=${encodeURIComponent(cleanRef)}&text=${encodeURIComponent(orderMessage)}`;

    window.open(messengerUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setOpening(false);
    }, 1500);
  };

  return (
    <Button
      onClick={handleOrder}
      disabled={!inStock || opening}
      size={size}
      className={`relative font-bold transition-all shadow-sm ${
        !inStock
          ? "opacity-60 cursor-not-allowed bg-muted text-muted-foreground"
          : "bg-primary hover:bg-primary-dark text-white active:scale-98"
      } ${className || ""}`}
    >
      {opening ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
      ) : (
        <MessageCircle className="h-4 w-4 mr-1.5" />
      )}
      <span>{opening ? "মেসেঞ্জারে যাওয়া হচ্ছে..." : !inStock ? "স্টক আউট" : label}</span>
    </Button>
  );
}
