import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { scryptSync, randomBytes } from "crypto";

import { initialPartners } from "../src/data/initialPartnersData";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");
  const hashedPw = hashPassword("123456");

  // Delete existing data to prevent duplicate keys
  await prisma.transaction.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.member.deleteMany();
  await prisma.partnerRequest.deleteMany();

  // 1. Seed Verified 12 Partners
  for (const p of initialPartners) {
    await prisma.partner.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        address: p.address,
        discount: p.discount,
        phone: p.phone,
        email: p.email || `${p.slug}@healthclub.com`,
        password: hashedPw,
        logoText: p.logoText,
        imageUrl: p.imageUrl,
        upazila: p.upazila,
        isPartner: p.isPartner,
      },
    });
  }

  // 2. Seed Members
  const m1 = await prisma.member.create({
    data: {
      id: "HC-1001",
      name: "মোঃ আব্দুর রহমান",
      phone: "01711112222",
      email: "arahman@gmail.com",
      password: hashedPw,
      tier: "founding",
      status: "active",
      joinedDate: new Date("2026-01-10"),
      expiryDate: new Date("2027-01-10"),
      totalSaved: 2000,
      emailVerified: true,
    },
  });

  const m2 = await prisma.member.create({
    data: {
      id: "HC-1002",
      name: "নুসরাত জাহান",
      phone: "01811112222",
      email: "nusrat@gmail.com",
      password: hashedPw,
      tier: "premium",
      status: "active",
      joinedDate: new Date("2026-03-15"),
      expiryDate: new Date("2027-03-15"),
      totalSaved: 300,
      emailVerified: true,
    },
  });

  // 3. Seed Transactions
  await prisma.transaction.create({
    data: {
      id: "tx1",
      memberId: m1.id,
      memberName: m1.name,
      partnerId: "p_55db306d-13e5-42b6-a4fa-8c0d7e3c6a92",
      partnerName: "লাইফ কেয়ার ডায়াগনস্টিক সেন্টার",
      amount: 5000,
      saved: 500,
      date: new Date("2026-06-12T10:30:00+06:00"),
    },
  });

  await prisma.transaction.create({
    data: {
      id: "tx2",
      memberId: m2.id,
      memberName: m2.name,
      partnerId: "p_d6c41b8a-e9fa-47cb-bfa2-0d1279efb925",
      partnerName: "প্যাসিফিক হেলথ কেয়ার সেন্টার",
      amount: 3000,
      saved: 300,
      date: new Date("2026-07-02T13:20:00+06:00"),
    },
  });

  await prisma.transaction.create({
    data: {
      id: "tx3",
      memberId: m1.id,
      memberName: m1.name,
      partnerId: "p_c361405e-fbb8-4fcb-8761-a5d625902047",
      partnerName: "আল-আকসা হাসপাতাল লিঃ ফেনী",
      amount: 15000,
      saved: 1500,
      date: new Date("2026-07-10T11:45:00+06:00"),
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
