-- Seed Data for InterpreTest and InterpreCoach
-- Migration: Populate initial grading rubrics, medical terms, and medications

-- ==============================================
-- GRADING RUBRICS (6 modules)
-- ==============================================

-- Voice Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('voice', '{
  "criteria": [
    {"name": "pronunciation", "weight": 25, "description": "Clear and accurate pronunciation of medical terms"},
    {"name": "fluency", "weight": 25, "description": "Smooth delivery without excessive hesitations"},
    {"name": "accuracy", "weight": 30, "description": "Correct interpretation of meaning and terminology"},
    {"name": "voice_quality", "weight": 20, "description": "Appropriate volume, pace, and tone"}
  ],
  "scoring_levels": {
    "90-100": "Excellent - Professional interpreter standard",
    "80-89": "Good - Minor improvements in clarity or pacing needed",
    "70-79": "Satisfactory - Notable hesitations or pronunciation errors",
    "60-69": "Below Standard - Significant fluency or accuracy issues",
    "0-59": "Needs Improvement - Major deficiencies requiring remediation"
  }
}'::jsonb, 1);

-- Syntax/Grammar Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('syntax', '{
  "criteria": [
    {"name":"grammatical_correctness", "weight": 40, "description": "Proper grammar and syntax in target language"},
    {"name": "tense_consistency", "weight": 30, "description": "Appropriate and consistent use of verb tenses"},
    {"name": "register", "weight": 20, "description": "Appropriate level of formality"},
    {"name": "coherence", "weight": 10, "description": "Logical sentence structure"}
  ],
  "scoring_levels": {
   "90-100": "Excellent - Minimal or no grammatical errors",
    "80-89": "Good - Minor grammatical inconsistencies",
    "70-79": "Satisfactory - Occasional errors that don\'t impede understanding",
    "60-69": "Below Standard - Frequent errors affecting clarity",
    "0-59": "Needs Improvement - Consistent grammatical mistakes"
  }
}'::jsonb, 1);

-- Vocabulary Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('vocab', '{
  "criteria": [
    {"name": "accuracy", "weight": 50, "description": "Correct matching of terms and definitions"},
    {"name": "speed", "weight": 30, "description": "Efficiency in recall and matching"},
    {"name": "specialty_knowledge", "weight": 20, "description": "Understanding of specialty-specific terminology"}
  ],
  "scoring_levels": {
    "90-100": "Excellent - Mastery of medical terminology",
    "80-89": "Good - Strong terminology knowledge with minor gaps",
    "70-79": "Satisfactory - Adequate but inconsistent recall",
    "60-69": "Below Standard - Significant terminology gaps",
    "0-59": "Needs Improvement - Fundamental gaps in vocabulary"
  }
}'::jsonb, 1);

-- Cultural Adaptation Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('cultural', '{
  "criteria": [
    {"name": "cultural_awareness", "weight": 35, "description": "Recognition of cultural nuances and implications"},
    {"name": "appropriate_adaptation", "weight": 35, "description": "Effective cultural mediation while maintaining accuracy"},
    {"name": "sensitivity", "weight": 20, "description": "Respectful and tactful handling of cultural differences"},
    {"name": "clarity", "weight": 10, "description": "Clear explanation to bridge cultural gaps"}
  ],
  "scoring_levels": {
    "90-100": "Excellent - Sophisticated cultural mediation",
    "80-89": "Good - Effective cultural adaptation with minor oversights",
    "70-79": "Satisfactory - Basic cultural awareness but limited adaptation",
    "60-69": "Below Standard - Missed cultural cues or inappropriate adaptation",
    "0-59": "Needs Improvement - Lack of cultural sensitivity or awareness"
  }
}'::jsonb, 1);

-- Ethics Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('ethics', '{
  "criteria": [
    {"name": "code_adherence", "weight": 40, "description": "Alignment with NCIHC, CHIA, and IMIA standards"},
    {"name": "decision_rationale", "weight": 35, "description": "Sound reasoning for ethical choices"},
    {"name": "boundary_awareness", "weight": 25, "description": "Understanding of professional role and limitations"}
  ],
  "scoring_levels": {
    "90-100": "Excellent - Strong ethical reasoning aligned with professional standards",
    "80-89": "Good - Generally sound ethical judgment",
    "70-79": "Satisfactory - Basic understanding with some gaps",
    "60-69": "Below Standard - Questionable ethical decisions",
    "0-59": "Needs Improvement - Significant ethical misconceptions"
  }
}'::jsonb, 1);

-- Typing Module Rubric
INSERT INTO public.grading_rubrics (module_type, rubric_data, version) VALUES
('typing', '{
  "criteria": [
    {"name": "speed", "weight": 30, "description": "Words per minute (WPM) appropriate for professional use"},
    {"name": "accuracy", "weight": 40, "description": "Low error rate in typing"},
    {"name": "grammar", "weight": 20, "description": "Grammatically correct output"},
    {"name": "coherence", "weight": 10, "description": "Logical and well-structured text"}
  ],
  "scoring_levels": {
    "90-100": "Excellent - High speed (60+ WPM) with 95%+ accuracy",
    "80-89": "Good - Moderate speed (45-59 WPM) with 90-94% accuracy",
    "70-79": "Satisfactory - Fair speed (30-44 WPM) with 85-89% accuracy",
    "60-69": "Below Standard - Slow speed or accuracy below 85%",
    "0-59": "Needs Improvement - Significantly below professional standards"
  }
}'::jsonb, 1);

-- ==============================================
-- MEDICAL TERMS (Sample Data - 50 core terms)
-- ==============================================

