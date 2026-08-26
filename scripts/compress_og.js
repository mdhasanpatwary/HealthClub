/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function compressOgImage() {
  const publicDir = path.join(__dirname, '..', 'public');
  const inputPng = path.join(publicDir, 'og-image.png');
  const tempPng = path.join(publicDir, 'og-image-temp.png');
  const outputJpg = path.join(publicDir, 'og-image.jpg');
  const outputWebp = path.join(publicDir, 'og-image.webp');

  if (!fs.existsSync(inputPng)) {
    console.error('❌ og-image.png not found at:', inputPng);
    process.exit(1);
  }

  const initialStats = fs.statSync(inputPng);
  console.log(`Original og-image.png size: ${(initialStats.size / 1024).toFixed(2)} KB`);

  // Read full quality buffer first
  const sourceBuffer = fs.readFileSync(inputPng);

  // 1. High-fidelity JPEG (target ~75 KB)
  await sharp(sourceBuffer)
    .jpeg({
      quality: 85,
      mozjpeg: true,
    })
    .toFile(outputJpg);
  const jpgStats = fs.statSync(outputJpg);
  console.log(`✅ Generated og-image.jpg: ${(jpgStats.size / 1024).toFixed(2)} KB`);

  // 2. Ultra-compact WebP (target ~45 KB)
  await sharp(sourceBuffer)
    .webp({
      quality: 85,
      effort: 6,
    })
    .toFile(outputWebp);
  const webpStats = fs.statSync(outputWebp);
  console.log(`✅ Generated og-image.webp: ${(webpStats.size / 1024).toFixed(2)} KB`);

  // 3. Optimized PNG (under 100 KB with 128 color palette + maximum compression effort)
  await sharp(sourceBuffer)
    .png({
      quality: 80,
      compressionLevel: 9,
      effort: 10,
      palette: true,
      colours: 128,
      dither: 0.8,
    })
    .toFile(tempPng);

  fs.renameSync(tempPng, inputPng);
  const newPngStats = fs.statSync(inputPng);
  console.log(`✅ Compressed og-image.png: ${(newPngStats.size / 1024).toFixed(2)} KB`);
}

compressOgImage().catch((err) => {
  console.error('Error compressing OG images:', err);
  process.exit(1);
});
