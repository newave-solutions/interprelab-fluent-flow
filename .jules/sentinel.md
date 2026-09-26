## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2025-02-26 - [XSS Vulnerability in JSON-LD Script Injection]
**Vulnerability:** Found a Cross-Site Scripting (XSS) vulnerability pattern where `JSON.stringify` was used directly inside a `<script type="application/ld+json">` tag with `dangerouslySetInnerHTML`. An attacker could inject `</script><script>alert(1)</script>` into the structured data content and break out of the script tag, executing arbitrary JS.
**Learning:** Using `JSON.stringify` within HTML script tags does not escape characters that HTML parsers consider significant (e.g., `<` and `>`), which can lead to XSS. This is a common but dangerous pattern in SEO structured data injection.
**Prevention:** Implement and use a safe JSON stringification utility (e.g., `safeJsonStringify`) that explicitly replaces sensitive characters (`<`, `>`, `&`, `\u2028`, `\u2029`) with their unicode escape sequences before embedding JSON data in HTML.
