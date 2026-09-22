## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - XSS Potential in JSON-LD Injection

**Vulnerability:** Found `dangerouslySetInnerHTML` in `src/components/Breadcrumbs.tsx` being used with a raw `JSON.stringify` to inject JSON-LD context data into a `<script>` tag.
**Learning:** When injecting dynamic content directly into HTML elements via `dangerouslySetInnerHTML`, especially inside `<script>` tags, standard stringification does not escape HTML termination tags (like `</script>`). If the JSON data includes user input, an attacker could potentially terminate the script tag early and execute arbitrary HTML/JS.
**Prevention:** Create and use a utility like `safeJsonStringify` which explicitly replaces `<` with `\u003c` to neutralize this threat while retaining perfectly valid JSON parsing for structured data.
