## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-06-15 - Array Iteration Performance
**Learning:** Chaining `.filter()` and multiple `.reduce()` calls on large datasets creates unnecessary intermediate arrays and forces multiple passes over the data, which increases CPU and memory overhead (O(N) operations compounded).
**Action:** Consolidate multiple array methods into a single `for...of` loop when deriving multiple aggregate values from the same dataset.
