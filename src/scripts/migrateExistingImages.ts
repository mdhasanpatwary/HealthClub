import { Client } from "pg";
import { uploadBase64Image, isStorageConfigured } from "../services/storageService";

/**
 * Migration Script: Migrate Existing Base64 Images from PostgreSQL to Supabase Storage CDN
 *
 * Usage:
 *   node --env-file=.env.local --env-file=.env -r ts-node/register src/scripts/migrateExistingImages.ts
 *   or run via npm script: yarn tsx src/scripts/migrateExistingImages.ts
 */
async function main() {
  console.log("=================================================");
  console.log("  Health Club Base64 Image to Supabase Storage   ");
  console.log("=================================================\n");

  if (!isStorageConfigured()) {
    console.error("❌ Supabase Storage is not configured in your environment!");
    console.error("Please add the following to your .env.local or .env file:");
    console.error('  NEXT_PUBLIC_SUPABASE_URL="https://uqtodphwiwzikmhsyiyc.supabase.co"');
    console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-supabase-anon-key>"');
    console.error('  or SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"\n');
    process.exit(1);
  }

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DIRECT_URL or DATABASE_URL is missing!");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log(" Connected to PostgreSQL database.\n");

  let totalBytesSaved = 0;
  let migratedMembersCount = 0;
  let migratedPartnersCount = 0;
  let migratedDoctorsCount = 0;

  try {
    // 1. Members Migration
    console.log("Scanning members with base64 profile pictures...");
    const membersRes = await client.query(
      "SELECT id, profile_picture_url FROM members WHERE profile_picture_url LIKE 'data:%';"
    );
    console.log(`Found ${membersRes.rows.length} member(s) with base64 images.\n`);

    for (const row of membersRes.rows) {
      const { id, profile_picture_url } = row;
      const base64Bytes = Buffer.byteLength(profile_picture_url, "utf8");

      console.log(`Uploading avatar for member ${id} (${Math.round(base64Bytes / 1024)} KB)...`);
      const uploadRes = await uploadBase64Image(profile_picture_url, "members", id);

      if (uploadRes.success && uploadRes.url) {
        await client.query(
          "UPDATE members SET profile_picture_url = $1 WHERE id = $2;",
          [uploadRes.url, id]
        );
        totalBytesSaved += base64Bytes - Buffer.byteLength(uploadRes.url, "utf8");
        migratedMembersCount++;
        console.log(`  ✅ Migrated -> ${uploadRes.url}`);
      } else {
        console.error(`  ❌ Failed to upload member ${id}: ${uploadRes.error}`);
      }
    }

    // 2. Partners Migration
    console.log("\nScanning partners with base64 logos/images...");
    const partnersRes = await client.query(
      "SELECT id, image_url FROM partners WHERE image_url LIKE 'data:%';"
    );
    console.log(`Found ${partnersRes.rows.length} partner(s) with base64 images.\n`);

    for (const row of partnersRes.rows) {
      const { id, image_url } = row;
      const base64Bytes = Buffer.byteLength(image_url, "utf8");

      console.log(`Uploading image for partner ${id} (${Math.round(base64Bytes / 1024)} KB)...`);
      const uploadRes = await uploadBase64Image(image_url, "partners", id);

      if (uploadRes.success && uploadRes.url) {
        await client.query(
          "UPDATE partners SET image_url = $1 WHERE id = $2;",
          [uploadRes.url, id]
        );
        totalBytesSaved += base64Bytes - Buffer.byteLength(uploadRes.url, "utf8");
        migratedPartnersCount++;
        console.log(`  ✅ Migrated -> ${uploadRes.url}`);
      } else {
        console.error(`  ❌ Failed to upload partner ${id}: ${uploadRes.error}`);
      }
    }

    // 3. Doctors Migration
    console.log("\nScanning doctors with base64 photos...");
    const doctorsRes = await client.query(
      "SELECT id, image_url FROM doctors WHERE image_url LIKE 'data:%';"
    );
    console.log(`Found ${doctorsRes.rows.length} doctor(s) with base64 images.\n`);

    for (const row of doctorsRes.rows) {
      const { id, image_url } = row;
      const base64Bytes = Buffer.byteLength(image_url, "utf8");

      console.log(`Uploading photo for doctor ${id} (${Math.round(base64Bytes / 1024)} KB)...`);
      const uploadRes = await uploadBase64Image(image_url, "doctors", id);

      if (uploadRes.success && uploadRes.url) {
        await client.query(
          "UPDATE doctors SET image_url = $1 WHERE id = $2;",
          [uploadRes.url, id]
        );
        totalBytesSaved += base64Bytes - Buffer.byteLength(uploadRes.url, "utf8");
        migratedDoctorsCount++;
        console.log(`  ✅ Migrated -> ${uploadRes.url}`);
      } else {
        console.error(`  ❌ Failed to upload doctor ${id}: ${uploadRes.error}`);
      }
    }

    console.log("\n=================================================");
    console.log("              Migration Summary                  ");
    console.log("=================================================");
    console.log(`  Migrated Members: ${migratedMembersCount}`);
    console.log(`  Migrated Partners: ${migratedPartnersCount}`);
    console.log(`  Migrated Doctors:  ${migratedDoctorsCount}`);
    console.log(`  Total Database Egress / Space Saved: ~${Math.round(totalBytesSaved / 1024)} KB (${(totalBytesSaved / (1024 * 1024)).toFixed(2)} MB)`);
    console.log("=================================================\n");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
