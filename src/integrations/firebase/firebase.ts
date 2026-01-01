import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Only initialize Firebase if we're using it
const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';

// Lazy initialization - only happens when Firebase is enabled
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

const initFirebase = () => {
    if (!useFirebase) {
        throw new Error('Firebase is not enabled. Set VITE_USE_FIREBASE=true to use Firebase.');
    }

    if (app) {
        // Already initialized
        return { app, auth: auth!, analytics };
    }

    // Validate required environment variables
    if (!firebaseConfig.apiKey) {
        throw new Error('Missing VITE_FIREBASE_API_KEY environment variable');
    }

    if (!firebaseConfig.authDomain) {
        throw new Error('Missing VITE_FIREBASE_AUTH_DOMAIN environment variable');
    }

    if (!firebaseConfig.projectId) {
        throw new Error('Missing VITE_FIREBASE_PROJECT_ID environment variable');
    }

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);

        // Only initialize analytics in production
        if (!import.meta.env.DEV && firebaseConfig.measurementId) {
            analytics = getAnalytics(app);
        }

        if (import.meta.env.DEV) {
            console.log('Firebase initialized successfully');
        }

        return { app, auth, analytics };
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
};

// Export a getter function that initializes on first access
const getFirebase = () => {
    if (!app && useFirebase) {
        initFirebase();
    }
    if (!useFirebase) {
        throw new Error('Firebase is not enabled. Set VITE_USE_FIREBASE=true to use Firebase.');
    }
    return { app: app!, auth: auth!, analytics };
};

// For backwards compatibility, export instances that throw if Firebase is disabled
const getFirebaseAuth = () => {
    if (!useFirebase) {
        throw new Error('Firebase Auth is not available when VITE_USE_FIREBASE=false');
    }
    if (!auth) {
        initFirebase();
    }
    return auth!;
};

const getFirebaseApp = () => {
    if (!useFirebase) {
        throw new Error('Firebase is not available when VITE_USE_FIREBASE=false');
    }
    if (!app) {
        initFirebase();
    }
    return app!;
};

// Export instances and helper functions
export { getFirebase, getFirebaseAuth as auth, getFirebaseApp as app, analytics };

