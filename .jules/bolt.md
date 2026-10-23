## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-10-23 - Array Iteration Consolidation
**Learning:** The CallTracker dashboard calculated call statistics using 4 separate `reduce` and 2 `filter` calls, followed by 4 more `reduce` calls on the filtered subsets. This resulted in iterating over the same dataset 10 times and creating intermediate array allocations.
**Action:** Replaced back-to-back `filter` and `reduce` calls with a single `for...of` loop that computes all aggregate stats in one O(N) pass, significantly reducing CPU overhead when rendering dashboards with large datasets.
