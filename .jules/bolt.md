## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-10-24 - Consolidating Array Traversals & Promise.all Data Fetching
**Learning:** Performing multiple chained `.reduce()` or `.filter()` operations on the same large array allocates intermediate arrays and costs CPU time. Sequentially awaiting data queries (like Supabase `.select()`) that don't depend on each other causes a network waterfall.
**Action:** Replaced chained array functions with a single `for...of` loop to aggregate multiple metrics simultaneously, avoiding intermediate array allocation. Used `Promise.all` to fetch independent dataset queries concurrently, cutting down total data fetching time.
