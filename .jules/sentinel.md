## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - DOM-based XSS via JSON-LD in Breadcrumbs

**Vulnerability:** Found DOM-based XSS vulnerability in `src/components/Breadcrumbs.tsx`. `dangerouslySetInnerHTML` was being used to inject JSON-LD script content where `JSON.stringify` was called on user-controlled data (`location.pathname`). If the pathname contained unescaped characters like `</script><script>alert(1)</script>`, it could break out of the script tag and execute malicious code.
**Learning:** `JSON.stringify` alone is not safe for outputting JSON within HTML `<script>` tags, as it doesn't escape characters like `<` and `>`, allowing an attacker to prematurely close the `<script>` tag.
**Prevention:** Always use a safe stringify function (like the reusable `safeJsonStringify` pattern added to `src/lib/utils.ts`) that replaces `<` with `\u003c`, `>` with `\u003e`, and `&` with `\u0026` to safely escape output for inclusion in HTML `<script>` tags.
