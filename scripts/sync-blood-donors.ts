import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { INITIAL_BLOOD_DONORS } from "../src/data/emergencyData";

async function main() {
  console.log(`Syncing ${INITIAL_BLOOD_DONORS.length} blood donors to relational table...`);

  for (const donor of INITIAL_BLOOD_DONORS) {
    const cleanPhone = donor.phone.replace(/\D/g, "");
    await prisma.bloodDonor.upsert({
      where: { phone: cleanPhone },
      update: {
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        upazila: donor.upazila,
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
      },
      create: {
        id: donor.id,
        name: donor.name,
        phone: cleanPhone,
        bloodGroup: donor.bloodGroup,
        upazila: donor.upazila,
        lastDonated: donor.lastDonated || "তথ্য নেই",
        isAvailable: donor.isAvailable !== false,
        status: donor.status || "approved",
      },
    });
  }

  const count = await prisma.bloodDonor.count();
  console.log(`Successfully synced! Total blood donors in DB: ${count}`);
}

main()
  .catch((err) => {
    console.error("Error syncing blood donors:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
    process.exit(0);
  });
