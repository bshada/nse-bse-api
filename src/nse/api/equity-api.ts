/**
 * Equity-related API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { EquityQuoteData, QuoteParams, MarketData } from "../types/index.js";

export class EquityApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get equity metadata information
   */
  async getEquityMetaInfo(symbol: string): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/equity-meta-info`, { 
      symbol: symbol.toUpperCase() 
    });
  }

  /**
   * Get quote for equity or derivative
   */
  async getQuote(params: QuoteParams): Promise<any> {
    const type = params.type ?? "equity";
    const url = type === "equity" 
      ? `${BASE_URL}/quote-equity` 
      : `${BASE_URL}/quote-derivative`;
    
    const query: Record<string, any> = { symbol: params.symbol.toUpperCase() };
    
    if (params.section) {
      if (params.section !== "trade_info") {
        throw new Error("'Section' if specified must be 'trade_info'");
      }
      query.section = params.section;
    }
    
    return await this.httpClient.request(url, query);
  }

  /**
   * Get simplified equity quote with OHLC data
   */
  async getEquityQuote(symbol: string): Promise<EquityQuoteData> {
    const q = await this.getQuote({ symbol, type: "equity" });
    const v = await this.getQuote({ symbol, type: "equity", section: "trade_info" });
    
    const open = q.priceInfo?.open;
    const minmax = q.priceInfo?.intraDayHighLow;
    const close = q.priceInfo?.close;
    const ltp = q.priceInfo?.lastPrice;
    
    return {
      date: q.metadata?.lastUpdateTime,
      open,
      high: minmax?.max,
      low: minmax?.min,
      close: close ?? ltp,
      volume: v.securityWiseDP?.quantityTraded,
    };
  }

  /**
   * Filter gainers from market data
   */
  getGainers(data: MarketData, count?: number): any[] {
    const filtered = data.data
      .filter((d) => d.pChange > 0)
      .sort((a, b) => b.pChange - a.pChange);
    
    return typeof count === "number" ? filtered.slice(0, count) : filtered;
  }

  /**
   * Filter losers from market data
   */
  getLosers(data: MarketData, count?: number): any[] {
    const filtered = data.data
      .filter((d) => d.pChange < 0)
      .sort((a, b) => a.pChange - b.pChange);
    
    return typeof count === "number" ? filtered.slice(0, count) : filtered;
  }

  /**
   * List equity stocks by index
   */
  async listEquityStocksByIndex(index = "NIFTY 50"): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/equity-stockIndices`, { index });
  }

  /**
   * List all indices
   */
  async listIndices(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/allIndices`);
  }

  /**
   * List ETFs
   */
  async listEtf(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/etf`);
  }

  /**
   * List SME stocks
   */
  async listSme(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/live-analysis-emerge`);
  }

  /**
   * List Sovereign Gold Bonds
   */
  async listSgb(): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/sovereign-gold-bonds`);
  }
}