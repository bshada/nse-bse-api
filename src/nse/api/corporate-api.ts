/**
 * Corporate actions and announcements API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { 
  ActionParams, 
  AnnouncementParams, 
  BoardMeetingParams, 
  CircularParams 
} from "../types/index.js";
import { formatDateDMY, validateDateRange } from "../utils/date-formatter.js";

export class CorporateApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get corporate actions
   */
  async getActions(params: ActionParams = {}): Promise<any[]> {
    const query: Record<string, any> = {
      index: params.segment ?? "equities",
    };
    
    if (params.symbol) query.symbol = params.symbol;
    
    if (params.from_date && params.to_date) {
      validateDateRange(params.from_date, params.to_date);
      query.from_date = formatDateDMY(params.from_date);
      query.to_date = formatDateDMY(params.to_date);
    }
    
    return await this.httpClient.request(`${BASE_URL}/corporates-corporateActions`, query);
  }

  /**
   * Get corporate announcements
   */
  async getAnnouncements(params: AnnouncementParams = {}): Promise<any[]> {
    const query: Record<string, any> = {
      index: params.index ?? "equities",
    };
    
    if (params.symbol) query.symbol = params.symbol;
    if (params.fno) query.fo_sec = true;
    
    if (params.from_date && params.to_date) {
      validateDateRange(params.from_date, params.to_date);
      query.from_date = formatDateDMY(params.from_date);
      query.to_date = formatDateDMY(params.to_date);
    }
    
    return await this.httpClient.request(`${BASE_URL}/corporate-announcements`, query);
  }

  /**
   * Get board meetings
   */
  async getBoardMeetings(params: BoardMeetingParams = {}): Promise<any[]> {
    const query: Record<string, any> = {
      index: params.index ?? "equities",
    };
    
    if (params.symbol) query.symbol = params.symbol;
    if (params.fno) query.fo_sec = true;
    
    if (params.from_date && params.to_date) {
      validateDateRange(params.from_date, params.to_date);
      query.from_date = formatDateDMY(params.from_date);
      query.to_date = formatDateDMY(params.to_date);
    }
    
    return await this.httpClient.request(`${BASE_URL}/corporate-board-meetings`, query);
  }

  /**
   * Get annual reports
   */
  async getAnnualReports(symbol: string, segment: "equities" | "sme" = "equities"): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/annual-reports`, {
      index: segment,
      symbol,
    });
  }

  /**
   * Get circulars
   */
  async getCirculars(params: CircularParams = {}): Promise<any> {
    const to = params.to_date ?? new Date();
    const from = params.from_date ?? new Date(to.getTime() - 7 * 86400000);
    validateDateRange(from, to);

    const query: Record<string, any> = {
      from_date: formatDateDMY(from),
      to_date: formatDateDMY(to),
    };
    
    if (params.subject) query.sub = params.subject;
    if (params.dept_code) query.dept = params.dept_code.toUpperCase();

    return await this.httpClient.request(`${BASE_URL}/circulars`, query);
  }
}