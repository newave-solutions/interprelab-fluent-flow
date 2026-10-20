## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## $(date +%Y-%m-%d) - DOM-Based XSS in Chrome Extension

**Vulnerability:** Found unescaped user data directly injected into the DOM via \`innerHTML\` in \`public/chrome-extension/content-script.js\` (e.g., in transcript and insights display). Also found unescaped JSON data within a JSON-LD script tag via \`dangerouslySetInnerHTML\` in \`src/components/Breadcrumbs.tsx\`.
**Learning:** Chrome extensions running in vanilla JS don't benefit from React's built-in XSS protection. Direct DOM manipulation using \`innerHTML\` requires manual sanitization of all dynamic variables. In JSON-LD injected into scripts, replacing \`<\` with \`\u003c\` is critical to prevent prematurely closing the script block and executing injected code.
**Prevention:** Implement a standard \`escapeHTML\` utility for all vanilla JS DOM manipulations, or use safe properties like \`textContent\` when possible. Never trust dynamic input.
