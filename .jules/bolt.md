## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-24 - Array Iteration Performance in Dashboards
**Learning:** Aggregating data in dashboards often tempts developers to use multiple chained `.reduce()` or `.filter()` calls on the same array. In `CallTracker.tsx` and `Dashboard.tsx`, this led to up to 10 passes over the same dataset.
**Action:** Consolidate multiple `.reduce()` and `.filter()` operations into a single `for...of` loop to calculate all aggregates in one O(N) pass, reducing intermediate array allocations and CPU overhead.
