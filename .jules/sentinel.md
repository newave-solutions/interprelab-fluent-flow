## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2026-09-24 - JSON-LD XSS Vulnerability

**Vulnerability:** XSS vulnerability in `src/components/Breadcrumbs.tsx` where user-controlled URL paths were injected unsanitized into a JSON-LD `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML` using `JSON.stringify`.
**Learning:** Using `JSON.stringify` directly into an HTML script block is dangerous because an attacker can break out of the script context by injecting `</script>` tags within string values, leading to Cross-Site Scripting (XSS).
**Prevention:** Always escape `<` characters (e.g., using a `safeJsonStringify` utility that replaces `<` with `\u003c`) before embedding JSON into HTML `<script>` blocks.
