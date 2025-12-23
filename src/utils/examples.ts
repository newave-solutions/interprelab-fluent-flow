/**
 * Example usage of the new utility functions
 * This file demonstrates how to use the utilities from eco-landing-page integration
 */

import { formatCurrency, parseCurrency } from '@/utils/currency';
import { formatDate, getRelativeTime } from '@/utils/date';
import { formatNumber, formatPercentage, abbreviateNumber } from '@/utils/numbers';

// ============================================
// Currency Examples
// ============================================

export const currencyExamples = {
    // Format numbers as currency
    basicCurrency: formatCurrency(1234.56), // "$1,234.56"

    // Different currencies
    euros: formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' }), // "1.234,56 €"

    // Parse currency strings
    parsedValue: parseCurrency('$1,234.56'), // 1234.56
};

// ============================================
// Date Examples
// ============================================

export const dateExamples = {
    // Format dates
    shortDate: formatDate(new Date(), { dateStyle: 'short' }), // "12/20/25"
    mediumDate: formatDate(new Date(), { dateStyle: 'medium' }), // "Dec 20, 2025"
    longDate: formatDate(new Date(), { dateStyle: 'full' }), // "Friday, December 20, 2025"

    // Relative time
    oneHourAgo: getRelativeTime(new Date(Date.now() - 3600000)), // "1 hour ago"
    threeDaysAgo: getRelativeTime(new Date(Date.now() - 3 * 24 * 3600000)), // "3 days ago"
};

// ============================================
// Number Examples
// ============================================

export const numberExamples = {
    // Format large numbers
    formattedNumber: formatNumber(1234567.89), // "1,234,567.89"

    // Format percentages
    percentage: formatPercentage(0.7543, 2), // "75.43%"

    // Abbreviate large numbers
    millions: abbreviateNumber(1500000), // "1.5M"
    thousands: abbreviateNumber(1500), // "1.5K"
    billions: abbreviateNumber(2500000000), // "2.5B"
};

// ============================================
// Real-World Use Cases
// ============================================

// Use in CallTracker component
export const callTrackerExample = {
    totalEarnings: formatCurrency(12543.67), // "$12,543.67"
    callDuration: formatNumber(3.5) + ' hours',
    lastCallTime: getRelativeTime(new Date(Date.now() - 1800000)), // "30 minutes ago"
};

// Use in Dashboard component
export const dashboardExample = {
    totalCalls: abbreviateNumber(15420), // "15.4K"
    successRate: formatPercentage(0.943, 1), // "94.3%"
    revenue: formatCurrency(45678.90), // "$45,678.90"
    lastUpdated: getRelativeTime(new Date(Date.now() - 300000)), // "5 minutes ago"
};

// Use in InterpreTrack component
export const interpreTrackExample = {
    weeklyHours: formatNumber(37.5, { maximumFractionDigits: 1 }), // "37.5"
    averageRate: formatCurrency(65, { minimumFractionDigits: 0 }), // "$65"
    totalMinutes: abbreviateNumber(125000), // "125K"
    efficiency: formatPercentage(0.87, 0), // "87%"
};

console.log('💡 Utility Examples Loaded:', {
    currencyExamples,
    dateExamples,
    numberExamples,
    callTrackerExample,
    dashboardExample,
    interpreTrackExample,
});
