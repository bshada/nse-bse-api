# NSE-BSE API

A unified TypeScript API for both NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) India. This package combines the functionality of both exchanges while keeping their APIs separate and isolated.

## Features

### NSE API Features
- 📈 **Real-time Stock Quotes** - Get live stock prices and market data
- 📊 **Historical Data** - Fetch historical stock prices and indices
- 🔍 **Symbol Lookup** - Search for stocks and securities
- 📋 **Option Chain Data** - Complete options data with Greeks
- 🏢 **Corporate Actions** - Dividends, splits, bonuses, and more
- 📰 **Corporate Announcements** - Latest company announcements
- 💹 **Market Status** - Live market status and trading hours
- 📁 **Data Downloads** - Bhavcopy and other reports
- 🎯 **IPO Information** - Current, past, and upcoming IPOs

### BSE API Features
- 📈 **Stock Quotes** - Real-time BSE stock prices
- 📊 **Historical Data** - Historical price data and indices
- 🔍 **Symbol Search** - Find BSE listed companies
- 🏆 **Gainers/Losers** - Top performing stocks
- 📋 **Corporate Actions** - Dividend, bonus, rights issues
- 📰 **Announcements** - Corporate announcements and news
- 📁 **Reports** - Bhavcopy and delivery reports
- 🎯 **Result Calendar** - Earnings announcement dates

## Installation

```bash
npm install nse-bse-api
```

## Quick Start

### Using Both APIs

```typescript
import { NSE, BSE } from 'nse-bse-api';

// Initialize clients
const nse = new NSE();
const bse = new BSE();

// Get NSE quote
const nseQuote = await nse.equityQuote('RELIANCE');
console.log('NSE RELIANCE:', nseQuote);

// Get BSE quote  
const bseQuote = await bse.quote('500325'); // RELIANCE BSE code
console.log('BSE RELIANCE:', bseQuote);

// Clean up
await nse.exit();
await bse.close();
```

### Using Individual APIs

```typescript
// Import only NSE
import { NSE } from 'nse-bse-api/nse';

const nse = new NSE();
const quote = await nse.equityQuote('TCS');

// Import only BSE
import { BSE } from 'nse-bse-api/bse';

const bse = new BSE();
const quote = await bse.quote('532540'); // TCS BSE code
```

## API Documentation

### NSE API

#### Basic Usage

```typescript
import { NSE } from 'nse-bse-api';

const nse = new NSE('./downloads');

// Get stock quote
const quote = await nse.equityQuote('RELIANCE');

// Get historical data
const historical = await nse.historical.fetchEquityHistoricalData({
  symbol: 'RELIANCE',
  from_date: new Date('2024-01-01'),
  to_date: new Date('2024-01-31')
});

// Get option chain
const optionChain = await nse.options.getOptionChain('NIFTY');

// Search symbols
const results = await nse.market.lookup('reliance');
```

#### Available Methods

- `equityQuote(symbol)` - Get equity quote
- `market.lookup(query)` - Search symbols
- `market.getStatus()` - Market status
- `historical.fetchEquityHistoricalData(params)` - Historical data
- `options.getOptionChain(symbol)` - Option chain
- `corporate.getActions(params)` - Corporate actions
- `ipo.listCurrentIPO()` - Current IPOs

### BSE API

#### Basic Usage

```typescript
import { BSE } from 'nse-bse-api';

const bse = new BSE();

// Get stock quote
const quote = await bse.quote('500325'); // RELIANCE

// Get gainers
const gainers = await bse.gainers();

// Get corporate actions
const actions = await bse.actions({
  fromDate: new Date('2024-01-01'),
  toDate: new Date('2024-01-31')
});

// Search symbol
const results = await bse.lookupSymbol('reliance');
```

#### Available Methods

- `quote(scripcode)` - Get stock quote
- `gainers(options)` - Top gainers
- `losers(options)` - Top losers
- `actions(options)` - Corporate actions
- `announcements(options)` - Corporate announcements
- `lookupSymbol(text)` - Search symbols

## Configuration

### NSE Configuration

```typescript
const nse = new NSE('./downloads', {
  server: false,    // Use server mode
  timeout: 10000   // Request timeout in ms
});
```

### BSE Configuration

```typescript
const bse = new BSE({
  downloadFolder: './downloads',
  timeout: 10000
});
```

## Error Handling

```typescript
import { NSE, BSE } from 'nse-bse-api';

try {
  const nse = new NSE();
  const quote = await nse.equityQuote('INVALID');
} catch (error) {
  console.error('NSE Error:', error.message);
}

try {
  const bse = new BSE();
  const quote = await bse.quote('INVALID');
} catch (error) {
  console.error('BSE Error:', error.message);
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

