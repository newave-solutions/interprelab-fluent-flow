-- Create study_settings table for InterpreStudy preferences
CREATE TABLE IF NOT EXISTS study_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_study_settings_user_id ON study_settings(user_id);

-- Enable Row Level Security
ALTER TABLE study_settings ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read their own settings
CREATE POLICY "Users can view their own study settings"
  ON study_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own settings
CREATE POLICY "Users can insert their own study settings"
  ON study_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own settings
CREATE POLICY "Users can update their own study settings"
  ON study_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own settings
CREATE POLICY "Users can delete their own study settings"
  ON study_settings FOR DELETE
  USING (auth.uid() = user_id);
