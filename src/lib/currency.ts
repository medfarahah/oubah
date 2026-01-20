/**
 * Currency utility functions
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  DJF: { code: 'DJF', symbol: 'FD', name: 'Djibouti Franc' },
};

/**
 * Format a number as currency based on currency code
 */
export function formatCurrency(amount: number, currencyCode: string = 'DJF'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.DJF;
  
  // For DJF, typically no decimal places are used
  if (currencyCode === 'DJF') {
    return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  // For other currencies, use 2 decimal places
  return `${currency.symbol}${amount.toFixed(2)}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string = 'DJF'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.DJF;
  return currency.symbol;
}

/**
 * Get currency name
 */
export function getCurrencyName(currencyCode: string = 'DJF'): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.DJF;
  return currency.name;
}
