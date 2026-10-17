## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-23 - InterpreTrack Call Data Optimization
**Learning:** In the `CallTracker` dashboard, multiple consecutive O(N) array methods (`.reduce()` and `.filter()`) were used to calculate individual aggregate statistics like duration and earnings. This caused up to 10 array traversals per data fetch, creating significant CPU overhead and intermediate object allocation.
**Action:** When calculating aggregate statistics from an array, combine the operations into a single `for...of` loop to gather all needed metrics in a single pass.
