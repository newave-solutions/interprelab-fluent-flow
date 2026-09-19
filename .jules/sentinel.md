## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2026-09-19 - [Fix XSS Vulnerability in JSON-LD Scripts]
**Vulnerability:** A Cross-Site Scripting (XSS) vulnerability was found in the `Breadcrumbs` component where `structuredData` (containing user-controlled path slugs) was serialized directly into an HTML `<script>` block using `JSON.stringify()`.
**Learning:** Using `dangerouslySetInnerHTML` to inject JSON data is common for JSON-LD, but `JSON.stringify` does not escape HTML control characters like `<`. If the JSON contains `</script><script>...`, it can break out of the context and execute arbitrary code.
**Prevention:** Always sanitize JSON injected into HTML blocks. A reusable `safeJsonStringify` utility that replaces `<` with `\u003c` ensures the payload remains valid JSON while mitigating the HTML parsing risk.
