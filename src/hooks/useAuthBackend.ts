import { useAuth } from '@/contexts/AuthContext';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

/**
 * Unified authentication hook that abstracts the backend provider.
 * 
 * Uses Firebase when VITE_USE_FIREBASE=true, otherwise uses Supabase.
 * This allows seamless switching between authentication backends.
 * 
 * @returns Authentication context with user state and auth methods
 */
export const useAuthBackend = () => {
    const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';

    if (useFirebase) {
        return useFirebaseAuth();
    }

    return useAuth();
};
