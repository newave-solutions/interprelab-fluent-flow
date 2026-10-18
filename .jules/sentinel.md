## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2024-05-24 - Chrome Extension Vanilla JS XSS Vulnerability
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) via `.innerHTML` assignments in `public/chrome-extension/content-script.js`.
**Learning:** The Chrome extension runs in a vanilla JavaScript context entirely separate from the main React application, meaning it does not have access to standard libraries like DOMPurify or React's built-in XSS protection. Direct use of `.innerHTML` with unsanitized dynamic data (like speech recognition transcripts or API responses) introduced severe vulnerabilities.
**Prevention:** Always write custom sanitization functions (e.g., `escapeHTML`) when working in vanilla JavaScript contexts isolated from the main app's dependencies, and consistently apply them to any dynamic data before using it in `.innerHTML` assignments.
