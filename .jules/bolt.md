## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## $(date +%Y-%m-%d) - Array Aggregation Optimization
**Learning:** Components frequently run multiple consecutive `.reduce()` or `.filter()` calls on the same array to calculate aggregate statistics (e.g., `totalDuration`, `totalEarnings`, `totalRounded`). This results in multiple O(N) traversals and intermediate array allocations.
**Action:** Replace multiple consecutive array methods with a single `for...of` loop to traverse the array once and accumulate all required metrics, significantly reducing CPU overhead and memory allocation.
