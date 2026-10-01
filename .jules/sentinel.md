## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2024-05-23 - XSS vulnerability in JSON.stringify injected into <script> tag
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in `src/components/Breadcrumbs.tsx`. JSON data generated via `JSON.stringify` was being embedded directly into a `<script type="application/ld+json">` tag using `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` doesn't escape characters like `<`, `>`, or `&`. If user-controlled data is included in the JSON, an attacker could potentially inject a payload like `</script><script>alert(1)</script>`, terminating the JSON block and executing malicious script.
**Prevention:** Always use a utility function like `safeJsonStringify` that properly escapes characters (`<`, `>`, `&`, and line terminators) to their Unicode equivalents (e.g., `\u003c`) when embedding JSON inside HTML tags, especially `<script>`.
