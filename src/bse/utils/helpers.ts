import * as fs from 'fs';
import * as path from 'path';
import { BSEError } from '../types/index.js';

/**
 * Utility function to get and validate path
 */
export function getPath(inputPath: string, isFolder = false): string {
  const resolvedPath = path.resolve(inputPath);

  if (isFolder) {
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      throw new BSEError(`${resolvedPath}: must be a folder`);
    }

    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    }
  }

  return resolvedPath;
}

/**
 * Split date range into chunks
 */
export function splitDateRange(
  fromDate: Date,
  toDate: Date,
  maxChunkSize = 30
): Array<[Date, Date]> {
  if (fromDate > toDate) {
    throw new BSEError("'fromDate' cannot be greater than 'toDate'");
  }

  const chunks: Array<[Date, Date]> = [];
  let currentStart = new Date(fromDate);

  while (currentStart <= toDate) {
    // Calculate the end of the current chunk
    const currentEnd = new Date(currentStart);
    currentEnd.setDate(currentEnd.getDate() + maxChunkSize - 1);

    // Don't go past the final date
    if (currentEnd > toDate) {
      currentEnd.setTime(toDate.getTime());
    }

    chunks.push([new Date(currentStart), new Date(currentEnd)]);

    // Start next chunk the day after the current end
    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
  }

  return chunks;
}

/**
 * Format date to YYYYMMDD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Format date to DD/MM/YYYY string
 */
export function formatDateSlash(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Extract and unzip file
 */
export async function unzipFile(filePath: string, extractPath: string): Promise<string> {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();
  
  if (zipEntries.length === 0) {
    throw new BSEError('Empty zip file');
  }

  const extractedPath = path.join(extractPath, zipEntries[0].entryName);
  zip.extractAllTo(extractPath, true);
  
  // Remove the original zip file
  fs.unlinkSync(filePath);
  
  return extractedPath;
}