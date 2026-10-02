## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - XSS via JSON.stringify in Script Tags

**Vulnerability:** The `Breadcrumbs.tsx` component used `JSON.stringify` inside `dangerouslySetInnerHTML` for a `<script type="application/ld+json">` tag. This allowed XSS because user-controllable data (like URL paths) could inject `</script>` tags, breaking out of the script context and executing arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters by default. When injecting JSON into HTML (especially `<script>` tags), it is unsafe to use `JSON.stringify` alone.
**Prevention:** Always use a utility function (like `safeJsonStringify`) that explicitly replaces dangerous HTML characters (`<`, `>`, `&`) and line terminators with their unicode escape sequences before embedding JSON in HTML.
