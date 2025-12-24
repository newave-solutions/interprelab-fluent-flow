/**
 * Number formatting utilities
 */

export interface NumberFormatOptions {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
}

/**
 * Format a number with locale-specific formatting
 * @param num - The number to format
 * @param options - Formatting options
 * @returns Formatted number string
 */
export const formatNumber = (
    num: number,
    options: NumberFormatOptions = {}
): string => {
    const {
        locale = 'en-US',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
        useGrouping = true,
    } = options;

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
    }).format(num);
};

/**
 * Format a number as a percentage
 * @param num - The number to format (0.5 = 50%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (num: number, decimals = 0): string => {
    return `${(num * 100).toFixed(decimals)}%`;
};

/**
 * Abbreviate large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
 * @param num - The number to abbreviate
 * @returns Abbreviated number string
 */
export const abbreviateNumber = (num: number): string => {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
};
