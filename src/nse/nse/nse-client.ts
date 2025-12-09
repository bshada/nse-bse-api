/**
 * Main NSE API client that orchestrates all API modules
 */

import { HttpClient } from "../http/http-client.js";
import { EquityApi } from "../api/equity-api.js";
import { OptionsApi } from "../api/options-api.js";
import { HistoricalApi } from "../api/historical-api.js";
import { CorporateApi } from "../api/corporate-api.js";
import { IpoApi } from "../api/ipo-api.js";
import { MarketApi } from "../api/market-api.js";
import { DownloadApi } from "../api/download-api.js";

import { getPath } from "../utils/file-operations.js";
import { DEFAULT_TIMEOUT } from "../constants/index.js";
import { NSEOptions } from "../types/index.js";

export class NSEClient {
  static readonly __version__ = "0.1.0";

  // Re-export constants for backward compatibility
  static readonly SEGMENT_EQUITY = "equities" as const;
  static readonly SEGMENT_SME = "sme" as const;
  static readonly SEGMENT_MF = "mf" as const;
  static readonly SEGMENT_DEBT = "debt" as const;
  static readonly HOLIDAY_CLEARING = "clearing" as const;
  static readonly HOLIDAY_TRADING = "trading" as const;
  static readonly FNO_BANK = "banknifty" as const;
  static readonly FNO_NIFTY = "nifty" as const;
  static readonly FNO_FINNIFTY = "finnifty" as const;
  static readonly FNO_IT = "niftyit" as const;
  static readonly UDIFF_SWITCH_DATE = new Date("2024-07-08");

  private httpClient: HttpClient;
  private downloadDir: string;

  // API modules
  public readonly equity: EquityApi;
  public readonly options: OptionsApi;
  public readonly historical: HistoricalApi;
  public readonly corporate: CorporateApi;
  public readonly ipo: IpoApi;
  public readonly market: MarketApi;
  public readonly download: DownloadApi;


  constructor(downloadFolder: string, opts: NSEOptions = {}) {
    const server = !!opts.server;
    const timeout = opts.timeout ?? DEFAULT_TIMEOUT;

    this.downloadDir = getPath(downloadFolder, true);
    this.httpClient = new HttpClient(this.downloadDir, server, timeout);

    // Initialize API modules
    this.equity = new EquityApi(this.httpClient);
    this.options = new OptionsApi(this.httpClient);
    this.historical = new HistoricalApi(this.httpClient);
    this.corporate = new CorporateApi(this.httpClient);
    this.ipo = new IpoApi(this.httpClient);
    this.market = new MarketApi(this.httpClient);
    this.download = new DownloadApi(this.httpClient, this.downloadDir);

  }

  /**
   * Clean up resources and save cookies
   */
  exit(): void {
    this.httpClient.saveCookies();
  }

  // Backward compatibility methods - delegate to appropriate modules
  
  async status() { return this.market.getStatus(); }
  async lookup(query: string) { return this.market.lookup(query); }
  async equityBhavcopy(date: Date, folder?: string) { return this.download.downloadEquityBhavcopy(date, folder); }
  async deliveryBhavcopy(date: Date, folder?: string) { return this.download.downloadDeliveryBhavcopy(date, folder); }
  async indicesBhavcopy(date: Date, folder?: string) { return this.download.downloadIndicesBhavcopy(date, folder); }
  async fnoBhavcopy(date: Date, folder?: string) { return this.download.downloadFnoBhavcopy(date, folder); }
  async priceband_report(date: Date, folder?: string) { return this.download.downloadPricebandReport(date, folder); }
  async pr_bhavcopy(date: Date, folder?: string) { return this.download.downloadPrBhavcopy(date, folder); }
  async cm_mii_security_report(date: Date, folder?: string) { return this.download.downloadCmMiiSecurityReport(date, folder); }
  async download_document(url: string, folder?: string, extract_files?: string[]) { return this.download.downloadDocument(url, folder, extract_files); }

