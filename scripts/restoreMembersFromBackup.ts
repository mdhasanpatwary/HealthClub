import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";
import { Client } from "pg";

interface BackupMember {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  password?: string;
  tier?: string;
  status?: string;
  joinedDate?: string | Date;
  expiryDate?: string | Date;
  qrCodeUrl?: string | null;
  totalSaved?: number;
  address?: string | null;
  birthDate?: string | Date | null;
  profession?: string | null;
  profilePictureUrl?: string | null;
  emailVerified?: boolean;
  verificationCode?: string | null;
  verificationCodeCreatedAt?: string | Date | null;
  createdAt?: string | Date;
  bkashSender?: string | null;
  bkashTxnId?: string | null;
  referenceCode?: string | null;
  discountAmount?: number;
  renewalStatus?: string | null;
  renewalBkashSender?: string | null;
  renewalBkashTxnId?: string | null;
}

async function restoreToDatabase(connectionString: string, dbName: string) {
  console.log(`\n======================================================`);
  console.log(`Restoring members to: ${dbName}`);
  console.log(`======================================================`);

  const backupPath = path.join(os.homedir(), "Downloads", "healthclub-db-backup-2026-08-24T18-11-13.json");
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup file not found at: ${backupPath}`);
    return 0;
  }

  const raw = fs.readFileSync(backupPath, "utf-8");
  const json = JSON.parse(raw);
  const backupMembers: BackupMember[] = json.data?.members || [];

  console.log(`📦 Loaded ${backupMembers.length} members from backup file.`);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    // 1. Fetch existing storage objects to link high-performance CDN URLs (if storage schema exists)
    const storageFiles = new Set<string>();
    try {
      const storageRes = await client.query(
        "SELECT name FROM storage.objects WHERE bucket_id = 'healthclub-public' AND name LIKE 'members/%';"
      );
      storageRes.rows.forEach((r: { name: string }) => storageFiles.add(r.name));
    } catch {
      // storage schema might not exist in local PostgreSQL
    }

    let restoredCount = 0;

    for (const m of backupMembers) {
      // Find matching CDN image if available
      let cdnProfilePic = m.profilePictureUrl;
      const matchedStorage = Array.from(storageFiles).find((f) => f.startsWith(`members/${m.id}`));
      if (matchedStorage) {
        cdnProfilePic = `https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/${matchedStorage}`;
      }

      const joinedDate = m.joinedDate ? new Date(m.joinedDate) : new Date();
      const expiryDate = m.expiryDate ? new Date(m.expiryDate) : new Date(Date.now() + 365 * 24 * 3600 * 1000);
      const birthDate = m.birthDate ? new Date(m.birthDate) : null;
      const createdAt = m.createdAt ? new Date(m.createdAt) : new Date();
      const verificationCodeCreatedAt = m.verificationCodeCreatedAt ? new Date(m.verificationCodeCreatedAt) : null;

      const query = `
        INSERT INTO members (
          id, name, phone, email, password, tier, status,
          joined_date, expiry_date, qr_code_url, total_saved,
          address, birth_date, profession, profile_picture_url,
          email_verified, verification_code, verification_code_created_at,
          created_at, bkash_sender, bkash_txn_id, reference_code,
          discount_amount, renewal_status, renewal_bkash_sender, renewal_bkash_txn_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18,
          $19, $20, $21, $22,
          $23, $24, $25, $26
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          tier = EXCLUDED.tier,
          status = EXCLUDED.status,
          joined_date = EXCLUDED.joined_date,
          expiry_date = EXCLUDED.expiry_date,
          qr_code_url = EXCLUDED.qr_code_url,
          total_saved = EXCLUDED.total_saved,
          address = EXCLUDED.address,
          birth_date = EXCLUDED.birth_date,
          profession = EXCLUDED.profession,
          profile_picture_url = EXCLUDED.profile_picture_url,
          email_verified = EXCLUDED.email_verified,
          reference_code = EXCLUDED.reference_code,
          discount_amount = EXCLUDED.discount_amount;
      `;

      const values = [
        m.id,
        m.name,
        m.phone,
        m.email || null,
        m.password || "salt:hash",
        m.tier || "premium",
        m.status || "active",
        joinedDate,
        expiryDate,
        m.qrCodeUrl || null,
        m.totalSaved || 0,
        m.address || null,
        birthDate,
        m.profession || null,
        cdnProfilePic || null,
        m.emailVerified ?? true,
        m.verificationCode || null,
        verificationCodeCreatedAt,
        createdAt,
        m.bkashSender || null,
        m.bkashTxnId || null,
        m.referenceCode || null,
        m.discountAmount || 0,
        m.renewalStatus || "none",
        m.renewalBkashSender || null,
        m.renewalBkashTxnId || null,
      ];

      await client.query(query, values);
      restoredCount++;
      console.log(`✅ [${restoredCount}/${backupMembers.length}] Restored member: ${m.id} - ${m.name} (${m.phone})`);
    }

    const countRes = await client.query("SELECT COUNT(*) FROM members;");
    console.log(`\n🎉 Restoration complete! Total members now in ${dbName}: ${countRes.rows[0].count}`);
    return restoredCount;
  } finally {
    await client.end();
  }
}

async function main() {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  const localConfig = fs.existsSync(".env.local") ? dotenv.parse(fs.readFileSync(".env.local")) : {};

  // 1. Restore to Supabase (Production)
  if (envConfig.DATABASE_URL) {
    await restoreToDatabase(envConfig.DATABASE_URL, "Supabase (Production)");
  }

  // 2. Restore to Local Database
  if (localConfig.DATABASE_URL) {
    await restoreToDatabase(localConfig.DATABASE_URL, "Local PostgreSQL");
  }
}

main().catch((err) => {
  console.error("Restoration failed with error:", err);
  process.exit(1);
});
