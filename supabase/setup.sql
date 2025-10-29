-- This file contains additional setup queries for Supabase
-- Run these after the initial migration

-- Insert some sample data for testing (optional)
-- You can remove this section in production

-- Sample glossary terms (public)
INSERT INTO public.glossary_terms (term, definition, category, language_code, is_public, is_verified) VALUES
('Consecutive Interpretation', 'A mode of interpreting where the interpreter speaks after the source-language speaker has finished speaking.', 'interpretation_modes', 'en', true, true),
('Simultaneous Interpretation', 'A mode of interpreting where the interpreter renders the message in the target language at the same time as the source-language speaker is speaking.', 'interpretation_modes', 'en', true, true),
('Sight Translation', 'The oral translation of a written text performed by an interpreter.', 'interpretation_modes', 'en', true, true),
('Source Language', 'The language from which interpretation or translation is performed.', 'terminology', 'en', true, true),
('Target Language', 'The language into which interpretation or translation is performed.', 'terminology', 'en', true, true),
('Booth', 'A soundproof enclosure used by interpreters during simultaneous interpretation.', 'equipment', 'en', true, true),
('Whispered Interpretation', 'A form of simultaneous interpretation where the interpreter whispers the interpretation to a small audience.', 'interpretation_modes', 'en', true, true),
('Relay Interpretation', 'A technique used when direct interpretation between two languages is not available, requiring an intermediate language.', 'techniques', 'en', true, true),
('Chuchotage', 'French term for whispered interpretation.', 'terminology', 'en', true, true),
('Décalage', 'The time lag between the original speech and the interpretation in simultaneous interpreting.', 'terminology', 'en', true, true);

-- Medical terminology
INSERT INTO public.glossary_terms (term, definition, category, subcategory, language_code, is_public, is_verified) VALUES
('Hypertension', 'High blood pressure, a condition where blood pressure in the arteries is persistently elevated.', 'medical', 'cardiology', 'en', true, true),
('Myocardial Infarction', 'Heart attack, occurs when blood flow decreases or stops to a part of the heart, causing damage to the heart muscle.', 'medical', 'cardiology', 'en', true, true),
('Diabetes Mellitus', 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.', 'medical', 'endocrinology', 'en', true, true),
('Pneumonia', 'Infection that inflames air sacs in one or both lungs, which may fill with fluid.', 'medical', 'pulmonology', 'en', true, true),
('Anesthesia', 'A state of controlled, temporary loss of sensation or awareness induced for medical purposes.', 'medical', 'anesthesiology', 'en', true, true);

-- Legal terminology
INSERT INTO public.glossary_terms (term, definition, category, subcategory, language_code, is_public, is_verified) VALUES
('Deposition', 'The testimony of a witness taken under oath outside of court, usually in an attorney''s office.', 'legal', 'litigation', 'en', true, true),
('Affidavit', 'A written statement confirmed by oath or affirmation, for use as evidence in court.', 'legal', 'documentation', 'en', true, true),
('Subpoena', 'A writ ordering a person to attend a court or produce documents.', 'legal', 'court_procedures', 'en', true, true),
('Plaintiff', 'A person who brings a case against another in a court of law.', 'legal', 'parties', 'en', true, true),
('Defendant', 'An individual, company, or institution sued or accused in a court of law.', 'legal', 'parties', 'en', true, true);

-- Create some useful functions for the application

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_calls', COALESCE(call_stats.total_calls, 0),
    'total_earnings', COALESCE(call_stats.total_earnings, 0),
    'total_duration', COALESCE(call_stats.total_duration, 0),
    'avg_call_duration', COALESCE(call_stats.avg_duration, 0),
    'this_month_calls', COALESCE(month_stats.month_calls, 0),
    'this_month_earnings', COALESCE(month_stats.month_earnings, 0),
    'assessments_taken', COALESCE(assessment_stats.total_assessments, 0),
    'avg_assessment_score', COALESCE(assessment_stats.avg_score, 0),
    'total_achievements', COALESCE(achievement_stats.total_achievements, 0),
    'total_points', COALESCE(achievement_stats.total_points, 0)
  ) INTO result
  FROM (
    SELECT
      COUNT(*) as total_calls,
      SUM(earnings) as total_earnings,
      SUM(duration_seconds) as total_duration,
      AVG(duration_seconds) as avg_duration
    FROM call_logs
    WHERE user_id = user_uuid
  ) call_stats
  CROSS JOIN (
    SELECT
      COUNT(*) as month_calls,
      SUM(earnings) as month_earnings
    FROM call_logs
    WHERE user_id = user_uuid
    AND start_time >= date_trunc('month', CURRENT_DATE)
  ) month_stats
  CROSS JOIN (
    SELECT
      COUNT(*) as total_assessments,
      AVG(percentage) as avg_score
    FROM assessment_results
    WHERE user_id = user_uuid
  ) assessment_stats
  CROSS JOIN (
    SELECT
      COUNT(*) as total_achievements,
      SUM(points_earned) as total_points
    FROM user_achievements
    WHERE user_id = user_uuid
  ) achievement_stats;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search glossary terms with ranking
