-- Create learning_stats table for tracking user learning progress
CREATE TABLE public.learning_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  study_hours NUMERIC NOT NULL DEFAULT 0,
  terms_learned INTEGER NOT NULL DEFAULT 0,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  scenarios_practiced INTEGER NOT NULL DEFAULT 0,
  bot_conversations INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.learning_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own learning stats"
ON public.learning_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning stats"
ON public.learning_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning stats"
ON public.learning_stats FOR UPDATE
USING (auth.uid() = user_id);

-- Create posts table for InterpreLink
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  tags TEXT[],
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- Create study_modules table for module definitions
CREATE TABLE public.study_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, admin write)
ALTER TABLE public.study_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active modules"
ON public.study_modules FOR SELECT
USING (is_active = true);

-- Create study_progress table for user progress tracking
CREATE TABLE public.study_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id TEXT NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  slides_completed INTEGER NOT NULL DEFAULT 0,
  quizzes_passed INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);

-- Enable RLS
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_progress
CREATE POLICY "Users can view their own progress"
ON public.study_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.study_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.study_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_learning_stats_updated_at
BEFORE UPDATE ON public.learning_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_progress_updated_at
BEFORE UPDATE ON public.study_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default study modules
INSERT INTO public.study_modules (module_id, title, description, category, icon, order_index, content) VALUES
('male-reproductive', 'Male Reproductive System', 'Anatomy, Spermatogenesis, and Pathology of the male reproductive system.', 'reproductive-systems', 'mars', 1, '{"slides": ["male-intro", "male-anatomy", "male-quiz", "male-complete"]}'::jsonb),
('female-reproductive', 'Female Reproductive System', 'Gestation, Hormonal Cycles, and Anatomy of the female reproductive system.', 'reproductive-systems', 'venus', 2, '{"slides": ["female-intro", "female-anatomy", "female-quiz", "female-complete"]}'::jsonb),
('obstetrics-neonatal', 'Obstetrics & Neonatal', 'Labor stages, Fertilization, and Neonatal Care terminology.', 'reproductive-systems', 'baby-carriage', 3, '{"slides": ["ob-intro", "ob-stages", "ob-quiz", "ob-complete"]}'::jsonb);