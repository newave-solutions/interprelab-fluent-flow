/**
 * React Query Hooks for Learning Statistics
 * Handles fetching and updating user learning progress
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface LearningStats {
    id?: string;
    user_id: string;
    study_hours: number;
    terms_learned: number;
    quizzes_completed: number;
    scenarios_practiced: number;
    bot_conversations: number;
    streak: number;
    created_at?: string;
    updated_at?: string;
}

// Query Keys
export const learningStatsKeys = {
    all: ['learning-stats'] as const,
    detail: (userId: string) => [...learningStatsKeys.all, userId] as const,
};

/**
 * Fetch learning statistics for a user
 */
export const useLearningStats = (userId: string | undefined) => {
    return useQuery({
        queryKey: learningStatsKeys.detail(userId || ''),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('learning_stats')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;

            // Return default stats if none exist
            if (!data) {
                return {
                    user_id: userId,
                    study_hours: 0,
                    terms_learned: 0,
                    quizzes_completed: 0,
                    scenarios_practiced: 0,
                    bot_conversations: 0,
                    streak: 0,
                };
            }

            return data as LearningStats;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Update learning statistics
 */
export const useUpdateLearningStats = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (stats: Partial<LearningStats> & { user_id: string }) => {
            const { user_id, ...statsData } = stats;

            // Check if stats exist
            const { data: existing } = await supabase
                .from('learning_stats')
                .select('id')
                .eq('user_id', user_id)
                .maybeSingle();

            let result;
            if (existing) {
                // Update existing
                result = await supabase
                    .from('learning_stats')
                    .update(statsData)
                    .eq('user_id', user_id)
                    .select()
                    .single();
            } else {
                // Insert new
                result = await supabase
                    .from('learning_stats')
                    .insert([{ user_id, ...statsData }])
                    .select()
                    .single();
            }

            if (result.error) throw result.error;
            return result.data as LearningStats;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(learningStatsKeys.detail(data.user_id), data);
            toast.success('Progress updated!');
        },
        onError: (error) => {
            console.error('Failed to update learning stats:', error);
            toast.error('Failed to update progress.');
        },
    });
};

/**
 * Increment a specific learning stat
 */
export const useIncrementLearningStat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            field,
            amount = 1
        }: {
            userId: string;
            field: keyof Omit<LearningStats, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
            amount?: number;
        }) => {
            // Get current stats
            const { data: current } = await supabase
                .from('learning_stats')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            const newValue = (current?.[field] || 0) + amount;

            // Update
            const { data, error } = await supabase
                .from('learning_stats')
                .upsert({
                    user_id: userId,
                    [field]: newValue,
                }, {
                    onConflict: 'user_id'
                })
                .select()
                .single();

            if (error) throw error;
            return data as LearningStats;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(learningStatsKeys.detail(data.user_id), data);
        },
        onError: (error) => {
            console.error('Failed to increment stat:', error);
        },
    });
};
