-- Create table for custom user flashcards
CREATE TABLE public.user_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  category TEXT DEFAULT 'custom',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_flashcards ENABLE ROW LEVEL SECURITY;

-- Users can view their own flashcards
CREATE POLICY "Users can view own flashcards" ON public.user_flashcards
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own flashcards
CREATE POLICY "Users can create own flashcards" ON public.user_flashcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own flashcards
CREATE POLICY "Users can update own flashcards" ON public.user_flashcards
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own flashcards
CREATE POLICY "Users can delete own flashcards" ON public.user_flashcards
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_flashcards_updated_at
  BEFORE UPDATE ON public.user_flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();