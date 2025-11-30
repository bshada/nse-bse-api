import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BSE } from '../../src/bse/BSE.js';

// These tests require network access and may be slow
// Run with: npm run test:integration
describe('Integration Tests (Network Required)', () => {
  let bse: BSE;

  beforeAll(() => {
    bse = new BSE({
      downloadFolder: './downloads',
      timeout: 15000
    });
  });

  afterAll(async () => {
    if (bse && typeof bse.close === 'function') {
      try {
        await bse.close();
      } catch {
        // Ignore close errors in tests
      }
    }
  });

  it('should test BSE endpoints', async () => {
    // Test 1: Fetch Index Names
    const indices = await bse.fetchIndexNames();
    expect(indices).toBeDefined();

    // Test 2: Get Quote
    const quote = await bse.quote('500180');
    expect(quote).toBeDefined();

    // Test 3: Lookup Symbol
    const result = await bse.lookupSymbol('HDFC');
    expect(result).toBeDefined();

    // Test 4: Advance Decline
    const advanceDecline = await bse.advanceDecline();
    expect(advanceDecline).toBeDefined();
    expect(Array.isArray(advanceDecline)).toBe(true);

    // Test 5: Gainers
    const gainers = await bse.gainers();
    expect(gainers).toBeDefined();
    expect(Array.isArray(gainers)).toBe(true);
  }, 30000);
});