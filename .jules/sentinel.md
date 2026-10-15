## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2025-02-23 - JSON Injection XSS in Structured Data

**Vulnerability:** XSS via JSON injection in `<script type="application/ld+json">` tag in `src/components/Breadcrumbs.tsx`. `dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}` was used without sanitization.
**Learning:** Injecting `JSON.stringify` directly into HTML `<script>` tags is dangerous. If the JSON data contains `</script><script>alert(1)</script>`, the browser's HTML parser intercepts the `</script>` tag, closing the current script block and executing the injected script, bypassing JSON parsing entirely.
**Prevention:** When injecting JSON data into HTML, always escape characters that have special meaning in HTML parsing, particularly `<` to `\u003c` (or use libraries that serialize JSON securely for HTML contexts).
