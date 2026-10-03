## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - JSON XSS in Script Tags

**Vulnerability:** XSS via `JSON.stringify` inside `<script type="application/ld+json">` tags using `dangerouslySetInnerHTML`.
**Learning:** Browsers do not parse HTML entities inside `<script>` tags but they do parse `<script>` closing tags. If `JSON.stringify` outputs a string containing `</script><script>alert(1)</script>`, it terminates the script block and executes the injected script, bypassing JSON structure.
**Prevention:** Always sanitize JSON embedded in HTML script tags. Implement a utility like `safeJsonStringify` that double-escapes `<` to `\\u003c`, `>` to `\\u003e`, and `&` to `\\u0026` to safely embed JSON data within HTML script tags.
