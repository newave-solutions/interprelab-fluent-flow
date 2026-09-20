/**
 * Currency formatting utilities
 */

export interface CurrencyFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

export const formatCurrency = (
    amount: number,
    options: CurrencyFormatOptions = {}
): string => {
    const {
        locale = 'en-US',
        currency = 'USD',
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
    } = options;

    const cacheKey = `${locale}-${currency}-${minimumFractionDigits}-${maximumFractionDigits}`;

    let formatter = currencyFormatterCache.get(cacheKey);
    if (!formatter) {
        formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits,
            maximumFractionDigits,
        });
        currencyFormatterCache.set(cacheKey, formatter);
    }

    return formatter.format(amount);
};

/**
 * Parse a currency string to a number
 * @param currencyString - The currency string to parse
 * @returns Parsed number or null if parsing fails
 */
export const parseCurrency = (currencyString: string): number | null => {
    // Remove currency symbols, commas, and spaces
    const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
};
