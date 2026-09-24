import { Prisma } from "@/generated/client/client";
import { Transaction } from "@/services/db";

export const TRANSACTION_SELECT_FIELDS = {
  id: true,
  memberId: true,
  memberName: true,
  partnerId: true,
  partnerName: true,
  staffId: true,
  staffName: true,
  deskName: true,
  amount: true,
  saved: true,
  date: true,
} as const;

export type PrismaTransactionRecord = Prisma.TransactionGetPayload<{
  select: typeof TRANSACTION_SELECT_FIELDS;
}>;

export function mapPrismaTransaction(t: PrismaTransactionRecord): Transaction {
  return {
    id: t.id,
    memberId: t.memberId,
    memberName: t.memberName,
    partnerId: t.partnerId,
    partnerName: t.partnerName,
    staffId: t.staffId || undefined,
    staffName: t.staffName || undefined,
    deskName: t.deskName || undefined,
    amount: t.amount,
    saved: t.saved,
    date: t.date.toISOString(),
  };
}
