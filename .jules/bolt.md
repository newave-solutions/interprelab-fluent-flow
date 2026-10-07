## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-10-07 - Array Aggregation Optimization
**Learning:** The application codebase previously exhibited a pattern of chaining multiple `.reduce()` and `.filter()` operations on the same data array to calculate aggregated statistics (e.g., in `InterpreTrack.tsx`, `Dashboard.tsx`, and `data.ts`). This resulted in O(N*M) passes over the array and unnecessary intermediate array allocations.
**Action:** Consolidate multiple consecutive array methods into a single `for...of` loop when iterating over the same dataset for multiple aggregate calculations.
