import { prisma } from "../src/lib/prisma";
import { scryptSync, randomBytes } from "crypto";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // Delete existing data to prevent duplicate keys
  await prisma.transaction.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.member.deleteMany();
  await prisma.partnerRequest.deleteMany();

  // 1. Seed Partners
  const p1 = await prisma.partner.create({
    data: {
      id: "p1",
      name: "পপুলার ডায়াগনস্টিক সেন্টার",
      category: "diagnostic",
      address: "এসএসকে রোড, ফেনী",
      discount: "১০% ফ্ল্যাট ডিসকাউন্ট",
      phone: "০৯৬১৩৭৮৭৮০১",
      logoText: "Popular"
    }
  });

  const p2 = await prisma.partner.create({
    data: {
      id: "p2",
      name: "ল্যাবএইড স্পেশালাইজড হাসপাতাল",
      category: "hospital",
      address: "মিজান রোড, ফেনী",
      discount: "১০% ফ্ল্যাট ডিসকাউন্ট",
      phone: "১০৬০৬",
      logoText: "Labaid"
    }
  });

  const p3 = await prisma.partner.create({
    data: {
      id: "p3",
      name: "লাজ ফার্মা লিমিটেড",
      category: "pharmacy",
      address: "ট্রাঙ্ক রোড, ফেনী",
      discount: "১০% ফ্ল্যাট ডিসকাউন্ট",
      phone: "০২-৯৩৪৩৫১৬",
      logoText: "Lazz"
    }
  });

  await prisma.partner.create({
    data: {
      id: "p5",
      name: "ইবনে সিনা ডায়াগনস্টিক সেন্টার",
      category: "diagnostic",
      address: "মহিপাল, ফেনী",
      discount: "১০% ফ্ল্যাট ডিসকাউন্ট",
      phone: "০৯৬১০০০৯৬১০",
      logoText: "Ibn Sina"
    }
  });

  await prisma.partner.create({
    data: {
      id: "p6",
      name: "স্কয়ার হাসপাতাল (সিলেক্টেড সুবিধা)",
      category: "hospital",
      address: "গ্র্যান্ড ট্রাঙ্ক রোড, ফেনী",
      discount: "১০% ফ্ল্যাট ডিসকাউন্ট",
      phone: "১০৬১৬",
      logoText: "Square"
    }
  });

  // 2. Seed Members
  const hashedPw = hashPassword("123456");

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
      emailVerified: true
    }
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
      emailVerified: true
    }
  });

  // 3. Seed Transactions
  await prisma.transaction.create({
    data: {
      id: "tx1",
      memberId: m1.id,
      memberName: m1.name,
      partnerId: p1.id,
      partnerName: p1.name,
      amount: 5000,
      saved: 500,
      date: new Date("2026-06-12T10:30:00+06:00")
    }
  });

  await prisma.transaction.create({
    data: {
      id: "tx3",
      memberId: m2.id,
      memberName: m2.name,
      partnerId: p3.id,
      partnerName: p3.name,
      amount: 3000,
      saved: 300,
      date: new Date("2026-07-02T13:20:00+06:00")
    }
  });

  await prisma.transaction.create({
    data: {
      id: "tx4",
      memberId: m1.id,
      memberName: m1.name,
      partnerId: p2.id,
      partnerName: p2.name,
      amount: 15000,
      saved: 1500,
      date: new Date("2026-07-10T11:45:00+06:00")
    }
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
