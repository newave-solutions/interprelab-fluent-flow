## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-10-26 - Optimize Promise.all and Array Iterations in CallTracker
**Learning:** Network waterfalls and repetitive array iterations ( followed by multiple  passes) on the same dataset can significantly bottleneck dashboard loading performance.
**Action:** When loading multiple independent datasets (e.g., month stats and recent calls), dispatch queries concurrently using `Promise.all`. Additionally, consolidate multiple `reduce` and `filter` passes on the same array into a single `O(N)` `for...of` loop to minimize CPU overhead and intermediate array allocations.
## 2024-10-26 - Optimize Promise.all and Array Iterations in CallTracker
**Learning:** Network waterfalls and repetitive array iterations (`filter` followed by multiple `reduce` passes) on the same dataset can significantly bottleneck dashboard loading performance.
**Action:** When loading multiple independent datasets (e.g., month stats and recent calls), dispatch queries concurrently using `Promise.all`. Additionally, consolidate multiple `reduce` and `filter` passes on the same array into a single `O(N)` `for...of` loop to minimize CPU overhead and intermediate array allocations.
