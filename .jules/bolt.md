## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-24 - Consolidated Array Iteration Optimizations
**Learning:** Found multiple instances where successive `.reduce()` and `.filter()` operations were chained to calculate aggregates across identical arrays (e.g., `InterpreTrack.tsx`, `Dashboard.tsx`, `useCallLogs.ts`, `data.ts`). This is an O(N*M) pattern where N is the array length and M is the number of aggregations, causing unnecessary array traversals, function calls, and intermediate array allocations (from `.filter()`).
**Action:** When calculating multiple aggregate values over the same dataset (such as total duration, total earnings, rounded duration, etc.), consolidate them into a single `for...of` loop. This reduces traversal to O(N), minimizes garbage collection overhead by eliminating intermediate array creation, and makes the algorithmic intent cleaner.
