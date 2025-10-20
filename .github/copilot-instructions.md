
# Copilot Instructions for interprelab-eco-landing-page

## Project Overview
- **Type:** Vite + React + TypeScript SPA
- **UI:** Tailwind CSS, shadcn-ui
- **Purpose:** Eco-focused landing page with modular, maintainable components and clear separation of UI, hooks, and pages.

## Architecture & Patterns
- **Entry Point:** `src/main.tsx` initializes the React app and wraps it in `BrowserRouter` for custom routing.
- **Routing:** Navigation is handled by React Router (`react-router-dom`). Page components are in `src/pages/` and routes are defined in `src/App.tsx` using a nested layout pattern (`Layout.tsx`).
- **UI Components:** Shared components are in `src/components/` and `src/components/ui/`, following shadcn-ui conventions (e.g., `button.tsx`, `card.tsx`, `accordion.tsx`).
- **Assets:** Images and static files are in `src/assets/` (for imports) and `public/` (for direct access).
- **Hooks:** Custom hooks (e.g., `use-mobile.tsx`, `use-toast.ts`) are in `src/hooks/` for reusable logic.
- **Utilities:** Shared helpers are in `src/lib/utils.ts` (e.g., `cn` for class merging).

## Developer Workflows
- **Install dependencies:** `npm i`
- **Start dev server:** `npm run dev` (Vite hot reload)
- **Build:** `npm run build` or VS Code "build" task (runs `dotnet build` for backend if present)
- **Preview:** `npm run preview`
- **Lint:** No explicit lint script; see `eslint.config.js` for config
- **Type Checking:** TypeScript config in `tsconfig*.json`

## Conventions & Practices
- **Component Structure:** Use functional components, colocate styles (e.g., `App.css`).
- **UI Library:** Follow shadcn-ui patterns for new UI elements. See `src/components/ui/` for examples.
- **Styling:** Use Tailwind utility classes. Global styles in `index.css`.
- **Pages:** Add new pages to `src/pages/` and register them in `src/App.tsx` routes.
- **Navigation:** Use `<Link>` from `react-router-dom` for navigation. See `Navigation.tsx` for menu structure.
- **Hooks:** Place reusable logic in `src/hooks/`, export as default.
- **Utils:** Place helpers in `src/lib/utils.ts`.

## Integration Points
- **Deployment:** Standard Vite/React build. Deploy using your preferred platform (e.g., Vercel, Netlify, GCP Cloud Run, Docker).
## Integration Points
- **Deployment:** Standard Vite/React build. Deploy using your preferred platform (e.g., Vercel, Netlify, GCP Cloud Run, Docker).
- **Custom Domain:** The intended production domain is `interprelab.com`. Configure DNS and hosting as needed for your provider.
- **Docker:** See `Dockerfile` and `nginx.conf` for container deployment.
- **GCP:** Deployment guides in `GCP_CLOUDRUN_DEPLOY.md`, `GCP_FORM_SETUP.md`, `GCP_SETUP.md`.

## Design spec / external resources
- The design spec referenced for the project is tracked in the local docs file: `docs/lovablespec.md`. If you prefer to keep a remote link only, add it to this file as plain text; do not add it in a way that tooling treats it as a repo file path.

## Examples
- **Add a UI component:** Place in `src/components/ui/`, follow shadcn-ui conventions (see `button.tsx`, `card.tsx`).
- **Add a page:** Place in `src/pages/`, add route in `src/App.tsx`.
- **Add a hook:** Place in `src/hooks/`, export as default.
- **Add navigation:** Update `Navigation.tsx` to include new links.

## References
- [`README.md`](../README.md) for setup/workflow details
- `src/components/ui/` for UI patterns
- `src/pages/` for page structure
- `src/App.tsx` for routing logic
- `GCP_CLOUDRUN_DEPLOY.md` for deployment guidance

---
**Update this file if project structure or workflows change.**
