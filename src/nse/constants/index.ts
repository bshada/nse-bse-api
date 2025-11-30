/**
 * Constants and configuration values for NSE API
 */

export const NSE_VERSION = "0.1.0";

// Market segments
export const SEGMENT_EQUITY = "equities" as const;
export const SEGMENT_SME = "sme" as const;
export const SEGMENT_MF = "mf" as const;
export const SEGMENT_DEBT = "debt" as const;

// Holiday types
export const HOLIDAY_CLEARING = "clearing" as const;
export const HOLIDAY_TRADING = "trading" as const;

// F&O indices
export const FNO_BANK = "banknifty" as const;
export const FNO_NIFTY = "nifty" as const;
export const FNO_FINNIFTY = "finnifty" as const;
export const FNO_IT = "niftyit" as const;

// Important dates
export const UDIFF_SWITCH_DATE = new Date("2024-07-08");

// Option indices array
export const OPTION_INDICES = [
  FNO_BANK,
  FNO_NIFTY,
  FNO_FINNIFTY,
  FNO_IT,
] as const;

// API URLs
export const BASE_URL = "https://www.nseindia.com/api";
export const ARCHIVE_URL = "https://nsearchives.nseindia.com";

// HTTP headers
export const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/118.0";

export const DEFAULT_HEADERS = {
  "User-Agent": DEFAULT_USER_AGENT,
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate",
  Referer: "https://www.nseindia.com/get-quotes/equity?symbol=HDFCBANK",
} as const;

// Default timeout
export const DEFAULT_TIMEOUT = 15000;

// Cookie priming URL
export const PRIME_URL = "https://www.nseindia.com/option-chain";