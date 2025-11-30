import { describe, it, expect } from 'vitest';
import { splitDateRange, formatDate, formatDateSlash } from '../../src/bse/utils/helpers.js';
import { BSEError } from '../../src/bse/types/index.js';

describe('Helper Functions', () => {
  describe('splitDateRange', () => {
    it('should split date range into chunks', () => {
      const fromDate = new Date('2023-01-01');
      const toDate = new Date('2023-01-31');
      const chunks = splitDateRange(fromDate, toDate, 10);

      expect(chunks).toHaveLength(4);
      expect(chunks[0][0]).toEqual(fromDate);
      expect(chunks[chunks.length - 1][1]).toEqual(toDate);
    });

    it('should handle single day range', () => {
      const date = new Date('2023-01-01');
      const chunks = splitDateRange(date, date, 10);

      expect(chunks).toHaveLength(1);
      expect(chunks[0][0]).toEqual(date);
      expect(chunks[0][1]).toEqual(date);
    });

    it('should throw error for invalid date range', () => {
      const fromDate = new Date('2023-01-31');
      const toDate = new Date('2023-01-01');

      expect(() => splitDateRange(fromDate, toDate)).toThrow(BSEError);
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYYMMDD', () => {
      const date = new Date('2023-01-15');
      expect(formatDate(date)).toBe('20230115');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2023-01-05');
      expect(formatDate(date)).toBe('20230105');
    });
  });

  describe('formatDateSlash', () => {
    it('should format date to DD/MM/YYYY', () => {
      const date = new Date('2023-01-15');
      expect(formatDateSlash(date)).toBe('15/01/2023');
    });

    it('should pad single digit months and days', () => {
      const date = new Date('2023-01-05');
      expect(formatDateSlash(date)).toBe('05/01/2023');
    });
  });
});