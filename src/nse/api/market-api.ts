/**
 * Market data and trading API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { HolidayType, DailyReportSegment } from "../types/index.js";
import { formatDateDMY, validateDateRange } from "../utils/date-formatter.js";

export class MarketApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get market status
   */
  async getStatus(): Promise<any[]> {
    const result = await this.httpClient.request(`${BASE_URL}/marketStatus`);
    return result.marketState;
  }

  /**
   * Search/lookup symbols
   */
  async lookup(query: string): Promise<Record<string, any>> {
    return await this.httpClient.request(`${BASE_URL}/search/autocomplete`, { q: query });
  }

  /**
   * Get block deals
   */
  async getBlockDeals(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/block-deal`);
  }

  /**
   * Get bulk deals for date range
   */
  async getBulkDeals(fromDate: Date, toDate: Date): Promise<any[]> {
    const daysDiff = (toDate.getTime() - fromDate.getTime()) / 86400000;
    if (daysDiff > 365) {
      throw new Error("The date range cannot exceed one year.");
    }
    
    const url = `${BASE_URL}/historical/bulk-deals?from=${formatDateDMY(fromDate)}&to=${formatDateDMY(toDate)}`;
    const data = await this.httpClient.request(url);
    
    if (!data.data || data.data.length < 1) {
      throw new Error("No bulk deals data available for the specified date range.");
    }
    
    return data.data;
  }

  /**
   * Get holidays
   */
  async getHolidays(type: HolidayType = "trading"): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/holiday-master`, { type });
  }

  /**
   * Get daily reports file metadata
   */
  async getDailyReportsFileMetadata(segment: DailyReportSegment = "CM"): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/daily-reports`, { key: segment });
  }
}