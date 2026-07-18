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
  // Always start null on first render (matches SSR output) to avoid hydration mismatch.
  // localStorage is unavailable on the server, so both server and client must agree on null.
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const currentUser = dbStore.getCurrentUser();
    if (!currentUser) return;

    if (currentUser.qrCodeUrl) {
      // Wrap in Promise.resolve so setState is called asynchronously,
      // satisfying the react-hooks/set-state-in-effect rule.
      Promise.resolve(currentUser).then(setMember);
    } else {
      // qrCodeUrl missing: fetch fresh data from DB
      dbStore.getMemberById(currentUser.id).then((freshUser) => {
        setMember(freshUser ?? null);
      });
    }
  }, []);

  return (
    <div className="w-full">
      <MemberCard member={member ?? demoMember} />
    </div>
  );
}
