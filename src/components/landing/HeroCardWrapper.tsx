"use client";

import { useEffect, useState } from "react";
import { dbStore } from "@/services/dbStore";
import { Member } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";

interface HeroCardWrapperProps {
  /** Demo member data shown when no user is logged in */
  demoMember: Member;
}

export default function HeroCardWrapper({ demoMember }: HeroCardWrapperProps) {
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
      <div className="w-full bg-slate-900/80 rounded-2xl animate-pulse border border-emerald-500/10 shadow-2xl" />
    );
  }

  // Render MemberCard with either the logged-in user or the demo data
  const displayMember = user || demoMember;

  return (
    <div className="w-full">
      <MemberCard member={displayMember} />
    </div>
  );
}
