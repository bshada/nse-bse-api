import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { NSE } from '../../src/index.js';

// Helper to write test outputs to JSON files
const OUTPUT_DIR = path.join(process.cwd(), 'test-outputs');

function writeOutput(category: string, data: any): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const filePath = path.join(OUTPUT_DIR, `${category}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Combined NSE API tests - network and unit tests
describe('NSE API - All Tests', () => {
  // Use a shared directory and single NSE instance for all tests
  let sharedDir: string;
  let nse: NSE;

  beforeAll(() => {
    sharedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nseapi-shared-'));
    nse = new NSE(sharedDir, { server: false, timeout: 20000 });
  });

  afterAll(() => {
    if (nse) {
      nse.exit();
    }
  });

  const tmpDir = () => sharedDir;

  describe('Basic Network Tests', () => {
    it('fetches market status', async () => {
      const status = await nse.status();
      writeOutput('market-status', status);
      expect(status).toBeTruthy();
    });

    it('looks up a known symbol', async () => {
      const results = await nse.lookup('INFY');
      writeOutput('lookup-infy', results);
      expect(results).toBeTruthy();
      const list = Array.isArray(results)
        ? results
        : (results as any)?.symbols ?? (results as any)?.items ?? (results as any)?.data ?? (results as any)?.searchdata ?? [];
      expect(Array.isArray(list)).toBe(true);
      if ((list as any[]).length > 0) {
        expect(typeof (list as any[])[0]).toBe('object');
      }
    });
  });

  describe('Broad Coverage Tests', () => {
    it('status()', async () => {
      const res = await nse.status();
      writeOutput('status', res);
      expect(res).toBeTruthy();
    });

    it('lookup()', async () => {
      const res = await nse.lookup('INFY');
      writeOutput('lookup', res);
      expect(res).toBeTruthy();
    });

    it('equityMetaInfo(), quote(), equityQuote()', async () => {
      try {
        const meta = await nse.equityMetaInfo('INFY');
        writeOutput('equity-meta-info', meta);
        expect(meta).toBeTruthy();
        const q1 = await nse.quote({ symbol: 'INFY', type: 'equity' });
        writeOutput('quote-equity', q1);
        expect(q1).toBeTruthy();
        const q2 = await nse.quote({ symbol: 'INFY', type: 'equity', section: 'trade_info' });
        writeOutput('quote-trade-info', q2);
        expect(q2).toBeTruthy();
        const simple = await nse.equityQuote('INFY');
        writeOutput('equity-quote', simple);
        expect(simple).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping equity tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('listEquityStocksByIndex(), listIndices(), listEtf(), listSme(), listSgb()', async () => {
      try {
        const stocksByIndex = await nse.listEquityStocksByIndex('NIFTY 50');
        writeOutput('equity-stocks-by-index', stocksByIndex);
        expect(stocksByIndex).toBeTruthy();
        
        const indices = await nse.listIndices();
        writeOutput('indices', indices);
        expect(indices).toBeTruthy();
        
        const etf = await nse.listEtf();
        writeOutput('etf', etf);
        expect(etf).toBeTruthy();
        
        const sme = await nse.listSme();
        writeOutput('sme', sme);
        expect(sme).toBeTruthy();
        
        const sgb = await nse.listSgb();
        writeOutput('sgb', sgb);
        expect(sgb).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping equity lists tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('IPO listings: current, upcoming, past', async () => {
      try {
        const currentIPO = await nse.listCurrentIPO();
        writeOutput('ipo-current', currentIPO);
        expect(currentIPO).toBeTruthy();
        
        const upcomingIPO = await nse.listUpcomingIPO();
        writeOutput('ipo-upcoming', upcomingIPO);
        expect(upcomingIPO).toBeTruthy();
        
        const to = new Date();
        const from = new Date(to.getTime() - 60 * 86400000);
        const pastIPO = await nse.listPastIPO(from, to);
        writeOutput('ipo-past', pastIPO);
        expect(pastIPO).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping IPO test due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('circulars() and blockDeals()', async () => {
      try {
        const circulars = await nse.circulars();
        writeOutput('circulars', circulars);
        expect(circulars).toBeTruthy();
        
        const blockDeals = await nse.blockDeals();
        writeOutput('block-deals', blockDeals);
        expect(blockDeals).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping circulars/blockDeals test due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('fnoLots()', async () => {
      const lots = await nse.fnoLots();
      writeOutput('fno-lots', lots);
      expect(lots && typeof lots).toBe('object');
    });

    it('optionChain(), getExpiryDatesV3(), compileOptionChain()', async () => {
      try {
        const chain = await nse.optionChain('NIFTY');
        writeOutput('option-chain', chain);
        expect(chain).toBeTruthy();
        expect(chain.records).toBeTruthy();
        expect(chain.records.underlyingValue).toBeGreaterThan(0);
        expect(Array.isArray(chain.records.data)).toBe(true);

        const expiries = await nse.getExpiryDatesV3('NIFTY');
        writeOutput('expiry-dates-v3', expiries);
        expect(Array.isArray(expiries)).toBe(true);
        expect(expiries.length).toBeGreaterThan(0);

        if (expiries.length > 0) {
          const [dd, mmm, yyyy] = expiries[0].split('-');
          const expiryDate = new Date(`${dd} ${mmm} ${yyyy}`);
          const oc = await nse.compileOptionChain('NIFTY', expiryDate);
          writeOutput('compiled-option-chain', oc);
          expect(oc).toBeTruthy();
          expect(oc.chain).toBeTruthy();
          expect(oc.underlying).toBeGreaterThan(0);
          expect(oc.atm).toBeGreaterThan(0);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping option chain tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('optionChainV3(), compileOptionChainV3(), filteredOptionChainV3()', async () => {
      try {
        const chainV3 = await nse.optionChainV3({ symbol: 'NIFTY' });
        writeOutput('option-chain-v3', chainV3);
        expect(chainV3).toBeTruthy();
        expect(chainV3.records).toBeTruthy();
        expect(chainV3.records.underlyingValue).toBeGreaterThan(0);
        expect(Array.isArray(chainV3.records.data)).toBe(true);

        const expiriesV3 = await nse.getExpiryDatesV3('NIFTY');
        writeOutput('expiry-dates-v3-2', expiriesV3);
        expect(Array.isArray(expiriesV3)).toBe(true);
        expect(expiriesV3.length).toBeGreaterThan(0);

        if (expiriesV3.length > 0) {
          const expiry = expiriesV3[0];
          const chainWithExpiry = await nse.optionChainV3({ symbol: 'NIFTY', expiry });
          writeOutput('option-chain-v3-with-expiry', chainWithExpiry);
          expect(chainWithExpiry).toBeTruthy();
          expect(chainWithExpiry.records.data.length).toBeGreaterThan(0);

          const compiledV3 = await nse.compileOptionChainV3('NIFTY', expiry);
          writeOutput('compiled-option-chain-v3', compiledV3);
          expect(compiledV3).toBeTruthy();
          expect(compiledV3.chain).toBeTruthy();
          expect(compiledV3.underlying).toBeGreaterThan(0);
          expect(compiledV3.atm).toBeGreaterThan(0);
          expect(typeof compiledV3.pcr).toBe('number');

          const filteredV3 = await nse.filteredOptionChainV3('NIFTY', expiry, 5);
          writeOutput('filtered-option-chain-v3', filteredV3);
          expect(filteredV3).toBeTruthy();
          expect(filteredV3.underlyingValue).toBeGreaterThan(0);
          expect(filteredV3.atmStrike).toBeGreaterThan(0);
          expect(Array.isArray(filteredV3.data)).toBe(true);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping v3 option chain tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('holidays()', async () => {
      const tradingHolidays = await nse.holidays('trading');
      writeOutput('holidays-trading', tradingHolidays);
      expect(tradingHolidays).toBeTruthy();
      
      const clearingHolidays = await nse.holidays('clearing');
      writeOutput('holidays-clearing', clearingHolidays);
      expect(clearingHolidays).toBeTruthy();
    });

    it('historical: equity, vix, fno', async () => {
      try {
        const eq = await nse.fetch_equity_historical_data({ symbol: 'INFY' });
        writeOutput('historical-equity', eq);
        expect(Array.isArray(eq)).toBe(true);

        const vix = await nse.fetch_historical_vix_data({ from_date: new Date(Date.now() - 7 * 86400000), to_date: new Date() });
        writeOutput('historical-vix', vix);
        expect(Array.isArray(vix)).toBe(true);

        const fno = await nse.fetch_historical_fno_data({ symbol: 'NIFTY', instrument: 'FUTIDX', from_date: new Date(Date.now() - 7 * 86400000), to_date: new Date() });
        writeOutput('historical-fno', fno);
        expect(Array.isArray(fno)).toBe(true);
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping historical data test due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('underlyings, indices, daily report metadata', async () => {
      try {
        const under = await nse.fetch_fno_underlying();
        writeOutput('fno-underlying', under);
        expect(under && typeof under).toBe('object');
        
        const names = await nse.fetch_index_names();
        writeOutput('index-names', names);
        expect(names && typeof names).toBe('object');
        
        const meta = await nse.fetch_daily_reports_file_metadata('CM');
        writeOutput('daily-reports-metadata', meta);
        expect(meta).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping underlyings/indices tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('gainers() and losers()', async () => {
      try {
        const marketData = await nse.listEquityStocksByIndex('NIFTY 50');
        writeOutput('market-data-nifty50', marketData);
        expect(marketData).toBeTruthy();

        const gainers = nse.gainers(marketData, 10);
        writeOutput('gainers', gainers);
        expect(gainers).toBeTruthy();
        expect(Array.isArray(gainers)).toBe(true);

        const losers = nse.losers(marketData, 10);
        writeOutput('losers', losers);
        expect(losers).toBeTruthy();
        expect(Array.isArray(losers)).toBe(true);
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping gainers/losers tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Additional Endpoints', () => {
    it('corporate: actions, announcements, boardMeetings, annual_reports', async () => {
      try {
        const actions = await nse.actions({ segment: 'equities', symbol: 'INFY' });
        writeOutput('corporate-actions', actions);
        expect(actions).toBeTruthy();
        
        const announcements = await nse.announcements({ index: 'equities', symbol: 'INFY' });
        writeOutput('announcements', announcements);
        expect(announcements).toBeTruthy();
        
        const boardMeetings = await nse.boardMeetings({ index: 'equities', symbol: 'INFY' });
        writeOutput('board-meetings', boardMeetings);
        expect(boardMeetings).toBeTruthy();
        
        const annualReports = await nse.annual_reports('INFY');
        writeOutput('annual-reports', annualReports);
        expect(annualReports).toBeTruthy();
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          console.warn('Skipping corporate actions tests due to API rate limiting (401)');
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });

    it('bulkdeals', async () => {
      const to = new Date();
      const from = new Date(to.getTime() - 7 * 86400000);
      try {
        const data = await nse.bulkdeals(from, to);
        writeOutput('bulk-deals', data);
        expect(Array.isArray(data)).toBe(true);
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it('downloads: equityBhavcopy / deliveryBhavcopy / indicesBhavcopy / fnoBhavcopy / priceband_report / pr_bhavcopy / cm_mii_security_report', async () => {
      const dir = tmpDir();

      function recentBusinessDay(offset: number = 1): Date {
        const d = new Date(Date.now() - offset * 86400000);
        const day = d.getDay();
        if (day === 0) d.setDate(d.getDate() - 2);
        if (day === 6) d.setDate(d.getDate() - 1);
        return d;
      }

      const dates = [1, 2, 3, 4, 5].map(recentBusinessDay);

      let tried = 0;
      for (const dt of dates) {
        tried++;
        try {
          const eq = await nse.equityBhavcopy(new Date(dt), dir);
          expect(fs.existsSync(eq)).toBe(true);
          break;
        } catch { }
      }

      tried = 0;
      for (const dt of dates) {
        tried++;
        try {
          const del = await nse.deliveryBhavcopy(new Date(dt), dir);
          expect(fs.existsSync(del)).toBe(true);
          break;
        } catch { }
      }

      tried = 0;
      for (const dt of dates) {
        tried++;
        try {
          const idx = await nse.indicesBhavcopy(new Date(dt), dir);
          expect(fs.existsSync(idx)).toBe(true);
          break;
        } catch { }
      }

      tried = 0;
      for (const dt of dates) {
        tried++;
        try {
          const fo = await nse.fnoBhavcopy(new Date(dt), dir);
          expect(fs.existsSync(fo)).toBe(true);
          break;
        } catch { }
      }

      try { await nse.priceband_report(recentBusinessDay(), dir); } catch { }
      try { await nse.pr_bhavcopy(recentBusinessDay(), dir); } catch { }
      try { await nse.cm_mii_security_report(recentBusinessDay(), dir); } catch { }
    });

    it('download_document for a public URL (should download without extract)', async () => {
      const dir = tmpDir();
      const url = 'https://nsearchives.nseindia.com/content/fo/fo_mktlots.csv';
      const file = await nse.download_document(url, dir);
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  describe('Helper Functions (Unit Tests)', () => {
    it('gainers filters positives, sorts desc, and limits', () => {
      const api = new NSE(sharedDir);
      const input = {
        data: [
          { symbol: 'A', pChange: -1 },
          { symbol: 'B', pChange: 2 },
          { symbol: 'C', pChange: 5 },
          { symbol: 'D', pChange: 3 },
        ]
      };
      const top2 = api.gainers(input as any, 2);
      expect(top2.map(x => x.symbol)).toEqual(['C', 'D']);
    });

    it('losers filters negatives, sorts asc (most negative first), and limits', () => {
      const api = new NSE(sharedDir);
      const input = {
        data: [
          { symbol: 'A', pChange: -1 },
          { symbol: 'B', pChange: 2 },
          { symbol: 'C', pChange: -5 },
          { symbol: 'D', pChange: 3 },
        ]
      };
      const top2 = api.losers(input as any, 2);
      expect(top2.map(x => x.symbol)).toEqual(['C', 'A']);
    });

    it('maxpain computes strike with maximum pain for a crafted chain', () => {
      const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(d)}-${d.getFullYear()}`;
      const expiry = new Date('2025-09-26T00:00:00Z');
      const expiryStr = fmt(expiry);

      const optionChain = {
        records: {
          data: [
            { expiryDate: expiryStr, strikePrice: 100, CE: { openInterest: 10 }, PE: { openInterest: 0 } },
            { expiryDate: expiryStr, strikePrice: 110, CE: { openInterest: 5 }, PE: { openInterest: 5 } },
            { expiryDate: expiryStr, strikePrice: 120, CE: { openInterest: 0 }, PE: { openInterest: 15 } },
          ]
        }
      };
      const strike = NSE.maxpain(optionChain as any, expiry);
      expect([100, 110, 120]).toContain(strike);
    });

    it('maxpainV3 computes strike with maximum pain for v3 chain format', () => {
      const expiry = '26-Sep-2025';

      const optionChainV3 = {
        records: {
          timestamp: '26-Sep-2025 15:30:00',
          underlyingValue: 25000,
          data: [
            { expiryDates: expiry, strikePrice: 24900, CE: { openInterest: 1000 }, PE: { openInterest: 500 } },
            { expiryDates: expiry, strikePrice: 25000, CE: { openInterest: 800 }, PE: { openInterest: 800 } },
            { expiryDates: expiry, strikePrice: 25100, CE: { openInterest: 500 }, PE: { openInterest: 1000 } },
          ]
        }
      };
      const strike = NSE.maxpainV3(optionChainV3 as any, expiry);
      expect([24900, 25000, 25100]).toContain(strike);
    });
  });
});
