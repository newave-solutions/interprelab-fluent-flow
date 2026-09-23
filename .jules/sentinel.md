## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-24 - Client-Side API Key Exposure

**Vulnerability:** Direct client-side API calls to Gemini in `src/components/assessments/InterpreBotAssessment.tsx` using `VITE_INTERPRETEST_API_KEY` and `GEMINI_API_KEY` exposed sensitive credentials to the frontend.
**Learning:** Environment variables starting with `VITE_` are bundled into the client-side code, meaning any API keys stored this way are accessible to anyone inspecting the network traffic or source code.
**Prevention:** Never make direct calls to third-party APIs requiring sensitive keys from the client. Abstract such calls behind an authenticated backend proxy or edge function (like Supabase Edge Functions) to secure credentials.
