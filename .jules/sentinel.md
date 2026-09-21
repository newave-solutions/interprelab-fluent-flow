## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2025-02-23 - XSS Vulnerability in JSON-LD Injection

**Vulnerability:** A Cross-Site Scripting (XSS) vulnerability was found in `src/components/Breadcrumbs.tsx`. User-controlled or dynamically generated data in the `structuredData` object was injected into a `<script type="application/ld+json">` tag using `dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}`. If the data contained `</script><script>alert(1)</script>`, it would prematurely close the JSON-LD script block and execute malicious JavaScript.
**Learning:** Standard `JSON.stringify` does not escape HTML characters, making it unsafe to use directly inside HTML contexts (like script tags), even when formatted as JSON.
**Prevention:** Always sanitize JSON strings before embedding them in HTML by replacing characters that have special meaning in HTML, especially `<`. The project now provides a `safeJsonStringify` utility in `src/lib/utils.ts` for this exact purpose, which escapes `<` to `\u003c`.
