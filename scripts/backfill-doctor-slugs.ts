import { prisma } from "../src/lib/prisma";
import { generateDoctorSlug, resolveUniqueDoctorSlug } from "../src/lib/slugify";

async function backfillDoctorSlugs() {
  console.log("Starting doctor slug backfill...");

  const doctors = await prisma.doctor.findMany({
    where: {
      OR: [
        { slug: null },
        { slug: "" },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${doctors.length} doctors needing slugs.`);

  let updatedCount = 0;
  for (const doc of doctors) {
    const baseSlug = generateDoctorSlug(doc.name) || `doc-${doc.id.replace(/^doc_/, "")}`;
    const uniqueSlug = await resolveUniqueDoctorSlug(prisma, baseSlug, doc.id);

    await prisma.doctor.update({
      where: { id: doc.id },
      data: { slug: uniqueSlug },
    });

    updatedCount++;
    if (updatedCount % 50 === 0 || updatedCount === doctors.length) {
      console.log(`Updated ${updatedCount}/${doctors.length} doctor slugs (e.g. ${doc.name} -> ${uniqueSlug})`);
    }
  }

  console.log(`Finished! Successfully backfilled ${updatedCount} doctor slugs.`);
}

backfillDoctorSlugs()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
