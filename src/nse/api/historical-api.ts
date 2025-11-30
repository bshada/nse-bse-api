/**
 * Historical data API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { 
  EquityHistoricalParams, 
  VixHistoricalParams, 
  FnoHistoricalParams, 
  IndexHistoricalParams,
  IndexHistoricalData,
  FnoUnderlyingData
} from "../types/index.js";
import { 
  formatDateDMY, 
  formatDateExpiry, 
  validateDateRange, 
  splitDateRange 
} from "../utils/date-formatter.js";

export class HistoricalApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Fetch equity historical data
   */
  async fetchEquityHistoricalData(params: EquityHistoricalParams): Promise<Record<string, any>[]> {
    const { symbol, from_date, to_date, series = ["EQ"] } = params;

    // Simple case - no date range and EQ series only
    if (!from_date && !to_date && JSON.stringify(series) === JSON.stringify(["EQ"])) {
      const data = await this.httpClient.request(`${BASE_URL}/historical/cm/equity`, { symbol });
      return (data.data as any[]).slice().reverse();
    }

    const to = to_date ?? new Date();
    const from = from_date ?? new Date(to.getTime() - 30 * 86400000);
    validateDateRange(from, to);

    const chunks = splitDateRange(from, to, 100);
    const results: Record<string, any>[] = [];
    
    for (const [cFrom, cTo] of chunks) {
      const data = await this.httpClient.request(`${BASE_URL}/historical/cm/equity`, {
        symbol,
        series: JSON.stringify(series),
        from: formatDateDMY(cFrom),
        to: formatDateDMY(cTo),
      });
      
      const arr = (data.data as any[]).slice().reverse();
      results.push(...arr);
    }
    
    return results;
  }

  /**
   * Fetch VIX historical data
   */
  async fetchHistoricalVixData(params: VixHistoricalParams = {}): Promise<Record<string, any>[]> {
    const to = params.to_date ?? new Date();
    const from = params.from_date ?? new Date(to.getTime() - 30 * 86400000);
    validateDateRange(from, to);

    const chunks = splitDateRange(from, to, 365);
    const data: any[] = [];
    
    for (const [cFrom, cTo] of chunks) {
      const result = await this.httpClient.request(`${BASE_URL}/historical/vixhistory`, {
        from: formatDateDMY(cFrom),
        to: formatDateDMY(cTo),
      });
      data.push(...(result.data as any[]));
    }
    
    return data;
  }

  /**
   * Fetch F&O historical data
   */
  async fetchHistoricalFnoData(params: FnoHistoricalParams): Promise<Record<string, any>[]> {
    const { 
      symbol, 
      instrument = "FUTIDX", 
      from_date, 
      to_date, 
      expiry, 
      option_type, 
      strike_price 
    } = params;

    const instrumentType = instrument.toUpperCase() as typeof instrument;
    const to = to_date ?? new Date();
    const from = from_date ?? new Date(to.getTime() - 30 * 86400000);
    validateDateRange(from, to);

    const query: Record<string, any> = {
      instrumentType,
      symbol: symbol.toUpperCase(),
    };

    if (expiry) {
      query.expiryDate = formatDateExpiry(expiry);
      query.year = expiry.getFullYear();
    }

    if (instrumentType === "OPTIDX" || instrumentType === "OPTSTK") {
      if (!option_type) {
        throw new Error("`option_type` param is required for Stock or Index options.");
      }
      query.optionType = option_type;
      if (strike_price != null) query.strikePrice = strike_price;
    }

    const chunks = splitDateRange(from, to, 365);
    const data: any[] = [];
    
    for (const [cFrom, cTo] of chunks) {
      query.from = formatDateDMY(cFrom);
      query.to = formatDateDMY(cTo);
      const result = await this.httpClient.request(`${BASE_URL}/historical/foCPV`, query);
      data.push(...(result.data as any[]));
    }
    
    return data;
  }

  /**
   * Fetch index historical data
   */
  async fetchHistoricalIndexData(params: IndexHistoricalParams): Promise<IndexHistoricalData> {
    const { index, from_date, to_date } = params;
    
    const to = to_date ?? new Date();
    const from = from_date ?? new Date(to.getTime() - 30 * 86400000);
    validateDateRange(from, to);

    const chunks = splitDateRange(from, to, 365);
    const result = { price: [] as any[], turnover: [] as any[] };
    
    for (const [cFrom, cTo] of chunks) {
      const data = await this.httpClient.request(`${BASE_URL}/historical/indicesHistory`, {
        indexType: index.toUpperCase(),
        from: formatDateDMY(cFrom),
        to: formatDateDMY(cTo),
      });
      
      result.price.push(...(data.data.indexCloseOnlineRecords as any[]));
      result.turnover.push(...(data.data.indexTurnoverRecords as any[]));
    }
    
    return result;
  }

  /**
   * Fetch F&O underlying information
   */
  async fetchFnoUnderlying(): Promise<FnoUnderlyingData> {
    const data = await this.httpClient.request(`${BASE_URL}/underlying-information`);
    return data.data;
  }

  /**
   * Fetch index names
   */
  async fetchIndexNames(): Promise<Record<string, Array<[string, string]>>> {
    return await this.httpClient.request(`${BASE_URL}/index-names`);
  }
}