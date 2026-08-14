"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { unstable_cache, updateTag } from "next/cache";
import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  INITIAL_BLOOD_DONORS,
  INITIAL_AMBULANCES,
  INITIAL_EMERGENCY_HOTLINES,
} from "@/data/emergencyData";

const EMERGENCY_TAG = "emergency-data";

async function verifyAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Fetch all emergency data (blood donors, ambulances, hotlines).
 * Cached via Next.js ISR tags.
 */
export const getEmergencyDataAction = unstable_cache(
  async (): Promise<{
    bloodDonors: BloodDonor[];
    ambulances: AmbulanceService[];
    hotlines: EmergencyHotline[];
  }> => {
    try {
      if (!prisma?.systemSetting) {
        return {
          bloodDonors: INITIAL_BLOOD_DONORS,
          ambulances: INITIAL_AMBULANCES,
          hotlines: INITIAL_EMERGENCY_HOTLINES,
        };
      }

      const settings = await prisma.systemSetting.findMany({
        where: {
          key: {
            in: ["emergency_donors", "emergency_ambulances", "emergency_hotlines"],
          },
        },
      });

      const map = new Map(settings.map((s) => [s.key, s.value]));

      let bloodDonors = INITIAL_BLOOD_DONORS;
      let ambulances = INITIAL_AMBULANCES;
      let hotlines = INITIAL_EMERGENCY_HOTLINES;

      if (map.has("emergency_donors")) {
        try {
          bloodDonors = JSON.parse(map.get("emergency_donors")!);
        } catch (e) {
          console.error("Failed to parse emergency_donors", e);
        }
      }

      if (map.has("emergency_ambulances")) {
        try {
          ambulances = JSON.parse(map.get("emergency_ambulances")!);
        } catch (e) {
          console.error("Failed to parse emergency_ambulances", e);
        }
      }

      if (map.has("emergency_hotlines")) {
        try {
          hotlines = JSON.parse(map.get("emergency_hotlines")!);
        } catch (e) {
          console.error("Failed to parse emergency_hotlines", e);
        }
      }

      return { bloodDonors, ambulances, hotlines };
    } catch (err) {
      console.error("Error in getEmergencyDataAction:", err);
      return {
        bloodDonors: INITIAL_BLOOD_DONORS,
        ambulances: INITIAL_AMBULANCES,
        hotlines: INITIAL_EMERGENCY_HOTLINES,
      };
    }
  },
  ["all-emergency-data"],
  { tags: [EMERGENCY_TAG] }
);

// --- BLOOD DONORS ---

export async function saveBloodDonorAction(donor: BloodDonor) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const existingIndex = data.bloodDonors.findIndex((d) => d.id === donor.id);
    let updatedList: BloodDonor[];

    if (existingIndex >= 0) {
      updatedList = [...data.bloodDonors];
      updatedList[existingIndex] = donor;
    } else {
      updatedList = [donor, ...data.bloodDonors];
    }

    await prisma.systemSetting.upsert({
      where: { key: "emergency_donors" },
      create: { key: "emergency_donors", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteBloodDonorAction(id: string) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.filter((d) => d.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_donors" },
      create: { key: "emergency_donors", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleBloodDonorAvailabilityAction(id: string) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.map((d) =>
      d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
    );

    await prisma.systemSetting.upsert({
      where: { key: "emergency_donors" },
      create: { key: "emergency_donors", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- AMBULANCE SERVICES ---

export async function saveAmbulanceAction(ambulance: AmbulanceService) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const existingIndex = data.ambulances.findIndex((a) => a.id === ambulance.id);
    let updatedList: AmbulanceService[];

    if (existingIndex >= 0) {
      updatedList = [...data.ambulances];
      updatedList[existingIndex] = ambulance;
    } else {
      updatedList = [ambulance, ...data.ambulances];
    }

    await prisma.systemSetting.upsert({
      where: { key: "emergency_ambulances" },
      create: { key: "emergency_ambulances", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteAmbulanceAction(id: string) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const updatedList = data.ambulances.filter((a) => a.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_ambulances" },
      create: { key: "emergency_ambulances", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- HOTLINES & OXYGEN ---

export async function saveHotlineAction(hotline: EmergencyHotline) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const existingIndex = data.hotlines.findIndex((h) => h.id === hotline.id);
    let updatedList: EmergencyHotline[];

    if (existingIndex >= 0) {
      updatedList = [...data.hotlines];
      updatedList[existingIndex] = hotline;
    } else {
      updatedList = [hotline, ...data.hotlines];
    }

    await prisma.systemSetting.upsert({
      where: { key: "emergency_hotlines" },
      create: { key: "emergency_hotlines", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteHotlineAction(id: string) {
  try {
    await verifyAdmin();
    const data = await getEmergencyDataAction();
    const updatedList = data.hotlines.filter((h) => h.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_hotlines" },
      create: { key: "emergency_hotlines", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
