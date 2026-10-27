## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-10-27 - Optimizing Array Iteration and Async Requests
**Learning:** Found sequential database requests and multiple successive array iteration passes (`.filter()`, `.reduce()`) in the dashboard data loading function. Sequential queries can block the main thread longer than necessary (waterfall effect), while multiple array iterations create unnecessary intermediate arrays.
**Action:** When working with dashboard or statistics aggregation functions, identify sequential queries that don't depend on each other and combine them using `Promise.all()`. Convert multiple successive array methods to a single `for...of` loop to iterate the collection exactly once, preventing intermediate allocations and reducing CPU overhead.
