import { supabase } from './client';
import type { Database } from '../../../integrations/supabase/types';

type CallLog = Database['public']['Tables']['call_logs']['Row'];
type CallLogInsert = Database['public']['Tables']['call_logs']['Insert'];
type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type AssessmentResult = Database['public']['Tables']['assessment_results']['Row'];
type GlossaryTerm = Database['public']['Tables']['glossary_terms']['Row'];

export class CallLogService {
  static async getCallLogs(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit);

    return { data, error };
  }

  static async getCallLogsByDateRange(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', startDate)
      .lte('start_time', endDate)
      .order('start_time', { ascending: false });

    return { data, error };
  }

  static async getMonthlyStats(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from('call_logs')
      .select('duration_seconds, earnings')
      .eq('user_id', userId)
      .gte('start_time', startDate)
      .lte('start_time', endDate);

    if (error) return { data: null, error };

    const totalCalls = data.length;
    const totalSeconds = data.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
    const totalEarnings = data.reduce((sum, log) => sum + (log.earnings || 0), 0);

    return {
      data: {
        totalCalls,
        totalSeconds,
        totalEarnings,
        averageDuration: totalCalls > 0 ? totalSeconds / totalCalls : 0,
      },
      error: null,
    };
  }

  static async createCallLog(callLog: CallLogInsert) {
    const { data, error } = await supabase
      .from('call_logs')
      .insert(callLog)
      .select()
      .single();

    return { data, error };
  }

  static async updateCallLog(id: string, updates: Partial<CallLogInsert>) {
    const { data, error } = await supabase
      .from('call_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async deleteCallLog(id: string) {
    const { error } = await supabase
      .from('call_logs')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Enhanced method using edge function for earnings calculation
  static async calculateAndUpdateEarnings(callLogId: string, userId: string, durationSeconds: number) {
    const { data, error } = await supabase.functions.invoke('calculate-earnings', {
      body: { callLogId, userId, durationSeconds }
    });

    return { data, error };
  }
}

export class UserSettingsService {
  static async getUserSettings(userId: string) {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data, error };
  }

  static async updateUserSettings(userId: string, settings: Partial<UserSettings>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...settings })
      .select()
      .single();

    return { data, error };
  }
}

export class ProfileService {
  static async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  static async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }
}

export class AnalyticsService {
  static async getWeeklyStats(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('call_logs')
      .select('start_time, duration_seconds, earnings')
      .eq('user_id', userId)
      .gte('start_time', oneWeekAgo.toISOString())
      .order('start_time', { ascending: true });

    if (error) return { data: null, error };

    // Group by day
    const dailyStats = data.reduce((acc, log) => {
      const date = new Date(log.start_time).toDateString();
      if (!acc[date]) {
        acc[date] = { calls: 0, duration: 0, earnings: 0 };
      }
      acc[date].calls += 1;
      acc[date].duration += log.duration_seconds || 0;
      acc[date].earnings += log.earnings || 0;
      return acc;
    }, {} as Record<string, { calls: number; duration: number; earnings: number }>);

    return { data: dailyStats, error: null };
  }

  static async getYearlyStats(userId: string, year: number) {
    const startDate = new Date(year, 0, 1).toISOString();
    const endDate = new Date(year + 1, 0, 1).toISOString();

    const { data, error } = await supabase
      .from('call_logs')
      .select('duration_seconds, earnings')
      .eq('user_id', userId)
      .gte('start_time', startDate)
      .lt('start_time', endDate);

    if (error) return { data: null, error };

    const totalCalls = data.length;
    const totalSeconds = data.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
    const totalEarnings = data.reduce((sum, log) => sum + (log.earnings || 0), 0);

    return {
      data: {
        totalCalls,
        totalSeconds,
        totalEarnings,
        averageDuration: totalCalls > 0 ? totalSeconds / totalCalls : 0,
      },
      error: null,
    };
  }

  // Enhanced method using edge function for comprehensive analytics
  static async getComprehensiveAnalytics(userId: string, period: string, year?: number, month?: number) {
    const { data, error } = await supabase.functions.invoke('generate-analytics', {
      body: { userId, period, year, month }
    });

    return { data, error };
  }
}

export class AssessmentService {
  static async getAssessmentResults(userId: string, assessmentType?: string) {
    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (assessmentType) {
      query = query.eq('assessment_type', assessmentType);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async submitAssessment(assessmentData: any) {
    const { data, error } = await supabase.functions.invoke('process-assessment', {
      body: assessmentData
    });

    return { data, error };
  }

  static async getAssessmentHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }
}

export class GlossaryService {
  static async getGlossaryTerms(userId: string, category?: string, isPublic = false) {
    let query = supabase
      .from('glossary_terms')
      .select('*')
      .order('created_at', { ascending: false });

    if (isPublic) {
      query = query.eq('is_public', true);
    } else {
      query = query.eq('user_id', userId);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createGlossaryTerm(term: Omit<GlossaryTerm, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('glossary_terms')
      .insert(term)
      .select()
      .single();

    return { data, error };
  }

  static async updateGlossaryTerm(id: string, updates: Partial<GlossaryTerm>) {
    const { data, error } = await supabase
      .from('glossary_terms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async deleteGlossaryTerm(id: string) {
    const { error } = await supabase
      .from('glossary_terms')
      .delete()
      .eq('id', id);

    return { error };
  }

  static async searchGlossaryTerms(searchTerm: string, userId?: string) {
    let query = supabase
      .from('glossary_terms')
      .select('*')
      .or(`term.ilike.%${searchTerm}%,definition.ilike.%${searchTerm}%`);

    if (userId) {
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;
    return { data, error };
  }
}

export class StudySessionService {
  static async createStudySession(sessionData: any) {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(sessionData)
      .select()
      .single();

    return { data, error };
  }

  static async updateStudySession(id: string, updates: any) {
    const { data, error } = await supabase
      .from('study_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  static async getStudySessions(userId: string, sessionType?: string) {
    let query = supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionType) {
      query = query.eq('session_type', sessionType);
    }

    const { data, error } = await query;
    return { data, error };
  }
}

export class CoachingService {
  static async createCoachingSession(sessionData: any) {
    const { data, error } = await supabase
      .from('coaching_sessions')
      .insert(sessionData)
      .select()
      .single();

    return { data, error };
  }

  static async getCoachingSessions(userId: string, sessionType?: string) {
    let query = supabase
      .from('coaching_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (sessionType) {
      query = query.eq('session_type', sessionType);
    }

    const { data, error } = await query;
    return { data, error };
  }
}

export class AchievementService {
  static async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    return { data, error };
  }

  static async getTotalPoints(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('points_earned')
      .eq('user_id', userId);

    if (error) return { data: 0, error };

    const totalPoints = data.reduce((sum, achievement) => sum + (achievement.points_earned || 0), 0);
    return { data: totalPoints, error: null };
  }
}
