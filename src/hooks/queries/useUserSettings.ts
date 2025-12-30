/**
 * React Query Hooks for User Settings
 * Handles fetching and updating user preferences
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface UserSettings {
    id?: string;
    user_id: string;
    preferred_currency: string;
    pay_rate: number;
    pay_rate_type: 'per_hour' | 'per_minute';
    rounding_preference: 'up' | 'down' | 'nearest';
    created_at?: string;
    updated_at?: string;
}

// Query Keys
export const userSettingsKeys = {
    all: ['user-settings'] as const,
    detail: (userId: string) => [...userSettingsKeys.all, userId] as const,
};

/**
 * Fetch user settings
 */
export const useUserSettings = (userId: string | undefined) => {
    return useQuery({
        queryKey: userSettingsKeys.detail(userId || ''),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;

            // Return default settings if none exist
            if (!data) {
                return {
                    user_id: userId,
                    preferred_currency: 'USD',
                    pay_rate: 25,
                    pay_rate_type: 'per_hour' as const,
                    rounding_preference: 'nearest' as const,
                };
            }

            return data as UserSettings;
        },
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Update user settings
 */
export const useUpdateUserSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: UserSettings) => {
            const { user_id, ...settingsData } = settings;

            // Check if settings exist
            const { data: existing } = await supabase
                .from('user_settings')
                .select('id')
                .eq('user_id', user_id)
                .maybeSingle();

            let result;
            if (existing) {
                // Update existing
                result = await supabase
                    .from('user_settings')
                    .update(settingsData)
                    .eq('user_id', user_id)
                    .select()
                    .single();
            } else {
                // Insert new
                result = await supabase
                    .from('user_settings')
                    .insert([{ user_id, ...settingsData }])
                    .select()
                    .single();
            }

            if (result.error) throw result.error;
            return result.data as UserSettings;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(userSettingsKeys.detail(data.user_id), data);
            toast.success('Settings updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings. Please try again.');
        },
    });
};
