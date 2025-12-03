-- Create table for platform rate configurations
CREATE TABLE IF NOT EXISTS public.platform_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  rate_per_minute NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform_name)
);

-- Create table for user goals
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('daily_earnings', 'monthly_earnings', 'call_duration', 'call_count', 'platform_specific')),
  target_amount NUMERIC NOT NULL,
  target_currency TEXT DEFAULT 'USD',
  target_period TEXT NOT NULL CHECK (target_period IN ('daily', 'weekly', 'monthly', 'yearly')),
  platform_name TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for AI-generated insights
CREATE TABLE IF NOT EXISTS public.user_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('earnings_optimization', 'productivity_pattern', 'platform_comparison', 'goal_progress', 'recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add platform field to call_logs table
ALTER TABLE public.call_logs 
ADD COLUMN IF NOT EXISTS platform_name TEXT,
ADD COLUMN IF NOT EXISTS is_imported BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS import_source TEXT;

-- Enable RLS
ALTER TABLE public.platform_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_rates
CREATE POLICY "Users can view their own platform rates"
ON public.platform_rates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform rates"
ON public.platform_rates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform rates"
ON public.platform_rates FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform rates"
ON public.platform_rates FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view their own goals"
ON public.user_goals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
ON public.user_goals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
ON public.user_goals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
ON public.user_goals FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_insights
CREATE POLICY "Users can view their own insights"
ON public.user_insights FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
ON public.user_insights FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
ON public.user_insights FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_platform_rates_updated_at
BEFORE UPDATE ON public.platform_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();