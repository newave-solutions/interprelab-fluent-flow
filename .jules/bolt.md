## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-24 - Data Aggregation Array Methods Overhead
**Learning:** Chained array methods like `.filter().forEach()` or sequential `.reduce()` calls in data calculation functions (e.g., `src/lib/data.ts`) can create unnecessary intermediate arrays and multiple iteration passes over the same dataset, increasing CPU overhead and memory allocation.
**Action:** Replace sequential `.reduce()` passes and `.filter().forEach()` chains with single `for...of` loops, particularly for aggregations of time-series or list data, to minimize iterations and memory allocation. Ensure inline code comments are provided for non-obvious optimizations when acting as Bolt.
