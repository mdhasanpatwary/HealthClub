"use client";

import { useEffect, useState } from "react";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";

interface HeroCardWrapperProps {
  fallbackCard: React.ReactNode;
}

export default function HeroCardWrapper({ fallbackCard }: HeroCardWrapperProps) {
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = dbStore.getCurrentUser();
    if (currentUser) {
      dbStore.getMemberById(currentUser.id).then((freshUser) => {
        setUser(freshUser || currentUser);
        setLoading(false);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, []);

  if (loading) {
    // Return a loading skeleton that matches the exact aspect ratio/shape of the card
    return (
      <div className="w-full max-w-xs sm:max-w-sm aspect-[1.586/1] bg-slate-900/80 rounded-2xl animate-pulse border border-emerald-500/10 shadow-2xl" />
    );
  }

  if (user) {
    return (
      <div className="w-full max-w-xs sm:max-w-sm">
        <MemberCard member={user} />
      </div>
    );
  }

  return <>{fallbackCard}</>;
}
