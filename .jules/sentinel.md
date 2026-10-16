## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2024-05-30 - XSS in application/ld+json Structured Data via React dangerouslySetInnerHTML
**Vulnerability:** XSS via unsanitized JSON data embedded in `<script type="application/ld+json">` tag using React's `dangerouslySetInnerHTML`. Specifically, in `src/components/Breadcrumbs.tsx`, `JSON.stringify` output was directly inserted without escaping `<` characters. An attacker could craft a URL like `/resources/articles/</script><script>alert("XSS")</script>` which gets placed in the `name` property of structured data, closing the structured data script block and opening a new executable script block.
**Learning:** React's DOM-based escaping mechanisms do not apply within `dangerouslySetInnerHTML`. Moreover, `JSON.stringify` does not escape `<` characters. When stringifying JSON intended to be embedded within HTML `<script>` tags, failing to escape `<` allows attackers to terminate the current `<script>` and inject arbitrary HTML/JS.
**Prevention:** When injecting JSON data into `<script>` elements (even data scripts like `ld+json`), always sanitize the stringified output by replacing `<` with `\u003c` (using `JSON.stringify(data).replace(/</g, '\\u003c')`) to ensure the browser parser does not interpret it as a closing tag.
