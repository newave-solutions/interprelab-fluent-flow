-- InterpreCoach Content and Logging Tables
-- Migration: Create tables for medical terms, medications, and session tracking

-- ==============================================
-- 1. Medical Terms Database
-- ==============================================
CREATE TABLE IF NOT EXISTS public.medical_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  translation_spanish TEXT,
  translation_chinese TEXT,
  phonetic_pronunciation TEXT,
  category TEXT NOT NULL, -- 'cardiology', 'oncology', 'respiratory', etc.
  aliases TEXT[], -- Alternative terms or common misspellings
  usage_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(term, category)
);

-- ==============================================
-- 2. Medications Database
-- ==============================================
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generic_name TEXT NOT NULL UNIQUE,
  brand_names TEXT[], -- Array of brand names
  aliases TEXT[], -- Common misspellings, abbreviations
  category TEXT, -- 'antihypertensive', 'antibiotic', 'analgesic', etc.
  common_dosages TEXT[],
  pronunciation TEXT,
  spanish_translation TEXT,
 chinese_translation TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. Terminology Lookup Log
-- ==============================================
CREATE TABLE IF NOT EXISTS public.terminology_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  ai_suggestion TEXT,
  user_chose_custom BOOLEAN DEFAULT false,
  custom_translation TEXT,
  context TEXT,
  language_pair TEXT DEFAULT 'en-es',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. Session Transcriptions (De-personalized)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.session_transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT, -- 'clinic', 'hospital', 'telehealth'
  specialty TEXT,
  depersonalized_transcript TEXT NOT NULL,
  duration_seconds INTEGER,
  highlighted_terms TEXT[], -- Medical terms detected
  ai_insights JSONB, -- Generated highlights and summaries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 5. AI Content Log (For Monitoring & Quality)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.ai_content_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  function_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  input_data JSONB,
  output_data JSONB,
  model_used TEXT,
  processing_time_ms INTEGER,
  flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  user_feedback TEXT CHECK (user_feedback IN ('thumbs_up', 'thumbs_down', NULL)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Indexes for Performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_medical_terms_term ON public.medical_terms(term);
CREATE INDEX IF NOT EXISTS idx_medical_terms_category ON public.medical_terms(category);
CREATE INDEX IF NOT EXISTS idx_medical_terms_usage ON public.medical_terms(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_medications_generic ON public.medications(generic_name);
CREATE INDEX IF NOT EXISTS idx_medications_category ON public.medications(category);

CREATE INDEX IF NOT EXISTS idx_terminology_lookups_user_id ON public.terminology_lookups(user_id);
CREATE INDEX IF NOT EXISTS idx_terminology_lookups_created_at ON public.terminology_lookups(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_transcriptions_user_id ON public.session_transcriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_transcriptions_specialty ON public.session_transcriptions(specialty);

CREATE INDEX IF NOT EXISTS idx_ai_content_log_flagged ON public.ai_content_log(flagged) WHERE flagged = true;
CREATE INDEX IF NOT EXISTS idx_ai_content_log_function ON public.ai_content_log(function_name);
CREATE INDEX IF NOT EXISTS idx_ai_content_log_created_at ON public.ai_content_log(created_at DESC);

-- ==============================================
-- Row Level Security
-- ==============================================
ALTER TABLE public.medical_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminology_lookups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_content_log ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read medical terms and medications
CREATE POLICY "Authenticated users can read medical terms"
  ON public.medical_terms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read medications"
  ON public.medications FOR SELECT
  TO authenticated
  USING (true);

-- Users can view their own logs
CREATE POLICY "Users can view own terminology lookups"
  ON public.terminology_lookups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own terminology lookups"
  ON public.terminology_lookups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own session transcriptions"
  ON public.session_transcriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session transcriptions"
  ON public.session_transcriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own AI content log"
  ON public.ai_content_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert AI content log"
  ON public.ai_content_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI content feedback"
  ON public.ai_content_log FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- Functions for Maintenance
-- ==============================================

-- Function to increment usage count for medical terms
CREATE OR REPLACE FUNCTION increment_medical_term_usage(term_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.medical_terms
  SET usage_count = usage_count + 1
  WHERE id = term_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage count for medications
CREATE OR REPLACE FUNCTION increment_medication_usage(medication_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.medications
  SET usage_count = usage_count + 1
  WHERE id = medication_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- Grant Permissions
-- ==============================================
GRANT SELECT ON public.medical_terms TO authenticated;
GRANT SELECT ON public.medications TO authenticated;
GRANT SELECT, INSERT ON public.terminology_lookups TO authenticated;
GRANT SELECT, INSERT ON public.session_transcriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ai_content_log TO authenticated;
GRANT EXECUTE ON FUNCTION increment_medical_term_usage TO authenticated;
GRANT EXECUTE ON FUNCTION increment_medication_usage TO authenticated;

-- ==============================================
-- Comments for Documentation
-- ==============================================
COMMENT ON TABLE public.medical_terms IS 'Comprehensive medical terminology database for InterpreCoach real-time assistance';
COMMENT ON TABLE public.medications IS 'Medication database with generic names, brand names, and aliases for lookup';
COMMENT ON TABLE public.terminology_lookups IS 'Log of all terminology lookups for personalization and analytics';
COMMENT ON TABLE public.session_transcriptions IS 'De-personalized session transcripts for training and scenario generation';
COMMENT ON TABLE public.ai_content_log IS 'Comprehensive log of all AI-generated content for monitoring and quality assurance';
