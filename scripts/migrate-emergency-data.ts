import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { INITIAL_BLOOD_DONORS, INITIAL_AMBULANCES } from "../src/data/emergencyData";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("8801")) {
    return digits.substring(2);
  }
  return digits;
}

export async function migrateEmergencyData() {
  console.log("Starting migration of emergency data to relational tables...");

  // 1. Migrate Blood Donors
  const donorSetting = await prisma.systemSetting.findUnique({
    where: { key: "emergency_donors" },
  });

  let rawDonors = INITIAL_BLOOD_DONORS;
  if (donorSetting?.value) {
    try {
      const parsed = JSON.parse(donorSetting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawDonors = parsed;
      }
    } catch (e) {
      console.error("Failed to parse existing emergency_donors setting:", e);
    }
  }

  console.log(`Found ${rawDonors.length} blood donors to migrate.`);
  const seenDonorPhones = new Set<string>();
  let donorsMigrated = 0;

  for (const donor of rawDonors) {
    const cleanPhone = normalizePhone(donor.phone || "");
    if (!cleanPhone || seenDonorPhones.has(cleanPhone)) {
      continue;
    }
    seenDonorPhones.add(cleanPhone);

    const createdAt = donor.createdAt ? new Date(donor.createdAt) : new Date();
    const validDate = isNaN(createdAt.getTime()) ? new Date() : createdAt;

    await prisma.bloodDonor.upsert({
      where: { phone: cleanPhone },
      update: {
        name: donor.name || "অজ্ঞাত দাতা",
        bloodGroup: donor.bloodGroup || "O+",
        upazila: donor.upazila || "feni-sadar",
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
      },
      create: {
        id: donor.id || `donor-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: donor.name || "অজ্ঞাত দাতা",
        phone: cleanPhone,
        bloodGroup: donor.bloodGroup || "O+",
        upazila: donor.upazila || "feni-sadar",
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
        createdAt: validDate,
      },
    });
    donorsMigrated++;
  }
  console.log(`Migrated ${donorsMigrated} blood donors successfully.`);

  // 2. Migrate Ambulances
  const ambSetting = await prisma.systemSetting.findUnique({
    where: { key: "emergency_ambulances" },
  });

  let rawAmbulances = INITIAL_AMBULANCES;
  if (ambSetting?.value) {
    try {
      const parsed = JSON.parse(ambSetting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        rawAmbulances = parsed;
      }
    } catch (e) {
      console.error("Failed to parse existing emergency_ambulances setting:", e);
    }
  }

  console.log(`Found ${rawAmbulances.length} ambulances to migrate.`);
  const seenAmbPhones = new Set<string>();
  let ambulancesMigrated = 0;

  for (const amb of rawAmbulances) {
    const cleanPhone = normalizePhone(amb.phone || "");
    if (!cleanPhone || seenAmbPhones.has(cleanPhone)) {
      continue;
    }
    seenAmbPhones.add(cleanPhone);

    const createdAt = amb.createdAt ? new Date(amb.createdAt) : new Date();
    const validDate = isNaN(createdAt.getTime()) ? new Date() : createdAt;

    await prisma.ambulanceService.upsert({
      where: { phone: cleanPhone },
      update: {
        name: amb.name || "অ্যাম্বুলেন্স সার্ভিস",
        type: amb.type || "AC",
        location: amb.location || "ফেনী সদর",
        availableHours: amb.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: amb.status || "approved",
      },
      create: {
        id: amb.id || `amb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: amb.name || "অ্যাম্বুলেন্স সার্ভিস",
        phone: cleanPhone,
        type: amb.type || "AC",
        location: amb.location || "ফেনী সদর",
        availableHours: amb.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: amb.status || "approved",
        createdAt: validDate,
      },
    });
    ambulancesMigrated++;
  }
  console.log(`Migrated ${ambulancesMigrated} ambulance services successfully.`);

  const [finalDonors, finalAmbulances] = await Promise.all([
    prisma.bloodDonor.count(),
    prisma.ambulanceService.count(),
  ]);
  console.log(`Migration Complete! Total in DB -> Donors: ${finalDonors}, Ambulances: ${finalAmbulances}`);
}

migrateEmergencyData()
  .catch((err) => {
    console.error("Error migrating emergency data:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
    process.exit(0);
  });
