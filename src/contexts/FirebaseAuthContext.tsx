import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { getFirebase } from '@/integrations/firebase/firebase';

interface FirebaseAuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [firebaseAuth, setFirebaseAuth] = useState<ReturnType<typeof getFirebase>['auth'] | null>(null);

    useEffect(() => {
        // Initialize Firebase auth
        try {
            const { auth } = getFirebase();
            setFirebaseAuth(auth);
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            setLoading(false);
            return;
        }
    }, []);

    useEffect(() => {
        if (!firebaseAuth) return;

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (import.meta.env.DEV) {
                console.debug('Firebase auth state changed:', user ? 'authenticated' : 'unauthenticated');
            }
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firebaseAuth]);

    const signIn = async (email: string, password: string) => {
        if (!firebaseAuth) {
            return { error: new Error('Firebase Auth is not initialized') };
        }
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            return { error: null };
        } catch (error) {
            console.error('Firebase sign in error:', error);
            return { error: error as Error };
        }
    };

    const signUp = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => {
        if (!firebaseAuth) {
            return { error: new Error('Firebase Auth is not initialized') };
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

            // Update user profile with name
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`,
            });

            return { error: null };
        } catch (error) {
            console.error('Firebase sign up error:', error);
            return { error: error as Error };
        }
    };

    const signInWithGoogle = async () => {
        if (!firebaseAuth) {
            return { error: new Error('Firebase Auth is not initialized') };
        }
        try {
            const provider = new GoogleAuthProvider();

            // Add additional OAuth parameters
            provider.setCustomParameters({
                prompt: 'select_account', // Force account selection
            });

            await signInWithPopup(firebaseAuth, provider);
            return { error: null };
        } catch (error) {
            console.error('Firebase Google sign in error:', error);
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        if (!firebaseAuth) return;
        try {
            await firebaseSignOut(firebaseAuth);
        } catch (error) {
            console.error('Firebase sign out error:', error);
        }
    };

    return (
        <FirebaseAuthContext.Provider
            value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}
        >
            {children}
        </FirebaseAuthContext.Provider>
    );
};

export const useFirebaseAuth = () => {
    const context = useContext(FirebaseAuthContext);
    if (context === undefined) {
        throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
    }
    return context;
};
