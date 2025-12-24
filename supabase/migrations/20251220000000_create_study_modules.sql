-- Create study_modules table for InterpreStudy learning modules
-- This table stores the structured learning modules for medical interpreter training

CREATE TABLE IF NOT EXISTS public.study_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    content JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_modules_category ON public.study_modules(category);
CREATE INDEX IF NOT EXISTS idx_study_modules_order ON public.study_modules(order_index);
CREATE INDEX IF NOT EXISTS idx_study_modules_active ON public.study_modules(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.study_modules ENABLE ROW LEVEL SECURITY;

-- Create policies for study_modules
CREATE POLICY "Allow public read access to active modules"
    ON public.study_modules
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow authenticated users to read all modules"
    ON public.study_modules
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert sample data for Reproductive Systems modules
INSERT INTO public.study_modules (module_id, title, description, category, icon, order_index, is_active) VALUES
    ('male-reproductive', 'Male Reproductive System', 'Anatomy, Spermatogenesis, and Pathology.', 'reproductive-systems', 'mars', 1, true),
    ('female-reproductive', 'Female Reproductive System', 'Gestation, Hormonal Cycles, and Anatomy.', 'reproductive-systems', 'venus', 2, true),
    ('obstetrics-neonatal', 'Obstetrics & Neonatal', 'Labor stages, Fertilization, and Care.', 'reproductive-systems', 'baby-carriage', 3, true)
ON CONFLICT (module_id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    is_active = EXCLUDED.is_active;

-- Add comment to table
COMMENT ON TABLE public.study_modules IS 'Stores structured learning modules for InterpreStudy medical interpreter training';
COMMENT ON COLUMN public.study_modules.module_id IS 'Unique identifier for the module (slug format)';
COMMENT ON COLUMN public.study_modules.category IS 'Category grouping (e.g., reproductive-systems, cardiovascular, etc.)';
COMMENT ON COLUMN public.study_modules.content IS 'Structured content in JSON format for slides, quizzes, etc.';
COMMENT ON COLUMN public.study_modules.order_index IS 'Display order within category';
