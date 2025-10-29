import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";
import { Tables } from "../../integrations/supabase/types"; // Assuming this path is correct

// Type definition for a call log from the database
type CallLog = Tables<'call_logs'>;

/**
 * Calculates the start and end date for a given period.
 * @param period - The time period ('month', 'year', 'week', 'last30days').
 * @param year - The target year (optional).
 * @param month - The target month (1-12, optional).
 * @returns An object with `startDate` and `endDate` as ISO strings.
 */
function getDateRange(period: string, year?: number, month?: number): { startDate: string; endDate: string } {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'year':
      const targetYear = year || now.getFullYear();
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
      break;
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      startDate = weekStart;
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last30days':
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
    default:
      const y = year || now.getFullYear();
      const m = (month ? month - 1 : now.getMonth());
      startDate = new Date(y, m, 1);
      endDate = new Date(y, m + 1, 0, 23, 59, 59, 999);
  }

  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

/**
 * Parses and validates the request body.
 * @param req The incoming request object.
 * @returns An object containing userId, period, year, and month.
 * @throws {Error} If required parameters are missing.
 */
async function validateAndParseRequest(req: Request) {
  const { userId, period = 'month', year, month } = await req.json();

  if (!userId) {
    throw new Error('User ID is required');
  }
  return { userId, period, year, month };
}

/**
 * Fetches call logs for a given user within a specified date range.
 * @param supabaseClient The Supabase client instance.
 * @param userId The ID of the user.
 * @param startDate The start date of the period (ISO string).
 * @param endDate The end date of the period (ISO string).
 * @returns An array of call logs.
 * @throws {Error} If there's an error fetching call logs.
 */
async function fetchCallLogs(supabaseClient: any, userId: string, startDate: string, endDate: string): Promise<CallLog[]> {
  const { data: callLogs, error: callLogsError } = await supabaseClient
    .from('call_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .order('start_time', { ascending: false });

  if (callLogsError) {
    throw callLogsError;
  }
  return callLogs || [];
}

/**
 * Calculates summary statistics from a list of call logs.
 */
function calculateSummaryStats(callLogs: CallLog[]) {
  const totalCalls = callLogs.length;
  const totalDuration = callLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
  const totalEarnings = callLogs.reduce((sum, log) => sum + (log.earnings || 0), 0);
  const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;
  const averageEarnings = totalCalls > 0 ? totalEarnings / totalCalls : 0;

  return {
    totalCalls,
    totalDuration,
    totalEarnings,
    averageDuration: Math.round(averageDuration),
    averageEarnings: Math.round(averageEarnings * 100) / 100,
  };
}

/**
 * Groups call logs by day.
 */
function groupDailyStats(callLogs: CallLog[]) {
  return callLogs.reduce((acc, log) => {
    const date = new Date(log.start_time).toDateString();
    if (!acc[date]) {
      acc[date] = { calls: 0, duration: 0, earnings: 0 };
    }
    acc[date].calls += 1;
    acc[date].duration += log.duration_seconds || 0;
    acc[date].earnings += log.earnings || 0;
    return acc;
  }, {} as Record<string, { calls: number; duration: number; earnings: number }>);
}

/**
 * Groups call logs by language pair.
 */
function groupLanguageStats(callLogs: CallLog[]) {
  return callLogs.reduce((acc, log) => {
    const lang = log.language_pair || 'Unknown';
    if (!acc[lang]) {
      acc[lang] = { calls: 0, duration: 0, earnings: 0 };
    }
    acc[lang].calls += 1;
    acc[lang].duration += log.duration_seconds || 0;
    acc[lang].earnings += log.earnings || 0;
    return acc;
  }, {} as Record<string, { calls: number; duration: number; earnings: number }>);
}

/**
 * Groups call logs by interpretation type.
 */
function groupTypeStats(callLogs: CallLog[]) {
  return callLogs.reduce((acc, log) => {
    const type = log.interpretation_type || 'Unknown';
    if (!acc[type]) {
      acc[type] = { calls: 0, duration: 0, earnings: 0 };
    }
    acc[type].calls += 1;
    acc[type].duration += log.duration_seconds || 0;
    acc[type].earnings += log.earnings || 0;
    return acc;
  }, {} as Record<string, { calls: number; duration: number; earnings: number }>);
}

/**
 * Calculates the peak hour for calls.
 */
function calculatePeakHour(callLogs: CallLog[]): number {
  const hourlyStats = callLogs.reduce((acc, log) => {
    const hour = new Date(log.start_time).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const peakHour = Object.entries(hourlyStats).reduce((max, [hour, count]) => {
    const hourNum = parseInt(hour);
    const countNum = count as number;
    return countNum > max.count ? { hour: hourNum, count: countNum } : max;
  }, { hour: 0, count: 0 });
  return peakHour.hour;
}

/**
 * Finds the top client by total earnings from a list of call logs.
 * @returns An object with the top client's name and their total earnings, or null if no client data is available.
 */
function calculateTopClient(callLogs: CallLog[]): { name: string; earnings: number } | null {
  const clientEarnings = callLogs.reduce((acc, log) => {
    // Only consider logs with a client name and earnings
    if (log.client_name && log.earnings) {
      acc[log.client_name] = (acc[log.client_name] || 0) + log.earnings;
    }
    return acc;
  }, {} as Record<string, number>);

  // Find the client with the maximum earnings
  const topClient = Object.entries(clientEarnings).reduce(
    (max, [name, earnings]) => {
      const earningsNum = earnings as number;
      return earningsNum > max.earnings ? { name, earnings: earningsNum } : max;
    },
    { name: '', earnings: 0 }
  );

  // Return null if no client with earnings was found
  if (!topClient.name) {
    return null;
  }

  return {
    name: topClient.name,
    earnings: Math.round(topClient.earnings * 100) / 100,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, period, year, month } = await validateAndParseRequest(req);

    const { startDate, endDate } = getDateRange(period, year, month);

    // Get call logs for the period
    const callLogs = await fetchCallLogs(supabaseClient, userId, startDate, endDate);

    // Calculate statistics
    const summary = calculateSummaryStats(callLogs);
    const dailyStats = groupDailyStats(callLogs);
    const languageStats = groupLanguageStats(callLogs);
    const typeStats = groupTypeStats(callLogs);
    const peakHour = calculatePeakHour(callLogs);
    const topClient = calculateTopClient(callLogs);

    const analytics = {
      period,
      startDate,
      endDate,
      summary,
      trends: {
        daily: dailyStats,
        languages: languageStats,
        types: typeStats,
        peakHour,
        topClient,
      },
      recentCalls: callLogs.slice(0, 10) // Last 10 calls
    };

    return new Response(
      JSON.stringify({ success: true, analytics }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Define interfaces for better type safety and readability
interface AnalyticsSummary {
  totalCalls: number;
  totalDuration: number;
  totalEarnings: number;
  averageDuration: number;
  averageEarnings: number;
}

interface DailyStats {
  [date: string]: { calls: number; duration: number; earnings: number };
}

interface LanguageStats {
  [language: string]: { calls: number; duration: number; earnings: number };
}

interface TypeStats {
  [type: string]: { calls: number; duration: number; earnings: number };
}

// Note: AnalyticsResponse interface is implicitly defined by the return structure
// of the main serve function, but could be explicitly defined if needed elsewhere.
