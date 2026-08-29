import { Member, Partner } from "./db";
import { safeStorage } from "@/lib/safeStorage";
import { logoutMemberAction } from "@/app/actions/memberActions";

const isClient = typeof window !== "undefined";

const KEYS = {
  CURRENT_USER: "hc_current_user",
  CURRENT_PARTNER: "hc_current_partner",
  CURRENT_STAFF: "hc_current_staff",
};

export interface StaffSessionUser {
  id: string;
  name: string;
  deskName: string;
  role: string;
  username: string;
}

export const authStore = {
  getCurrentUser(): Member | null {
    return safeStorage.getItem<Member | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: Member): void {
    if (isClient) {
      safeStorage.removeItem(KEYS.CURRENT_PARTNER);
      safeStorage.removeItem(KEYS.CURRENT_STAFF);
      safeStorage.setItem(KEYS.CURRENT_USER, user);
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  async logout(): Promise<void> {
    if (isClient) {
      safeStorage.removeItem(KEYS.CURRENT_USER);
      window.dispatchEvent(new Event("auth-change"));
    }
    try {
      await logoutMemberAction(); // Clear server cookie session
    } catch {
      // Ignore client-side cookie clearance errors
    }
  },

  getCurrentPartner(): Partner | null {
    return safeStorage.getItem<Partner | null>(KEYS.CURRENT_PARTNER, null);
  },

  setCurrentPartner(partner: Partner): void {
    if (isClient) {
      safeStorage.removeItem(KEYS.CURRENT_USER);
      safeStorage.setItem(KEYS.CURRENT_PARTNER, partner);
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  getCurrentStaff(): StaffSessionUser | null {
    return safeStorage.getItem<StaffSessionUser | null>(KEYS.CURRENT_STAFF, null);
  },

  setCurrentStaff(staff: StaffSessionUser | null): void {
    if (isClient) {
      if (staff) {
        safeStorage.setItem(KEYS.CURRENT_STAFF, staff);
      } else {
        safeStorage.removeItem(KEYS.CURRENT_STAFF);
      }
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  async logoutPartner(): Promise<void> {
    if (isClient) {
      safeStorage.removeItem(KEYS.CURRENT_PARTNER);
      safeStorage.removeItem(KEYS.CURRENT_STAFF);
      window.dispatchEvent(new Event("auth-change"));
    }
    try {
      await logoutMemberAction(); // Clear server cookie session
    } catch {
      // Ignore client-side cookie clearance errors
    }
  },
};
