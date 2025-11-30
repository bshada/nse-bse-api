/**
 * File operations utilities for NSE API
 */

import fs from "fs";
import path from "path";
import { promisify } from "util";
import zlib from "zlib";
import { pipeline as pipelineCb } from "stream";
import AdmZip from "adm-zip";

const pipeline = promisify(pipelineCb);

/**
 * Resolve and validate file/folder path
 */
export function getPath(p: string, isFolder = false): string {
  const resolved = path.resolve(p);
  
  if (isFolder) {
    try {
      const stat = fs.existsSync(resolved) ? fs.statSync(resolved) : undefined;
      if (stat && stat.isFile()) {
        throw new Error(`${resolved}: must be a folder`);
      }
      if (!stat) {
        fs.mkdirSync(resolved, { recursive: true });
      }
    } catch (e) {
      throw e;
    }
  }
  
  return resolved;
}

/**
 * Extract zip or gzip files
 */
export async function unzipFile(filePath: string, folder: string, extractFiles?: string[]): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === ".zip") {
    const zip = new AdmZip(filePath);
    
    if (extractFiles && extractFiles.length > 0) {
      zip.extractEntryTo(extractFiles[extractFiles.length - 1], folder, false, true);
      const out = path.join(folder, extractFiles[extractFiles.length - 1]);
      fs.rmSync(filePath, { force: true });
      return out;
    } else {
      const entries = zip.getEntries();
      if (!entries.length) {
        throw new Error("Zip is empty");
      }
      const first = entries[0].entryName;
      zip.extractAllTo(folder, true);
      const out = path.join(folder, first);
      fs.rmSync(filePath, { force: true });
      return out;
    }
  } else if (ext === ".gz") {
    const dest = path.join(path.dirname(filePath), path.basename(filePath, ".gz"));
    const gzip = zlib.createGunzip();
    await pipeline(fs.createReadStream(filePath), gzip, fs.createWriteStream(dest));
    fs.rmSync(filePath, { force: true });
    return dest;
  } else {
    throw new Error("Unknown file format");
  }
}

/**
 * Save file from stream
 */
export async function saveStreamToFile(stream: NodeJS.ReadableStream, filePath: string): Promise<void> {
  await pipeline(stream, fs.createWriteStream(filePath));
}