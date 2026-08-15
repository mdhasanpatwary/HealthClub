import { prisma } from "@/lib/prisma";
import doctors from "@/data/fenirDoctors.json";

async function main() {
  console.log(`Starting to import ${doctors.length} doctors into database...`);

  let added = 0;
  let errors = 0;

  // Process in chunks of 25 to respect pool limits
  const chunkSize = 25;
  for (let i = 0; i < doctors.length; i += chunkSize) {
    const chunk = doctors.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (doc) => {
        try {
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
              partnerId: null,
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
              isActive: true,
            }
          });
          added++;
        } catch (e: unknown) {
          console.error(`Failed to upsert ${doc.id} (${doc.name}):`, e instanceof Error ? e.message : e);
          errors++;
        }
      })
    );
    console.log(`Progress: ${Math.min(i + chunkSize, doctors.length)} / ${doctors.length}`);
  }

  const finalCount = await prisma.doctor.count();
  console.log(`\nImport complete!`);
  console.log(`Successfully processed: ${added}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total doctors now in database: ${finalCount}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
