## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-24 - Array Methods Fusion
**Learning:** Chaining multiple `.reduce()` and `.filter()` calls on large arrays in React components can cause unnecessary intermediate array allocations and redundant iterations. In `InterpreTrack.tsx`, replacing 10 back-to-back array methods with a single `for...of` loop provided a measurable CPU efficiency win.
**Action:** When performing multiple aggregations or filtering operations on the same dataset (especially in rendering or data-loading paths), consolidate them into a single loop to reduce O(N) complexity multiplier.
