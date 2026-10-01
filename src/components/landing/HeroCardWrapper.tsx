"use client";

import { useEffect, useState } from "react";
import { authStore } from "@/services/authStore";
import { getMemberByIdAction } from "@/app/actions/memberActions";
import { Member } from "@/services/db";
import MemberCard from "@/components/ui/MemberCard";

interface HeroCardWrapperProps {
  /** Demo member data shown when no user is logged in */
  demoMember: Member;
  priority?: boolean;
}

export default function HeroCardWrapper({ demoMember, priority = true }: HeroCardWrapperProps) {
  // Always start null on first render (matches SSR output) to avoid hydration mismatch.
  // localStorage is unavailable on the server, so both server and client must agree on null.
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    let cancelId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;

    const syncUser = () => {
      const currentUser = authStore.getCurrentUser();
      if (!currentUser) {
        // If already null, do not trigger an unnecessary re-render during hydration
        return;
      }

      if (currentUser.qrCodeUrl) {
        setMember(currentUser);
      } else {
        // qrCodeUrl missing: fetch fresh data from DB
        getMemberByIdAction(currentUser.id)
          .then((freshUser) => {
            setMember(freshUser ?? currentUser);
          })
          .catch(() => {
            setMember(currentUser);
          });
      }
    };

    // Defer sync until after initial paint when the main thread is completely idle (preserves LCP)
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      cancelId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        syncUser,
        { timeout: 2000 }
      );
    } else {
      timerId = setTimeout(syncUser, 1000);
    }

    const handleAuthChange = () => {
      const currentUser = authStore.getCurrentUser();
      setMember(currentUser ?? null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      if (cancelId !== null && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(cancelId);
      }
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return (
    <div className="w-full">
      <MemberCard member={member ?? demoMember} priority={priority} />
    </div>
  );
}
