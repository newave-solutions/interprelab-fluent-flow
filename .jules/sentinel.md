## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2024-10-21 - [DOM-based XSS in Vanilla JavaScript Contexts]
**Vulnerability:** Unsanitized user inputs and API responses were injected directly into the DOM using `.innerHTML` within the Chrome extension content script (`public/chrome-extension/content-script.js`).
**Learning:** `DOMPurify`, which is used in the main React application, is not automatically available in the isolated vanilla JavaScript context of a Chrome extension content script. This architectural gap leaves extension interfaces vulnerable to XSS if `.innerHTML` is used for dynamic rendering.
**Prevention:** In vanilla JavaScript contexts where a sanitizer library is not available, always use an `escapeHTML` helper function before injecting dynamic data into `.innerHTML`, or prefer `.textContent` where HTML parsing is not required.
