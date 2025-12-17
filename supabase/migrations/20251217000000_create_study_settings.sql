-- Create study_settings table for storing user study preferences
CREATE TABLE IF NOT EXISTS study_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  specialty TEXT NOT NULL DEFAULT 'medical',
  target_language TEXT NOT NULL DEFAULT 'spanish',
  provider_accent TEXT NOT NULL DEFAULT 'neutral',
  provider_gender TEXT NOT NULL DEFAULT 'any',
  response_time INTEGER NOT NULL DEFAULT 8,
  preferred_vocabulary TEXT DEFAULT '',
  auto_save BOOLEAN NOT NULL DEFAULT true,
  audio_feedback BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_study_settings_user_id ON study_settings(user_id);

-- Enable Row Level Security
ALTER TABLE study_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_settings
CREATE POLICY "Users can view their own study settings"
  ON study_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study settings"
  ON study_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study settings"
  ON study_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON study_settings TO authenticated;

-- Add helpful comments
COMMENT ON TABLE study_settings IS 'Stores user study preferences for InterpreStudy sessions';
COMMENT ON COLUMN study_settings.difficulty IS 'Study difficulty level: beginner, intermediate, advanced, expert';
COMMENT ON COLUMN study_settings.specialty IS 'Field of study: medical, legal, business, education, social-services';
COMMENT ON COLUMN study_settings.target_language IS 'Target language for practice: spanish, french, mandarin, arabic';
COMMENT ON COLUMN study_settings.provider_accent IS 'Provider accent preference: neutral, regional, native, mixed';
COMMENT ON COLUMN study_settings.provider_gender IS 'Provider gender preference: any, male, female';
COMMENT ON COLUMN study_settings.response_time IS 'Maximum response time in seconds (5-15)';
COMMENT ON COLUMN study_settings.preferred_vocabulary IS 'Comma-separated list of preferred vocabulary terms to practice';
COMMENT ON COLUMN study_settings.auto_save IS 'Whether to automatically save study progress';
COMMENT ON COLUMN study_settings.audio_feedback IS 'Whether to provide audio confirmation for correct answers';
