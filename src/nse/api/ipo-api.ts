/**
 * IPO-related API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { IpoDetailsParams } from "../types/index.js";
import { formatDateDMY, validateDateRange } from "../utils/date-formatter.js";

export class IpoApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * List current IPOs
   */
  async listCurrentIPO(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/ipo-current-issue`);
  }

  /**
   * List upcoming IPOs
   */
  async listUpcomingIPO(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/all-upcoming-issues?category=ipo`);
  }

  /**
   * Get IPO details
   */
  async getIpoDetails(params: IpoDetailsParams): Promise<any> {
    const symbol = params.symbol.toUpperCase();
    const series = params.series ?? "EQ";
    
    return await this.httpClient.request(`${BASE_URL}/ipo-detail`, { symbol, series });
  }

  /**
   * List past IPOs
   */
  async listPastIPO(from_date?: Date, to_date?: Date): Promise<any> {
    const to = to_date ?? new Date();
    const from = from_date ?? new Date(to.getTime() - 90 * 86400000);
    
    if (to < from) {
      throw new Error("Argument `to_date` cannot be less than `from_date`");
    }
    
    return await this.httpClient.request(`${BASE_URL}/public-past-issues`, {
      from_date: formatDateDMY(from),
      to_date: formatDateDMY(to),
    });
  }
}