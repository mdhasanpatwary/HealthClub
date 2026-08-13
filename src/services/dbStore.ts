import { Member, Partner, Transaction, Doctor } from "./db";
import {
  getPartnersAction,
  addPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
} from "@/app/actions/partnerActions";
import {
  getDoctorsAction,
  getAllDoctorsAdminAction,
  getDoctorByIdAction,
  addDoctorAction,
  updateDoctorAction,
  deleteDoctorAction,
} from "@/app/actions/doctorActions";
import {
  addMemberAction,
  getMemberByIdAction,
  getPublicMemberVerificationAction,
  PublicMemberVerification,
  logoutMemberAction,
} from "@/app/actions/memberActions";
import {
  getMembersAction,
  updateMemberStatusAction,
  updateMemberProfileAction,
  updateMemberAction,
  deleteMemberAction,
} from "@/app/actions/memberAdminActions";
import {
  getTransactionsAction,
  addTransactionAction,
  getStatsAction,
} from "@/app/actions/transactionActions";
import {
  isMemberTxAllowedAction,
  setMemberTxAllowedAction,
} from "@/app/actions/systemSettingsActions";

// Helper to check if running on client side
const isClient = typeof window !== "undefined";

// Cache keys
const KEYS = {
  CURRENT_USER: "hc_current_user",
  CURRENT_PARTNER: "hc_current_partner",
};

export const dbStore = {
  // --- DOCTORS ---
  async getDoctors(): Promise<Doctor[]> {
    return getDoctorsAction();
  },

  async getAllDoctorsAdmin(): Promise<Doctor[]> {
    return getAllDoctorsAdminAction();
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    return getDoctorByIdAction(id);
  },

  async addDoctor(doctor: Omit<Doctor, "id">): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
    return addDoctorAction(doctor);
  },

  async updateDoctor(id: string, doctor: Partial<Omit<Doctor, "id">>): Promise<{ success: boolean; error?: string }> {
    return updateDoctorAction(id, doctor);
  },

  async deleteDoctor(id: string): Promise<{ success: boolean; error?: string }> {
    return deleteDoctorAction(id);
  },

  // --- PARTNERS ---
  async getPartners(): Promise<Partner[]> {
    return getPartnersAction();
  },

  async addPartner(partner: Omit<Partner, "id">): Promise<Partner> {
    return addPartnerAction(partner);
  },

  async updatePartner(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
    return updatePartnerAction(id, partner);
  },

  async deletePartner(id: string): Promise<boolean> {
    return deletePartnerAction(id);
  },

  // --- MEMBERS ---
  async getMembers(): Promise<Member[]> {
    return getMembersAction();
  },

  async addMember(
    member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved"> & { password?: string }
  ): Promise<Member> {
    return addMemberAction(member);
  },

  async getMemberById(id: string): Promise<Member | undefined> {
    const m = await getMemberByIdAction(id);
    return m ?? undefined;
  },

  async verifyMemberPublic(id: string): Promise<PublicMemberVerification | null> {
    return getPublicMemberVerificationAction(id);
  },

  async updateMemberStatus(id: string, status: Member["status"]): Promise<boolean> {
    return updateMemberStatusAction(id, status);
  },

  async updateMemberProfile(
    id: string,
    name: string,
    phone: string,
    email: string,
    address?: string,
    birthDate?: string,
    profession?: string,
    profilePictureUrl?: string
  ): Promise<boolean> {
    const success = await updateMemberProfileAction(id, name, phone, email, address, birthDate, profession, profilePictureUrl);
    
    if (success) {
      // Sync local storage user session if logged in
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        this.setCurrentUser({
          ...currentUser,
          name,
          phone,
          email,
          address,
          birthDate,
          profession,
          profilePictureUrl,
        });
      }
    }
    
    return success;
  },

  async updateMember(
    id: string,
    member: {
      name: string;
      phone: string;
      email: string;
      tier: Member["tier"];
      address?: string;
      birthDate?: string;
      profession?: string;
      profilePictureUrl?: string;
    }
  ): Promise<boolean> {
    return updateMemberAction(id, member);
  },

  async deleteMember(id: string): Promise<boolean> {
    return deleteMemberAction(id);
  },

  // --- TRANSACTIONS ---
  async getTransactions(memberId?: string): Promise<Transaction[]> {
    return getTransactionsAction(memberId);
  },

  async addTransaction(tx: Omit<Transaction, "id" | "date">): Promise<Transaction> {
    const newTx = await addTransactionAction(tx);

    // Sync totalSaved to localStorage without an extra DB round-trip.
    // We already know the saved amount from tx.saved — no need to refetch the member.
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === tx.memberId) {
      this.setCurrentUser({
        ...currentUser,
        totalSaved: currentUser.totalSaved + tx.saved,
      });
    }

    return newTx;
  },

  // --- CURRENT SESSION (Client LocalStorage Sync) ---
  getCurrentUser(): Member | null {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.CURRENT_USER);
      if (!stored) return null;
      return JSON.parse(stored) as Member;
    }
    return null;
  },

  setCurrentUser(user: Member): void {
    if (isClient) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  async logout(): Promise<void> {
    if (isClient) {
      localStorage.removeItem(KEYS.CURRENT_USER);
      window.dispatchEvent(new Event("auth-change"));
    }
    await logoutMemberAction(); // Clear server cookie session
  },

  getCurrentPartner(): Partner | null {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.CURRENT_PARTNER);
      if (!stored) return null;
      return JSON.parse(stored) as Partner;
    }
    return null;
  },

  setCurrentPartner(partner: Partner): void {
    if (isClient) {
      localStorage.setItem(KEYS.CURRENT_PARTNER, JSON.stringify(partner));
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  async logoutPartner(): Promise<void> {
    if (isClient) {
      localStorage.removeItem(KEYS.CURRENT_PARTNER);
      window.dispatchEvent(new Event("auth-change"));
    }
    await logoutMemberAction(); // Clear server cookie session
  },

  // --- ANALYTICS & SETTINGS ---
  async getStats() {
    return getStatsAction();
  },

  async isMemberTxAllowed(): Promise<boolean> {
    return isMemberTxAllowedAction();
  },

  async setMemberTxAllowed(enabled: boolean): Promise<boolean> {
    return setMemberTxAllowedAction(enabled);
  },
};
