/**
 * Options and derivatives API methods for NSE
 */

import { HttpClient } from "../http/http-client.js";
import { BASE_URL } from "../constants/index.js";
import { OPTION_INDICES } from "../constants/index.js";
import { OptionChainData, CompiledOptionChain, FnoIndex } from "../types/index.js";
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
   * Get option chain data
   */
  async getOptionChain(symbol: string): Promise<any> {
    const isIndex = OPTION_INDICES.includes(symbol.toLowerCase() as any);
    const url = isIndex
      ? `${BASE_URL}/option-chain-indices`
      : `${BASE_URL}/option-chain-equities`;
    
    return await this.httpClient.request(url, { symbol: symbol.toUpperCase() });
  }

  /**
   * Get filtered option chain data with only essential information for LLM processing
   * Reduces data volume by ~90% while retaining key metrics
   */
  async getFilteredOptionChain(symbol: string, strikeRange: number = 10): Promise<any> {
    const fullData = await this.getOptionChain(symbol);
    const underlying = fullData.records.underlyingValue;
    
    // Calculate ATM strike
    const strikes = fullData.records.data.map((item: any) => item.strikePrice);
    const atmStrike = strikes.reduce((prev: number, curr: number) => 
      Math.abs(curr - underlying) < Math.abs(prev - underlying) ? curr : prev
    );
    
    // Filter strikes within range of ATM
    const minStrike = atmStrike - (strikeRange * 50); // Assuming 50 point intervals
    const maxStrike = atmStrike + (strikeRange * 50);
    
    const filteredData = fullData.records.data.filter((item: any) => 
      item.strikePrice >= minStrike && item.strikePrice <= maxStrike
    );
    
    // Extract only essential fields
    const essentialData = filteredData.map((item: any) => ({
      strikePrice: item.strikePrice,
      expiryDate: item.expiryDate,
      CE: item.CE ? {
        lastPrice: item.CE.lastPrice,
        change: item.CE.change,
        pChange: item.CE.pChange,
        openInterest: item.CE.openInterest,
        changeinOpenInterest: item.CE.changeinOpenInterest,
        impliedVolatility: item.CE.impliedVolatility
      } : null,
      PE: item.PE ? {
        lastPrice: item.PE.lastPrice,
        change: item.PE.change,
        pChange: item.PE.pChange,
        openInterest: item.PE.openInterest,
        changeinOpenInterest: item.PE.changeinOpenInterest,
        impliedVolatility: item.PE.impliedVolatility
      } : null
    }));
    
    return {
      symbol: symbol.toUpperCase(),
      underlyingValue: underlying,
      atmStrike: atmStrike,
      timestamp: fullData.records.timestamp,
      strikeRange: `${minStrike}-${maxStrike}`,
      totalStrikes: essentialData.length,
      data: essentialData
    };
  }

  /**
   * Calculate max pain for option chain
   */
  static calculateMaxPain(optionChain: OptionChainData, expiryDate: Date): number {
    const painMap: Record<number, number> = {};
    const expiryDateStr = formatDateExpiry(expiryDate);

    for (const x of optionChain.records.data) {
      if (x.expiryDate !== expiryDateStr) continue;
      
      const expiryStrike = x.strikePrice;
      let pain = 0;
      
      for (const y of optionChain.records.data) {
        if (y.expiryDate !== expiryDateStr) continue;
        
        const diff = expiryStrike - y.strikePrice;
        if (diff > 0 && y.CE) pain += -diff * y.CE.openInterest;
        if (diff < 0 && y.PE) pain += diff * y.PE.openInterest;
      }
      
      painMap[expiryStrike] = pain;
    }

    const strikes = Object.keys(painMap).map(Number);
    return strikes.sort((a, b) => painMap[b] - painMap[a])[0];
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
   * Compile option chain with calculated metrics
   */
  async compileOptionChain(symbol: string, expiryDate: Date): Promise<CompiledOptionChain> {
    const data = await this.getOptionChain(symbol);
    const chain: Record<string, any> = {};
    const expiryDateStr = formatDateExpiry(expiryDate);

    const oc: any = {
      expiry: expiryDateStr,
      timestamp: data.records.timestamp,
    };

    const strike1 = data.filtered.data[0].strikePrice;
    const strike2 = data.filtered.data[1].strikePrice;
    const multiple = strike1 - strike2;

    const underlying = data.records.underlyingValue;
    oc.underlying = underlying;
    oc.atm = multiple * Math.round(underlying / multiple);

    let maxCoi = 0;
    let maxPoi = 0;
    let totalCoi = 0;
    let totalPoi = 0;
    let maxCoiStrike = 0;
    let maxPoiStrike = 0;

    for (const idx of data.records.data) {
      if (idx.expiryDate !== expiryDateStr) continue;
      
      const strike = String(idx.strikePrice);
      if (!chain[strike]) chain[strike] = { pe: {}, ce: {} };

      let poi = 0;
      let coi = 0;

      if (idx.PE) {
        const { openInterest, lastPrice, chg, impliedVolatility } = idx.PE;
        poi = openInterest;
        chain[strike].pe = { last: lastPrice, oi: poi, chg, iv: impliedVolatility };
        totalPoi += poi;
        if (poi > maxPoi) {
          maxPoi = poi;
          maxPoiStrike = Number(strike);
        }
      } else {
        chain[strike].pe = { last: 0, oi: 0, chg: 0, iv: 0 };
      }

      if (idx.CE) {
        const { openInterest, lastPrice, chg, impliedVolatility } = idx.CE;
        coi = openInterest;
        chain[strike].ce = { last: lastPrice, oi: coi, chg, iv: impliedVolatility };
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

    oc.maxpain = OptionsApi.calculateMaxPain(data, expiryDate);
    oc.maxCoi = maxCoiStrike;
    oc.maxPoi = maxPoiStrike;
    oc.coiTotal = totalCoi;
    oc.poiTotal = totalPoi;
    oc.pcr = Number((totalPoi / totalCoi).toFixed(2));
    oc.chain = chain;

    return oc;
  }
}