-- InterpreStudy Enhanced Content Tables
-- Migration: Create tables for flashcards, scenarios, quiz frameworks, and chat history

-- ==============================================
-- 1. Flashcard Decks
-- ==============================================
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  card_type TEXT NOT NULL CHECK (
    card_type IN ('root-words', 'term-translation', 'term-definition', 'custom')
  ),
  specialty TEXT,
  is_public BOOLEAN DEFAULT false, -- Free users must make public
  cards JSONB NOT NULL, -- Array of flashcard objects
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. Scenario Cache
-- ==============================================
CREATE TABLE IF NOT EXISTS public.scenario_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language_pair TEXT NOT NULL DEFAULT 'en-es',
  scenario_data JSONB NOT NULL,
  -- Example: {"title": "...", "lines": [{"speaker": "doctor", "language": "en", "text": "..."}]}
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. Quiz Frameworks
-- ==============================================
CREATE TABLE IF NOT EXISTS public.quiz_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name TEXT NOT NULL UNIQUE,
  description TEXT,
  structure JSONB NOT NULL,
  -- Example: {
  --   "questionTypes": ["multiple-choice", "matching"],
  --   "sections": [{"name": "terminology", "count": 5}, {"name": "scenario", "count": 5}],
  --   "timeLimit": 600,
  --   "passingScore": 70
  -- }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. Study Chat History (De-personalized)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.study_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT,
  depersonalized_messages JSONB NOT NULL, -- Array of messages with PII removed
  opted_out_training BOOLEAN DEFAULT false,
  session_duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Indexes for Performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user_id ON public.flashcard_decks(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_public ON public.flashcard_decks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_card_type ON public.flashcard_decks(card_type);

CREATE INDEX IF NOT EXISTS idx_scenario_cache_setting ON public.scenario_cache(setting);
CREATE INDEX IF NOT EXISTS idx_scenario_cache_difficulty ON public.scenario_cache(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenario_cache_usage ON public.scenario_cache(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_frameworks_active ON public.quiz_frameworks(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_study_chat_history_user_id ON public.study_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_study_chat_history_opted_out ON public.study_chat_history(opted_out_training);

-- ==============================================
-- Row Level Security
-- ==============================================
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_chat_history ENABLE ROW LEVEL SECURITY;

-- Flashcard Decks Policies
CREATE POLICY "Users can view own flashcard decks"
  ON public.flashcard_decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public flashcard decks"
  ON public.flashcard_decks FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own flashcard decks"
  ON public.flashcard_decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard decks"
  ON public.flashcard_decks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard decks"
  ON public.flashcard_decks FOR DELETE
  USING (auth.uid() = user_id);

-- Scenario Cache Policies
CREATE POLICY "Authenticated users can read scenario cache"
  ON public.scenario_cache FOR SELECT
  TO authenticated
  USING (true);

-- Quiz Frameworks Policies
CREATE POLICY "Authenticated users can read active quiz frameworks"
  ON public.quiz_frameworks FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Study Chat History Policies
CREATE POLICY "Users can view own chat history"
  ON public.study_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON public.study_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- Seed Data: Quiz Frameworks
-- ==============================================
INSERT INTO public.quiz_frameworks (framework_name, description, structure) VALUES
('medical-terminology-basic', 'Basic medical term comprehension for beginners', '{"questionTypes": ["multiple-choice"], "sections": [{"name": "terminology", "count": 10}], "timeLimit": 600, "passingScore": 70}'::jsonb),
('clinical-scenario-intermediate', 'Intermediate clinical scenarios with terminology', '{"questionTypes": ["multiple-choice", "scenario-based"], "sections": [{"name": "scenario", "count": 8}, {"name": "terminology", "count": 7}], "timeLimit": 900, "passingScore": 75}'::jsonb),
('advanced-interpretation', 'Advanced interpretation skills assessment', '{"questionTypes": ["multiple-choice", "scenario-based", "ethics"], "sections": [{"name": "scenario", "count": 5}, {"name": "ethics", "count": 3}, {"name": "cultural", "count": 2}], "timeLimit": 1200, "passingScore": 80}'::jsonb),
('specialty-focused', 'Specialty-specific terminology and scenarios', '{"questionTypes": ["multiple-choice", "matching"], "sections": [{"name": "specialty-terms", "count": 12}, {"name": "matching", "count": 8}], "timeLimit": 800, "passingScore": 75}'::jsonb),
('rapid-recall', 'Quick terminology recall for experienced interpreters', '{"questionTypes": ["multiple-choice"], "sections": [{"name": "rapid", "count": 20}], "timeLimit": 300, "passingScore": 85}'::jsonb),
('comprehensive-assessment', 'Full assessment across all domains', '{"questionTypes": ["multiple-choice", "scenario-based", "ethics", "cultural"], "sections": [{"name": "terminology", "count": 10}, {"name": "scenario", "count": 5}, {"name": "ethics", "count": 3}, {"name": "cultural", "count": 2}], "timeLimit": 1800, "passingScore": 80}'::jsonb)
ON CONFLICT (framework_name) DO UPDATE SET
  description = EXCLUDED.description,
  structure = EXCLUDED.structure,
  is_active = EXCLUDED.is_active;

-- ==============================================
-- Functions for Maintenance
-- ==============================================

-- Function to increment scenario usage
CREATE OR REPLACE FUNCTION increment_scenario_usage(scenario_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.scenario_cache
  SET usage_count = usage_count + 1
  WHERE id = scenario_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment flashcard deck usage
CREATE OR REPLACE FUNCTION increment_flashcard_usage(deck_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.flashcard_decks
  SET usage_count = usage_count + 1
  WHERE id = deck_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- Grant Permissions
-- ==============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flashcard_decks TO authenticated;
GRANT SELECT ON public.scenario_cache TO authenticated;
GRANT SELECT ON public.quiz_frameworks TO authenticated;
GRANT SELECT, INSERT ON public.study_chat_history TO authenticated;
GRANT EXECUTE ON FUNCTION increment_scenario_usage TO authenticated;
GRANT EXECUTE ON FUNCTION increment_flashcard_usage TO authenticated;

-- ==============================================
-- Comments for Documentation
-- ==============================================
COMMENT ON TABLE public.flashcard_decks IS 'User-created flashcard decks with public/private visibility based on subscription tier';
COMMENT ON TABLE public.scenario_cache IS 'Cached practice scenarios for reuse and pattern-based generation';
COMMENT ON TABLE public.quiz_frameworks IS 'Core quiz structures that AI uses to generate consistent assessments';
COMMENT ON TABLE public.study_chat_history IS 'De-personalized study chat conversations for AI training (with user consent)';
