# Firebase Setup Guide

This guide walks you through setting up Firebase Authentication with Google Sign-In for the InterpreLab Fluent Flow application.

## Prerequisites

- Firebase project created: **interprelab-eco-landing-93ac3**
- Google Cloud Console access
- Domain ownership of **interprelab.com**

## 1. Google Cloud Console OAuth Configuration

### Enable Google Sign-In API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **interprelab-eco-landing-93ac3**
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. If prompted, configure the OAuth consent screen first

### Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in required fields:
   - **App name**: InterpreLab
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes (optional for basic auth):
   - `email`
   - `profile`
5. Save and continue

### Create OAuth 2.0 Client ID

1. Go back to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: **InterpreLab Web Client**

#### Authorized JavaScript Origins

Add these URIs (one per line):

```
http://localhost:8080
https://interprelab.com
https://www.interprelab.com
```

> **Note**: Only use `http://` for localhost. Production domains **must** use `https://`.

#### Authorized Redirect URIs

Add these URIs (one per line):

```
http://localhost:8080/__/auth/handler
https://interprelab.com/__/auth/handler
https://www.interprelab.com/__/auth/handler
```

> **Important**: The `/__/auth/handler` path is Firebase's authentication callback endpoint.

1. Click **Create** and save your Client ID

## 2. Firebase Console Configuration

### Enable Google Sign-In Provider

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **interprelab-eco-landing-93ac3**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Click **Enable** toggle
6. Enter your **Web SDK configuration** (should auto-populate)
7. Under **Web client ID**, paste the OAuth Client ID from step 1
8. Under **Web client secret**, paste the OAuth Client Secret from step 1
9. Click **Save**

### Add Authorized Domains

1. Still in **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add these domains:
   - `interprelab.com`
   - `www.interprelab.com`

   > **Note**: `localhost` is already authorized by default

## 3. Environment Variables

Your `.env.local` file already contains the Firebase configuration. Verify these values:

```bash
VITE_FIREBASE_API_KEY=AIzaSyDTCsx0jNNHQpXx0fSh5gMvqUwBhcArpi8
VITE_FIREBASE_AUTH_DOMAIN=interprelab-eco-landing-93ac3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=interprelab-eco-landing-93ac3
VITE_FIREBASE_STORAGE_BUCKET=interprelab-eco-landing-93ac3.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=932992065324
VITE_FIREBASE_APP_ID=1:932992065324:web:395eda8bb8f100671f5689
VITE_FIREBASE_MEASUREMENT_ID=G-1EC1XW9J7V
```

## 4. Toggle Between Firebase and Supabase

Use the `VITE_USE_FIREBASE` environment variable to switch backends:

### Use Supabase (current default)

```bash
VITE_USE_FIREBASE=false
```

### Use Firebase

```bash
VITE_USE_FIREBASE=true
```

> **Important**: Restart your development server after changing this variable.

## 5. Update Application Code

You'll need to modify your app to use the Firebase auth context when `VITE_USE_FIREBASE=true`.

### Option A: Conditional Provider (Recommended)

Update your `main.tsx` or `App.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext'; // Supabase
import { FirebaseAuthProvider } from '@/contexts/FirebaseAuthContext';

const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';

function App() {
  const AuthProviderComponent = useFirebase ? FirebaseAuthProvider : AuthProvider;
  
  return (
    <AuthProviderComponent>
      {/* Your app components */}
    </AuthProviderComponent>
  );
}
```

### Option B: Unified Auth Hook (Advanced)

Create a unified auth hook that abstracts the backend:

```typescript
// src/hooks/useAuthBackend.ts
import { useAuth } from '@/contexts/AuthContext';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

export const useAuthBackend = () => {
  const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true';
  
  if (useFirebase) {
    return useFirebaseAuth();
  }
  return useAuth();
};
```

Then replace all `useAuth()` calls with `useAuthBackend()`.

## 6. Testing Locally

