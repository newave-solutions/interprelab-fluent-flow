## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - DOM-based XSS via JSON-LD

**Vulnerability:** A DOM-based XSS vulnerability existed in `src/components/Breadcrumbs.tsx` where dynamic route data was serialized with `JSON.stringify` and injected directly into a `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML`.
**Learning:** `JSON.stringify` does not escape HTML-sensitive characters (`<`, `>`, `&`, `'`). If the JSON object contains strings derived from user-controllable input (like URL paths or titles), an attacker could craft an input that breaks out of the script tag (e.g., using `</script><script>alert(1)</script>`) and executes arbitrary JavaScript in the context of the application.
**Prevention:** Always use a safe stringification method when embedding JSON in HTML. Introduce a utility like `safeJsonStringify` that double-escapes HTML characters (e.g., replacing `<` with `\u003c`) to prevent the browser parser from prematurely terminating the script tag.
