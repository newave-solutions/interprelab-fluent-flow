## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-30 - O(n) loops vs multiple .reduce/.filter array passes
**Learning:** React component files like `src/pages/InterpreTrack.tsx` had multiple `O(N)` `.reduce` and `.filter` loops chained over the same dataset (often ~10 passes per render/update). This is a codebase-specific anti-pattern.
**Action:** Always refactor sequential `Array.prototype.reduce` and `Array.prototype.filter` calls over the same array into a single `for...of` loop to save CPU cycles and prevent intermediate array garbage collection.
