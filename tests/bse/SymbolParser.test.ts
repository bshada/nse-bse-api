import { describe, it, expect, beforeEach } from 'vitest';
import { SymbolParser } from '../../src/bse/utils/SymbolParser.js';

describe('SymbolParser', () => {
  let parser: SymbolParser;

  beforeEach(() => {
    parser = new SymbolParser();
  });

  it('should initialize with empty result', () => {
    expect(parser.getResult()).toBeNull();
  });

  it('should parse company data correctly', () => {
    const htmlString = '<a>HDFC Bank Ltd</a><a>HDFCBANK</a><a>INE040A01034</a><a>500180</a>';
    
    parser.feed(htmlString);
    const result = parser.getResult();

    expect(result).not.toBeNull();
    expect(result?.company_name).toBe('HDFC Bank Ltd');
    expect(result?.symbol).toBe('HDFCBANK');
    expect(result?.isin).toBe('INE040A01034');
    expect(result?.bse_code).toBe('500180');
  });

  it('should handle combined space-separated fields', () => {
    const htmlString = '<a>HDFC Bank Ltd</a><a>HDFCBANK  INE040A01034</a><a>500180</a>';
    
    parser.feed(htmlString);
    const result = parser.getResult();

    expect(result).not.toBeNull();
    expect(result?.company_name).toBe('HDFC Bank Ltd');
    expect(result?.symbol).toBe('HDFCBANK');
    expect(result?.isin).toBe('INE040A01034');
    expect(result?.bse_code).toBe('500180');
  });

  it('should reset data correctly', () => {
    const htmlString = '<a>HDFC Bank Ltd</a><a>HDFCBANK</a><a>INE040A01034</a><a>500180</a>';
    
    parser.feed(htmlString);
    expect(parser.getResult()).not.toBeNull();

    parser.resetData();
    expect(parser.getResult()).toBeNull();
  });

  it('should return null for incomplete data', () => {
    const htmlString = '<a>HDFC Bank Ltd</a>';
    
    parser.feed(htmlString);
    const result = parser.getResult();

    expect(result).toBeNull();
  });

  it('should handle empty HTML string', () => {
    parser.feed('');
    expect(parser.getResult()).toBeNull();
  });

  it('should handle HTML without anchor tags', () => {
    parser.feed('<div>Some content</div>');
    expect(parser.getResult()).toBeNull();
  });
});