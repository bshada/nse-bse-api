// Configuration interface for BSE API
export interface BSEConfig {
  downloadFolder?: string;
  timeout?: number;
}

// Error classes
export class BSEError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSEError';
  }
}

export class TimeoutError extends BSEError {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ConnectionError extends BSEError {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

// Data interfaces
export interface QuoteData {
  scripcode?: string;
  companyname?: string;
  ltp?: number;
  change?: number;
  pchange?: number;
  volume?: number;
  value?: number;
  high?: number;
  low?: number;
  open?: number;
  previousclose?: number;
  PrevClose?: number;
  Open?: number;
  High?: number;
  Low?: number;
  LTP?: number;
}

export interface ActionData {
  scripcode: string;
  companyname: string;
  exdate: string;
  purpose: string;
  recorddate: string;
  bcstartdate: string;
  bcenddate: string;
}

export interface AnnouncementsResponse {
  announcements: any[];
  totalCount: number;
  pageNo: number;
}

export interface ResultCalendarData {
  scripcode: string;
  companyname: string;
  resultdate: string;
  resulttype: string;
}

export interface AdvanceDeclineData {
  advances: number;
  declines: number;
  unchanged: number;
}

export interface GainerLoserData {
  scripcode: string;
  companyname: string;
  ltp: number;
  change: number;
  pchange: number;
}

export interface Near52WeekData {
  scripcode?: string;
  companyname?: string;
  ltp?: number;
  high52?: number;
  low52?: number;
  highs?: any[];
  lows?: any[];
}

export interface WeeklyHighLowData {
  scripcode?: string;
  companyname?: string;
  ltp?: number;
  weekhigh?: number;
  weeklow?: number;
  monthhigh?: number;
  monthlow?: number;
  fifty2WeekHigh?: number;
  dateHigh?: string;
  fifty2WeekLow?: number;
  dateLow?: string;
  monthlyHigh?: number;
  monthlyLow?: number;
  weeklyHigh?: number;
  weeklyLow?: number;
}

export interface SecurityData {
  scripcode: string;
  companyname: string;
  group: string;
  industry: string;
  segment: string;
  status: string;
}

export interface LookupResult {
  company_name: string;
  symbol: string;
  isin: string;
  bse_code: string;
}

export interface IndexData {
  indexname: string;
  currentvalue: number;
  change: number;
  pchange: number;
  high: number;
  low: number;
  open: number;
  previousclose: number;
}

// Enum types
export type Segment = 'equity' | 'sme' | 'debt' | 'mf';
export type ByDateType = 'ex' | 'record' | 'bc';
export type ByType = 'index' | 'group';
export type PctChange = '2' | '5' | '10';
export type Period = 'D' | 'W' | 'M';
export type Status = 'Active' | 'Suspended' | 'Delisted';