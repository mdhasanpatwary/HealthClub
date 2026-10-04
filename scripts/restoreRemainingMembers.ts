import fs from "fs";
import dotenv from "dotenv";
import { Client } from "pg";
import { scryptSync, randomBytes } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const defaultHashedPassword = hashPassword("123456");

interface MemberToRestore {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: "free" | "premium" | "founding";
  status: "active" | "inactive";
  joinedDate: string;
  expiryDate: string;
  profilePictureUrl?: string | null;
  createdAt: string;
}

const membersToRestore: MemberToRestore[] = [
  {
    id: "HC-2026-F84F74F6",
    name: "Md. Jabed Hossain",
    email: "helloshahedsocial@gmail.com",
    phone: "01800000001",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-25",
    expiryDate: "2027-08-25",
    createdAt: "2026-08-25T11:38:30.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-F84F74F6_1789052566365_zzwpvs.jpg",
  },
  {
    id: "HC-2026-4061A747",
    name: "Abdur Rahman",
    email: "mdrahman8163240@gmail.com",
    phone: "01800000002",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-25",
    expiryDate: "2027-08-25",
    createdAt: "2026-08-25T15:00:44.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-284B9406",
    name: "Najim uddin",
    email: "cpsstudent47@gmail.com",
    phone: "01800000003",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-26",
    expiryDate: "2027-08-26",
    createdAt: "2026-08-26T02:54:48.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-284B9406_1789052568672_7toodq.jpg",
  },
  {
    id: "HC-2026-5E6D9879",
    name: "মোঃ মোকছুদ উল্লাহ",
    email: "moksudullahf@gmail.com",
    phone: "01800000004",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-26",
    expiryDate: "2027-08-26",
    createdAt: "2026-08-26T03:57:18.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-5E6D9879_1789052567338_72fa48.jpg",
  },
  {
    id: "HC-2026-B11A8E47",
    name: "Iftekhar Alam Opu",
    email: "iftekharalamopu490@gmail.com",
    phone: "01800000005",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-26",
    expiryDate: "2027-08-26",
    createdAt: "2026-08-26T13:25:07.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-B11A8E47_1789052567561_zghphf.jpg",
  },
  {
    id: "HC-2026-2B8D9352",
    name: "MD. Mehedi Hasan",
    email: "mdmehedi312132@gmail.com",
    phone: "01800000006",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-30",
    expiryDate: "2027-08-30",
    createdAt: "2026-08-30T01:16:03.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-2B8D9352_1789052562583_icwzza.jpg",
  },
  {
    id: "HC-2026-1A3C5CDD",
    name: "Ariful Islam",
    email: "arifnpharmicy2025@gmail.com",
    phone: "01800000007",
    tier: "founding",
    status: "active",
    joinedDate: "2026-08-30",
    expiryDate: "2027-08-30",
    createdAt: "2026-08-30T05:24:24.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-1A3C5CDD_1789052567106_t1ctce.jpg",
  },
  {
    id: "HC-2026-8997462A",
    name: "Jahangir Alam",
    email: "ronirony435@gmail.com",
    phone: "01800000008",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-01",
    expiryDate: "2027-09-01",
    createdAt: "2026-09-01T13:47:12.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-8997462A_1789052563225_63m5df.jpg",
  },
  {
    id: "HC-2026-BE35A399",
    name: "আবু মুছা পাটোয়ারি",
    email: "mdkamrul132363@gmail.com",
    phone: "01800000009",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-01",
    expiryDate: "2027-09-01",
    createdAt: "2026-09-01T14:03:29.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-BE35A399_1789052566900_x3nztn.jpg",
  },
  {
    id: "HC-2026-F5B17457",
    name: "MD KAMRUL ISLAM RATUL",
    email: "ratulpatwary95@gmail.com",
    phone: "01800000010",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-01",
    expiryDate: "2027-09-01",
    createdAt: "2026-09-01T14:16:16.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-F5B17457_1789052567794_lnti5e.jpg",
  },
  {
    id: "HC-2026-0F24C3BF",
    name: "Mir Atikul Islam",
    email: "mmiratikulislam@gmail.com",
    phone: "01800000011",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-02",
    expiryDate: "2027-09-02",
    createdAt: "2026-09-02T09:58:33.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-0F24C3BF_1789052568005_iy1xr3.jpg",
  },
  {
    id: "HC-2026-4CF1EA5C",
    name: "একরামুর নাছের",
    email: "munim8778@gmail.com",
    phone: "01800000012",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-04",
    expiryDate: "2027-09-04",
    createdAt: "2026-09-04T08:16:26.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-D2FF2861",
    name: "Nurul Alam",
    email: "nalam7153@gmail.com",
    phone: "01800000013",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-04",
    expiryDate: "2027-09-04",
    createdAt: "2026-09-04T08:53:46.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-D2FF2861_1789052563788_awgw66.jpg",
  },
  {
    id: "HC-2026-1A99A2A6",
    name: "মোঃ বশিরুল ইসলাম চৌধুী",
    email: "mdbashirulislam359@gmail.com",
    phone: "01800000014",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-04",
    expiryDate: "2027-09-04",
    createdAt: "2026-09-04T09:42:30.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/HC-2026-1A99A2A6_1789052564380_kv4h9m.jpg",
  },
  {
    id: "HC-2026-7C3E14B9",
    name: "Wahidul Islam",
    email: "wahidislam68@gmail.com",
    phone: "01800000015",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-05",
    expiryDate: "2027-09-05",
    createdAt: "2026-09-05T00:19:33.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-6E21F8A4",
    name: "Md jobayer",
    email: "ronyfeni80@gmail.com",
    phone: "01800000016",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-06",
    expiryDate: "2027-09-06",
    createdAt: "2026-09-06T14:17:14.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-9C4B218F",
    name: "কোরবান আলী",
    email: "korbanaliemon49@gmail.com",
    phone: "01800000017",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-07",
    expiryDate: "2027-09-07",
    createdAt: "2026-09-07T04:32:27.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-3A1B90FE",
    name: "আরজিনা আক্তার",
    email: "arjinaarif8@gmail.com",
    phone: "01800000018",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-07",
    expiryDate: "2027-09-07",
    createdAt: "2026-09-07T15:34:47.000Z",
    profilePictureUrl: null,
  },
  {
    id: "HC-2026-16F1079E",
    name: "Mostafizur Rahman",
    email: "mostafiztarek@gmail.com",
    phone: "01800000019",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-11",
    expiryDate: "2027-09-11",
    createdAt: "2026-09-11T09:44:47.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1789119761032_jq0cui.jpg",
  },
  {
    id: "HC-2026-8D29F5C1",
    name: "Ali hasan mehedi",
    email: "ahmehedi73@gmail.com",
    phone: "01800000020",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-21",
    expiryDate: "2027-09-21",
    createdAt: "2026-09-21T02:54:44.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1789959201581_tiomr2.jpg",
  },
  {
    id: "HC-2026-4B8C13EF",
    name: "JAHIRA AHAMMAD",
    email: "jahirahmedfenibd1@yahoo.com",
    phone: "01800000021",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-22",
    expiryDate: "2027-09-22",
    createdAt: "2026-09-22T09:12:48.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790068351005_ukluwo.jpg",
  },
  {
    id: "HC-2026-62A1F8D9",
    name: "Emam Hossain Mazumder",
    email: "emam65270@gmail.com",
    phone: "01800000022",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-25",
    expiryDate: "2027-09-25",
    createdAt: "2026-09-25T02:56:18.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790304971380_492mb3.jpg",
  },
  {
    id: "HC-2026-61DD3C86",
    name: "হাজেরা আক্তার লাখি",
    email: "srthaizone@gmail.com",
    phone: "01800000023",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-27",
    expiryDate: "2027-09-27",
    createdAt: "2026-09-27T21:06:00.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790543155548_7uahpk.jpg",
  },
  {
    id: "HC-2026-BDF2A832",
    name: "Abdullah Al Noman",
    email: "nusratnoman324@gmail.com",
    phone: "01800000024",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-28",
    expiryDate: "2027-09-28",
    createdAt: "2026-09-28T08:02:21.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790582472685_53ayt4.jpg",
  },
  {
    id: "HC-2026-52D22AD9",
    name: "শাহানা আক্তার",
    email: "jiikbaljafor1999@gmail.com",
    phone: "01800000025",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-30",
    expiryDate: "2027-09-30",
    createdAt: "2026-09-30T01:06:38.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790730390208_dzrlx8.jpg",
  },
  {
    id: "HC-2026-8000CFE3",
    name: "Mir Akram Hossen",
    email: "mirveterinarypharmacy@gmail.com",
    phone: "01800000026",
    tier: "founding",
    status: "active",
    joinedDate: "2026-09-30",
    expiryDate: "2027-09-30",
    createdAt: "2026-09-30T12:08:00.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790770000045_ljpvjm.jpg",
  },
  {
    id: "HC-2026-7D39FA12",
    name: "এনামুল হক",
    email: "emperorhoque@gmail.com",
    phone: "01800000027",
    tier: "founding",
    status: "active",
    joinedDate: "2026-10-01",
    expiryDate: "2027-10-01",
    createdAt: "2026-10-01T20:05:33.000Z",
    profilePictureUrl: "https://uqtodphwiwzikmhsyiyc.supabase.co/storage/v1/object/public/healthclub-public/members/upload_1790885127716_u2e2yk.jpg",
  },
];

