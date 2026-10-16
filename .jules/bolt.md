## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-10-16 - Consolidation of Multiple Array Operations in Data-Heavy Components
**Learning:** React components that calculate complex aggregate statistics (like `CallTracker.tsx` and `Dashboard.tsx`) can suffer from CPU overhead when multiple consecutive `.reduce()` and `.filter()` operations are chained or executed back-to-back on the same array. Each method iterates over the entire array and allocates intermediate arrays (in the case of `filter`).
**Action:** When calculating aggregate statistics in data-heavy components, consolidate multiple O(N) back-to-back `.reduce()` and `.filter()` calls into a single `for...of` loop. This avoids redundant passes and reduces intermediate array allocations.
