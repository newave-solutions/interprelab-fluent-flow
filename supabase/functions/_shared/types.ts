// Shared type definitions for Supabase Edge Functions

export interface CallLog {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  language_pair?: string;
  interpretation_type?: string;
  client_name?: string;
  earnings?: number;
  currency?: string;
  notes?: string;
  created_at?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  pay_rate: number;
  pay_rate_type: 'per_hour' | 'per_minute';
  preferred_currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: string;
  language_code: string;
  score: number;
  max_score: number;
  percentage: number;
  time_taken_seconds: number;
  questions_total: number;
  questions_correct: number;
  difficulty_level: string;
  results: any;
  feedback: string;
  created_at?: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  language_pair: string;
  total_lessons: number;
  estimated_duration_minutes: number;
  created_by_ai: boolean;
  created_at?: string;
}

export interface Lesson {
  id: string;
  learning_path_id?: string;
  user_id: string;
  title: string;
  content: string;
  lesson_type: string;
  order_index: number;
  estimated_duration_minutes: number;
  learning_objectives: string[];
  key_terms: Record<string, string>;
  practice_exercises?: any[];
  ai_generated: boolean;
  created_at?: string;
}

export interface Flashcard {
  id: string;
  user_id: string;
  front_text: string;
  back_text: string;
  front_language: string;
  back_language: string;
  category: string;
  difficulty_level: string;
  example_sentence?: string;
  pronunciation_guide?: string;
  ai_generated: boolean;
  created_at?: string;
}

export interface Quiz {
  id: string;
  user_id: string;
  lesson_id?: string;
  learning_path_id?: string;
  title: string;
  description: string;
  quiz_type: string;
  questions: any[];
  time_limit_minutes?: number;
  passing_score: number;
  ai_generated: boolean;
  created_at?: string;
}
