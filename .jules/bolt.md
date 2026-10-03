## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-14 - Concurrent Database Queries & Loop Optimization
**Learning:** In the Supabase React architecture, fetching multiple independent data sets (like stats across different timeframes) sequentially creates a significant network waterfall, delaying initial render. Furthermore, using chained `.reduce()` and `.filter()` operations for calculating aggregate stats creates unnecessary intermediate arrays and CPU overhead.
**Action:** When multiple independent queries are needed on page load, group them using `Promise.all` to fetch concurrently. When calculating aggregate statistics over arrays, fuse multiple operations into a single `for...of` loop to eliminate intermediate allocations.
