/**
 * React Query Hooks for Call Logs
 * Handles fetching, creating, and managing call log data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface CallLog {
    id: string;
    user_id: string;
    start_time: string;
    duration_seconds: number;
    earnings: number;
    call_type?: string;
    notes?: string;
    platform?: string;
    created_at?: string;
}

export interface CallLogStats {
    totalCalls: number;
    totalMinutes: number;
    totalEarnings: number;
    totalSeconds: number;
    avgCallDuration: number;
}

// Query Keys
export const callLogKeys = {
    all: ['call-logs'] as const,
    lists: () => [...callLogKeys.all, 'list'] as const,
    list: (userId: string) => [...callLogKeys.lists(), userId] as const,
    stats: (userId: string) => [...callLogKeys.all, 'stats', userId] as const,
    recent: (userId: string, limit: number) => [...callLogKeys.all, 'recent', userId, limit] as const,
};

/**
 * Fetch all call logs for a user
 */
export const useCallLogs = (userId: string | undefined) => {
    return useQuery({
        queryKey: callLogKeys.list(userId || ''),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('call_logs')
                .select('*')
                .eq('user_id', userId)
                .order('start_time', { ascending: false });

            if (error) throw error;
            return data as CallLog[];
        },
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Fetch recent call logs (limited)
 */
export const useRecentCallLogs = (userId: string | undefined, limit: number = 5) => {
    return useQuery({
        queryKey: callLogKeys.recent(userId || '', limit),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('call_logs')
                .select('*')
                .eq('user_id', userId)
                .order('start_time', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data as CallLog[];
        },
        enabled: !!userId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

/**
 * Calculate call log statistics
 */
export const useCallLogStats = (userId: string | undefined) => {
    return useQuery({
        queryKey: callLogKeys.stats(userId || ''),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('call_logs')
                .select('duration_seconds, earnings')
                .eq('user_id', userId);

            if (error) throw error;

            const stats: CallLogStats = {
                totalCalls: data.length,
                totalSeconds: data.reduce((sum, call) => sum + (call.duration_seconds || 0), 0),
                totalMinutes: 0,
                totalEarnings: data.reduce((sum, call) => sum + (call.earnings || 0), 0),
                avgCallDuration: 0,
            };

            stats.totalMinutes = Math.floor(stats.totalSeconds / 60);
            stats.avgCallDuration = stats.totalCalls > 0 ? stats.totalSeconds / stats.totalCalls : 0;

            return stats;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Create a new call log entry
 */
export const useCreateCallLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (callLog: Omit<CallLog, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('call_logs')
                .insert([callLog])
                .select()
                .single();

            if (error) throw error;
            return data as CallLog;
        },
        onSuccess: (data) => {
            // Invalidate and refetch call logs
            queryClient.invalidateQueries({ queryKey: callLogKeys.list(data.user_id) });
            queryClient.invalidateQueries({ queryKey: callLogKeys.stats(data.user_id) });
            queryClient.invalidateQueries({ queryKey: callLogKeys.recent(data.user_id, 5) });

            toast.success('Call logged successfully!');
        },
        onError: (error) => {
            console.error('Failed to create call log:', error);
            toast.error('Failed to log call. Please try again.');
        },
    });
};

/**
 * Update an existing call log
 */
export const useUpdateCallLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<CallLog> }) => {
            const { data, error } = await supabase
                .from('call_logs')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as CallLog;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: callLogKeys.list(data.user_id) });
            queryClient.invalidateQueries({ queryKey: callLogKeys.stats(data.user_id) });
            toast.success('Call updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update call log:', error);
            toast.error('Failed to update call. Please try again.');
        },
    });
};

/**
 * Delete a call log
 */
export const useDeleteCallLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
            const { error } = await supabase
                .from('call_logs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { id, userId };
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: callLogKeys.list(variables.userId) });
            queryClient.invalidateQueries({ queryKey: callLogKeys.stats(variables.userId) });
            toast.success('Call deleted successfully!');
        },
        onError: (error) => {
            console.error('Failed to delete call log:', error);
            toast.error('Failed to delete call. Please try again.');
        },
    });
};
