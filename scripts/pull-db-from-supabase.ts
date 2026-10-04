import dotenv from "dotenv";
import { Client } from "pg";

// 1. Read remote config from .env
const remoteEnv = dotenv.config({ path: ".env" }).parsed || {};
// 2. Read local config from .env.local
const localEnv = dotenv.config({ path: ".env.local" }).parsed || {};

const remoteUrl =
  remoteEnv.DIRECT_URL ||
  remoteEnv.DATABASE_URL ||
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "";

const localUrl =
  localEnv.DIRECT_URL ||
  localEnv.DATABASE_URL ||
  "postgresql://patwary@localhost:5432/healthclub";

// SAFETY CHECK: Ensure localUrl is strictly localhost
const isLocal =
  localUrl.includes("localhost") ||
  localUrl.includes("127.0.0.1") ||
  localUrl.includes("::1");

if (!isLocal) {
  console.error("❌ CRITICAL SAFETY ERROR: Destination database MUST be localhost!");
  console.error("Destination URL:", localUrl.replace(/:[^:@]+@/, ":***@"));
  process.exit(1);
}

if (!remoteUrl || remoteUrl === localUrl) {
  console.error("❌ Source remote database URL not found or identical to local.");
  process.exit(1);
}

console.log("-----------------------------------------------------------------");
console.log("🔄 HEALTH CLUB DATABASE SYNC: REMOTE SUPABASE -> LOCAL POSTGRES");
console.log("-----------------------------------------------------------------");
console.log("📥 Source (Remote):     ", remoteUrl.replace(/:[^:@]+@/, ":***@"));
console.log("💻 Destination (Local): ", localUrl.replace(/:[^:@]+@/, ":***@"));
console.log("-----------------------------------------------------------------");

// Order of sync respecting foreign key dependencies
const TABLES_TO_SYNC: { name: string; pk: string }[] = [
  { name: "admin_users", pk: "id" },
  { name: "system_settings", pk: "key" },
  { name: "partners", pk: "id" },
  { name: "members", pk: "id" },
  { name: "blood_donors", pk: "id" },
  { name: "ambulance_services", pk: "id" },
  { name: "products", pk: "id" },
  { name: "blog_posts", pk: "slug" },
  { name: "doctors", pk: "id" },
  { name: "partner_staff", pk: "id" },
  { name: "partner_requests", pk: "id" },
  { name: "contact_messages", pk: "id" },
  { name: "transactions", pk: "id" },
  { name: "member_notifications", pk: "id" },
  { name: "reviews", pk: "id" },
  { name: "push_subscriptions", pk: "id" },
  { name: "pwa_installations", pk: "id" },
];

async function syncTable(
  remote: Client,
  local: Client,
  tableName: string,
  pk: string
) {
  const { rows } = await remote.query(`SELECT * FROM "${tableName}"`);
  if (!rows || rows.length === 0) {
    return { count: 0, updated: 0 };
  }

  const BATCH_SIZE = 50;
  let synced = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    for (const row of batch) {
      const cols = Object.keys(row);
      const colNames = cols.map((c) => `"${c}"`).join(", ");
      const placeholders = cols.map((_, idx) => `$${idx + 1}`).join(", ");
      const updateClauses = cols
        .filter((c) => c !== pk)
        .map((c) => `"${c}" = EXCLUDED."${c}"`)
        .join(", ");

      const values = cols.map((c) => {
        const val = row[c];
        if (val !== null && typeof val === "object" && !(val instanceof Date)) {
          return JSON.stringify(val);
        }
        return val;
      });

      const sql = updateClauses.length > 0
        ? `INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders}) ON CONFLICT ("${pk}") DO UPDATE SET ${updateClauses}`
        : `INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders}) ON CONFLICT ("${pk}") DO NOTHING`;

      await local.query(sql, values);
      synced++;
    }
  }

  return { count: rows.length, synced };
}

async function main() {
  const remote = new Client({
    connectionString: remoteUrl,
    ssl: { rejectUnauthorized: false },
  });

  const local = new Client({
    connectionString: localUrl,
  });

  try {
    await remote.connect();
    console.log("✅ Connected to Remote Supabase DB (READ-ONLY mode)");
    await local.connect();
    console.log("✅ Connected to Local Postgres DB\n");

    console.log("Syncing tables...");
    for (const { name, pk } of TABLES_TO_SYNC) {
      process.stdout.write(`  ⏳ Syncing ${name.padEnd(24)} `);
      try {
        const { count, synced } = await syncTable(remote, local, name, pk);
        console.log(`-> ${synced}/${count} rows synced`);
      } catch (err: unknown) {
        console.log(`❌ ERROR: ${(err as Error).message}`);
      }
    }

    console.log("\n-----------------------------------------------------------------");
    console.log("📊 Verification - Row counts after sync:");
    console.log("-----------------------------------------------------------------");
    console.log("Table".padEnd(25) + "Local".padEnd(10) + "Remote");
    console.log("-".repeat(45));

    for (const { name } of TABLES_TO_SYNC) {
      let lCount = "-";
      let rCount = "-";
      try {
        const rRes = await remote.query(`SELECT count(*) FROM "${name}"`);
        rCount = rRes.rows[0].count;
      } catch {}
      try {
        const lRes = await local.query(`SELECT count(*) FROM "${name}"`);
        lCount = lRes.rows[0].count;
      } catch {}
      console.log(name.padEnd(25) + String(lCount).padEnd(10) + String(rCount));
    }
    console.log("-----------------------------------------------------------------");
    console.log("🎉 Database sync completed successfully!");
  } catch (error) {
    console.error("Sync failed:", error);
    process.exit(1);
  } finally {
    await remote.end().catch(() => {});
    await local.end().catch(() => {});
  }
}

main();
