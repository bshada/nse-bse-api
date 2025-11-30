import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { 
  BSEConfig, 
  QuoteData, 
  ActionData, 
  AnnouncementsResponse, 
  ResultCalendarData,
  AdvanceDeclineData,
  GainerLoserData,
  Near52WeekData,
  WeeklyHighLowData,
  SecurityData,
  LookupResult,
  IndexData,
  Segment,
  ByDateType,
  ByType,
  PctChange,
  Period,
  Status,
  BSEError,
  TimeoutError,
  ConnectionError
} from './types/index.js';
import { SymbolParser } from './utils/SymbolParser.js';
import { Throttle } from './utils/throttle.js';
import { getPath, formatDate, formatDateSlash, unzipFile } from './utils/helpers.js';

/**
 * Unofficial TypeScript API for BSE India
 */
export class BSE {
  static readonly version = '1.0.0';
  static readonly baseUrl = 'https://www.bseindia.com/';
  static readonly apiUrl = 'https://api.bseindia.com/BseIndiaAPI/api';

  static readonly validGroups = [
    'A', 'B', 'E', 'F', 'FC', 'GC', 'I', 'IF', 'IP', 'M', 'MS', 'MT',
    'P', 'R', 'T', 'TS', 'W', 'X', 'XD', 'XT', 'Y', 'Z', 'ZP', 'ZY'
  ];

  private session: AxiosInstance;
  private dir: string;
  private symbolParser: SymbolParser;

