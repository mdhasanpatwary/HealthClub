import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

/**
 * Generic Blog Posts Exporter / Backup Tool
 * Usage: npx tsx scripts/exportBlogPosts.ts [output-file-path]
 * Default output: backups/blog_posts_backup.json
 */
async function main() {
  const args = process.argv.slice(2);
  const defaultDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }

  const outputPath = args[0]
    ? path.resolve(process.cwd(), args[0])
    : path.resolve(defaultDir, `blog_posts_backup_${new Date().toISOString().split("T")[0]}.json`);

  console.log("Fetching all blog posts from PostgreSQL database...");
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedDate: "desc" },
  });

  console.log(`Exporting ${posts.length} posts to: ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");

  console.log(`✅ Successfully backed up ${posts.length} blog posts to ${outputPath}`);
}

main()
  .catch((err) => {
    console.error("❌ Error exporting blog posts:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
