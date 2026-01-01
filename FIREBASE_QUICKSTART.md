# Firebase Integration Quick Start

## Overview

Your InterpreLab Fluent Flow application now supports **both Firebase and Supabase** for authentication. Use environment variables to toggle between backends.

## Current Setup

- ✅ Firebase SDK installed
- ✅ Firebase configuration created
- ✅ Firebase Auth context with Google Sign-In
- ✅ Unified auth hook for backend switching
- ✅ App.tsx updated to support both backends
- ✅ All environment variables configured

## Backend Toggle

### Using Supabase (Current Default)

In `.env.local`:

```bash
VITE_USE_FIREBASE=false
```

### Using Firebase

In `.env.local`:

```bash
VITE_USE_FIREBASE=true
```

> **Important**: Restart your development server after changing this variable:
>
> ```powershell
> npm run dev
> ```

## Next Steps

### 1. Complete Google OAuth Setup

Before you can test Firebase authentication, you need to:

1. **Create OAuth Client ID** in Google Cloud Console
2. **Enable Google Sign-In** in Firebase Console
3. **Add Authorized Domains** in Firebase Console

📖 **Full instructions**: See [`FIREBASE_SETUP.md`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/FIREBASE_SETUP.md)

### 2. Required OAuth Configuration

#### Authorized JavaScript Origins

```
http://localhost:8080
https://interprelab.com
https://www.interprelab.com
```

#### Authorized Redirect URIs

```
http://localhost:8080/__/auth/handler
https://interprelab.com/__/auth/handler
https://www.interprelab.com/__/auth/handler
```

### 3. Testing Locally

Once OAuth is configured:

```powershell
# Set Firebase as active backend
# In .env.local: VITE_USE_FIREBASE=true

# Start dev server
npm run dev

# Navigate to http://localhost:8080
# Try signing in with Google
```

## Using the Unified Auth Hook

Instead of importing `useAuth` or `useFirebaseAuth` directly, use the unified hook:

```typescript
import { useAuthBackend } from '@/hooks/useAuthBackend';

function MyComponent() {
  const { user, loading, signInWithGoogle, signOut } = useAuthBackend();
  
  // Same interface works with both Firebase and Supabase!
}
```

This automatically uses the correct backend based on `VITE_USE_FIREBASE`.

## Production Deployment

When ready to deploy to production:

1. Build your app:

   ```powershell
   npm run build
   ```

2. Deploy to Firebase Hosting (recommended):

   ```powershell
   firebase deploy --only hosting
   ```

3. Configure custom domain in Firebase Console

📖 **Full deployment guide**: See section 7 in [`FIREBASE_SETUP.md`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/FIREBASE_SETUP.md#7-production-deployment)

## Files Created

- [`src/integrations/firebase/firebase.ts`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/src/integrations/firebase/firebase.ts) - Firebase initialization
- [`src/contexts/FirebaseAuthContext.tsx`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/src/contexts/FirebaseAuthContext.tsx) - Firebase Auth provider
- [`src/hooks/useAuthBackend.ts`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/src/hooks/useAuthBackend.ts) - Unified auth hook
- [`FIREBASE_SETUP.md`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/FIREBASE_SETUP.md) - Complete setup guide

## Files Modified

- [`.env.local`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/.env.local) - Added Firebase config vars
- [`src/App.tsx`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/src/App.tsx) - Added conditional provider
- [`package.json`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/package.json) - Added firebase dependency

## Troubleshooting

See the full troubleshooting section in [`FIREBASE_SETUP.md`](file:///c:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/FIREBASE_SETUP.md#10-troubleshooting) for common issues and solutions.
