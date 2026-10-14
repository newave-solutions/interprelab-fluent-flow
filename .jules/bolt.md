## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-10-14 - [O(N) Loop Consolidation for Aggregate Stats]
**Learning:** Across multiple files (`InterpreTrack.tsx`, `Dashboard.tsx`, `useCallLogs.ts`, `data.ts`), aggregate statistics were being calculated using multiple consecutive `.reduce()` and `.filter()` operations on the same arrays. In extreme cases, this caused up to 10 O(N) traversals and intermediate array allocations.
**Action:** Consolidate consecutive `.reduce()` and `.filter()` calls into a single `for...of` loop when computing multiple aggregates from the same dataset. This drastically reduces CPU overhead and avoids unnecessary garbage collection, scaling much better with larger datasets.