1. **Start the development server**:

   ```powershell
   npm run dev
   ```

2. **Open your browser** to `http://localhost:8080`

3. **Navigate to sign-in page** and click "Sign in with Google"

4. **Expected flow**:
   - Google OAuth popup appears
   - Select your Google account
   - Grant permissions
   - Redirected back to `http://localhost:8080/__/auth/handler`
   - Firebase processes the authentication
   - Redirected to your app (authenticated)

5. **Check for errors**:
   - Open browser DevTools (F12)
   - Check Console for any Firebase errors
   - Check Network tab for failed requests

## 7. Production Deployment

### Using Firebase Hosting

1. **Install Firebase CLI**:

   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```powershell
   firebase login
   ```

3. **Initialize Firebase Hosting**:

   ```powershell
   cd c:\Users\LSA\Coding-projects\interprelab-fluent-flow\interprelab-fluent-flow
   firebase init hosting
   ```

   - Select existing project: **interprelab-eco-landing-93ac3**
   - Public directory: `dist`
   - Configure as single-page app: **Yes**
   - Set up automatic builds with GitHub: **No** (or Yes if you want)

4. **Build your app**:

   ```powershell
   npm run build
   ```

5. **Deploy to Firebase**:

   ```powershell
   firebase deploy --only hosting
   ```

6. **Custom Domain Setup**:
   - In Firebase Console → **Hosting** → **Add custom domain**
   - Enter `interprelab.com`
   - Follow instructions to update DNS records at your domain registrar
   - Firebase automatically provisions SSL certificate

### Using Other Hosting (Vercel, Netlify, etc.)

Ensure your hosting supports:

- HTTPS (required for OAuth)
- Single-page app routing (all routes redirect to index.html)
- Environment variables configuration

## 8. Security Considerations

### Firebase Security Rules

Since your API key is public (visible in client code), you **must** configure Firebase Security Rules:

1. Go to Firebase Console → **Firestore Database** → **Rules**
2. Example rules for authenticated users only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

1. For more granular control:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public data
    match /public/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### Storage Security Rules

If using Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 9. Migration Checklist

- [ ] Complete Google Cloud Console OAuth setup
- [ ] Enable Google Sign-In in Firebase Console
- [ ] Add authorized domains in Firebase Console
- [ ] Test authentication locally on `http://localhost:8080`
- [ ] Update app code to conditionally use Firebase auth
- [ ] Configure Firebase Security Rules
- [ ] Build and test production build
- [ ] Deploy to Firebase Hosting (or your preferred host)
- [ ] Configure custom domain `interprelab.com`
- [ ] Test authentication on production domain
- [ ] Verify SSL certificate is active
- [ ] Test Google Sign-In on production
- [ ] Monitor Firebase Console for auth events
- [ ] Migrate existing Supabase users (if needed)
- [ ] Switch `VITE_USE_FIREBASE=true` in production
- [ ] Decommission Supabase (optional, after validation period)

## 10. Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: OAuth error stating redirect URI doesn't match

**Solution**:

- Verify the redirect URI in Google Cloud Console exactly matches Firebase's format
- Check for typos or trailing slashes
- Ensure `http://` vs `https://` is correct

### "Invalid API Key" Error

**Problem**: Firebase can't initialize

**Solution**:

- Verify `.env.local` has correct API key
- Restart development server after changing `.env.local`
- Check that environment variable starts with `VITE_` prefix

### Google Popup Blocked

**Problem**: Browser blocks OAuth popup

**Solution**:

- Allow popups for `localhost:8080` in browser settings
- Try using `signInWithRedirect` instead of `signInWithPopup`

### "Domain not authorized" Error

**Problem**: Can't sign in on production domain

**Solution**:

- Add domain to Firebase Console → Authentication → Authorized domains
- Add domain to Google Cloud Console → Authorized JavaScript Origins
- Wait a few minutes for changes to propagate

## Support

For Firebase-specific issues:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For OAuth issues:

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
