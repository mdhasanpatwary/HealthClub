/**
 * One-time script: Compress doctor and placeholder images to WebP
 * Usage: node src/scripts/compress-images.mjs
 */
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const DIRS = [
  "public/images/doctors",
  "public/images/placeholders",
  "public/images/partners",
];

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

// Quality settings
const DOCTOR_OPTS = { quality: 75, effort: 6 };       // doctor portraits
const PLACEHOLDER_OPTS = { quality: 70, effort: 6 };   // placeholder images
const PARTNER_OPTS = { quality: 75, effort: 6 };        // partner logos

async function compressDir(dir, opts) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log(`  ⏭ Skipping ${dir} (not found)`);
    return { processed: 0, savedBytes: 0 };
  }

  let processed = 0;
  let savedBytes = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;

    const inputPath = join(dir, file);
    const outputPath = join(dir, basename(file, ext) + ".webp");

    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;

    try {
      // Resize doctor images to max 400px width (they're profile photos)
      const pipeline = sharp(inputPath);

      if (dir.includes("doctors")) {
        pipeline.resize({ width: 400, withoutEnlargement: true });
      } else if (dir.includes("placeholders")) {
        pipeline.resize({ width: 600, withoutEnlargement: true });
      }

      await pipeline.webp(opts).toFile(outputPath);

      const newStat = await stat(outputPath);
      const saved = originalSize - newStat.size;
      savedBytes += saved;
      processed++;

      const pct = ((saved / originalSize) * 100).toFixed(0);
      console.log(
        `  ✅ ${file} → ${basename(outputPath)} | ${(originalSize / 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB (${pct}% saved)`
      );
    } catch (err) {
      console.error(`  ❌ Failed: ${file} — ${err.message}`);
    }
  }

  return { processed, savedBytes };
}

async function main() {
  console.log("🖼  Image Compression Script\\n");

  let totalProcessed = 0;
  let totalSaved = 0;

  for (const dir of DIRS) {
    console.log(`\\n📁 Processing: ${dir}`);
    const opts = dir.includes("doctors")
      ? DOCTOR_OPTS
      : dir.includes("placeholders")
        ? PLACEHOLDER_OPTS
        : PARTNER_OPTS;

    const { processed, savedBytes } = await compressDir(dir, opts);
    totalProcessed += processed;
    totalSaved += savedBytes;
  }

  console.log(`\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Total: ${totalProcessed} images compressed`);
  console.log(`💾 Total saved: ${(totalSaved / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`\\n⚠️  Remember to update DB references from .png/.jpg to .webp`);
  console.log(`⚠️  After verifying, you can delete the original PNGs to reclaim space.`);
}

main().catch(console.error);
