"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Partner } from "@/services/db";
import { dbStore } from "@/services/dbStore";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PartnerDropdownProps {
  partner: Partner;
}

export default function PartnerDropdown({ partner }: PartnerDropdownProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    dbStore.logoutPartner();
    router.push("/");
  };

  const avatarText = partner.name ? partner.name.charAt(0).toUpperCase() : "P";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Partner account menu"
        className="flex items-center gap-2 rounded-full outline-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/20 shrink-0 select-none"
      >
        {partner.imageUrl ? (
          <Image
            src={partner.imageUrl}
            alt={partner.name}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover object-left-top border border-border shrink-0 shadow-xs"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-emerald-500/20">
            {avatarText}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1.5 bg-background border border-border p-1 shadow-md">
        <div className="font-normal px-2.5 py-1.5 flex flex-col gap-0.5 select-none">
          <div className="text-sm font-semibold text-foreground truncate">{partner.name}</div>
          <div className="text-xs text-muted-foreground truncate">{partner.email || partner.phone}</div>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          render={<Link href="/partner/dashboard" />}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md hover:bg-muted text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4 text-primary" />
          <span>ড্যাশবোর্ড</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("layout.header.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
