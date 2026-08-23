import { Member, Partner, Transaction, Doctor, PublicMemberVerification } from "./db";
import { safeStorage } from "@/lib/safeStorage";
import {
  getPartnersAction,
  getPaginatedPartnersAdminAction,
  GetPaginatedPartnersAdminParams,
  addPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
  getPartnerProfileAction,
  updatePartnerProfileAction,
  UpdatePartnerProfileInput,
  getPartnerTransactionsAction,
} from "@/app/actions/partnerActions";
import {
  getDoctorsAction,
  getAllDoctorsAdminAction,
  getPaginatedDoctorsAdminAction,
  GetPaginatedDoctorsAdminParams,
  getDoctorByIdAction,
  addDoctorAction,
  updateDoctorAction,
  deleteDoctorAction,
} from "@/app/actions/doctorActions";
import {
  getPartnerDoctorsAction,
  getAvailableDoctorsToLinkAction,
  linkDoctorToPartnerAction,
  unlinkDoctorFromPartnerAction,
  addPartnerDoctorAction,
  updatePartnerDoctorChamberAction,
  deletePartnerDoctorAction,
} from "@/app/actions/partnerDoctorActions";
import type {
  PartnerDoctorChamberInput,
  AddPartnerDoctorInput,
  UpdatePartnerDoctorInput,
} from "@/app/actions/partnerDoctorActions";
import {
  addMemberAction,
  getMemberByIdAction,
  getPublicMemberVerificationAction,
  logoutMemberAction,
} from "@/app/actions/memberActions";
import {
  getMembersAction,
  getPaginatedMembersAction,
  GetPaginatedMembersParams,
  getPaginatedRenewalsAction,
  GetPaginatedRenewalsParams,
  updateMemberStatusAction,
  updateMemberProfileAction,
  updateMemberAction,
  deleteMemberAction,
} from "@/app/actions/memberAdminActions";
import {
  getTransactionsAction,
  getPaginatedTransactionsAction,
  GetPaginatedTransactionsParams,
  addTransactionAction,
  getStatsAction,
} from "@/app/actions/transactionActions";
import {
  isMemberTxAllowedAction,
  setMemberTxAllowedAction,
} from "@/app/actions/systemSettingsActions";
import {
  getAdminNotificationsAction,
  GetAdminNotificationsParams,
  PaginatedAdminNotificationsResult,
} from "@/app/actions/adminNotificationActions";
import {
  getMemberNotificationsAction,
  GetMemberNotificationsParams,
  MemberNotificationSummary,
  markMemberNotificationReadAction,
  markAllMemberNotificationsReadAction,
  deleteMemberNotificationAction,
} from "@/app/actions/memberNotificationActions";
import { PaginatedResult } from "@/types/pagination";


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

  async getPaginatedDoctorsAdmin(
    params?: GetPaginatedDoctorsAdminParams
  ): Promise<PaginatedResult<Doctor>> {
    return getPaginatedDoctorsAdminAction(params);
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

  async getPartnerDoctors(): Promise<{ success: boolean; doctors: Doctor[]; error?: string }> {
    return getPartnerDoctorsAction();
  },

  async getAvailableDoctorsToLink(search?: string): Promise<{ success: boolean; doctors: Doctor[]; error?: string }> {
    return getAvailableDoctorsToLinkAction(search);
  },

  async linkDoctorToPartner(
    doctorId: string,
    chamberData: PartnerDoctorChamberInput
  ): Promise<{ success: boolean; error?: string }> {
    return linkDoctorToPartnerAction(doctorId, chamberData);
  },

  async unlinkDoctorFromPartner(doctorId: string): Promise<{ success: boolean; error?: string }> {
    return unlinkDoctorFromPartnerAction(doctorId);
  },

  async addPartnerDoctor(
    input: AddPartnerDoctorInput
  ): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
    return addPartnerDoctorAction(input);
  },

  async updatePartnerDoctorChamber(
    doctorId: string,
    input: UpdatePartnerDoctorInput
  ): Promise<{ success: boolean; error?: string }> {
    return updatePartnerDoctorChamberAction(doctorId, input);
  },

  async deletePartnerDoctor(doctorId: string): Promise<{ success: boolean; error?: string }> {
    return deletePartnerDoctorAction(doctorId);
  },

  // --- PARTNERS ---
  async getPartners(): Promise<Partner[]> {
    return getPartnersAction();
  },

  async getPaginatedPartnersAdmin(
    params?: GetPaginatedPartnersAdminParams
  ): Promise<PaginatedResult<Partner>> {
    return getPaginatedPartnersAdminAction(params);
  },

  async addPartner(partner: Omit<Partner, "id">): Promise<Partner | { error: string }> {
    return addPartnerAction(partner);
  },

  async updatePartner(id: string, partner: Omit<Partner, "id">): Promise<boolean> {
    return updatePartnerAction(id, partner);
  },

  async deletePartner(id: string): Promise<boolean> {
    return deletePartnerAction(id);
  },

  async getPartnerProfile(): Promise<{ success: boolean; partner?: Partner; error?: string }> {
    return getPartnerProfileAction();
  },

  async updatePartnerProfile(
    input: UpdatePartnerProfileInput
  ): Promise<{ success: boolean; partner?: Partner; error?: string }> {
    const res = await updatePartnerProfileAction(input);
    if (res.success && res.partner) {
      this.setCurrentPartner(res.partner);
    }
    return res;
  },

  // --- MEMBERS ---
  async getMembers(): Promise<Member[]> {
    return getMembersAction();
  },

  async getPaginatedMembers(
    params?: GetPaginatedMembersParams
  ): Promise<PaginatedResult<Member>> {
    return getPaginatedMembersAction(params);
  },

  async getPaginatedRenewals(
    params?: GetPaginatedRenewalsParams
  ): Promise<PaginatedResult<Member>> {
    return getPaginatedRenewalsAction(params);
  },


  async addMember(
    member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved"> & { password?: string }
  ): Promise<Member | { error: string }> {
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

  async getPaginatedTransactions(
    params?: GetPaginatedTransactionsParams
  ): Promise<PaginatedResult<Transaction>> {
    return getPaginatedTransactionsAction(params);
  },

  async getPartnerTransactions(): Promise<Transaction[]> {
    return getPartnerTransactionsAction();
  },


  async addTransaction(tx: Omit<Transaction, "id" | "date">): Promise<Transaction | { error: string }> {
    const newTx = await addTransactionAction(tx);

    if ("error" in newTx) return newTx;

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
    return safeStorage.getItem<Member | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: Member): void {
    if (isClient) {
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
      safeStorage.setItem(KEYS.CURRENT_PARTNER, partner);
      window.dispatchEvent(new Event("auth-change"));
    }
  },

  async logoutPartner(): Promise<void> {
    if (isClient) {
      safeStorage.removeItem(KEYS.CURRENT_PARTNER);
      window.dispatchEvent(new Event("auth-change"));
    }
    try {
      await logoutMemberAction(); // Clear server cookie session
    } catch {
      // Ignore client-side cookie clearance errors
    }
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

  // --- NOTIFICATIONS ---
  async getAdminNotifications(
    params?: GetAdminNotificationsParams
  ): Promise<PaginatedAdminNotificationsResult> {
    return getAdminNotificationsAction(params);
  },

  async getMemberNotifications(
    params?: GetMemberNotificationsParams
  ): Promise<MemberNotificationSummary> {
    return getMemberNotificationsAction(params);
  },

  async markMemberNotificationRead(
    notificationId: string
  ): Promise<{ success: boolean; error?: string }> {
    return markMemberNotificationReadAction(notificationId);
  },

  async markAllMemberNotificationsRead(): Promise<{ success: boolean; count?: number; error?: string }> {
    return markAllMemberNotificationsReadAction();
  },

  async deleteMemberNotification(
    notificationId: string
  ): Promise<{ success: boolean; error?: string }> {
    return deleteMemberNotificationAction(notificationId);
  },
};
