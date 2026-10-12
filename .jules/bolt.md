## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-10-12 - Array Aggregation Refactoring
**Learning:** Consolidating multiple `.reduce()` and `.filter()` calls into a single `for...of` loop is a safe and effective micro-optimization in this React/Vite codebase for preventing unnecessary intermediate array allocations, especially when dealing with data retrieved from Supabase.
**Action:** Always scan for consecutive array methods operating on the same dataset and combine them into a single-pass loop where clarity isn't significantly sacrificed.
