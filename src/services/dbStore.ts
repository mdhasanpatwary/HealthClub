import { Member, Partner, Transaction, initialMembers, initialPartners, initialTransactions } from "./db";

// Helper to check if running on client side
const isClient = typeof window !== "undefined";

// Cache keys
const KEYS = {
  PARTNERS: "hc_partners",
  MEMBERS: "hc_members",
  TRANSACTIONS: "hc_transactions",
  CURRENT_USER: "hc_current_user",
};

// In-memory fallback for server side
const serverStore = {
  partners: [...initialPartners],
  members: [...initialMembers],
  transactions: [...initialTransactions],
  currentUser: null as Member | null,
};

export const dbStore = {
  // --- PARTNERS ---
  getPartners(): Partner[] {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.PARTNERS);
      if (!stored) {
        localStorage.setItem(KEYS.PARTNERS, JSON.stringify(initialPartners));
        return initialPartners;
      }
      return JSON.parse(stored);
    }
    return serverStore.partners;
  },

  addPartner(partner: Omit<Partner, "id">): Partner {
    const newPartner: Partner = {
      ...partner,
      id: `p_${Date.now()}`,
    };
    if (isClient) {
      const current = this.getPartners();
      const updated = [newPartner, ...current];
      localStorage.setItem(KEYS.PARTNERS, JSON.stringify(updated));
      return newPartner;
    }
    serverStore.partners.unshift(newPartner);
    return newPartner;
  },

  // --- MEMBERS ---
  getMembers(): Member[] {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.MEMBERS);
      if (!stored) {
        localStorage.setItem(KEYS.MEMBERS, JSON.stringify(initialMembers));
        return initialMembers;
      }
      return JSON.parse(stored);
    }
    return serverStore.members;
  },

  addMember(member: Omit<Member, "id" | "status" | "joinedDate" | "expiryDate" | "totalSaved">): Member {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newMember: Member = {
      ...member,
      id: `HC-${year}-${rand}`,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      totalSaved: 0,
    };

    if (isClient) {
      const current = this.getMembers();
      const updated = [newMember, ...current];
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(updated));
      return newMember;
    }
    serverStore.members.unshift(newMember);
    return newMember;
  },

  getMemberById(id: string): Member | undefined {
    return this.getMembers().find(m => m.id === id || m.phone === id || m.email === id);
  },

  // --- TRANSACTIONS ---
  getTransactions(): Transaction[] {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.TRANSACTIONS);
      if (!stored) {
        localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
        return initialTransactions;
      }
      return JSON.parse(stored);
    }
    return serverStore.transactions;
  },

  addTransaction(tx: Omit<Transaction, "id" | "date">): Transaction {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      date: new Date().toLocaleString("en-US", { hour12: true }),
    };

    if (isClient) {
      const current = this.getTransactions();
      const updated = [newTx, ...current];
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));

      // Update member's total savings
      const members = this.getMembers();
      const updatedMembers = members.map(m => {
        if (m.id === tx.memberId) {
          const totalSaved = (m.totalSaved || 0) + tx.saved;
          // If the logged-in user is updated, update current user cache as well
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === m.id) {
            this.setCurrentUser({ ...currentUser, totalSaved });
          }
          return { ...m, totalSaved };
        }
        return m;
      });
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(updatedMembers));
      return newTx;
    }

    serverStore.transactions.unshift(newTx);
    const member = serverStore.members.find(m => m.id === tx.memberId);
    if (member) {
      member.totalSaved += tx.saved;
    }
    return newTx;
  },

  // --- CURRENT SESSION ---
  getCurrentUser(): Member | null {
    if (isClient) {
      const stored = localStorage.getItem(KEYS.CURRENT_USER);
      if (!stored) return null;
      // Refresh current user data from members list to ensure totalSaved is accurate
      const user = JSON.parse(stored) as Member;
      const refreshed = this.getMemberById(user.id);
      if (refreshed) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(refreshed));
        return refreshed;
      }
      return user;
    }
    return serverStore.currentUser;
  },

  setCurrentUser(user: Member): void {
    if (isClient) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      serverStore.currentUser = user;
    }
  },

  logout(): void {
    if (isClient) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      serverStore.currentUser = null;
    }
  },

  // --- ANALYTICS ---
  getStats() {
    const members = this.getMembers();
    const partners = this.getPartners();
    const transactions = this.getTransactions();

    const activeMembers = members.filter(m => m.status === "active").length;
    const totalSaved = members.reduce((sum, m) => sum + (m.totalSaved || 0), 0);
    const totalTransactions = transactions.length;

    // Simulated revenue based on individual/family plans (500 BDT/year, 1500 BDT/year)
    // Founding tier is free (0 BDT)
    const revenue = members.reduce((sum, m) => {
      if (m.tier === "individual") return sum + 500;
      if (m.tier === "family") return sum + 1500;
      return sum;
    }, 0);

    return {
      totalMembers: members.length,
      activeMembers,
      partnerCount: partners.length,
      totalSaved,
      totalTransactions,
      revenue,
    };
  }
};
