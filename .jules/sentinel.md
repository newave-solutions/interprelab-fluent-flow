## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - XSS Vulnerability in JSON-LD Scripts

**Vulnerability:** The `Breadcrumbs.tsx` component was using standard `JSON.stringify` directly within `dangerouslySetInnerHTML` for injecting JSON-LD into a `<script>` tag. If a breadcrumb label ever contained a sequence like `</script>`, it could break out of the tag and execute arbitrary code.
**Learning:** The native `JSON.stringify` method does not escape HTML-sensitive characters (`<`, `>`, `&`) or specific line terminators by default, making it unsafe for direct injection into the DOM, even within a `<script>` tag block.
**Prevention:** Create and utilize a `safeJsonStringify` utility that replaces these characters with their unicode equivalents (`\u003c`, `\u003e`, `\u0026`, `\u2028`, `\u2029`) before injection.
