-- InterpreTest Assessment System
-- Migration: Create tables for AI-powered assessment tracking

-- Assessment Sessions Table
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  composite_score INTEGER CHECK (composite_score >= 0 AND composite_score <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  ai_report TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Scores by Module
CREATE TABLE IF NOT EXISTS assessment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('voice', 'syntax', 'vocab', 'cultural', 'ethics', 'typing')),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  raw_data JSONB DEFAULT '{}'::jsonb,
  ai_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Typing Test Results
CREATE TABLE IF NOT EXISTS typing_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE NOT NULL,
  text_written TEXT NOT NULL,
  wpm INTEGER, -- Words per minute
  accuracy_percentage DECIMAL(5,2),
  error_count INTEGER DEFAULT 0,
  duration_seconds INTEGER NOT NULL,
  grammar_score INTEGER CHECK (grammar_score >= 0 AND grammar_score <= 100),
  coherence_score INTEGER CHECK (coherence_score >= 0 AND coherence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Recording Metadata (Optional)
CREATE TABLE IF NOT EXISTS assessment_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE NOT NULL,
  audio_url TEXT,
  transcript TEXT,
  duration_seconds INTEGER,
  clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 100),
  pacing_score INTEGER CHECK (pacing_score >= 0 AND pacing_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_session_id ON assessment_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_module_type ON assessment_scores(module_type);
CREATE INDEX IF NOT EXISTS idx_typing_test_session_id ON typing_test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_audio_session_id ON assessment_audio(session_id);

-- Row Level Security Policies
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_audio ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own assessment sessions" 
  ON assessment_sessions FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own assessment sessions" 
  ON assessment_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own assessment sessions" 
  ON assessment_sessions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can view scores for their own sessions
CREATE POLICY "Users can view own assessment scores" 
  ON assessment_scores FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can insert scores for their own sessions
CREATE POLICY "Users can insert own assessment scores" 
  ON assessment_scores FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can view their own typing test results
CREATE POLICY "Users can view own typing test results" 
  ON typing_test_results FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own typing test results
CREATE POLICY "Users can insert own typing test results" 
  ON typing_test_results FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can view their own audio recordings
CREATE POLICY "Users can view own assessment audio" 
  ON assessment_audio FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own audio recordings
CREATE POLICY "Users can insert own assessment audio" 
  ON assessment_audio FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT id FROM assessment_sessions WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessment_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_assessment_sessions_updated_at
  BEFORE UPDATE ON assessment_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_assessment_session_updated_at();

-- Comment on tables
COMMENT ON TABLE assessment_sessions IS 'Stores InterpreTest assessment sessions with overall scores and completion status';
COMMENT ON TABLE assessment_scores IS 'Stores individual module scores (voice, syntax, vocab, cultural, ethics, typing) for each assessment session';
COMMENT ON TABLE typing_test_results IS 'Stores detailed typing test metrics including WPM, accuracy, and grammar scores';
COMMENT ON TABLE assessment_audio IS 'Stores metadata for voice recording assessments including transcripts and quality scores';
