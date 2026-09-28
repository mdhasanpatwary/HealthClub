import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { BLOG_POSTS } from "../src/data/blog/blogPosts";
import { getPostFacilityMeta } from "../src/app/blog/utils/blogPagination";

const ALL_SEED_POSTS = [...BLOG_POSTS];

async function main() {
  console.log(`Starting migration/seeding of ${ALL_SEED_POSTS.length} blog posts into PostgreSQL database...`);

  let count = 0;
  for (const post of ALL_SEED_POSTS) {
    const facilityMeta = getPostFacilityMeta(post);
    const hospitalCount = post.hospitals?.length ?? 0;
    const facilityCount = facilityMeta.count;
    const facilityLabelBn = facilityMeta.labelBn;
    const facilityLabelEn = facilityMeta.labelEn;

    const data = {
      slug: post.slug.toLowerCase().trim(),
      titleBn: post.titleBn,
      titleEn: post.titleEn,
      excerptBn: post.excerptBn,
      excerptEn: post.excerptEn,
      category: post.category,
      categoryNameBn: post.categoryNameBn || "",
      categoryNameEn: post.categoryNameEn || "",
      publishedDate: post.publishedDate,
      modifiedDate: post.modifiedDate || post.publishedDate,
      readTimeBn: post.readTimeBn,
      readTimeEn: post.readTimeEn,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt || post.titleBn,
      author: JSON.parse(JSON.stringify(post.author)),
      hospitalCount,
      facilityCount,
      facilityLabelBn,
      facilityLabelEn,
      keyHighlightsBn: post.keyHighlightsBn ? JSON.parse(JSON.stringify(post.keyHighlightsBn)) : null,
      introParagraphsBn: post.introParagraphsBn ? JSON.parse(JSON.stringify(post.introParagraphsBn)) : null,
      diagnosticComparisonTable: post.diagnosticComparisonTable
        ? JSON.parse(JSON.stringify(post.diagnosticComparisonTable))
        : null,
      diagnosticCenters: post.diagnosticCenters ? JSON.parse(JSON.stringify(post.diagnosticCenters)) : null,
      diagnosticTestPricingBn: post.diagnosticTestPricingBn
        ? JSON.parse(JSON.stringify(post.diagnosticTestPricingBn))
        : null,
      bookingGuideBn: post.bookingGuideBn ? JSON.parse(JSON.stringify(post.bookingGuideBn)) : null,
      selectionGuideBn: post.selectionGuideBn ? JSON.parse(JSON.stringify(post.selectionGuideBn)) : null,
      faqs: post.faqs ? JSON.parse(JSON.stringify(post.faqs)) : null,
      relatedSlugs: post.relatedSlugs ? JSON.parse(JSON.stringify(post.relatedSlugs)) : null,
      metaKeywords: post.metaKeywords ? JSON.parse(JSON.stringify(post.metaKeywords)) : null,
      tags: post.tags ? JSON.parse(JSON.stringify(post.tags)) : null,
      contentPayload: JSON.parse(JSON.stringify(post)),
    };

    await prisma.blogPost.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    count++;
    if (count % 10 === 0 || count === ALL_SEED_POSTS.length) {
      console.log(`Synced ${count}/${ALL_SEED_POSTS.length} posts...`);
    }
  }

  const totalInDb = await prisma.blogPost.count();
  console.log(`✅ Seeding complete! Total BlogPost rows in database: ${totalInDb}`);
}

main()
  .catch((err) => {
    console.error("❌ Error seeding blog posts:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
    process.exit(0);
  });
