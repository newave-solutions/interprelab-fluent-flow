
export interface CallRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  earnings: number;
  platform: 'Platform A' | 'Platform B' | 'Platform C';
  callType: 'VRI' | 'OPI';
}

export interface WeeklyData {
  day: string;
  calls: number;
  earnings: number;
}

export interface UserPreferences {
    payPerMinuteUSD: number;
    targetCurrency: string;
    rounding: 'nearest' | 'up' | 'down';
}

export interface ConversionRates {
    [key: string]: number;
}

export interface CallTypeStats {
  vri: number;
  opi: number;
}

export interface Post {
  id: string;
  content: string;
  created_at: string;
  media_url?: string;
  media_type?: string;
  tags?: string[];
  user_id: string;
}

export interface GlossaryTerm {
  id: string;
  user_id: string | null;
  term: string;
  translation: string | null;
  definition: string;
  pronunciation: string | null;
  category: string | null;
  subcategory: string | null;
  language_code: string | null;
  source_language: string | null;
  target_language: string | null;
  difficulty_level: string | null;
  usage_example: string | null;
  notes: string | null;
  tags: string[] | null;
  is_public: boolean | null;
  is_verified: boolean | null;
  usage_count: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
