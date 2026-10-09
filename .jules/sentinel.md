## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2023-10-25 - XSS Vulnerability in JSON-LD Structured Data
**Vulnerability:** The `<script type="application/ld+json">` tag in `Breadcrumbs.tsx` used standard `JSON.stringify` within `dangerouslySetInnerHTML`. This could potentially allow XSS attacks if any of the breadcrumb labels or dynamically generated URLs contained user-supplied input with unescaped HTML characters (like `<script>`).
**Learning:** `JSON.stringify` does not escape HTML control characters (`<`, `>`, `&`) by default, making it unsafe to embed directly within HTML `<script>` tags, as malicious sequences can terminate the script block and execute arbitrary code.
**Prevention:** Always use a utility function (like `safeJsonStringify`) that explicitly replaces `<`, `>`, `&`, and line terminators (`\u2028`, `\u2029`) with their unicode equivalents (e.g., `\u003c`) before rendering JSON directly into the DOM via `dangerouslySetInnerHTML`.
