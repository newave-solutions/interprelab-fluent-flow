## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2026-10-25 - Prevent XSS in JSON-LD structured data\n**Vulnerability:** A Cross-Site Scripting (XSS) vulnerability was present in `src/components/Breadcrumbs.tsx`. Unsanitized JSON output containing structured data was directly injected into a `<script>` tag using `dangerouslySetInnerHTML`.\n**Learning:** The browser's HTML parser stops parsing a script block immediately upon encountering `</script>`, even if that string is inside a valid JSON string literal. Standard `JSON.stringify()` does not escape `<` or `>`.\n**Prevention:** When injecting JSON directly into a `<script>` tag, always sanitize the output by escaping characters that have meaning to the HTML parser. Use `JSON.stringify(data).replace(/</g, '\\u003c')` to safely serialize JSON for inline scripts.
