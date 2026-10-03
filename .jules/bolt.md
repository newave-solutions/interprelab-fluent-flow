## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-10-03 - Array Iteration and Concurrent Queries
**Learning:** The `Dashboard` component had a network waterfall by fetching 4 independent Supabase queries sequentially, and performed 2 `.reduce()` passes to calculate summary metrics.
**Action:** Replaced sequential awaits with `Promise.all()` and consolidated `.reduce()` passes into a single `for...of` loop for O(N) calculation.
