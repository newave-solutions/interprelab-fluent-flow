/**
 * React Query Configuration
 * Centralized query client setup with defaults
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Global query defaults
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 3, // Retry failed requests 3 times
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        },
        mutations: {
            // Global mutation defaults
            retry: 1, // Retry failed mutations once
            retryDelay: 1000,
        },
    },
});

// React Query DevTools setup (development only)
export const enableDevTools = import.meta.env.DEV;
