## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2024-05-27 - XSS Vulnerability in Breadcrumbs
**Vulnerability:** A Cross-Site Scripting (XSS) vulnerability was found in `src/components/Breadcrumbs.tsx` where JSON-LD data was interpolated directly into a script tag using `dangerouslySetInnerHTML` with `JSON.stringify()`. This can allow attackers to inject malicious `<script>` tags through structured data content.
**Learning:** Using `JSON.stringify()` alone inside a `<script>` tag is not safe from XSS attacks, as closing script tags (`</script>`) within the stringified data can prematurely close the element and execute arbitrary code.
**Prevention:** Create and use a utility like `safeJsonStringify` that escapes characters such as `<`, `>`, and `&` to neutral unicode equivalents before inserting JSON into HTML attributes or tags.