  constructor(config: BSEConfig = {}) {
    this.dir = getPath(config.downloadFolder || './downloads', true);
    this.symbolParser = new SymbolParser();

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0';

    this.session = axios.create({
      timeout: config.timeout || 10000,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Origin': BSE.baseUrl,
        'Referer': BSE.baseUrl,
        'Connection': 'keep-alive',
      },
    });
  }

  /**
   * Close the HTTP session
   */
  close(): void {
    // Axios doesn't need explicit closing like Python requests
  }

  private async download(
    url: string, 
    folder: string, 
    params?: Record<string, any>, 
    filename?: string
  ): Promise<string> {
    const fname = filename || url.split('/').pop() || 'download';
    const filePath = path.join(folder, fname);

    await Throttle.check();

    try {
      const response = await this.session.get(url, {
        params,
        responseType: 'stream',
        timeout: 30000, // 30 seconds for downloads
      });

      if (response.status === 404) {
        throw new BSEError('Report is unavailable or not yet updated.');
      }

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
      });
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new TimeoutError('Request timed out');
      }
      throw error;
    }
  }

  private async request<T = any>(
    url: string, 
    params?: Record<string, any>, 
    timeout = 10000
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.session.get<T>(url, {
        params,
        timeout,
      });
      return response;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new TimeoutError('Request timed out');
      }
      if (error.response) {
        throw new ConnectionError(
          `${error.response.status}: ${error.response.statusText}`
        );
      }
      throw error;
    }
  }

  private async lookup(scrip: string): Promise<string> {
    const url = `${BSE.apiUrl}/PeerSmartSearch/w`;
    const params = { Type: 'SS', text: scrip };

    await Throttle.check('lookup');

    const response = await this.request<string>(url, params);
    return response.data.replace(/&nbsp;/g, ' ');
  }

  /**
   * Download the daily bhavcopy report for specified date
   */
  async bhavcopyReport(date: Date, folder?: string): Promise<string> {
    const targetFolder = folder ? getPath(folder, true) : this.dir;
    const dateStr = formatDate(date);
    const url = `${BSE.baseUrl}/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_${dateStr}_F_0000.CSV`;

    const filePath = await this.download(url, targetFolder);

    if (!fs.existsSync(filePath)) {
      throw new BSEError(`Failed to download file: ${path.basename(filePath)}`);
    }

    return filePath;
  }

  /**
   * Download the daily delivery report for specified date
   */
  async deliveryReport(date: Date, folder?: string): Promise<string> {
    const targetFolder = folder ? getPath(folder, true) : this.dir;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const url = `${BSE.baseUrl}/BSEDATA/gross/${year}/SCBSEALL${day}${month}.zip`;

    let filePath = await this.download(url, targetFolder);

    if (!fs.existsSync(filePath)) {
      throw new BSEError(`Failed to download file: ${path.basename(filePath)}`);
    }

    // Extract zip file
    filePath = await unzipFile(filePath, targetFolder);

    // Convert pipe-separated to CSV
    const content = fs.readFileSync(filePath);
    const csvContent = content.toString().replace(/\|/g, ',');
    const csvPath = filePath.replace(path.extname(filePath), '.csv');
    
    fs.writeFileSync(csvPath, csvContent);
    
    if (filePath !== csvPath) {
      fs.unlinkSync(filePath);
    }

    return csvPath;
  }

  /**
   * All corporate announcements
   */
  async announcements(options: {
    pageNo?: number;
    fromDate?: Date;
    toDate?: Date;
    segment?: Segment;
    scripcode?: string;
    category?: string;
    subcategory?: string;
  } = {}): Promise<AnnouncementsResponse> {
    const {
      pageNo = 1,
      fromDate = new Date(),
      toDate = new Date(),
      segment = 'equity',
      scripcode,
      category = '-1',
      subcategory = '-1'
    } = options;

    const segmentType = segment === 'equity' ? 'C' : (segment === 'debt' ? 'D' : 'M');

    if (fromDate > toDate) {
      throw new BSEError("'fromDate' cannot be greater than 'toDate'");
    }

    if (subcategory !== '-1' && category === '-1') {
      throw new BSEError(`Specify a 'category' for subcategory: ${subcategory}`);
    }

    const url = `${BSE.apiUrl}/AnnSubCategoryGetData/w`;

    const params = {
      pageno: pageNo,
      strCat: category,
      subcategory: subcategory,
      strPrevDate: formatDate(fromDate),
      strToDate: formatDate(toDate),
      strSearch: 'P',
      strscrip: scripcode,
      strType: segmentType,
    };

    await Throttle.check();
    const response = await this.request<AnnouncementsResponse>(url, params);
    return response.data;
  }

  /**
   * All forthcoming corporate actions
   */
  async actions(options: {
    segment?: Segment;
    fromDate?: Date;
    toDate?: Date;
    byDate?: ByDateType;
    scripcode?: string;
    sector?: string;
    purposeCode?: string;
  } = {}): Promise<ActionData[]> {
    const {
      segment = 'equity',
      fromDate,
      toDate,
      byDate = 'ex',
      scripcode,
      sector = '',
      purposeCode
    } = options;

    const segmentType = segment === 'equity' ? '0' : (segment === 'debt' ? '1' : '2');
    const byType = byDate === 'ex' ? 'E' : (byDate === 'record' ? 'R' : 'B');

    const params: Record<string, any> = {
      ddlcategorys: byType,
      ddlindustrys: sector,
      segment: segmentType,
      strSearch: 'D',
    };

    if (fromDate && toDate) {
      if (fromDate > toDate) {
        throw new BSEError("'fromDate' cannot be greater than 'toDate'");
      }

      params.Fdate = formatDate(fromDate);
      params.TDate = formatDate(toDate);
    }

    if (purposeCode) {
      params.Purposecode = purposeCode;
    }

    if (scripcode) {
      params.scripcode = scripcode;
    }

    const response = await this.request<ActionData[]>(`${BSE.apiUrl}/DefaultData/w`, params);
    return response.data;
  }

  /**
   * Corporate result calendar
   */
  async resultCalendar(options: {
    fromDate?: Date;
    toDate?: Date;
    scripcode?: string;
  } = {}): Promise<ResultCalendarData[]> {
    const { fromDate, toDate, scripcode } = options;

    const params: Record<string, any> = {};

    if (fromDate && toDate) {
      if (fromDate > toDate) {
        throw new BSEError("'fromDate' cannot be greater than 'toDate'");
      }

      params.fromdate = formatDate(fromDate);
      params.todate = formatDate(toDate);
    }

    if (scripcode) {
      params.scripcode = scripcode;
    }

    const url = `${BSE.apiUrl}/Corpforthresults/w`;
    const response = await this.request<ResultCalendarData[]>(url, params);
    return response.data;
  }

  /**
   * Advance decline values for all BSE indices
   */
  async advanceDecline(): Promise<AdvanceDeclineData[]> {
    const url = `${BSE.apiUrl}/advanceDecline/w`;

    await Throttle.check();

    const response = await this.request<AdvanceDeclineData[]>(url, { val: 'Index' });
    return response.data;
  }

  /**
   * List of top gainers
   */
  async gainers(options: {
    by?: ByType;
    name?: string;
    pctChange?: PctChange;
  } = {}): Promise<GainerLoserData[]> {
    const { by = 'group', name, pctChange = 'all' } = options;

    const params: Record<string, any> = {
      GLtype: 'gainer',
      IndxGrp: by,
      orderby: pctChange,
    };

    if (by === 'group') {
      const groupName = name || 'A';
      if (!BSE.validGroups.includes(groupName.toUpperCase())) {
        throw new BSEError(`${groupName}: Not a valid BSE stock group`);
      }
      params.IndxGrpval = groupName.toUpperCase();
    } else if (by === 'index') {
      params.IndxGrpval = (name || 'S&P BSE SENSEX').toUpperCase();
    }

    const url = `${BSE.apiUrl}/MktRGainerLoserData/w`;
    const response = await this.request<{ Table: GainerLoserData[] }>(url, params);
    return response.data.Table;
  }

  /**
   * List of top losers
   */
  async losers(options: {
    by?: ByType;
    name?: string;
    pctChange?: PctChange;
  } = {}): Promise<GainerLoserData[]> {
    const { by = 'group', name, pctChange = 'all' } = options;

    const params: Record<string, any> = {
      GLtype: 'loser',
      IndxGrp: by,
      orderby: pctChange,
    };

    if (by === 'group') {
      const groupName = name || 'A';
      if (!BSE.validGroups.includes(groupName.toUpperCase())) {
        throw new BSEError(`${groupName}: Not a valid BSE group`);
      }
      params.IndxGrpval = groupName.toUpperCase();
    } else if (by === 'index') {
      params.IndxGrpval = (name || 'S&P BSE SENSEX').toUpperCase();
    }

    const url = `${BSE.apiUrl}/MktRGainerLoserData/w`;
    const response = await this.request<{ Table: GainerLoserData[] }>(url, params);
    return response.data.Table;
  }

  /**
   * Get stocks near 52 week highs and lows
   */
  async near52WeekHighLow(options: {
    by?: ByType;
    name?: string;
  } = {}): Promise<Near52WeekData> {
    const { by = 'group', name } = options;

    const url = `${BSE.apiUrl}/MktHighLowData/w`;

    const params: Record<string, any> = {
      HLflag: 'H',
      Grpcode: '',
      indexcode: '',
      scripcode: '',
    };

    if (by === 'group') {
      const groupName = name || 'A';
      if (!BSE.validGroups.includes(groupName.toUpperCase())) {
        throw new BSEError(`${groupName}: Not a valid BSE stock group`);
      }
      params.Grpcode = groupName.toUpperCase();
    } else if (by === 'index') {
      params.indexcode = name || 'S&P BSE SENSEX';
    }

    await Throttle.check();

    const response = await this.request<any>(url, params);
    const data = response.data;

    const result: Near52WeekData = {};

    if (data.Table) {
      result.highs = data.Table;
    }

    if (data.Table1) {
      result.lows = data.Table1;
    }

    return result;
  }

  /**
   * Get OHLC quotes for given scripcode
   */
  async quote(scripcode: string): Promise<QuoteData> {
    const url = `${BSE.apiUrl}/getScripHeaderData/w`;

    const params = {
      scripcode: scripcode,
    };

    await Throttle.check();

    const response = await this.request<{ Header: any }>(url, params);
    const header = response.data.Header;

    const fields = ['PrevClose', 'Open', 'High', 'Low', 'LTP'];
    const data: any = {};

    for (const field of fields) {
      data[field] = parseFloat(header[field]);
    }

    return data as QuoteData;
  }

  /**
   * Get 52 week and monthly high & low data for given stock
   */
  async quoteWeeklyHL(scripcode: string): Promise<WeeklyHighLowData> {
    const params = { Type: 'EQ', flag: 'C', scripcode: scripcode };

    await Throttle.check();

    const response = await this.request<any>(`${BSE.apiUrl}/HighLow/w`, params);
    const data = response.data;

    const [wHigh, wLow] = data.WeekHighLow.split(' / ');
    const [mHigh, mLow] = data.MonthHighLow.split(' / ');

    return {
      fifty2WeekHigh: parseFloat(data.Fifty2WkHigh_adj),
      dateHigh: data.Fifty2WkHigh_adjDt.replace(/[()]/g, '').trim(),
      fifty2WeekLow: parseFloat(data.Fifty2WkLow_adj),
      dateLow: data.Fifty2WkLow_adjDt.replace(/[()]/g, '').trim(),
      monthlyHigh: parseFloat(mHigh),
      monthlyLow: parseFloat(mLow),
      weeklyHigh: parseFloat(wHigh),
      weeklyLow: parseFloat(wLow),
    };
  }

  /**
   * List securities and their meta info
   */
  async listSecurities(options: {
    industry?: string;
    scripcode?: string;
    group?: string;
    segment?: string;
    status?: Status;
  } = {}): Promise<SecurityData[]> {
    const {
      industry = '',
      scripcode = '',
      group = 'A',
      segment = 'Equity',
      status = 'Active'
    } = options;

    const url = `${BSE.apiUrl}/ListofScripData/w`;

    const params = {
      scripcode,
      Group: group,
      industry,
      segment,
      status,
    };

    if (group && !BSE.validGroups.includes(group.toUpperCase())) {
      throw new BSEError(`${group} not a valid BSE stock group`);
    }

    await Throttle.check();

    const response = await this.request<SecurityData[]>(url, params);
    return response.data;
  }

  /**
   * Search by Company name, stock symbol, ISIN or BSE code
   */
  async lookupSymbol(text: string): Promise<LookupResult | null> {
    const response = await this.lookup(text);
    this.symbolParser.feed(response);
    const result = this.symbolParser.getResult();
    this.symbolParser.resetData();

    return result;
  }

  /**
   * Get stock symbol name for BSE scrip code
   */
  async getScripName(scripcode: string): Promise<string> {
    // <span>HDFC   INE001A01036<strong>500010
    const regex = new RegExp(`<\\w+>([A-Z0-9]+)\\s+\\w+\\s+<\\w+>${scripcode}`);

    const response = await this.lookup(scripcode);
    const match = response.match(regex);

    if (match) {
      return match[1];
    }

    throw new BSEError(`Could not find scrip name for ${scripcode}`);
  }

  /**
   * Get BSE scrip code for stock symbol name
   */
  async getScripCode(scripname: string): Promise<string> {
    // <strong>HDFC</strong>   INE001A01036   500010
    const regex = new RegExp(`<\\w+>${scripname.toUpperCase()}<\\/\\w+>\\s+\\w+\\s+(\\d{6})`);

    const response = await this.lookup(scripname);
    const match = response.match(regex);

    if (match) {
      return match[1];
    }

    throw new BSEError(`Could not find scrip code for ${scripname}`);
  }

  /**
   * Fetch daily data for all indices for a given date
   */
  async fetchAllIndicesDataByDate(date: Date): Promise<Record<string, IndexData[]>> {
    await Throttle.check();
    const dateStr = formatDateSlash(date);

    const response = await this.request<Record<string, IndexData[]>>(
      `${BSE.apiUrl}/IndexArchDailyAll/w`,
      {
        fmdt: dateStr,
        todt: dateStr,
        index: 'All',
        period: 'D',
      }
    );

    return response.data;
  }

  /**
   * Download historical data for the specified index for the given date range
   */
  async fetchHistoricalIndexData(options: {
    index: string;
    fromDate: Date;
    toDate: Date;
    period?: Period;
    folder?: string;
  }): Promise<string | null> {
    const { index, fromDate, toDate, period = 'D', folder } = options;

    if (toDate < fromDate) {
      throw new BSEError('`toDate` must be greater than `fromDate`');
    }

    await Throttle.check();

    const targetFolder = folder ? getPath(folder, true) : this.dir;
    const fname = `${index}_${formatDate(fromDate)}_${formatDate(toDate)}.csv`;

    const filePath = await this.download(
      `${BSE.apiUrl}/ProduceCSVForDate/w`,
      targetFolder,
      {
        strIndex: index,
        dtFromDate: formatDateSlash(fromDate),
        dtToDate: formatDateSlash(toDate),
        period: period,
      },
      fname
    );

    if (fs.statSync(filePath).size > 0) {
      return filePath;
    } else {
      fs.unlinkSync(filePath);
      return null;
    }
  }

  /**
   * Fetch the list of Indices
   */
  async fetchIndexNames(): Promise<Record<string, IndexData[]>> {
    const url = `${BSE.apiUrl}/FillddlIndex/w?fmdt=&todt=`;

    await Throttle.check();

    const response = await this.request<Record<string, IndexData[]>>(url);
    return response.data;
  }

  /**
   * Returns metadata about AllIndices report
   */
  async fetchIndexReportMetadata(): Promise<Record<string, IndexData[]>> {
    await Throttle.check();

    const response = await this.request<Record<string, IndexData[]>>(
      `${BSE.apiUrl}/Indexarchive_filedownload/w`
    );
    return response.data;
  }
}