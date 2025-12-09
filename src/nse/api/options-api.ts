/**
 * Options and derivatives API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { OPTION_INDICES } from "../constants/index.js";
import { 
  OptionChainData, 
  CompiledOptionChain, 
  FnoIndex,
  OptionChainV3Params,
  OptionChainV3Response
} from "../types/index.js";
import { formatDateExpiry } from "../utils/date-formatter.js";

export class OptionsApi {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get F&O lot sizes
   */
  async getFnoLots(): Promise<Record<string, number>> {
    const url = "https://nsearchives.nseindia.com/content/fo/fo_mktlots.csv";
    
    // Try to get as JSON first, fallback to text
    let csv: string;
    try {
      const res = await this.httpClient.request(url);
      csv = typeof res === "string" ? res : "";
    } catch {
      csv = "";
    }
    
    if (!csv) {
      csv = await this.httpClient.getTextResponse(url);
    }
    
    const lines = csv.trim().split(/\r?\n/);
    const lots: Record<string, number> = {};
    
    for (const line of lines) {
      const parts = line.split(",");
      if (parts.length < 4) continue;
      
      const sym = parts[1]?.trim();
      const lot = Number(parts[3]?.trim());
      
      if (!sym || !Number.isFinite(lot)) continue;
      lots[sym] = lot;
    }
    
    return lots;
  }

  /**
   * Get option chain contract info including expiry dates
   * @param symbol - The symbol to get contract info for
   * @returns Contract info with expiry dates
   */
  async getOptionChainContractInfo(symbol: string): Promise<any> {
    return await this.httpClient.request(`${BASE_URL}/option-chain-contract-info`, { 
      symbol: symbol.toUpperCase() 
    });
  }

  /**
   * Get available expiry dates for a symbol
   * @param symbol - The symbol to get expiry dates for
   * @returns Array of expiry dates in "DD-Mon-YYYY" format
   */
  async getExpiryDatesV3(symbol: string): Promise<string[]> {
    const contractInfo = await this.getOptionChainContractInfo(symbol);
    
    // Extract expiry dates from contract info response
    if (contractInfo?.expiryDates && Array.isArray(contractInfo.expiryDates)) {
      return contractInfo.expiryDates.sort((a: string, b: string) => {
        const dateA = new Date(a.replace(/-/g, " "));
        const dateB = new Date(b.replace(/-/g, " "));
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    // Fallback: try to get from records if available
    if (contractInfo?.records?.expiryDates) {
      return contractInfo.records.expiryDates;
    }
    
    return [];
  }

  /**
   * Get option chain data (uses v3 API, auto-fetches nearest expiry if not provided)
   * @param symbol - The symbol to get option chain for
   */
  async getOptionChain(symbol: string): Promise<OptionChainV3Response> {
    // Get nearest expiry first
    const expiries = await this.getExpiryDatesV3(symbol);
    if (expiries.length === 0) {
      throw new Error(`No expiry dates found for symbol: ${symbol}`);
    }
    return this.getOptionChainV3({ symbol, expiry: expiries[0] });
  }

  /**
   * Get option chain data using v3 API
   * @param params - Symbol, type (Indices/Equity), and expiry date
   * @returns Option chain data with all strikes for the given expiry
   */
  async getOptionChainV3(params: OptionChainV3Params): Promise<OptionChainV3Response> {
    const { symbol } = params;
    let { expiry } = params;
    const isIndex = OPTION_INDICES.includes(symbol.toLowerCase() as any);
    // V3 API uses "Indices" and "Equity" (capitalized, singular for Equity)
    const type = params.type ?? (isIndex ? "Indices" : "Equity");
    
    // V3 API requires expiry - fetch it if not provided
    if (!expiry) {
      const expiries = await this.getExpiryDatesV3(symbol);
      if (expiries.length === 0) {
        throw new Error(`No expiry dates found for symbol: ${symbol}`);
      }
      expiry = expiries[0];
    }
    
    const query: Record<string, string> = {
      type,
      symbol: symbol.toUpperCase(),
      expiry,
    };
    
    return await this.httpClient.request(`${BASE_URL}/option-chain-v3`, query);
  }

  /**
   * Get filtered option chain data with only essential information for LLM processing
   * Reduces data volume by ~90% while retaining key metrics (uses v3 API internally)
   */
  async getFilteredOptionChain(symbol: string, strikeRange: number = 10): Promise<any> {
    return this.getFilteredOptionChainV3(symbol, undefined, strikeRange);
  }

  /**
   * Get filtered option chain data using v3 API with essential information
   * @param symbol - The symbol to get option chain for
   * @param expiry - Optional expiry date in "DD-Mon-YYYY" format
   * @param strikeRange - Number of strikes above/below ATM to include (default: 10)
   */
  async getFilteredOptionChainV3(
    symbol: string, 
    expiry?: string,
    strikeRange: number = 10
  ): Promise<any> {
    const fullData = await this.getOptionChainV3({ symbol, expiry });
    const underlying = fullData.records.underlyingValue;
    
    // Calculate ATM strike
    const strikes = fullData.records.data.map((item) => item.strikePrice);
    const uniqueStrikes = [...new Set(strikes)];
    const atmStrike = uniqueStrikes.reduce((prev: number, curr: number) => 
      Math.abs(curr - underlying) < Math.abs(prev - underlying) ? curr : prev
    );
    
    // Determine strike interval
    const sortedStrikes = uniqueStrikes.sort((a, b) => a - b);
    const strikeInterval = sortedStrikes.length > 1 
      ? sortedStrikes[1] - sortedStrikes[0] 
      : 50;
    
    // Filter strikes within range of ATM
    const minStrike = atmStrike - (strikeRange * strikeInterval);
    const maxStrike = atmStrike + (strikeRange * strikeInterval);
    
    const filteredData = fullData.records.data.filter((item) => 
      item.strikePrice >= minStrike && item.strikePrice <= maxStrike
    );
    
    // Extract only essential fields
    const essentialData = filteredData.map((item) => ({
      strikePrice: item.strikePrice,
      expiryDate: item.expiryDates,
      CE: item.CE ? {
        lastPrice: item.CE.lastPrice,
        change: item.CE.change,
        pchange: item.CE.pchange,
        openInterest: item.CE.openInterest,
        changeinOpenInterest: item.CE.changeinOpenInterest,
        impliedVolatility: item.CE.impliedVolatility,
        totalTradedVolume: item.CE.totalTradedVolume
      } : null,
      PE: item.PE ? {
        lastPrice: item.PE.lastPrice,
        change: item.PE.change,
        pchange: item.PE.pchange,
        openInterest: item.PE.openInterest,
        changeinOpenInterest: item.PE.changeinOpenInterest,
        impliedVolatility: item.PE.impliedVolatility,
        totalTradedVolume: item.PE.totalTradedVolume
      } : null
    }));
    
    return {
      symbol: symbol.toUpperCase(),
      underlyingValue: underlying,
      atmStrike,
      timestamp: fullData.records.timestamp,
      strikeRange: `${minStrike}-${maxStrike}`,
      totalStrikes: essentialData.length,
      data: essentialData
    };
  }

  /**
   * Calculate max pain for option chain (supports both legacy and v3 format)
   */
  static calculateMaxPain(optionChain: OptionChainData | OptionChainV3Response, expiryDate: Date): number {
    const painMap: Record<number, number> = {};
    const expiryDateStr = formatDateExpiry(expiryDate);

    for (const x of optionChain.records.data) {
      // Support both v3 (expiryDates) and legacy (expiryDate) format
      const itemExpiry = (x as any).expiryDates || (x as any).expiryDate;
      if (itemExpiry !== expiryDateStr) continue;
      
      const expiryStrike = x.strikePrice;
      let pain = 0;
      
      for (const y of optionChain.records.data) {
        const yExpiry = (y as any).expiryDates || (y as any).expiryDate;
        if (yExpiry !== expiryDateStr) continue;
        
        const diff = expiryStrike - y.strikePrice;
        if (diff > 0 && y.CE) pain += -diff * y.CE.openInterest;
        if (diff < 0 && y.PE) pain += diff * y.PE.openInterest;
      }
      
      painMap[expiryStrike] = pain;
    }

    const strikes = Object.keys(painMap).map(Number);
    return strikes.sort((a, b) => painMap[b] - painMap[a])[0] || 0;
  }

  /**
   * Get futures expiry dates
   */
  async getFuturesExpiry(index: FnoIndex = "nifty"): Promise<string[]> {
    const indexMap = {
      banknifty: "nifty_bank_fut",
      finnifty: "finnifty_fut",
      nifty: "nse50_fut",
      niftyit: "niftyit_fut"
    };
    
    const idx = indexMap[index] || "nse50_fut";
    const res = await this.httpClient.request(`${BASE_URL}/liveEquity-derivatives`, { index: idx });
    const data: string[] = res.data.map((i: any) => i.expiryDate);
    
    return data.sort(
      (a, b) =>
        new Date(a.replace(/-/g, "/")).getTime() - new Date(b.replace(/-/g, "/")).getTime()
    );
  }

  /**
   * Compile option chain with calculated metrics (uses v3 API internally)
   * @param symbol - The symbol to get option chain for
   * @param expiryDate - Expiry date as Date object
   */
  async compileOptionChain(symbol: string, expiryDate: Date): Promise<CompiledOptionChain> {
    const expiry = formatDateExpiry(expiryDate);
    return this.compileOptionChainV3(symbol, expiry);
  }

  /**
   * Compile option chain with calculated metrics using v3 API
   * @param symbol - The symbol to get option chain for
   * @param expiry - Expiry date in "DD-Mon-YYYY" format (e.g., "09-Dec-2025")
   */
  async compileOptionChainV3(symbol: string, expiry: string): Promise<CompiledOptionChain> {
    const data = await this.getOptionChainV3({ symbol, expiry });
    const chain: Record<string, any> = {};

    const oc: any = {
      expiry,
      timestamp: data.records.timestamp,
    };

    const underlying = data.records.underlyingValue;
    oc.underlying = underlying;

    // Calculate strike interval from data
    const strikes = [...new Set(data.records.data.map(d => d.strikePrice))].sort((a, b) => a - b);
    const multiple = strikes.length > 1 ? strikes[1] - strikes[0] : 50;
    oc.atm = multiple * Math.round(underlying / multiple);

    let maxCoi = 0;
    let maxPoi = 0;
    let totalCoi = 0;
    let totalPoi = 0;
    let maxCoiStrike = 0;
    let maxPoiStrike = 0;

    for (const idx of data.records.data) {
      const strike = String(idx.strikePrice);
      if (!chain[strike]) chain[strike] = { pe: {}, ce: {} };

      let poi = 0;
      let coi = 0;

      if (idx.PE) {
        const { openInterest, lastPrice, change, impliedVolatility } = idx.PE;
        poi = openInterest;
        chain[strike].pe = { last: lastPrice, oi: poi, chg: change, iv: impliedVolatility };
        totalPoi += poi;
        if (poi > maxPoi) {
          maxPoi = poi;
          maxPoiStrike = Number(strike);
        }
      } else {
        chain[strike].pe = { last: 0, oi: 0, chg: 0, iv: 0 };
      }

      if (idx.CE) {
        const { openInterest, lastPrice, change, impliedVolatility } = idx.CE;
        coi = openInterest;
        chain[strike].ce = { last: lastPrice, oi: coi, chg: change, iv: impliedVolatility };
        totalCoi += coi;
        if (coi > maxCoi) {
          maxCoi = coi;
          maxCoiStrike = Number(strike);
        }
      } else {
        chain[strike].ce = { last: 0, oi: 0, chg: 0, iv: 0 };
      }

      chain[strike].pcr = poi === 0 || coi === 0 ? null : Number((poi / coi).toFixed(2));
    }

    oc.maxpain = OptionsApi.calculateMaxPainV3(data, expiry);
    oc.maxCoi = maxCoiStrike;
    oc.maxPoi = maxPoiStrike;
    oc.coiTotal = totalCoi;
    oc.poiTotal = totalPoi;
    oc.pcr = totalCoi > 0 ? Number((totalPoi / totalCoi).toFixed(2)) : 0;
    oc.chain = chain;

    return oc;
  }

  /**
   * Calculate max pain for option chain using v3 data
   */
  static calculateMaxPainV3(optionChain: OptionChainV3Response, expiry: string): number {
    const painMap: Record<number, number> = {};

    for (const x of optionChain.records.data) {
      if (x.expiryDates !== expiry) continue;
      
      const expiryStrike = x.strikePrice;
      let pain = 0;
      
      for (const y of optionChain.records.data) {
        if (y.expiryDates !== expiry) continue;
        
        const diff = expiryStrike - y.strikePrice;
        if (diff > 0 && y.CE) pain += -diff * y.CE.openInterest;
        if (diff < 0 && y.PE) pain += diff * y.PE.openInterest;
      }
      
      painMap[expiryStrike] = pain;
    }

    const strikes = Object.keys(painMap).map(Number);
    return strikes.sort((a, b) => painMap[b] - painMap[a])[0] || 0;
  }
}