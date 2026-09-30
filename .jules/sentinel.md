## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2024-05-24 - JSON-LD XSS Vector
**Vulnerability:** XSS vulnerability found in `src/components/Breadcrumbs.tsx` where unescaped URL inputs were being stringified and injected into a `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML`.
**Learning:** React's built-in XSS protection does not apply to `<script>` bodies injected with `dangerouslySetInnerHTML`. Calling `JSON.stringify` on objects containing strings with `</script>` tags will break out of the script block and allow code execution, bypassing JSON syntax entirely.
**Prevention:** Always use a utility like `safeJsonStringify` which explicitly replaces `<, >, &, \u2028, \u2029` with unicode escape sequences (e.g. `\u003c`) when stringifying JSON objects for injection into HTML script tags.
