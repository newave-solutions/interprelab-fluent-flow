## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-09-19 - Intl.NumberFormat Caching Optimization
**Learning:** Instantiating `Intl.NumberFormat` repeatedly during rendering or inside loops (such as when rendering lists of dashboard metrics like `RecentCalls` or `StatsCards`) causes noticeable performance bottlenecks because it is an expensive operation.
**Action:** Use a memoized lookup `Map` to cache `Intl.NumberFormat` instances by their locale and configuration options to avoid redundant re-allocations on every call.
