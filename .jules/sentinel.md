## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - Prevent DOM-based XSS in JSON-LD Injection

**Vulnerability:** The `Breadcrumbs.tsx` component passed `JSON.stringify(structuredData)` directly into a `dangerouslySetInnerHTML` script tag for JSON-LD SEO data. A maliciously crafted path segment could inject closing script tags (`</script>`) followed by executable JavaScript.
**Learning:** Standard `JSON.stringify()` does not escape HTML characters like `<`, `>`, or `&`, allowing attackers to break out of the JSON string context and the `<script>` tag context entirely if the data is rendered unescaped within HTML.
**Prevention:** When embedding JSON within a `<script>` tag (like JSON-LD), always use a sanitization utility like `safeJsonStringify` which replaces dangerous HTML and Unicode characters (e.g., `<`, `>`, `&`, `'`, `\u2028`, `\u2029`) with their unicode escape sequences (e.g., `\\u003c`).
