import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { INITIAL_BLOOD_DONORS } from "../src/data/emergencyData";

async function main() {
  console.log(`Syncing ${INITIAL_BLOOD_DONORS.length} blood donors to database...`);
  
  await prisma.systemSetting.upsert({
    where: { key: "emergency_donors" },
    create: {
      key: "emergency_donors",
      value: JSON.stringify(INITIAL_BLOOD_DONORS),
    },
    update: {
      value: JSON.stringify(INITIAL_BLOOD_DONORS),
    },
  });

  const updated = await prisma.systemSetting.findUnique({
    where: { key: "emergency_donors" },
  });

  const count = updated ? JSON.parse(updated.value).length : 0;
  console.log(`Successfully synced! Total donors in DB: ${count}`);
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
