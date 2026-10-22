## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-23 - InterpreTrack Array Aggregation Optimization
**Learning:** Sequential `.reduce()` and `.filter()` operations over the same array to extract various statistics can significantly degrade performance, as they create intermediate array allocations and perform O(N * M) passes (where M is the number of aggregations). In `src/pages/CallTracker.tsx`, calculating dashboard stats required 10 consecutive full iterations over `monthData`.
**Action:** Always identify back-to-back `.reduce()` and `.filter()` calls. Refactor them into a single O(N) `for...of` loop to calculate all required metrics in one pass, minimizing CPU overhead and preventing unnecessary garbage collection.
