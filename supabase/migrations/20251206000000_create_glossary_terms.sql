-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    translation TEXT,
    definition TEXT,
    pronunciation TEXT,
    category TEXT,
    subcategory TEXT,
    language_code TEXT,
    source_language TEXT,
    target_language TEXT,
    difficulty_level TEXT,
    usage_example TEXT,
    notes TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own terms
CREATE POLICY "Users can view their own glossary terms" ON glossary_terms
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can view public terms
CREATE POLICY "Users can view public glossary terms" ON glossary_terms
    FOR SELECT
    USING (is_public = true);

-- Users can insert their own terms
CREATE POLICY "Users can insert their own glossary terms" ON glossary_terms
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own terms
CREATE POLICY "Users can update their own glossary terms" ON glossary_terms
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own terms
CREATE POLICY "Users can delete their own glossary terms" ON glossary_terms
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster searching
CREATE INDEX idx_glossary_terms_term ON glossary_terms(term);
CREATE INDEX idx_glossary_terms_user_id ON glossary_terms(user_id);
