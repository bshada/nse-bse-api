/**
 * File download and bhavcopy API methods for NSE
 */

import fs from "fs";
import path from "path";
import { HttpClient } from "../http/http-client.js";
import { ARCHIVE_URL, UDIFF_SWITCH_DATE } from "../constants/index.js";
import { getPath, unzipFile } from "../utils/file-operations.js";
import { formatDateArchive, formatDateYMD, formatDateDDMMYYYY, formatDateDDMMYY } from "../utils/date-formatter.js";

export class DownloadApi {
  constructor(
    private httpClient: HttpClient,
    private downloadDir: string
  ) {}

  /**
   * Download and extract equity bhavcopy
   */
  async downloadEquityBhavcopy(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    let url: string;

    if (date < UDIFF_SWITCH_DATE) {
      const dateStr = formatDateArchive(date);
      const month = dateStr.substring(2, 5);
      url = `${ARCHIVE_URL}/content/historical/EQUITIES/${date.getFullYear()}/${month}/cm${dateStr}bhav.csv.zip`;
    } else {
      const ymd = formatDateYMD(date);
      url = `${ARCHIVE_URL}/content/cm/BhavCopy_NSE_CM_0_0_0_${ymd}_F_0000.csv.zip`;
    }

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return await unzipFile(file, path.dirname(file));
  }

  /**
   * Download delivery bhavcopy
   */
  async downloadDeliveryBhavcopy(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ddmmyyyy = formatDateDDMMYYYY(date);
    const url = `${ARCHIVE_URL}/products/content/sec_bhavdata_full_${ddmmyyyy}.csv`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return file;
  }

  /**
   * Download indices bhavcopy
   */
  async downloadIndicesBhavcopy(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ddmmyyyy = formatDateDDMMYYYY(date);
    const url = `${ARCHIVE_URL}/content/indices/ind_close_all_${ddmmyyyy}.csv`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return file;
  }

  /**
   * Download F&O bhavcopy
   */
  async downloadFnoBhavcopy(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ymd = formatDateYMD(date);
    const url = `${ARCHIVE_URL}/content/fo/BhavCopy_NSE_FO_0_0_0_${ymd}_F_0000.csv.zip`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return await unzipFile(file, path.dirname(file));
  }

  /**
   * Download priceband report
   */
  async downloadPricebandReport(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ddmmyyyy = formatDateDDMMYYYY(date);
    const url = `${ARCHIVE_URL}/content/equities/sec_list_${ddmmyyyy}.csv`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return file;
  }

  /**
   * Download PR bhavcopy
   */
  async downloadPrBhavcopy(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ddmmyy = formatDateDDMMYY(date);
    const url = `${ARCHIVE_URL}/archives/equities/bhavcopy/pr/PR${ddmmyy}.zip`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return file;
  }

  /**
   * Download CM MII security report
   */
  async downloadCmMiiSecurityReport(date: Date, folder?: string): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const ddmmyyyy = formatDateDDMMYYYY(date);
    const url = `${ARCHIVE_URL}/content/cm/NSE_CM_security_${ddmmyyyy}.csv.gz`;

    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    return await unzipFile(file, path.dirname(file));
  }

  /**
   * Download any document from URL
   */
  async downloadDocument(url: string, folder?: string, extractFiles?: string[]): Promise<string> {
    const outDir = folder ? getPath(folder, true) : this.downloadDir;
    const file = await this.httpClient.downloadFile(url, outDir);
    
    if (!fs.existsSync(file)) {
      fs.rmSync(file, { force: true });
      throw new Error(`Failed to download file: ${path.basename(file)}`);
    }

    if (path.extname(file).toLowerCase() === ".zip") {
      try {
        return await unzipFile(file, path.dirname(file), extractFiles);
      } catch (e: any) {
        fs.rmSync(file, { force: true });
        throw new Error(`Failed to extract zip file: ${String(e?.message ?? e)}`);
      }
    }

    return file;
  }
}