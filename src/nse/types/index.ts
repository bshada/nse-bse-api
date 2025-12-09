/**
 * Type definitions and interfaces for NSE API
 */

export type Literal<T extends string> = T;

export type Segment = "equities" | "sme" | "mf" | "debt";
export type HolidayType = "clearing" | "trading";
export type FnoIndex = "banknifty" | "nifty" | "finnifty" | "niftyit";
export type InstrumentType = "FUTIDX" | "FUTSTK" | "OPTIDX" | "OPTSTK" | "FUTIVX";
export type OptionType = "CE" | "PE";
export type QuoteType = "equity" | "fno";
export type QuoteSection = "trade_info";

export interface NSEOptions {
  server?: boolean;
  timeout?: number;
}

export interface ActionParams {
  segment?: Segment;
  symbol?: string;
  from_date?: Date;
  to_date?: Date;
}

export interface AnnouncementParams {
  index?: Segment | "invitsreits";
  symbol?: string;
  fno?: boolean;
  from_date?: Date;
  to_date?: Date;
}

export interface BoardMeetingParams {
  index?: "equities" | "sme";
  symbol?: string;
  fno?: boolean;
  from_date?: Date;
  to_date?: Date;
}

export interface QuoteParams {
  symbol: string;
  type?: QuoteType;
  section?: QuoteSection;
}

export interface IpoDetailsParams {
  symbol: string;
  series?: "EQ" | "SME";
}

export interface CircularParams {
  subject?: string;
  dept_code?: string;
  from_date?: Date;
  to_date?: Date;
}

export interface EquityHistoricalParams {
  symbol: string;
  from_date?: Date;
  to_date?: Date;
  series?: string[];
}

export interface VixHistoricalParams {
  from_date?: Date;
  to_date?: Date;
}

export interface FnoHistoricalParams {
  symbol: string;
  instrument?: InstrumentType;
  from_date?: Date;
  to_date?: Date;
  expiry?: Date;
  option_type?: OptionType;
  strike_price?: number;
}

export interface IndexHistoricalParams {
  index: string;
  from_date?: Date;
  to_date?: Date;
}

export interface EquityQuoteData {
  date?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface MarketData {
  data: Array<{ pChange: number; [k: string]: any }>;
}

export interface OptionChainData {
  records: {
    data: any[];
    timestamp: string;
    underlyingValue: number;
  };
  filtered: {
    data: Array<{ strikePrice: number }>;
  };
}

// V3 Option Chain Types
export interface OptionChainV3Params {
  symbol: string;
  type?: "Indices" | "Equity"; // V3 API uses capitalized values
  expiry?: string; // Format: "DD-Mon-YYYY" e.g., "09-Dec-2025"
}

export interface OptionLegV3 {
  strikePrice: number;
  expiryDate: string;
  underlying: string;
  identifier: string;
  openInterest: number;
  changeinOpenInterest: number;
  pchangeinOpenInterest: number;
  totalTradedVolume: number;
  impliedVolatility: number;
  lastPrice: number;
  change: number;
  pchange: number;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  buyPrice1: number;
  buyQuantity1: number;
  sellPrice1: number;
  sellQuantity1: number;
  underlyingValue: number;
  optionType: string | null;
}

export interface OptionChainV3DataItem {
  expiryDates: string;
  strikePrice: number;
  CE?: OptionLegV3;
  PE?: OptionLegV3;
}

export interface OptionChainV3Response {
  records: {
    timestamp: string;
    underlyingValue: number;
    data: OptionChainV3DataItem[];
  };
}

export interface CompiledOptionChain {
  expiry: string;
  timestamp: string;
  underlying: number;
  atm: number;
  maxpain: number;
  maxCoi: number;
  maxPoi: number;
  coiTotal: number;
  poiTotal: number;
  pcr: number;
  chain: Record<string, any>;
}

export interface IndexHistoricalData {
  price: any[];
  turnover: any[];
}

export interface FnoUnderlyingData {
  IndexList: any[];
  UnderlyingList: any[];
}

export type DailyReportSegment = "CM" | "INDEX" | "SLBS" | "SME" | "FO" | "COM" | "CD" | "NBF" | "WDM" | "CBM" | "TRI-PARTY";