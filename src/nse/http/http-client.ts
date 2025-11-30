/**
 * HTTP client management for NSE API
 */

import fs from "fs";
import path from "path";
import axios, { AxiosInstance } from "axios";
import { wrapper as axiosCookieJarSupport } from "axios-cookiejar-support";
import got, { Got } from "got";
import { CookieJar } from "tough-cookie";
import { DEFAULT_HEADERS, DEFAULT_TIMEOUT, PRIME_URL } from "../constants/index.js";
import { saveStreamToFile } from "../utils/file-operations.js";

export class HttpClient {
  private axiosClient?: AxiosInstance;
  private gotClient?: Got;
  private jar: CookieJar;
  private cookiePath: string;
  private cookiesPrimed = false;
  private server: boolean;
  private timeout: number;

  constructor(downloadDir: string, server: boolean, timeout: number) {
    this.server = server;
    this.timeout = timeout;
    
    // Set up cookie jar and load from disk
    this.cookiePath = path.join(
      downloadDir,
      server ? "nse_cookies_http2.json" : "nse_cookies_http1.json"
    );
    this.jar = new CookieJar();
    this.loadCookies();

    if (server) {
      // got with HTTP/2
      this.gotClient = got.extend({
        http2: true,
        headers: DEFAULT_HEADERS,
        cookieJar: this.jar,
        timeout: { request: this.timeout },
        throwHttpErrors: false,
      });
    } else {
      // axios with cookie jar
      const ax = axios.create({
        headers: DEFAULT_HEADERS,
        timeout: this.timeout,
        decompress: true,
        validateStatus: () => true,
      });
      axiosCookieJarSupport(ax);
      (ax as any).defaults.jar = this.jar;
      this.axiosClient = ax;
    }
  }

  /**
   * Load cookies from disk
   */
  private loadCookies(): void {
    if (!fs.existsSync(this.cookiePath)) return;
    
    try {
      const data = JSON.parse(fs.readFileSync(this.cookiePath, "utf8"));
      this.jar = CookieJar.fromJSON(data);
    } catch {
      // Ignore cookie loading errors
    }
  }

  /**
   * Save cookies to disk
   */
  saveCookies(): void {
    try {
      const json = this.jar.toJSON();
      fs.writeFileSync(this.cookiePath, JSON.stringify(json), "utf8");
    } catch {
      // Ignore cookie saving errors
    }
  }

  /**
   * Prime cookies by visiting NSE homepage
   */
  private async primeCookies(): Promise<void> {
    if (this.cookiesPrimed) return;
    
    try {
      if (this.server && this.gotClient) {
        await this.gotClient.get(PRIME_URL);
      } else if (this.axiosClient) {
        await this.axiosClient.get(PRIME_URL);
      }
      this.cookiesPrimed = true;
      this.saveCookies();
    } catch {
      // Ignore priming failures; subsequent requests may still succeed
    }
  }

  /**
   * Make HTTP request and return JSON response
   */
  async request(url: string, params?: Record<string, unknown>): Promise<any> {
    await this.primeCookies();
    
    if (this.server && this.gotClient) {
      const res = await this.gotClient.get(url, {
        searchParams: params as unknown as Record<string, string | number | boolean | null | undefined>,
      });
      
      if (res.statusCode < 200 || res.statusCode >= 300) {
        throw new Error(`${url} ${res.statusCode}: ${res.statusMessage}`);
      }
      
      return JSON.parse(res.body as string);
    }

    if (this.axiosClient) {
      const res = await this.axiosClient.get(url, { params });
      
      if (res.status < 200 || res.status >= 300) {
        throw new Error(`${url} ${res.status}: ${res.statusText}`);
      }
      
      return res.data;
    }

    throw new Error("HTTP client not initialized");
  }

  /**
   * Download file from URL
   */
  async downloadFile(url: string, folder: string): Promise<string> {
    const fname = path.join(folder, path.basename(new URL(url).pathname));

    await this.primeCookies();

    if (this.server && this.gotClient) {
      const res = await this.gotClient.get(url, { responseType: "buffer" });
      const contentType = res.headers["content-type"];
      
      if (contentType && String(contentType).includes("text/html")) {
        throw new Error("NSE file is unavailable or not yet updated.");
      }
      
      fs.writeFileSync(fname, res.body as unknown as Buffer);
    } else if (this.axiosClient) {
      const res = await this.axiosClient.get(url, { responseType: "stream" });
      const contentType = res.headers["content-type"] as string | undefined;
      
      if (contentType && contentType.includes("text/html")) {
        throw new Error("NSE file is unavailable or not yet updated.");
      }
      
      await saveStreamToFile(res.data, fname);
    } else {
      throw new Error("HTTP client not initialized");
    }

    return fname;
  }

  /**
   * Get text response from URL
   */
  async getTextResponse(url: string): Promise<string> {
    await this.primeCookies();
    
    if (this.server && this.gotClient) {
      const res = await this.gotClient.get(url, { responseType: "text" });
      return res.body as string;
    } else if (this.axiosClient) {
      const res = await this.axiosClient.get(url, { responseType: "text" });
      return res.data as string;
    } else {
      throw new Error("HTTP client not initialized");
    }
  }
}