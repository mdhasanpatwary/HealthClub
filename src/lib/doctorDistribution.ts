import { Doctor } from "@/services/db";

/**
 * Safely extracts a numeric timestamp from string or Date
 */
function getTimestamp(d?: string | Date | null): number {
  if (!d) return 0;
  const time = new Date(d).getTime();
  return isNaN(time) ? 0 : time;
}

/**
 * Distributes doctors fairly using round-robin interleaving across partners.
 * 
 * 1. Groups partner-affiliated doctors by `partnerId`.
 * 2. Sorts doctors within each partner by `createdAt: desc` (newest first).
 * 3. Sorts partner groups by the timestamp of their most recently added doctor.
 * 4. Interleaves doctors round-robin (Round 1: 1st doctor from each partner,
 *    Round 2: 2nd doctor from each partner, etc.).
 * 5. Appends non-partner (independent) doctors (newest first) after partner doctors.
 * 
 * This ensures that when partner hospitals and diagnostic centers add doctors,
 * their doctors are fairly represented in the initial slots without any single
 * partner monopolizing the view.
 */
export function distributeDoctorsFairly(doctors: Doctor[]): Doctor[] {
  if (!doctors || doctors.length <= 1) {
    return doctors || [];
  }

  const partnerGroups = new Map<string, Doctor[]>();
  const independentDoctors: Doctor[] = [];

  for (const doc of doctors) {
    const pId = doc.partnerId?.trim();
    if (pId) {
      const group = partnerGroups.get(pId) || [];
      group.push(doc);
      partnerGroups.set(pId, group);
    } else {
      independentDoctors.push(doc);
    }
  }

  // Sort doctors within each partner group: newest created first
  for (const group of partnerGroups.values()) {
    group.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
  }

  // Sort independent doctors: newest created first
  independentDoctors.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

  // Sort partner order by the recency of their newest doctor
  const sortedPartnerIds = Array.from(partnerGroups.keys()).sort((pA, pB) => {
    const latestA = partnerGroups.get(pA)?.[0]?.createdAt;
    const latestB = partnerGroups.get(pB)?.[0]?.createdAt;
    return getTimestamp(latestB) - getTimestamp(latestA);
  });

  // Interleave one doctor from each partner per round
  const distributedPartnerDoctors: Doctor[] = [];
  let hasMore = true;
  let round = 0;

  while (hasMore) {
    hasMore = false;
    for (const pId of sortedPartnerIds) {
      const group = partnerGroups.get(pId);
      if (group && round < group.length) {
        distributedPartnerDoctors.push(group[round]);
        hasMore = true;
      }
    }
    round++;
  }

  // Combine: Partner doctors in fair round-robin order + Independent doctors
  return [...distributedPartnerDoctors, ...independentDoctors];
}
