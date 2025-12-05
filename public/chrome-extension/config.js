/**
 * Configuration constants for InterpreCoach Chrome Extension
 */

// API Endpoints - These should be configured via extension options in production
const SUPABASE_URL = 'https://ggyzlvbtkibqnkfhgnbe.supabase.co';

const API_ENDPOINTS = {
  PROCESS_INTERPRECOACH: `${SUPABASE_URL}/functions/v1/process-interprecoach`,
  GENERATE_INTERPRETER_FEEDBACK: `${SUPABASE_URL}/functions/v1/generate-interpreter-feedback`
};
