## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-10-14 - Optimize Array Iteration for Aggregate Statistics\n**Learning:** In components calculating numerous aggregate metrics from lists (like dashboards or trackers), using multiple back-to-back `.reduce()` and `.filter()` calls on the same array results in severe (N * M)$ time complexity (where M is the number of operations). This forces unnecessary array allocations and repeated traversals, causing significant CPU overhead.\n**Action:** Replaced 10 multiple consecutive `.reduce()` and `.filter()` operations with a single `for...of` loop in `src/pages/CallTracker.tsx`, reducing the iteration to a single (N)$ pass. Always search for overlapping array iteration in dashboard components.
