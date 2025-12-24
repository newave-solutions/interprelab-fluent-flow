
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
