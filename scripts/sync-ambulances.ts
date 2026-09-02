import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { INITIAL_AMBULANCES } from "../src/data/emergencyData";

async function main() {
  console.log(`Syncing ${INITIAL_AMBULANCES.length} ambulances to relational table...`);

  for (const amb of INITIAL_AMBULANCES) {
    const cleanPhone = amb.phone.replace(/\D/g, "");
    await prisma.ambulanceService.upsert({
      where: { phone: cleanPhone },
      update: {
        name: amb.name,
        type: amb.type,
        location: amb.location,
        availableHours: amb.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: amb.status || "approved",
      },
      create: {
        id: amb.id,
        name: amb.name,
        phone: cleanPhone,
        type: amb.type,
        location: amb.location,
        availableHours: amb.availableHours || "২৪/৭ সার্বক্ষণিক",
        status: amb.status || "approved",
      },
    });
  }

  const list = await prisma.ambulanceService.findMany({
    orderBy: { createdAt: "desc" },
  });
  console.log(`Successfully synced! Total ambulances in DB: ${list.length}`);
  console.log("Ambulance Services:");
  list.forEach((amb, index) => {
    console.log(` ${index + 1}. [${amb.type}] ${amb.name} - 📞 ${amb.phone} (${amb.location})`);
  });
}

main()
  .catch((err) => {
    console.error("Error syncing ambulances:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
    process.exit(0);
  });
