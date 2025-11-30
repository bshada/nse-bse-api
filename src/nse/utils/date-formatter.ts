/**
 * Date formatting utilities for NSE API
 */

/**
 * Format date as DD-MM-YYYY
 */
export function formatDateDMY(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
}

/**
 * Format date as DDMMYYYY
 */
export function formatDateDDMMYYYY(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${date.getFullYear()}`;
}

/**
 * Format date as DDMMYY
 */
export function formatDateDDMMYY(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getFullYear()).slice(-2)}`;
}

/**
 * Format date as YYYYMMDD
 */
export function formatDateYMD(date: Date): string {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Format date for NSE archive URLs (DDMMMYYYY format)
 */
export function formatDateArchive(date: Date): string {
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(/ /g, "");
}

/**
 * Format date for option expiry (DD-MMM-YYYY format)
 */
export function formatDateExpiry(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}-${new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date)}-${date.getFullYear()}`;
}

/**
 * Validate date range
 */
export function validateDateRange(fromDate: Date, toDate: Date): void {
  if (fromDate > toDate) {
    throw new Error("'from_date' cannot be greater than 'to_date'");
  }
}

/**
 * Split date range into chunks for API pagination
 */
export function splitDateRange(from: Date, to: Date, maxChunkSizeDays = 365): Array<[Date, Date]> {
  const chunks: Array<[Date, Date]> = [];
  let currentStart = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  
  while (currentStart.getTime() <= end.getTime()) {
    const currentEnd = new Date(currentStart.getTime() + (maxChunkSizeDays - 1) * 86400000);
    const boundedEnd = currentEnd.getTime() > end.getTime() ? end : currentEnd;
    chunks.push([currentStart, boundedEnd]);
    currentStart = new Date(boundedEnd.getTime() + 86400000);
  }
  
  return chunks;
}