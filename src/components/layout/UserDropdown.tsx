"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Member } from "@/services/db";
import { dbStore } from "@/services/dbStore";
import { useLanguage } from "@/components/layout/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownProps {
  user: Member;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    dbStore.logout();
    router.push("/");
  };

  const isAdmin = user.email === "healthclubfeni@gmail.com";
  const avatarText = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/20 shrink-0 select-none">
        {user.profilePictureUrl ? (
          <Image
            src={user.profilePictureUrl}
            alt={user.name}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover border border-border shrink-0 shadow-xs"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0 border border-primary/20">
            {avatarText}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1.5 bg-background border border-border p-1 shadow-md">
        <div className="font-normal px-2.5 py-1.5 flex flex-col gap-0.5 select-none">
          <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email || user.phone}</div>
        </div>
        <DropdownMenuSeparator />
        
        {isAdmin ? (
          <DropdownMenuItem
            render={<Link href="/admin" />}
            className="flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md hover:bg-muted text-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span>{t("layout.header.adminPanel")}</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            render={<Link href="/dashboard" />}
            className="flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md hover:bg-muted text-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span>{t("layout.header.dashboard")}</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem
          render={<Link href="/profile" />}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-md hover:bg-muted text-foreground transition-colors"
        >
          <Settings className="h-4 w-4 text-primary" />
          <span>{t("profile.page.profileSettings")}</span>
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
