import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BSE } from '../../src/bse/BSE.js';

describe('BSE Class Tests', () => {
  let bse: BSE;

  beforeAll(() => {
    bse = new BSE({
      downloadFolder: './downloads',
      timeout: 10000
    });
  });

  afterAll(async () => {
    if (bse && typeof bse.close === 'function') {
      await bse.close();
    }
  });

  it('should create BSE instance with config', () => {
    expect(bse).toBeDefined();
    expect(bse).toBeInstanceOf(BSE);
  });

  it('should have static properties', () => {
    expect(BSE.version).toBeDefined();
    expect(BSE.baseUrl).toBe('https://www.bseindia.com/');
    expect(BSE.apiUrl).toBe('https://api.bseindia.com/BseIndiaAPI/api');
  });

  it('should have valid groups array', () => {
    expect(BSE.validGroups).toBeDefined();
    expect(Array.isArray(BSE.validGroups)).toBe(true);
    expect(BSE.validGroups.length).toBeGreaterThan(0);
    expect(BSE.validGroups).toContain('A');
    expect(BSE.validGroups).toContain('B');
  });
});