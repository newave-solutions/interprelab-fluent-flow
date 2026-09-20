## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2024-05-25 - XSS Vulnerability via JSON-LD payload

**Vulnerability:** Found `dangerouslySetInnerHTML` injecting raw `JSON.stringify` payload into an `application/ld+json` script tag in `Breadcrumbs.tsx`.
**Learning:** `JSON.stringify` does not escape HTML characters such as `<` and `>`. If user input ends up in the serialized JSON (e.g. malicious URLs or category names), it can prematurely close the `<script>` tag and execute arbitrary code.
**Prevention:** Implement and use a safe JSON serializer (e.g. replacing `<` with `\u003c`) prior to injecting JSON-LD data.
