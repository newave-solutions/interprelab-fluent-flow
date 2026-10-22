## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-05-24 - Cross-Site Scripting (XSS) in Vanilla JS Extension Content Script
**Vulnerability:** DOM-based XSS via direct `innerHTML` assignments with unsanitized dynamic user input in `public/chrome-extension/content-script.js`.
**Learning:** The React application correctly uses DOMPurify and structured JSX. However, the Chrome extension runs as a plain vanilla JavaScript content script, where there's no framework protecting against injection, and DOMPurify isn't bundled. Developers mistakenly treated variables mapped to `innerHTML` as safe, opening the door for XSS from spoken transcripts or backend API responses.
**Prevention:** Always use an `escapeHTML` helper function to sanitize dynamic variables before interpolating them into HTML strings that will be assigned via `.innerHTML`, or prefer `.textContent` where HTML parsing is not required.
