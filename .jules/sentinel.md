## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2024-05-25 - XSS in Structured JSON-LD Data

**Vulnerability:** Found `JSON.stringify` used inside `<script type="application/ld+json">` tag with `dangerouslySetInnerHTML` in `Breadcrumbs.tsx`. This allows an attacker to inject `</script>` and execute arbitrary code.
**Learning:** `JSON.stringify` does not escape HTML control characters like `<` and `>`. Also learned that when replacing characters with unicode escapes in JS (`replace(/</g, '\\u003c')`), double backslashes must be used, or the JS engine evaluates them into the raw character at runtime, rendering the mitigation useless.
**Prevention:** Use a `safeJsonStringify` utility that replaces dangerous HTML characters with their harmless Unicode escape sequences (`\\u003c`, `\\u003e`, `\\u0026`). Also ensure line terminators like `\u2028` and `\u2029` are handled.
