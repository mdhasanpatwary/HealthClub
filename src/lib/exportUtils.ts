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
