## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-10-08 - Array Aggregation Anti-Pattern
**Learning:** Chaining multiple `.reduce()` and `.filter()` operations on the same array to calculate aggregate statistics is a common pattern in this codebase (e.g., `Dashboard.tsx`, `CallTracker.tsx`, `InterpreTrack.tsx`, `src/lib/data.ts`). This creates O(k*N) complexity (where k is the number of operations) and numerous intermediate arrays.
**Action:** Replace these multiple array iteration chains with a single `for...of` loop to calculate all required aggregates simultaneously, achieving true O(N) complexity and eliminating intermediate allocations.
