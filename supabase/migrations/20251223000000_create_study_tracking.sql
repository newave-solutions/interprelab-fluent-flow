-- Study Progress Tracking System
-- Migration: Create tables for quiz scores, sessions tracking, and enhanced glossary

-- NOTE: study_progress table already exists from migration 20251204070043
-- Skipping duplicate table creation

-- Quiz Scores Table
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id TEXT NOT NULL,
  specialty TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  questions_data JSONB DEFAULT '[]'::jsonb, -- Store individual question responses
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTE: glossary_terms table already exists from migration 20251206000000
-- Skipping duplicate table creation to avoid schema conflicts

-- Study Sessions Table (for tracking study time)
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id TEXT,
  session_type TEXT NOT NULL CHECK (session_type IN ('lesson', 'quiz', 'practice', 'review')),
  duration_seconds INTEGER NOT NULL,
  activities_completed INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Learning Streaks Table
CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  total_study_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance (skip study_progress indexes since table structure may differ)

CREATE INDEX IF NOT EXISTS idx_quiz_scores_user_id ON quiz_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_specialty ON quiz_scores(specialty);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_created_at ON quiz_scores(created_at DESC);

-- Note: glossary_terms indexes and RLS already handled in migration 20251206000000
-- Skipping to avoid conflicts with different table schema

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_streaks_user_id ON learning_streaks(user_id);

-- Row Level Security Policies
-- Note: glossary_terms RLS already handled in earlier migration
ALTER TABLE IF EXISTS quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS learning_streaks ENABLE ROW LEVEL SECURITY;

-- Quiz Scores Policies
DROP POLICY IF EXISTS "Users can view own quiz scores" ON quiz_scores;
CREATE POLICY "Users can view own quiz scores" 
  ON quiz_scores FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz scores" ON quiz_scores;
CREATE POLICY "Users can insert own quiz scores" 
  ON quiz_scores FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Study Sessions Policies
DROP POLICY IF EXISTS "Users can view own study sessions" ON study_sessions;
CREATE POLICY "Users can view own study sessions" 
  ON study_sessions FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study sessions" ON study_sessions;
CREATE POLICY "Users can insert own study sessions" 
  ON study_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Learning Streaks Policies
DROP POLICY IF EXISTS "Users can view own learning streaks" ON learning_streaks;
CREATE POLICY "Users can view own learning streaks" 
  ON learning_streaks FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own learning streaks" ON learning_streaks;
CREATE POLICY "Users can insert own learning streaks" 
  ON learning_streaks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own learning streaks" ON learning_streaks;
CREATE POLICY "Users can update own learning streaks" 
  ON learning_streaks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_study_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_glossary_terms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_learning_streaks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_study_progress_timestamp
  BEFORE UPDATE ON study_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_study_progress_timestamp();

CREATE TRIGGER trigger_update_glossary_terms_timestamp
  BEFORE UPDATE ON glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION update_glossary_terms_timestamp();

CREATE TRIGGER trigger_update_learning_streaks_timestamp
  BEFORE UPDATE ON learning_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_streaks_timestamp();

-- Function to calculate and update learning streaks
CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
  user_streak RECORD;
  days_diff INTEGER;
BEGIN
  -- Get current streak data
  SELECT * INTO user_streak
  FROM learning_streaks
  WHERE user_id = NEW.user_id;

  -- If no streak record exists, create one
  IF user_streak IS NULL THEN
    INSERT INTO learning_streaks (user_id, current_streak_days, longest_streak_days, last_activity_date, total_study_days)
    VALUES (NEW.user_id, 1, 1, CURRENT_DATE, 1);
    RETURN NEW;
  END IF;

  -- Calculate days difference
  days_diff := CURRENT_DATE - user_streak.last_activity_date;

  -- Update streak logic
  IF days_diff = 0 THEN
    -- Same day activity, no change to streak
    RETURN NEW;
  ELSIF days_diff = 1 THEN
    -- Consecutive day, increment streak
    UPDATE learning_streaks
    SET 
      current_streak_days = user_streak.current_streak_days + 1,
      longest_streak_days = GREATEST(user_streak.longest_streak_days, user_streak.current_streak_days + 1),
      last_activity_date = CURRENT_DATE,
      total_study_days = user_streak.total_study_days + 1
    WHERE user_id = NEW.user_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE learning_streaks
    SET 
      current_streak_days = 1,
      last_activity_date = CURRENT_DATE,
      total_study_days = user_streak.total_study_days + 1
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update learning streaks on study activity
CREATE TRIGGER trigger_update_learning_streak
  AFTER INSERT ON study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_streak();

-- Comments for documentation
COMMENT ON TABLE study_progress IS 'Tracks user progress through study modules including lessons, quizzes, and scenarios';
COMMENT ON TABLE quiz_scores IS 'Stores detailed quiz attempt results with questions and answers';
COMMENT ON TABLE glossary_terms IS 'User-managed medical terminology glossary with review tracking';
COMMENT ON TABLE study_sessions IS 'Logs individual study sessions for activity tracking and analytics';
COMMENT ON TABLE learning_streaks IS 'Tracks daily study streaks and engagement metrics';
