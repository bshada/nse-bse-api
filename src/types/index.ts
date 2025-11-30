/**
 * Combined Types Module
 * 
 * Re-exports types from both NSE and BSE modules with proper namespacing
 */

// NSE Types (with namespace to avoid conflicts)
import * as NSETypes from '../nse/types/index.js';
import * as BSETypes from '../bse/types/index.js';

// Export namespaced types
export { NSETypes, BSETypes };

// Common interface for unified usage
export interface UnifiedStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  source: 'NSE' | 'BSE';
}