## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-24 - JSON-LD Injection via Breadcrumbs

**Vulnerability:** Found Potential Reflected XSS in `src/components/Breadcrumbs.tsx`. The component was injecting JSON-LD data into a `<script>` tag using `JSON.stringify` with user-controlled data (URL path) without proper escaping. A payload like `</script><script>...` in the URL could execute malicious code.
**Learning:** `JSON.stringify` is not safe for generating content inside HTML `<script>` tags because it does not escape the `<` character. The browser's HTML parser processes `</script>` before the JS parser handles the string.
**Prevention:** Use a safe serialization helper that replaces `<` with `\u003c` when embedding JSON in HTML. Added `safeJsonStringify` utility for this purpose.
