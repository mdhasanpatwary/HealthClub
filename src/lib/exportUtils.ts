import { MonthlySettlementStatement } from "@/types/partnerAnalytics";

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | null | undefined);
}

/**
 * Exports tabular data to a downloadable CSV file.
 * Includes UTF-8 BOM (\uFEFF) to ensure non-Latin characters (like Bengali)
 * render properly in Microsoft Excel and other spreadsheet viewers.
 */
export function exportToCsv<T>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[]
): void {
  if (!data || data.length === 0) {
    return;
  }

  // Generate header row
  const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(",");

  // Generate data rows
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        let value: unknown;
        if (typeof col.accessor === "function") {
          value = col.accessor(item);
        } else {
          value = item[col.accessor];
        }

        if (value === null || value === undefined) {
          value = "";
        }

        const stringVal = String(value).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(",");
  });

  const csvContent = [headerRow, ...dataRows].join("\r\n");

  // UTF-8 BOM prefix
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a comprehensive Partner Monthly Settlement & Billing Statement CSV
 * formatted with hospital headers, monthly summary KPIs, and itemized patient transactions.
 */
export function exportPartnerSettlementCsv(
  statement: MonthlySettlementStatement,
  partnerName: string
): void {
  const lines: string[] = [
    `"HEALTH CLUB - PARTNER MONTHLY SETTLEMENT & BILLING STATEMENT"`,
    `"Partner Hospital / Facility:","${partnerName.replace(/"/g, '""')}"`,
    `"Billing Period:","${statement.monthLabelEn} / ${statement.monthLabelBn}"`,
    `"Total Patients Served:","${statement.totalTransactions}"`,
    `"Unique Members:","${statement.uniquePatients}"`,
    `"Gross Medical Billing:","BDT ${statement.grossAmount.toLocaleString()}"`,
    `"Total Discount Dispensed:","BDT ${statement.totalDiscountDispensed.toLocaleString()}"`,
    `"Net Member Paid:","BDT ${statement.netPatientPaid.toLocaleString()}"`,
    `"Statement Status:","${statement.status.toUpperCase()}"`,
    `"Report Generated:","${new Date().toLocaleString()}"`,
    `""`, // Blank separator row
    `"Sl","Transaction ID","Date","Member ID","Patient Name","Gross Bill (BDT)","Discount Given (BDT)","Net Paid (BDT)"`,
  ];

  statement.transactions.forEach((tx, idx) => {
    const net = tx.amount - tx.saved;
    const formattedDate = new Date(tx.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    lines.push(
      `"${idx + 1}","${tx.id}","${formattedDate}","${tx.memberId}","${tx.memberName.replace(/"/g, '""')}","${tx.amount}","${tx.saved}","${net}"`
    );
  });

  // Totals summary row
  lines.push(`""`);
  lines.push(
    `"TOTAL","${statement.totalTransactions} Transactions","","","","${statement.grossAmount}","${statement.totalDiscountDispensed}","${statement.netPatientPaid}"`
  );

  const csvContent = lines.join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const cleanPartnerName = partnerName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `settlement_${cleanPartnerName}_${statement.monthKey}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

