## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-10-13 - Avoid lockfile churn when typechecking
**Learning:** Running `npm install --no-save typescript` to temporarily fix a missing `tsc` command modifies `package.json` and `package-lock.json` unprompted. This violates Bolt's constraints and breaks code reviews.
**Action:** Always strictly use `git restore package.json package-lock.json` directly after a temporary installation, or rely solely on `npx tsc --noEmit` which downloads temporarily without touching package files.
