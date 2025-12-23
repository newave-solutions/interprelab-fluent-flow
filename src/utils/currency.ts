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

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(amount);
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
