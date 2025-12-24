/**
 * Date formatting utilities
 */

export interface DateFormatOptions {
    locale?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

/**
 * Format a date to a localized string
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDate = (
    date: Date | string | number,
    options: DateFormatOptions = {}
): string => {
    const {
        locale = 'en-US',
        dateStyle = 'medium',
        timeStyle,
    } = options;

    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
        dateStyle,
        timeStyle,
    }).format(dateObj);
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to compare
 * @param locale - The locale to use
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string | number, locale = 'en-US'): string => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(-diffInSeconds, 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
};
