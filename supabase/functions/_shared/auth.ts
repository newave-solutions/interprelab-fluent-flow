import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Verifies user authentication from request and returns authenticated Supabase client
 * @param req - The incoming request object
 * @returns Object containing user and supabaseClient, or error Response
 */
export async function verifyAuth(req: Request): Promise<
    | { user: any; supabaseClient: any; error?: never }
    | { user?: never; supabaseClient?: never; error: Response }
> {
    try {
        // Extract authorization header
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return {
                error: new Response(
                    JSON.stringify({ error: 'Missing authorization header' }),
                    {
                        status: 401,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                )
            };
        }

        // Create Supabase client with service role for initial setup
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

        if (!supabaseUrl || !supabaseAnonKey) {
            return {
                error: new Response(
                    JSON.stringify({ error: 'Supabase configuration missing' }),
                    {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                )
            };
        }

        // Create client with user's JWT from the Authorization header
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: { Authorization: authHeader },
            },
        });

        // Verify the user is authenticated
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            return {
                error: new Response(
                    JSON.stringify({ error: 'Invalid or expired token' }),
                    {
                        status: 401,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    }
                )
            };
        }

        return { user, supabaseClient };
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            error: new Response(
                JSON.stringify({ error: 'Authentication failed' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        };
    }
}

/**
 * Quick auth check that only verifies the token without creating a client
 * Use this when you don't need database access
 */
export async function verifyAuthQuick(req: Request): Promise<{ user: any } | { error: Response }> {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
        return {
            error: new Response(
                JSON.stringify({ error: 'Missing authorization header' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        };
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
        return {
            error: new Response(
                JSON.stringify({ error: 'Supabase configuration missing' }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        };
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error } = await supabaseClient.auth.getUser();

    if (error || !user) {
        return {
            error: new Response(
                JSON.stringify({ error: 'Invalid or expired token' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        };
    }

    return { user };
}
