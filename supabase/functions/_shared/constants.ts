/**
 * Shared constants for Supabase edge functions
 */

// AI Model Configuration
export const AI_MODEL = 'google/gemini-2.5-flash';

// API Endpoints
export const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://ggyzlvbtkibqnkfhgnbe.supabase.co';
export const PROCESS_INTERPRECOACH_URL = `${SUPABASE_URL}/functions/v1/process-interprecoach`;
export const GENERATE_INTERPRETER_FEEDBACK_URL = `${SUPABASE_URL}/functions/v1/generate-interpreter-feedback`;
