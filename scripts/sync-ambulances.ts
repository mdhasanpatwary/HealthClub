import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { INITIAL_AMBULANCES } from "../src/data/emergencyData";

async function main() {
  console.log(`Syncing ${INITIAL_AMBULANCES.length} ambulances to database...`);
  
  await prisma.systemSetting.upsert({
    where: { key: "emergency_ambulances" },
    create: {
      key: "emergency_ambulances",
      value: JSON.stringify(INITIAL_AMBULANCES),
    },
    update: {
      value: JSON.stringify(INITIAL_AMBULANCES),
    },
  });

  const updated = await prisma.systemSetting.findUnique({
    where: { key: "emergency_ambulances" },
  });

  const list = updated ? JSON.parse(updated.value) : [];
  console.log(`Successfully synced! Total ambulances in DB: ${list.length}`);
  console.log("Ambulance Services:");
  list.forEach((amb: { id: string; name: string; phone: string; type: string; location: string }, index: number) => {
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
