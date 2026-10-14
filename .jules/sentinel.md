## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - DOM-based XSS in Chrome Extension Content Script
**Vulnerability:** The Chrome extension content script (`public/chrome-extension/content-script.js`) injected untrusted data directly into `.innerHTML` assignments. Specifically, terms, definitions, dynamically highlighted text, and feedback messages were constructed using string interpolation without HTML escaping.
**Learning:** Content scripts often live outside the purview of the main application's build process and linting (in this case, it was vanilla JS in the `public/` directory). Consequently, React's built-in XSS protection did not apply, and standard ESLint rules for the React app did not catch the issue.
**Prevention:**
1. Always assume vanilla JS scripts are vulnerable to XSS when manipulating the DOM.
2. Implement a centralized `escapeHTML` helper in vanilla JS scripts and enforce its use for all dynamically constructed HTML strings.
3. Review whether external scripts (like those in `public/`) should be included in the linting configuration.
