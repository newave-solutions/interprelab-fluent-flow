## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-09-25 - Array Iteration Consolidation
**Learning:** Multiple sequential array  and  operations create unnecessary intermediate arrays and CPU overhead, especially on render-blocking paths.
**Action:** Replaced back-to-back iterations with a single `for...of` loop in `CallTracker.tsx` and `Dashboard.tsx`, yielding an O(N) pass for calculating multiple aggregate statistics.


## 2026-09-25 - Array Iteration Consolidation
**Learning:** Multiple sequential array `.reduce()` and `.filter()` operations create unnecessary intermediate arrays and CPU overhead, especially on render-blocking paths.
**Action:** Replaced back-to-back iterations with a single `for...of` loop in `CallTracker.tsx` and `Dashboard.tsx`, yielding an O(N) pass for calculating multiple aggregate statistics.
