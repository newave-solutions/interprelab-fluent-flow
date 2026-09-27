## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - JSON-LD XSS Vulnerability

**Vulnerability:** Found `JSON.stringify()` output passed directly to `dangerouslySetInnerHTML` in `<script type="application/ld+json">` in `src/components/Breadcrumbs.tsx`. Since user input (like URL path elements/slugs for articles) could be included in the structured data, this allows escaping the JSON context and injecting a `</script>` tag, enabling arbitrary JS execution.
**Learning:** Using `JSON.stringify` inside `<script>` blocks is a known XSS vector if data can contain `</script>`. React's standard HTML escaping doesn't apply inside `dangerouslySetInnerHTML`.
**Prevention:** Always escape data embedded in `<script>` tags using a utility function (e.g., `safeJsonStringify` replacing `<`, `>`, `&`, `\u2028`, and `\u2029` with their unicode string counterparts).
