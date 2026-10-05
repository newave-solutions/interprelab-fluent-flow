## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-23 - Data Aggregation in React Components\n**Learning:** Chaining multiple `.reduce()` and `.filter()` operations on data arrays inside component rendering (or hooks) creates unnecessary iterations and intermediate allocations.\n**Action:** Consolidate these operations into a single `for...of` loop to calculate all metrics in an O(N) single pass. Successfully applied to `Dashboard.tsx`, `InterpreTrack.tsx`, and `CallTracker.tsx`.
