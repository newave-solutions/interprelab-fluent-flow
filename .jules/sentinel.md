## 2024-05-24 - Hardcoded Secrets in Client and XSS Potential

**Vulnerability:** Hardcoded fallback values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `src/integrations/supabase/client.ts`. Also identified XSS vulnerability in `src/pages/Article.tsx` using `dangerouslySetInnerHTML` without sanitization.
**Learning:** Providing hardcoded fallbacks for secrets (even if 'anon') encourages poor security hygiene and creates a risk if the repository is cloned or forked (pointing to the original backend). It also bypasses environment configuration validation.
**Prevention:** Always rely on environment variables for configuration. Throw explicit errors if required variables are missing to fail fast and securely. Use libraries like `dompurify` for any HTML injection.

## 2025-02-23 - Hardcoded Secrets in Setup Scripts

**Vulnerability:** Found hardcoded `VITE_SUPABASE_ANON_KEY` and project URL in `setup-github-actions.sh`.
**Learning:** Even in setup instructions, hardcoding secrets encourages bad practices and leaks project-specific configuration in the repository history. Users might blindly commit these or assume it's safe to hardcode them elsewhere.
**Prevention:** Use placeholders (e.g., `<YOUR_KEY>`) in scripts and documentation, and direct users to the source of truth (e.g., dashboard, environment variables).

## 2025-02-23 - Content Security Policy Mismatch

**Vulnerability:** `nginx.conf` contained a hardcoded Content Security Policy (CSP) referencing an outdated/unused Supabase Project ID (`iokgkrnbawhizmuejluz`), while the application code (`.env.production`, `config.toml`) utilized different project IDs (`opmafykbhjinqebgflnl`, `ggyzlvbtkibqnkfhgnbe`).
**Learning:** Hardcoding specific external domains in static configuration files (like nginx.conf) creates a high risk of service denial in production if the backend infrastructure changes, as the CSP will block legitimate traffic. This is a common "Configuration Drift" issue.
**Prevention:** Use environment variable substitution (e.g., `envsubst`) in container startup scripts to inject the correct allowed domains into the CSP at runtime, ensuring the security policy always matches the active environment configuration.

## 2025-02-23 - DOM-Based XSS in Vanilla JS Environments
**Vulnerability:** The Chrome extension (`public/chrome-extension/content-script.js`) manipulated the DOM directly via `.innerHTML` assignments using unescaped user inputs (like transcribed text and parsed entities), introducing a risk of DOM-based XSS.
**Learning:** In React applications, we typically rely on tools like `DOMPurify` or React's built-in escaping. However, vanilla JS environments (like extension content scripts) don't have these protections by default and are highly vulnerable if `innerHTML` is used for dynamic content insertion.
**Prevention:** In vanilla JavaScript, always sanitize dynamic inputs using a custom `escapeHTML` helper before inserting them into the DOM with `.innerHTML`, or use safer alternatives like `.textContent` where HTML parsing is not required.
