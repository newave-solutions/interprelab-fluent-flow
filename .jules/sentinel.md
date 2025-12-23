## 2024-05-24 - Exposed API Keys and Backend Proxy
**Vulnerability:** Identified empty `apiKey` variable in `SmartFlashcards.tsx` and `ConversationMode.tsx` intended for client-side Gemini calls. This encourages leaking keys and exposes AI logic to the client.
**Learning:** Even if keys are empty in the repo, the pattern suggests developers might fill them in for local testing and accidentally commit them. Also, client-side AI calls bypass backend controls (rate limiting, auditing).
**Prevention:** Always proxy 3rd party API calls through Supabase Edge Functions. I refactored the components to use `interactive-module-ai` and added a `completion` action to the edge function to support flexible prompts securely.
