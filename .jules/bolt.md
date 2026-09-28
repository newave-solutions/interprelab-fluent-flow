## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-10-27 - Multiple Array Iterations
**Learning:** Performing multiple `.reduce()` and `.filter()` operations back-to-back on the same array structure is a common pattern in the codebase for calculating stats, which leads to redundant O(N) traversals and intermediate array allocations.
**Action:** Consolidate these operations into a single `for...of` loop to traverse the array once and update multiple accumulators simultaneously.
