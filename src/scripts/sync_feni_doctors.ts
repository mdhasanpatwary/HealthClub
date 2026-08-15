import { prisma } from "@/lib/prisma";
import feniDoctors from "@/data/feniUniqueDoctors.json";

async function main() {
  console.log(`Starting clean sync for ${feniDoctors.length} unique Feni doctors...`);

  // 1. Delete old scraped duplicate rows
  const deleteResult = await prisma.doctor.deleteMany({
    where: {
      id: {
        startsWith: "doc_fenir_"
      }
    }
  });
  console.log(`Deleted ${deleteResult.count} old raw scraped entries.`);

  // 2. Insert/Upsert the 229 clean unique Feni doctors
  let count = 0;
  for (const doc of feniDoctors) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      create: {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        department: doc.department,
        degrees: doc.degrees,
        designation: doc.designation,
        chamberName: doc.chamberName,
        chamberAddress: doc.chamberAddress,
        roomNo: doc.roomNo || null,
        visitingDays: doc.visitingDays,
        visitingHours: doc.visitingHours,
        serialPhone: doc.serialPhone,
        consultationFee: doc.consultationFee || null,
        imageUrl: doc.imageUrl || null,
        partnerId: doc.partnerId || null,
        isActive: true,
      },
      update: {
        name: doc.name,
        specialty: doc.specialty,
        department: doc.department,
        degrees: doc.degrees,
        designation: doc.designation,
        chamberName: doc.chamberName,
        chamberAddress: doc.chamberAddress,
        roomNo: doc.roomNo || null,
        visitingDays: doc.visitingDays,
        visitingHours: doc.visitingHours,
        serialPhone: doc.serialPhone,
        consultationFee: doc.consultationFee || null,
        imageUrl: doc.imageUrl || null,
        partnerId: doc.partnerId || null,
        isActive: true,
      }
    });
    count++;
  }

  const totalInDb = await prisma.doctor.count({ where: { isActive: true } });
  console.log(`Successfully synced ${count} unique Feni doctors!`);
  console.log(`Total active doctors in database: ${totalInDb}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