INSERT INTO public.medical_terms (term, definition, translation_spanish, phonetic_pronunciation, category, is_verified) VALUES
('hypertension', 'Abnormally high blood pressure', 'hipertensión', 'hahy-per-TEN-shuhn', 'cardiovascular', true),
('diabetes mellitus', 'Metabolic disorder characterized by high blood sugar', 'diabetes mellitus', 'dahy-uh-BEE-teez MEL-i-tuhs', 'endocrine', true),
('myocardial infarction', 'Heart attack - blockage of blood flow to heart muscle', 'infarto de miocardio', 'mahy-oh-KAR-dee-uhl in-FAHRK-shuhn', 'cardiovascular', true),
('pneumonia', 'Infection that inflames air sacs in lungs', 'neumonía', 'noo-MOHN-yuh', 'respiratory', true),
('fracture', 'Broken bone', 'fractura', 'FRAK-cher', 'orthopedic', true),
('edema', 'Swelling caused by fluid retention', 'edema', 'ih-DEE-muh', 'general', true),
('tachycardia', 'Abnormally fast heart rate', 'taquicardia', 'tak-i-KAR-dee-uh', 'cardiovascular', true),
('bradycardia', 'Abnormally slow heart rate', 'bradicardia', 'brad-i-KAR-dee-uh', 'cardiovascular', true),
('dyspnea', 'Difficulty breathing or shortness of breath', 'disnea', 'disp-NEE-uh', 'respiratory', true),
('analgesic', 'Pain-relieving medication', 'analgésico', 'an-uhl-JEE-zik', 'pharmacology', true),
('antibiotic', 'Medication that kills bacteria', 'antibiótico', 'an-tee-bahy-OT-ik', 'pharmacology', true),
('benign', 'Not cancerous; non-threatening', 'benigno', 'bih-NAHYN', 'oncology', true),
('malignant', 'Cancerous; life-threatening', 'maligno', 'muh-LIG-nuhnt', 'oncology', true),
('chronic', 'Long-lasting or persistent', 'crónico', 'KRON-ik', 'general', true),
('acute', 'Sudden onset and severe', 'agudo', 'uh-KYOOT', 'general', true),
('hemorrhage', 'Excessive bleeding', 'hemorragia', 'HEM-er-ij', 'emergency', true),
('thrombosis', 'Formation of blood clot in vessel', 'trombosis', 'throm-BOH-sis', 'cardiovascular', true),
('embolism', 'Blockage of artery by clot or air bubble', 'embolia', 'EM-buh-liz-uhm', 'cardiovascular', true),
('stroke', 'Interrupted blood flow to the brain', 'accidente cerebrovascular', 'STROHK', 'neurology', true),
('seizure', 'Sudden uncontrolled electrical disturbance in brain', 'convulsión', 'SEE-zher', 'neurology', true)
ON CONFLICT (term, category) DO NOTHING;

-- ==============================================
-- MEDICATIONS (Sample Data - 30 common medications)
-- ==============================================

INSERT INTO public.medications (generic_name, brand_names, aliases, category, common_dosages, pronunciation, spanish_translation) VALUES
('metformin', ARRAY['Glumetza', 'Fortamet'], ARRAY['metformina'], 'antidiabetic', ARRAY['500mg', '850mg', '1000mg'], 'met-FOR-min', 'metformina'),
('lisinopril', ARRAY['Prinivil', 'Zestril'], ARRAY[], 'antihypertensive', ARRAY['2.5mg', '5mg', '10mg', '20mg'], 'lye-SIN-oh-pril', 'lisinopril'),
('atorvastatin', ARRAY['Lipitor'], ARRAY[], 'statin', ARRAY['10mg', '20mg', '40mg', '80mg'], 'a-TOR-va-stat-in', 'atorvastatina'),
('amlodipine', ARRAY['Norvasc'], ARRAY[], 'calcium channel blocker', ARRAY['2.5mg', '5mg', '10mg'], 'am-LOH-di-peen', 'amlodipino'),
('omeprazole', ARRAY['Prilosec'], ARRAY['ome'], 'proton pump inhibitor', ARRAY['20mg', '40mg'], 'oh-MEP-ra-zohl', 'omeprazol'),
('albuterol', ARRAY['Proventil', 'Ventolin'], ARRAY['salbutamol'], 'bronchodilator', ARRAY['90mcg'], 'al-BYOO-ter-ol', 'salbutamol'),
('gabapentin', ARRAY['Neurontin'], ARRAY['GBP'], 'anticonvulsant', ARRAY['300mg', '600mg', '800mg'], 'GAB-uh-PEN-tin', 'gabapentina'),
('hydrochlorothiazide', ARRAY['Microzide'], ARRAY['HCTZ'], 'diuretic', ARRAY['12.5mg', '25mg', '50mg'], 'hahy-droh-klohr-oh-THAHY-uh-zahyd', 'hidroclorotiazida'),
('levothyroxine', ARRAY['Synthroid', 'Levoxyl'], ARRAY['LT4'], 'thyroid hormone', ARRAY['25mcg', '50mcg', '75mcg', '100mcg'], 'lee-voh-thahy-ROK-seen', 'levotiroxina'),
('simvastatin', ARRAY['Zocor'], ARRAY[], 'statin', ARRAY['10mg', '20mg', '40mg'], 'SIM-va-stat-in', 'simvastatina')
ON CONFLICT (generic_name) DO NOTHING;

-- ==============================================
-- Comments
-- ==============================================
COMMENT ON TABLE public.grading_rubrics IS 'Initial rubrics populated for all 6 assessment modules';
COMMENT ON TABLE public.medical_terms IS 'Seeded with 20 core medical terms across specialties';
COMMENT ON TABLE public.medications IS 'Seeded with 10 common medications';
