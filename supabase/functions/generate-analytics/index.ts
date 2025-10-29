import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, period = 'month', year, month } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let startDate: string
    let endDate: string

    // Calculate date range based on period
    if (period === 'month' && year && month) {
      startDate = new Date(year, month - 1, 1).toISOString()
      endDate = new Date(year, month, 0, 23, 59, 59).toISOString()
    } else if (period === 'year' && year) {
      startDate = new Date(year, 0, 1).toISOString()
      endDate = new Date(year + 1, 0, 1).toISOString()
    } else if (period === 'week') {
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6))
      startDate = weekStart.toISOString()
      endDate = weekEnd.toISOString()
    } else {
      // Default to current month
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
    }

    // Get call logs for the period
    const { data: callLogs, error: callLogsError } = await supabaseClient
      .from('call_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time', { ascending: false })

    if (callLogsError) {
      throw callLogsError
    }

    // Calculate statistics
    const totalCalls = callLogs.length
    const totalDuration = callLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0)
    const totalEarnings = callLogs.reduce((sum, log) => sum + (log.earnings || 0), 0)
    const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0
    const averageEarnings = totalCalls > 0 ? totalEarnings / totalCalls : 0

    // Group by day for trend analysis
    const dailyStats = callLogs.reduce((acc, log) => {
      const date = new Date(log.start_time).toDateString()
      if (!acc[date]) {
        acc[date] = { calls: 0, duration: 0, earnings: 0 }
      }
      acc[date].calls += 1
      acc[date].duration += log.duration_seconds || 0
      acc[date].earnings += log.earnings || 0
      return acc
    }, {} as Record<string, { calls: number; duration: number; earnings: number }>)

    // Group by language pair
    const languageStats = callLogs.reduce((acc, log) => {
      const lang = log.language_pair || 'Unknown'
      if (!acc[lang]) {
        acc[lang] = { calls: 0, duration: 0, earnings: 0 }
      }
      acc[lang].calls += 1
      acc[lang].duration += log.duration_seconds || 0
      acc[lang].earnings += log.earnings || 0
      return acc
    }, {} as Record<string, { calls: number; duration: number; earnings: number }>)

    // Group by interpretation type
    const typeStats = callLogs.reduce((acc, log) => {
      const type = log.interpretation_type || 'Unknown'
      if (!acc[type]) {
        acc[type] = { calls: 0, duration: 0, earnings: 0 }
      }
      acc[type].calls += 1
      acc[type].duration += log.duration_seconds || 0
      acc[type].earnings += log.earnings || 0
      return acc
    }, {} as Record<string, { calls: number; duration: number; earnings: number }>)

    // Calculate peak hours
    const hourlyStats = callLogs.reduce((acc, log) => {
      const hour = new Date(log.start_time).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const peakHour = Object.entries(hourlyStats).reduce((max, [hour, count]) =>
      count > max.count ? { hour: parseInt(hour), count } : max,
      { hour: 0, count: 0 }
    )

    const analytics = {
      period,
      startDate,
      endDate,
      summary: {
        totalCalls,
        totalDuration,
        totalEarnings,
        averageDuration: Math.round(averageDuration),
        averageEarnings: Math.round(averageEarnings * 100) / 100
      },
      trends: {
        daily: dailyStats,
        languages: languageStats,
        types: typeStats,
        peakHour: peakHour.hour
      },
      recentCalls: callLogs.slice(0, 10) // Last 10 calls
    }

    return new Response(
      JSON.stringify({ success: true, analytics }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

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
