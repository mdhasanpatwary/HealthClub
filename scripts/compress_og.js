/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateAndCompressOgImage() {
  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'src', 'app');
  const logoPath = path.join(publicDir, 'logo', 'v_logo_transparent.png');

  if (!fs.existsSync(logoPath)) {
    console.error('❌ Logo source not found at:', logoPath);
    process.exit(1);
  }

  // Trim transparent margins and resize to fit within standard 1200x630 canvas
  const trimmedLogoBuffer = await sharp(logoPath)
    .trim()
    .resize({ height: 510, fit: 'inside' })
    .toBuffer();

  const metadata = await sharp(trimmedLogoBuffer).metadata();
  const left = Math.round((1200 - (metadata.width || 0)) / 2);
  const top = Math.round((630 - (metadata.height || 0)) / 2);

  // Compose onto clean 1200x630 canvas
  const canvasBuffer = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: trimmedLogoBuffer,
        top: top,
        left: left,
      },
    ])
    .png()
    .toBuffer();

  const outputPng = path.join(publicDir, 'og-image.png');
  const outputJpg = path.join(publicDir, 'og-image.jpg');
  const outputWebp = path.join(publicDir, 'og-image.webp');
  const appOgPng = path.join(appDir, 'opengraph-image.png');
  const appTwitterPng = path.join(appDir, 'twitter-image.png');

  // 1. High-fidelity JPEG (target ~45-75 KB)
  await sharp(canvasBuffer)
    .jpeg({
      quality: 90,
      mozjpeg: true,
    })
    .toFile(outputJpg);
  console.log(`✅ Generated og-image.jpg: ${(fs.statSync(outputJpg).size / 1024).toFixed(2)} KB`);

  // 2. WebP format
  await sharp(canvasBuffer)
    .webp({
      quality: 90,
      effort: 6,
    })
    .toFile(outputWebp);
  console.log(`✅ Generated og-image.webp: ${(fs.statSync(outputWebp).size / 1024).toFixed(2)} KB`);

  // 3. PNG format for public and Next.js app metadata
  await sharp(canvasBuffer)
    .png({
      quality: 90,
      compressionLevel: 9,
      effort: 10,
    })
    .toFile(outputPng);
  console.log(`✅ Generated public/og-image.png: ${(fs.statSync(outputPng).size / 1024).toFixed(2)} KB`);

  fs.copyFileSync(outputPng, appOgPng);
  fs.copyFileSync(outputPng, appTwitterPng);
  console.log(`✅ Copied to src/app/opengraph-image.png & src/app/twitter-image.png`);
}

generateAndCompressOgImage().catch((err) => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});

