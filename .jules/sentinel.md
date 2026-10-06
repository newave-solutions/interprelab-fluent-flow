## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2026-10-06 - XSS Vulnerability in JSON LD-JSON Script Tags

**Vulnerability:** XSS vulnerability in `src/components/Breadcrumbs.tsx` where user-controlled or dynamic data (`structuredData`) was injected directly into a `<script type="application/ld+json">` tag using `JSON.stringify` inside `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not escape HTML characters by default. If a string within the JSON object contains `</script><script>alert(1)</script>`, it will prematurely close the script block and execute the payload, bypassing typical React XSS protections because it's rendered raw inside a script block.
**Prevention:** Always use a utility function (like `safeJsonStringify`) that escapes `<` (`\u003c`), `>` (`\u003e`), `&` (`\u0026`), and line terminators (`\u2028`, `\u2029`) into unicode sequences when embedding JSON in HTML script tags.
