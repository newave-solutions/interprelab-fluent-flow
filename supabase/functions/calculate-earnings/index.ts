import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'supabase'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { callLogId, userId, durationSeconds } = await req.json()

    if (!callLogId || !userId || !durationSeconds) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user settings for pay rate
    const { data: userSettings, error: settingsError } = await supabaseClient
      .from('user_settings')
      .select('pay_rate, pay_rate_type, preferred_currency')
      .eq('user_id', userId)
      .single()

    if (settingsError || !userSettings) {
      return new Response(
        JSON.stringify({ error: 'User settings not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate earnings based on pay rate type
    let earnings = 0
    if (userSettings.pay_rate_type === 'per_hour') {
      earnings = (durationSeconds / 3600) * userSettings.pay_rate
    } else if (userSettings.pay_rate_type === 'per_minute') {
      earnings = (durationSeconds / 60) * userSettings.pay_rate
    }

    // Round to 2 decimal places
    earnings = Math.round(earnings * 100) / 100

    // Update the call log with calculated earnings
    const { data: updatedCallLog, error: updateError } = await supabaseClient
      .from('call_logs')
      .update({
        earnings,
        currency: userSettings.preferred_currency,
        duration_seconds: durationSeconds
      })
      .eq('id', callLogId)
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update call log' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        earnings,
        currency: userSettings.preferred_currency,
        callLog: updatedCallLog
      }),
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
