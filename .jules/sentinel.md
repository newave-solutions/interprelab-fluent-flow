## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - Hardcoded API Key and Direct Client-Side API Call

**Vulnerability:** Found hardcoded `VITE_INTERPRETEST_API_KEY` and `GEMINI_API_KEY` fallbacks in `src/components/assessments/InterpreBotAssessment.tsx`, making direct client-side requests to the Gemini API (`generativelanguage.googleapis.com`).
**Learning:** Directly calling third-party AI APIs from the client exposes API keys in the frontend bundle, allowing anyone to extract them and exhaust API quotas or use them maliciously. Relying on `import.meta.env` for these keys without a secure backend relay is a critical security gap.
**Prevention:** Always route third-party API calls (especially those requiring secret keys) through an authenticated backend service or Edge Function (like `supabase.functions.invoke`). This keeps secrets out of the client bundle and allows for proper rate limiting and authorization.
