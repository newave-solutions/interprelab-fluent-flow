## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-23 - Intl.NumberFormat Instantiation Overhead
**Learning:** `Intl.NumberFormat` instantiation is notoriously slow in V8/JavaScript. Repeatedly calling `new Intl.NumberFormat` inside React render cycles (e.g. mapping over financial data in `earnings-projection.tsx`) can noticeably degrade performance.
**Action:** Implement caching via `Map` keyed by locale and options in utility functions (`formatCurrency`, `formatNumber`), and refactor components to use these cached utilities instead of direct inline instantiation.

## 2024-05-23 - Pnpm Lockfile Upgrades
**Learning:** This project's `pnpm-lock.yaml` is pinned to lockfileVersion 6.0. Using newer pnpm versions (v9+) triggers an automatic rewrite to v9.0, resulting in massive diffs that violate the <50 line change constraint.
**Action:** Always discard unintended lockfile upgrades via `git checkout pnpm-lock.yaml` unless explicitly instructed to upgrade dependencies.
