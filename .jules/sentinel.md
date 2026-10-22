## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).
## 2025-02-28 - Cross-Site Scripting (XSS) via Unescaped JSON-LD and InnerHTML
**Vulnerability:** XSS vulnerability in `Breadcrumbs.tsx` where unescaped JSON was injected into a `<script>` tag via `dangerouslySetInnerHTML`. Additional DOM-based XSS vectors were found in the Chrome extension (`content-script.js`) where user input was injected directly into `.innerHTML` assignments.
**Learning:** `JSON.stringify` does not escape HTML characters by default, allowing attackers to prematurely close a `<script>` tag with `</script>` and inject arbitrary code. The Chrome extension, being vanilla JS, lacked built-in sanitization like DOMPurify available in the React app.
**Prevention:** Always escape `<` to `\u003c` when injecting JSON into script tags. For vanilla JS contexts like browser extensions, implement and consistently use a robust `escapeHTML` helper function before assigning any dynamic data to `.innerHTML`.
