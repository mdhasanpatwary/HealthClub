"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { unstable_cache, updateTag, revalidateTag, revalidatePath } from "next/cache";
import {
  BloodDonor,
  AmbulanceService,
  EmergencyHotline,
  INITIAL_BLOOD_DONORS,
  INITIAL_AMBULANCES,
  INITIAL_EMERGENCY_HOTLINES,
} from "@/data/emergencyData";

const EMERGENCY_TAG = "emergency-data";

async function verifyAdmin(): Promise<boolean> {
  const session = await getSessionUser();
  return !!(session && session.role === "admin");
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
          const parsed = JSON.parse(map.get("emergency_donors")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            bloodDonors = parsed;
          } else {
            bloodDonors = INITIAL_BLOOD_DONORS;
          }
        } catch (e) {
          console.error("Failed to parse emergency_donors", e);
          bloodDonors = INITIAL_BLOOD_DONORS;
        }
      }

      if (map.has("emergency_ambulances")) {
        try {
          const parsed = JSON.parse(map.get("emergency_ambulances")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            ambulances = parsed;
          } else {
            ambulances = INITIAL_AMBULANCES;
          }
        } catch (e) {
          console.error("Failed to parse emergency_ambulances", e);
          ambulances = INITIAL_AMBULANCES;
        }
      }

      if (map.has("emergency_hotlines")) {
        try {
          const parsed = JSON.parse(map.get("emergency_hotlines")!);
          if (Array.isArray(parsed) && parsed.length > 0) {
            hotlines = parsed;
          } else {
            hotlines = INITIAL_EMERGENCY_HOTLINES;
          }
        } catch (e) {
          console.error("Failed to parse emergency_hotlines", e);
          hotlines = INITIAL_EMERGENCY_HOTLINES;
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
  ["all-emergency-data-v4"],
  { tags: [EMERGENCY_TAG], revalidate: 60 }
);

// --- BLOOD DONORS ---

export async function saveBloodDonorAction(donor: BloodDonor) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
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
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteBloodDonorAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.bloodDonors.filter((d) => d.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_donors" },
      create: { key: "emergency_donors", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function toggleBloodDonorAvailabilityAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
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
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- AMBULANCE SERVICES ---

export async function saveAmbulanceAction(ambulance: AmbulanceService) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
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
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteAmbulanceAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.ambulances.filter((a) => a.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_ambulances" },
      create: { key: "emergency_ambulances", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// --- HOTLINES & OXYGEN ---

export async function saveHotlineAction(hotline: EmergencyHotline) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
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
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function deleteHotlineAction(id: string) {
  try {
    if (!await verifyAdmin()) return { success: false, error: "অননুমোদিত অ্যাক্সেস।" };
    const data = await getEmergencyDataAction();
    const updatedList = data.hotlines.filter((h) => h.id !== id);

    await prisma.systemSetting.upsert({
      where: { key: "emergency_hotlines" },
      create: { key: "emergency_hotlines", value: JSON.stringify(updatedList) },
      update: { value: JSON.stringify(updatedList) },
    });

    updateTag(EMERGENCY_TAG);
    revalidateTag(EMERGENCY_TAG, "max");
    revalidatePath("/emergency");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