CREATE OR REPLACE FUNCTION search_glossary_terms(
  search_query TEXT,
  user_uuid UUID DEFAULT NULL,
  limit_results INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  term TEXT,
  definition TEXT,
  category TEXT,
  subcategory TEXT,
  language_code TEXT,
  is_public BOOLEAN,
  usage_count INTEGER,
  relevance_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gt.id,
    gt.term,
    gt.definition,
    gt.category,
    gt.subcategory,
    gt.language_code,
    gt.is_public,
    gt.usage_count,
    (
      CASE
        WHEN gt.term ILIKE search_query || '%' THEN 1.0
        WHEN gt.term ILIKE '%' || search_query || '%' THEN 0.8
        WHEN gt.definition ILIKE '%' || search_query || '%' THEN 0.6
        ELSE 0.4
      END
    ) as relevance_score
  FROM glossary_terms gt
  WHERE (
    gt.term ILIKE '%' || search_query || '%'
    OR gt.definition ILIKE '%' || search_query || '%'
  )
  AND (
    gt.is_public = true
    OR (user_uuid IS NOT NULL AND gt.user_id = user_uuid)
  )
  ORDER BY relevance_score DESC, gt.usage_count DESC, gt.term ASC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment glossary term usage
CREATE OR REPLACE FUNCTION increment_term_usage(term_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE glossary_terms
  SET usage_count = usage_count + 1
  WHERE id = term_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance on search
CREATE INDEX IF NOT EXISTS idx_glossary_terms_search ON glossary_terms USING gin(to_tsvector('english', term || ' ' || definition));
CREATE INDEX IF NOT EXISTS idx_call_logs_user_start_time ON call_logs(user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_type_created ON assessment_results(user_id, assessment_type, created_at DESC);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_user_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_glossary_terms(TEXT, UUID, INTEGER) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_term_usage(UUID) TO authenticated;

-- Create a view for public glossary terms (for unauthenticated access)
CREATE OR REPLACE VIEW public_glossary AS
SELECT
  id,
  term,
  definition,
  category,
  subcategory,
  language_code,
  usage_count,
  created_at
FROM glossary_terms
WHERE is_public = true AND is_verified = true
ORDER BY category, term;

-- Grant access to the view
GRANT SELECT ON public_glossary TO anon, authenticated;

-- Create a materialized view for analytics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS user_analytics_summary AS
SELECT
  u.id as user_id,
  p.first_name,
  p.last_name,
  COUNT(DISTINCT cl.id) as total_calls,
  SUM(cl.duration_seconds) as total_call_duration,
  SUM(cl.earnings) as total_earnings,
  COUNT(DISTINCT ar.id) as total_assessments,
  AVG(ar.percentage) as avg_assessment_score,
  COUNT(DISTINCT ss.id) as total_study_sessions,
  COUNT(DISTINCT cs.id) as total_coaching_sessions,
  COUNT(DISTINCT ua.id) as total_achievements,
  SUM(ua.points_earned) as total_points,
  MAX(cl.created_at) as last_call_date,
  MAX(ar.created_at) as last_assessment_date
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN call_logs cl ON u.id = cl.user_id
LEFT JOIN assessment_results ar ON u.id = ar.user_id
LEFT JOIN study_sessions ss ON u.id = ss.user_id
LEFT JOIN coaching_sessions cs ON u.id = cs.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, p.first_name, p.last_name;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_analytics_summary_user_id ON user_analytics_summary(user_id);

-- Grant access to materialized view
GRANT SELECT ON user_analytics_summary TO authenticated;

-- Function to refresh analytics (call this periodically)
CREATE OR REPLACE FUNCTION refresh_user_analytics()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_analytics_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION refresh_user_analytics() TO authenticated;