  async actions(params: any = {}) { return this.corporate.getActions(params); }
  async announcements(params: any = {}) { return this.corporate.getAnnouncements(params); }
  async boardMeetings(params: any = {}) { return this.corporate.getBoardMeetings(params); }
  async annual_reports(symbol: string, segment: any = "equities") { return this.corporate.getAnnualReports(symbol, segment); }
  async circulars(params: any = {}) { return this.corporate.getCirculars(params); }

  async equityMetaInfo(symbol: string) { return this.equity.getEquityMetaInfo(symbol); }
  async quote(params: any) { return this.equity.getQuote(params); }
  async equityQuote(symbol: string) { return this.equity.getEquityQuote(symbol); }
  gainers(data: any, count?: number) { return this.equity.getGainers(data, count); }
  losers(data: any, count?: number) { return this.equity.getLosers(data, count); }
  async listEquityStocksByIndex(index?: string) { return this.equity.listEquityStocksByIndex(index); }
  async listIndices() { return this.equity.listIndices(); }
  async listEtf() { return this.equity.listEtf(); }
  async listSme() { return this.equity.listSme(); }
  async listSgb() { return this.equity.listSgb(); }

  async listCurrentIPO() { return this.ipo.listCurrentIPO(); }
  async listUpcomingIPO() { return this.ipo.listUpcomingIPO(); }
  async getIpoDetails(params: any) { return this.ipo.getIpoDetails(params); }
  async listPastIPO(from_date?: Date, to_date?: Date) { return this.ipo.listPastIPO(from_date, to_date); }

  async blockDeals() { return this.market.getBlockDeals(); }
  async bulkdeals(fromdate: Date, todate: Date) { return this.market.getBulkDeals(fromdate, todate); }
  async holidays(type: any = "trading") { return this.market.getHolidays(type); }

  async fnoLots() { return this.options.getFnoLots(); }
  async optionChain(symbol: string) { return this.options.getOptionChain(symbol); }
  async filteredOptionChain(symbol: string, strikeRange?: number) { return this.options.getFilteredOptionChain(symbol, strikeRange); }
  static maxpain(optionChain: any, expiryDate: Date) { return OptionsApi.calculateMaxPain(optionChain, expiryDate); }
  async getFuturesExpiry(index: any = "nifty") { return this.options.getFuturesExpiry(index); }
  async compileOptionChain(symbol: string, expiryDate: Date) { return this.options.compileOptionChain(symbol, expiryDate); }

  // V3 Option Chain API methods
  async optionChainV3(params: { symbol: string; type?: "Indices" | "Equity"; expiry?: string }) { 
    return this.options.getOptionChainV3(params); 
  }
  async getExpiryDatesV3(symbol: string) { return this.options.getExpiryDatesV3(symbol); }
  async filteredOptionChainV3(symbol: string, expiry?: string, strikeRange?: number) { 
    return this.options.getFilteredOptionChainV3(symbol, expiry, strikeRange); 
  }
  async compileOptionChainV3(symbol: string, expiry: string) { 
    return this.options.compileOptionChainV3(symbol, expiry); 
  }
  static maxpainV3(optionChain: any, expiry: string) { return OptionsApi.calculateMaxPainV3(optionChain, expiry); }

  async fetch_equity_historical_data(params: any) { return this.historical.fetchEquityHistoricalData(params); }
  async fetch_historical_vix_data(params: any = {}) { return this.historical.fetchHistoricalVixData(params); }
  async fetch_historical_fno_data(params: any) { return this.historical.fetchHistoricalFnoData(params); }
  async fetch_historical_index_data(params: any) { return this.historical.fetchHistoricalIndexData(params); }
  async fetch_fno_underlying() { return this.historical.fetchFnoUnderlying(); }
  async fetch_index_names() { return this.historical.fetchIndexNames(); }
  async fetch_daily_reports_file_metadata(segment: any = "CM") { return this.market.getDailyReportsFileMetadata(segment); }


}