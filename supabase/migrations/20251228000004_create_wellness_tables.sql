-- InterpreWellness Minimal Logging Tables
-- Migration: Create tables for emotional wellness tracking and support

-- ==============================================
-- 1. Wellness Check-ins
-- ==============================================
CREATE TABLE IF NOT EXISTS public.wellness_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5), -- 1=very poor, 5=excellent
  stress_level TEXT CHECK (stress_level IN ('low', 'moderate', 'high')),
  burnout_indicators JSONB, -- Specific indicators detected
  -- Example: {"emotional_exhaustion": true, "depersonalization": false, "reduced_accomplishment": true}
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. Debriefing Responses (Backend Only)
-- ==============================================
CREATE TABLE IF NOT EXISTS public.debriefing_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  ai_analysis TEXT,
  sentiment_score INTEGER CHECK (sentiment_score >= -10 AND sentiment_score <= 10), -- Negative to positive
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. Coping Strategies Library
-- ==============================================
CREATE TABLE IF NOT EXISTS public.coping_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_text TEXT NOT NULL,
  category TEXT CHECK (
    category IN ('breathing', 'mindfulness', 'social-support', 'physical', 'cognitive', 'creative')
  ),
  effectiveness_rating DECIMAL(3,2) DEFAULT 0.00, -- Average user rating 0-5
  usage_count INTEGER DEFAULT 0,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. User Wellness Preferences
-- ==============================================
CREATE TABLE IF NOT EXISTS public.wellness_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_frequency TEXT DEFAULT 'weekly' CHECK (
    checkin_frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'manual')
  ),
  preferred_intervention TEXT DEFAULT 'gentle' CHECK (
    preferred_intervention IN ('minimal', 'gentle', 'proactive')
  ),
  last_checkin_prompt DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Indexes for Performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_wellness_checkins_user_id ON public.wellness_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_checkins_created_at ON public.wellness_checkins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_checkins_stress ON public.wellness_checkins(stress_level);

CREATE INDEX IF NOT EXISTS idx_debriefing_responses_user_id ON public.debriefing_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_debriefing_responses_sentiment ON public.debriefing_responses(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_debriefing_responses_created_at ON public.debriefing_responses(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coping_strategies_category ON public.coping_strategies(category);
CREATE INDEX IF NOT EXISTS idx_coping_strategies_rating ON public.coping_strategies(effectiveness_rating DESC);

-- ==============================================
-- Row Level Security
-- ==============================================
ALTER TABLE public.wellness_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debriefing_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coping_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_preferences ENABLE ROW LEVEL SECURITY;

-- Wellness Check-ins Policies
CREATE POLICY "Users can view own wellness checkins"
  ON public.wellness_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness checkins"
  ON public.wellness_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Debriefing Responses Policies (Backend only - very restrictive)
CREATE POLICY "Users can view own debriefing responses"
  ON public.debriefing_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debriefing responses"
  ON public.debriefing_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Coping Strategies Policies
CREATE POLICY "Authenticated users can read coping strategies"
  ON public.coping_strategies FOR SELECT
  TO authenticated
  USING (true);

-- Wellness Preferences Policies
CREATE POLICY "Users can view own wellness preferences"
  ON public.wellness_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness preferences"
  ON public.wellness_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness preferences"
  ON public.wellness_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- Functions for Analytics
-- ==============================================

-- Function to calculate wellness trends (for backend analytics)
CREATE OR REPLACE FUNCTION get_wellness_trend(p_user_id UUID, days INTEGER DEFAULT 30)
RETURNS TABLE(
  average_mood DECIMAL,
  average_stress DECIMAL,
  checkin_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    AVG(mood_score)::DECIMAL,
    AVG(CASE stress_level 
      WHEN 'low' THEN 1
      WHEN 'moderate' THEN 2
      WHEN 'high' THEN 3
    END)::DECIMAL,
    COUNT(*)::INTEGER
  FROM public.wellness_checkins
  WHERE user_id = p_user_id
    AND created_at >= NOW() - (days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- Seed Data: Common Coping Strategies
-- ==============================================
INSERT INTO public.coping_strategies (strategy_text, category) VALUES
('Take 5 deep breaths, inhaling for 4 counts and exhaling for 6 counts', 'breathing'),
('Practice 5-minute mindfulness meditation focusing on present sensations', 'mindfulness'),
('Reach out to a trusted colleague or friend for support', 'social-support'),
('Take a 10-minute walk outside to clear your mind', 'physical'),
('Write down three things that went well today', 'cognitive'),
('Listen to calming music for 10 minutes', 'creative'),
('Use progressive muscle relaxation before bed', 'physical'),
('Reframe negative thoughts with evidence-based alternatives', 'cognitive')
ON CONFLICT DO NOTHING;

-- ==============================================
-- Grant Permissions
-- ==============================================
GRANT SELECT, INSERT ON public.wellness_checkins TO authenticated;
GRANT SELECT, INSERT ON public.debriefing_responses TO authenticated;
GRANT SELECT ON public.coping_strategies TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.wellness_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION get_wellness_trend TO authenticated;

-- ==============================================
-- Comments for Documentation
-- ==============================================
COMMENT ON TABLE public.wellness_checkins IS 'Minimal emotional wellness check-ins for trend analysis and support';
COMMENT ON TABLE public.debriefing_responses IS 'De-personalized debriefing questionnaire responses for backend analytics only';
COMMENT ON TABLE public.coping_strategies IS 'Library of evidence-based coping strategies for interpreter wellness';
COMMENT ON TABLE public.wellness_preferences IS 'User preferences for check-in frequency and intervention style';
