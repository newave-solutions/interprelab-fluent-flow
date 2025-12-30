-- InterpreTest Content Libraries
-- Migration: Create tables for test questions, scenarios, and grading rubrics

-- ==============================================
-- 1. Grammar Questions Bank
-- ==============================================
CREATE TABLE IF NOT EXISTS public.grammar_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL CHECK (jsonb_array_length(options) = 4),
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  language_pair TEXT NOT NULL DEFAULT 'en-es',
  grammar_rule TEXT, -- e.g., "subject-verb agreement", "tense consistency"
  is_ai_generated BOOLEAN DEFAULT true,
  approved BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. Ethics Dilemma Library
-- ==============================================
CREATE TABLE IF NOT EXISTS public.ethics_dilemmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  scenario TEXT NOT NULL,
  dilemma_type TEXT NOT NULL CHECK (
    dilemma_type IN ('confidentiality', 'impartiality', 'advocacy', 'accuracy', 'professional-boundaries')
  ),
  options JSONB NOT NULL CHECK (jsonb_array_length(options) >= 2),
  correct_option_index INTEGER NOT NULL,
  ncihc_standard TEXT, -- Reference to NCIHC standard
  chia_standard TEXT, -- Reference to CHIA standard
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  usage_count INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 3. Cultural Scenarios Bank
-- ==============================================
CREATE TABLE IF NOT EXISTS public.cultural_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_text TEXT NOT NULL,
  source_culture TEXT NOT NULL,
  target_culture TEXT NOT NULL,
  expected_adaptation JSONB NOT NULL,
  -- Example: {"adaptations": ["use formal register", "explain medical context"], "avoid": ["literal translation"]}
  rubric_criteria JSONB NOT NULL,
  -- Example: {"cultural_awareness": 30, "appropriate_adaptation": 40, "accuracy": 30}
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_ai_generated BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 4. Vocabulary Pairs Cache
-- ==============================================
CREATE TABLE IF NOT EXISTS public.vocabulary_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_term TEXT NOT NULL,
  target_term TEXT NOT NULL,
  language_pair TEXT NOT NULL DEFAULT 'en-es',
  specialty TEXT, -- 'cardiology', 'oncology', 'pediatrics', etc.
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  phonetic_pronunciation TEXT,
  definition TEXT,
  usage_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_term, target_term, language_pair)
);

-- ==============================================
-- 5. Grading Rubrics
-- ==============================================
CREATE TABLE IF NOT EXISTS public.grading_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_type TEXT NOT NULL CHECK (
    module_type IN ('voice', 'syntax', 'vocab', 'cultural', 'ethics', 'typing')
  ),
  rubric_data JSONB NOT NULL,
  -- Example structure:
  -- {
  --   "criteria": [
  --     {"name": "accuracy", "weight": 40, "description": "Correct terminology and grammar"},
  --     {"name": "clarity", "weight": 30, "description": "Clear pronunciation and pacing"}
  --   ],
  --   "scoring_levels": {
  --     "90-100": "Excellent - Meets all professional standards",
  --     "80-89": "Good - Minor improvements needed",
  --     "70-79": "Satisfactory - Notable gaps in performance",
  --     "0-69": "Needs improvement - Significant deficiencies"
  --   }
  -- }
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_type, version)
);

-- ==============================================
-- Indexes for Performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_grammar_questions_difficulty ON public.grammar_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_grammar_questions_approved ON public.grammar_questions(approved) WHERE approved = true;
CREATE INDEX IF NOT EXISTS idx_grammar_questions_language_pair ON public.grammar_questions(language_pair);

CREATE INDEX IF NOT EXISTS idx_ethics_dilemmas_type ON public.ethics_dilemmas(dilemma_type);
CREATE INDEX IF NOT EXISTS idx_ethics_dilemmas_difficulty ON public.ethics_dilemmas(difficulty);

CREATE INDEX IF NOT EXISTS idx_cultural_scenarios_status ON public.cultural_scenarios(status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_cultural_scenarios_difficulty ON public.cultural_scenarios(difficulty);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pairs_language_pair ON public.vocabulary_pairs(language_pair);
CREATE INDEX IF NOT EXISTS idx_vocabulary_pairs_specialty ON public.vocabulary_pairs(specialty);

CREATE INDEX IF NOT EXISTS idx_grading_rubrics_module_active ON public.grading_rubrics(module_type, is_active) WHERE is_active = true;

-- ==============================================
-- Row Level Security
-- ==============================================
ALTER TABLE public.grammar_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethics_dilemmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_rubrics ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read approved content
CREATE POLICY "Authenticated users can read approved grammar questions"
  ON public.grammar_questions FOR SELECT
  TO authenticated
  USING (approved = true);

CREATE POLICY "Authenticated users can read ethics dilemmas"
  ON public.ethics_dilemmas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read approved cultural scenarios"
  ON public.cultural_scenarios FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Authenticated users can read vocabulary pairs"
  ON public.vocabulary_pairs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read active rubrics"
  ON public.grading_rubrics FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ==============================================
-- Grant Permissions
-- ==============================================
GRANT SELECT ON public.grammar_questions TO authenticated;
GRANT SELECT ON public.ethics_dilemmas TO authenticated;
GRANT SELECT ON public.cultural_scenarios TO authenticated;
GRANT SELECT ON public.vocabulary_pairs TO authenticated;
GRANT SELECT ON public.grading_rubrics TO authenticated;

-- ==============================================
-- Comments for Documentation
-- ==============================================
COMMENT ON TABLE public.grammar_questions IS 'Bank of grammar/syntax questions for InterpreTest assessments';
COMMENT ON TABLE public.ethics_dilemmas IS 'Library of ethical dilemmas based on NCIHC, CHIA, and IMIA standards';
COMMENT ON TABLE public.cultural_scenarios IS 'Cultural adaptation scenarios requiring interpreter judgment';
COMMENT ON TABLE public.vocabulary_pairs IS 'Cached vocabulary matching pairs for efficient reuse';
COMMENT ON TABLE public.grading_rubrics IS 'Scoring rubrics for each assessment module to ensure consistent AI grading';
