## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2026-09-21 - PerformanceHeatmap nested lookup optimization
**Learning:** The `getDataForCell` function in `PerformanceHeatmap` used `Array.prototype.find` inside a nested map of 7 days x 24 hours, making it an O(n^2) operation during rendering. This degrades performance when the data set grows or on frequent re-renders.
**Action:** Use `useMemo` to pre-compute a lookup `Map` keyed by `day-hour` for O(1) lookups inside the rendering loop.
