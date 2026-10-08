import dotenv from "dotenv";
import { Client } from "pg";

// Support both .env and .env.local
const isLocal = process.argv.includes("--local");
const isDryRun = process.argv.includes("--dry-run");

const envFile = isLocal ? ".env.local" : ".env";
const env = dotenv.config({ path: envFile }).parsed || {};
const url = env.DIRECT_URL || env.DATABASE_URL;

if (!url) {
  console.error(`❌ Could not find database connection string in ${envFile}`);
  process.exit(1);
}

console.log("=================================================================");
console.log(`🏥 HEALTH CLUB: RESTORE PARTNER-DOCTOR ASSOCIATIONS`);
console.log(`Target Environment: ${isLocal ? "LOCAL (Postgres)" : "REMOTE (Supabase)"}`);
console.log(`Mode:               ${isDryRun ? "DRY-RUN (Simulated, no writes)" : "APPLY (Writing changes to DB)"}`);
console.log("=================================================================\n");

interface DoctorRow {
  id: string;
  name: string;
  chamber_name: string | null;
  chamber_address: string | null;
  serial_phone: string | null;
  partner_id: string | null;
}

interface PartnerMapping {
  partnerId: string;
  name: string;
  slug: string;
  match: (d: DoctorRow) => boolean;
}

const PARTNER_MAPPINGS: PartnerMapping[] = [
  {
    partnerId: "p_6e4ee249-31f1-49f3-8ba5-c23191adcf06",
    name: "আল-আকসা হাসপাতাল লিঃ ফেনী",
    slug: "al-aqsa-hospital-feni",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("আল-আকসা") || ch.includes("আল আকসা") || ch.includes("Al-Aqsa") || (phone === "01815076266" && ch !== "");
    },
  },
  {
    partnerId: "p_d2907a36-d893-437a-80dc-ebf29db5e541",
    name: "ফেনী কেয়ার হসপিটাল",
    slug: "feni-care-hospital",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("ফেনী কেয়ার") || ch.includes("ফেনী কেয়ার") || ch.includes("Feni Care") || (phone === "01806968140" && ch !== "");
    },
  },
  {
    partnerId: "p_55db306d-13e5-42b6-a4fa-8c0d7e3c6a92",
    name: "লাইফ কেয়ার ডায়াগনস্টিক সেন্টার",
    slug: "life-care-diagnostic-center",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("লাইফ কেয়ার") || ch.includes("Life Care") || (phone === "01752431244" && ch !== "") || (phone === "01882462650" && ch !== "");
    },
  },
  {
    partnerId: "p_b6383465-388d-4c4a-b806-eff03b6d7c51",
    name: "নিরাময় ডায়াগনস্টিক এন্ড কনসালটেশন সেন্টার",
    slug: "niramoy-diagnostic-consultation-center",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("নিরাময় ডায়াগনস্টিক") || ch.includes("নিরাময় মেডিকেল") || (phone === "01815583960" && ch !== "");
    },
  },
  {
    partnerId: "p_1d77f4cf-d357-4e4e-a707-591ccd2dc3fd",
    name: "ফেনি ম্যাক্স ডায়াগনস্টিক সেন্টার",
    slug: "feni-max-diagnostic-centre",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("ফেনী ম্যাক্স") || ch.includes("Feni Max") || (phone === "01816660616" && ch !== "");
    },
  },
  {
    partnerId: "p_b4113be9-bae1-4022-ba03-6e3b3c2599f8",
    name: "প্যাসিফিক হেলথ কেয়ার সেন্টার",
    slug: "pacific-health-care-centre",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("Pacific Health Care") || ch.includes("প্যাসিফিক হেলথ") || ch.includes("প্যাসিপিক ডায়াগনস্টিক") || (phone === "01711365956" && ch !== "");
    },
  },
  {
    partnerId: "p_9abc5886-459d-43a7-8d26-52d51ac9589c",
    name: "মজুমদার ডেন্টাল ক্লিনিক",
    slug: "mazumder-dental-clinic",
    match: (d) => {
      const ch = (d.chamber_name || "").trim();
      const phone = (d.serial_phone || "").replace(/[^0-9]/g, "");
      return ch.includes("মজুমদার ডেন্টাল") || ch.includes("Mojumder Dental") || (phone === "01912887888" && ch !== "");
    },
  },
];

async function main() {
  const client = new Client({
    connectionString: url,
    ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
  });

  await client.connect();

  const { rows: partnersInDb } = await client.query("SELECT id, name FROM partners");
  const partnerDbIds = new Set(partnersInDb.map((p) => p.id));

  const { rows: doctors } = await client.query(`
    SELECT id, name, chamber_name, chamber_address, serial_phone, partner_id
    FROM doctors
  `);

  let totalUpdated = 0;

  for (const mapping of PARTNER_MAPPINGS) {
    if (!partnerDbIds.has(mapping.partnerId)) {
      console.warn(`⚠️ Warning: Partner [${mapping.partnerId}] ${mapping.name} not found in database! Skipping.`);
      continue;
    }

    const matchedDocs = doctors.filter(mapping.match);
    console.log(`\n📌 Partner: ${mapping.name} (${mapping.partnerId})`);
    console.log(`   Found ${matchedDocs.length} matching doctors:`);

    for (const doc of matchedDocs) {
      console.log(`   - [${doc.id}] ${doc.name} (Chamber: "${doc.chamber_name}")`);

      if (!isDryRun) {
        await client.query(
          `UPDATE doctors SET partner_id = $1 WHERE id = $2`,
          [mapping.partnerId, doc.id]
        );
      }
      totalUpdated++;
    }
  }

  console.log("\n-----------------------------------------------------------------");
  if (isDryRun) {
    console.log(`🔍 DRY-RUN COMPLETED: ${totalUpdated} doctors would be re-linked to their partners.`);
    console.log(`To apply changes, run without --dry-run`);
  } else {
    console.log(`✅ RESTORATION SUCCESSFUL: ${totalUpdated} doctors re-linked to their partners.`);
  }
  console.log("-----------------------------------------------------------------");

  await client.end();
}

main().catch((err) => {
  console.error("❌ Error restoring partner doctors:", err);
  process.exit(1);
});
