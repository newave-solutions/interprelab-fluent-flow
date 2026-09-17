## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - JSON-LD Script Injection XSS Risk

**Vulnerability:** Found `dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}` inside `<script type="application/ld+json">` tags in `src/components/Breadcrumbs.tsx`. `structuredData` contained potentially unsanitized dynamic user input or route parameters (e.g. from breadcrumb labels).
**Learning:** `JSON.stringify` does not escape HTML control characters like `<` or `>`. If user input contains something like `</script><script>alert('XSS')</script>`, the browser will terminate the current script block and execute the injected payload, resulting in a Cross-Site Scripting (XSS) vulnerability.
**Prevention:** Always sanitize or safely escape JSON payloads before injecting them into HTML script tags. A common pattern is replacing all `<` characters with `\u003c`, which is perfectly valid JSON but prevents script tag breakouts. Created `safeJsonStringify` utility to enforce this pattern.
