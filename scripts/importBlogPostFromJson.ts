import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";
import { getPostFacilityMeta } from "../src/app/blog/utils/blogPagination";
import { BlogPost } from "../src/types/blog";

/**
 * Generic JSON Importer for Blog Posts
 * Usage: npx tsx scripts/importBlogPostFromJson.ts <path-to-json-file>
 *
 * This allows adding or updating any blog post in PostgreSQL without creating
 * static TypeScript files in the codebase.
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ Error: Please provide the path to a blog post JSON file.");
    console.log("Usage: npx tsx scripts/importBlogPostFromJson.ts <path-to-json-file>");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found at path: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading blog post data from: ${filePath}...`);
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const post = JSON.parse(rawContent) as BlogPost;

  if (!post.slug || !post.titleBn) {
    console.error("❌ Error: Invalid blog post format. 'slug' and 'titleBn' are required.");
    process.exit(1);
  }

  const slug = post.slug.toLowerCase().trim();
  const facilityMeta = getPostFacilityMeta(post);
  const hospitalCount = post.hospitals?.length ?? 0;
  const facilityCount = post.facilityCount !== undefined ? post.facilityCount : facilityMeta.count;
  const facilityLabelBn = post.facilityLabelBn || facilityMeta.labelBn;
  const facilityLabelEn = post.facilityLabelEn || facilityMeta.labelEn;

  const data = {
    slug,
    titleBn: post.titleBn,
    titleEn: post.titleEn,
    excerptBn: post.excerptBn,
    excerptEn: post.excerptEn,
    category: post.category,
    categoryNameBn: post.categoryNameBn || "",
    categoryNameEn: post.categoryNameEn || "",
    publishedDate: post.publishedDate || new Date().toISOString().split("T")[0],
    modifiedDate: post.modifiedDate || post.publishedDate || new Date().toISOString().split("T")[0],
    readTimeBn: post.readTimeBn || "১০ মিনিট",
    readTimeEn: post.readTimeEn || "10 min read",
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt || post.titleBn,
    author: JSON.parse(JSON.stringify(post.author || { nameBn: "হেলথ ক্লাব টিম", nameEn: "Health Club Team" })),
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

  const upserted = await prisma.blogPost.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  const totalInDb = await prisma.blogPost.count();
  console.log(`✅ Successfully saved blog post: ${upserted.slug} (ID: ${upserted.id})`);
  console.log(`📊 Total BlogPost rows in database: ${totalInDb}`);
}

main()
  .catch((err) => {
    console.error("❌ Error importing blog post:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
