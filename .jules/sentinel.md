## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2025-02-23 - Hardcoded Client-Side Gemini API Key
**Vulnerability:** Client-side React component (`InterpreBotAssessment.tsx`) was making direct fetch requests to the Gemini API using an API key retrieved from environment variables (`import.meta.env.GEMINI_API_KEY`), exposing the secret to the browser.
**Learning:** Third-party AI/LLM API calls must never be executed directly from the client, as doing so requires exposing the API key in the frontend bundle. Any environment variable prefixed with `VITE_` is inherently public.
**Prevention:** Always route third-party API calls through a secure backend proxy or serverless function (like Supabase Edge Functions). In this project, use `supabase.functions.invoke('interactive-module-ai')` for AI completions.
