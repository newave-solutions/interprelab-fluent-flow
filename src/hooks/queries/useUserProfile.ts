/**
 * React Query Hooks for User Profile
 * Handles fetching and updating user profile information
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface UserProfile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    location?: string;
    bio?: string;
    languages?: string[];
    certifications?: string[];
    created_at?: string;
    updated_at?: string;
}

// Query Keys
export const userProfileKeys = {
    all: ['user-profile'] as const,
    detail: (userId: string) => [...userProfileKeys.all, userId] as const,
};

/**
 * Fetch user profile
 */
export const useUserProfile = (userId: string | undefined) => {
    return useQuery({
        queryKey: userProfileKeys.detail(userId || ''),
        queryFn: async () => {
            if (!userId) throw new Error('User ID required');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;
            return data as UserProfile;
        },
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Update user profile
 */
export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: Partial<UserProfile> & { id: string }) => {
            const { id, ...profileData } = profile;

            const { data, error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as UserProfile;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(userProfileKeys.detail(data.id), data);
            toast.success('Profile updated successfully!');
        },
        onError: (error) => {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile.');
        },
    });
};