async function restoreListToDb(connectionString: string, dbName: string) {
  console.log(`\n======================================================`);
  console.log(`Restoring ${membersToRestore.length} additional members to: ${dbName}`);
  console.log(`======================================================`);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    let count = 0;
    for (const m of membersToRestore) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://www.healthclubfeni.com/verify/${m.id}`)}`;

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
          email = EXCLUDED.email,
          profile_picture_url = COALESCE(EXCLUDED.profile_picture_url, members.profile_picture_url),
          email_verified = true,
          status = 'active';
      `;

      const values = [
        m.id,
        m.name,
        m.phone,
        m.email,
        defaultHashedPassword,
        m.tier,
        m.status,
        new Date(m.joinedDate),
        new Date(m.expiryDate),
        qrCodeUrl,
        0,
        null,
        null,
        null,
        m.profilePictureUrl || null,
        true,
        null,
        null,
        new Date(m.createdAt),
        null,
        null,
        null,
        0,
        "none",
        null,
        null,
      ];

      await client.query(query, values);
      count++;
      console.log(`✅ [${count}/${membersToRestore.length}] Restored: [${m.id}] ${m.name} (${m.email})`);
    }

    const totalRes = await client.query("SELECT COUNT(*) FROM members;");
    console.log(`\n🎉 Restoration completed successfully!`);
    console.log(`👉 Total members now in ${dbName}: ${totalRes.rows[0].count}`);
  } finally {
    await client.end();
  }
}

async function main() {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  const localConfig = fs.existsSync(".env.local") ? dotenv.parse(fs.readFileSync(".env.local")) : {};

  // 1. Supabase Production
  if (envConfig.DATABASE_URL) {
    await restoreListToDb(envConfig.DATABASE_URL, "Supabase (Production)");
  }

  // 2. Local Database
  if (localConfig.DATABASE_URL) {
    await restoreListToDb(localConfig.DATABASE_URL, "Local PostgreSQL");
  }
}

main().catch((err) => {
  console.error("Restoration error:", err);
  process.exit(1);
});
