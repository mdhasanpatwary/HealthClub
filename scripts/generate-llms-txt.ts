import "dotenv/config";
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";
import { collectLlmsKnowledgeData } from "../src/lib/seo/llmsDataCollector";
import { generateLlmsTxt, generateLlmsFullTxt } from "../src/lib/seo/llmsGenerator";

/**
 * Health Club — Automated LLM Knowledge Base Synchronizer
 * Generates and synchronizes public/llms.txt and public/llms-full.txt
 * for Generative AI engines (ChatGPT, Gemini, Perplexity, Claude, Grok).
 *
 * Usage:
 *   npx tsx scripts/generate-llms-txt.ts
 */
async function main() {
  console.log("=================================================");
  console.log("🤖 Health Club — Dynamic LLM Knowledge Sync Pipeline");
  console.log("=================================================");

  const startTime = Date.now();
  console.log("Fetching live directory data from PostgreSQL and local catalogs...");
  const data = await collectLlmsKnowledgeData();

  console.log(`\n📊 Data Collection Summary:`);
  console.log(`  - 👨‍⚕️ Specialist Doctors: ${data.doctors.length}`);
  console.log(`  - 🏥 Partner Facilities (Feni Sadar): ${data.partners.length}`);
  console.log(`  - 🔬 Diagnostic Tests Cataloged: ${data.tests.length}`);
  console.log(`  - 🚑 Emergency Ambulances: ${data.ambulances.length}`);
  console.log(`  - 🩸 Voluntary Blood Donors: ${data.bloodDonors.length}`);
  console.log(`  - 📝 Published Medical Guides: ${data.blogPosts.length}`);

  console.log("\nGenerating structured markdown files...");
  const [llmsTxtContent, llmsFullTxtContent] = await Promise.all([
    generateLlmsTxt(data),
    generateLlmsFullTxt(data),
  ]);

  const publicDir = path.resolve(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const llmsTxtPath = path.resolve(publicDir, "llms.txt");
  const llmsFullTxtPath = path.resolve(publicDir, "llms-full.txt");

  fs.writeFileSync(llmsTxtPath, llmsTxtContent, "utf-8");
  fs.writeFileSync(llmsFullTxtPath, llmsFullTxtContent, "utf-8");

  const llmsTxtStats = fs.statSync(llmsTxtPath);
  const llmsFullTxtStats = fs.statSync(llmsFullTxtPath);

  console.log("\n✅ Generated Files Successfully:");
  console.log(
    `  - public/llms.txt: ${(llmsTxtStats.size / 1024).toFixed(2)} KB (${llmsTxtContent.length} chars)`
  );
  console.log(
    `  - public/llms-full.txt: ${(llmsFullTxtStats.size / 1024).toFixed(2)} KB (${llmsFullTxtContent.length} chars)`
  );
  console.log(`\n⏱️ Execution time: ${Date.now() - startTime}ms`);
  console.log("=================================================");
}

main()
  .catch((err) => {
    console.error("❌ Fatal error generating LLM knowledge bases:", err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
    process.exit(0);
  });
