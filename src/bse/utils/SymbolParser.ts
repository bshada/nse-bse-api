import { parse } from 'node-html-parser';
import { LookupResult } from '../types/index.js';

/**
 * HTML parser to parse html strings returned from BSE symbol search
 * The result is parsed into a dictionary with company_name, symbol, isin and bse_code
 */
export class SymbolParser {
  private result: Partial<LookupResult> = {};
  private start = false;
  private index = 0;
  
  // The fields within the HTML are always in the same order
  private readonly fields: (keyof LookupResult)[] = ['company_name', 'symbol', 'isin', 'bse_code'];

  resetData(): void {
    this.result = {};
    this.start = false;
    this.index = 0;
  }

  getResult(): LookupResult | null {
    if (!this.result.symbol) {
      return null;
    }
    return this.result as LookupResult;
  }

  feed(htmlString: string): void {
    const root = parse(htmlString);
    const anchors = root.querySelectorAll('a');
    
    if (anchors.length === 0) {
      return;
    }

    this.start = true;
    this.index = 0;
    
    // Process each anchor tag's text content
    for (const anchor of anchors) {
      const textContent = anchor.text.trim();
      if (textContent) {
        this.handleData(textContent);
      }
    }
  }

  private handleData(data: string): void {
    if (!this.start || this.index >= this.fields.length) {
      return;
    }

    const field = this.fields[this.index];

    if (!(field in this.result)) {
      if ('company_name' in this.result && data.includes(' ')) {
        // Handle strings like "   INE040A01034   500180"
        const parts = data.split(' ').filter(part => part.trim() !== '');
        for (const part of parts) {
          this.handleData(part);
        }
        return;
      }
      
      this.result[field] = data.trim();
      this.index++;
    }
  }
}