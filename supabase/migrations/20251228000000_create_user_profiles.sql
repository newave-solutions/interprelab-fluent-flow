-- Create User Profiles Extension Table
-- Migration: Extended user data beyond auth.users for InterpreLab platform

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  full_name TEXT,
  bio TEXT CHECK (char_length(bio) <= 500),
  avatar_url TEXT,
  
  -- Professional Details
  certification_status TEXT DEFAULT 'none' CHECK (
    certification_status IN ('none', 'student', 'cmi', 'chi', 'nbcmi_written', 'nbcmi_oral', 'cchi_certified')
  ),
  certification_expiry DATE,
  experience_level TEXT DEFAULT 'student' CHECK (
    experience_level IN ('student', 'entry', 'experienced', 'expert')
  ),
  
  -- Language Pairs (JSONB array of objects)
  -- Example: [{"source": "en", "target": "es", "proficiency": "native", "certified": true}]
  language_pairs JSONB DEFAULT '[]'::jsonb,
  
  -- Medical Specializations (text array)
  -- Example: ['oncology', 'cardiology', 'pediatrics', 'obstetrics']
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Platform Preferences
  timezone TEXT DEFAULT 'America/New_York',
  language_ui TEXT DEFAULT 'en' CHECK (language_ui IN ('en', 'es', 'zh')),
  
  -- Subscription & Credits
  subscription_tier TEXT DEFAULT 'free' CHECK (
    subscription_tier IN ('free', 'paid', 'enterprise')
  ),
  ai_credits_remaining INTEGER DEFAULT 100,
  ai_credits_reset_date DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  
  -- Privacy & Permissions
  profile_public BOOLEAN DEFAULT false,
  opt_out_training BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view public profiles
CREATE POLICY "Anyone can view public profiles"
  ON public.user_profiles FOR SELECT
  USING (profile_public = true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier 
  ON public.user_profiles(subscription_tier);

CREATE INDEX IF NOT EXISTS idx_user_profiles_certification_status 
  ON public.user_profiles(certification_status);

CREATE INDEX IF NOT EXISTS idx_user_profiles_public 
  ON public.user_profiles(profile_public) 
  WHERE profile_public = true;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

-- Function to reset AI credits monthly
CREATE OR REPLACE FUNCTION reset_monthly_ai_credits()
RETURNS void AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    ai_credits_remaining = CASE subscription_tier
      WHEN 'free' THEN 100
      WHEN 'paid' THEN 1000
      WHEN 'enterprise' THEN 10000
    END,
    ai_credits_reset_date = CURRENT_DATE + INTERVAL '30 days'
  WHERE ai_credits_reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_profiles_updated_at TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Extended user profile data for InterpreLab platform with certifications, language pairs, and subscription management';
COMMENT ON COLUMN public.user_profiles.language_pairs IS 'JSON array of language pair objects with source, target, proficiency, and certification status';
COMMENT ON COLUMN public.user_profiles.specializations IS 'Array of medical specialties the interpreter focuses on (oncology, cardiology, etc.)';
COMMENT ON COLUMN public.user_profiles.ai_credits_remaining IS 'Remaining AI generation credits for the current billing period';
COMMENT ON COLUMN public.user_profiles.opt_out_training IS 'User has opted out of AI training data collection';
