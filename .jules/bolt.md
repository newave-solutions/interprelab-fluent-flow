## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-10-15 - Optimize ASL progress calculations in InterpreSigns
**Learning:** Derived states calculated redundantly via expensive inline `Object.values(...).reduce()` logic cause unnecessary CPU overhead on every render, especially when tracking progress metrics.
**Action:** Replace duplicated filtering and mapping logic in state updates/renders with a single `useMemo` block using a generic `for...in` or `for...of` iteration to compute multiple aggregations (e.g., `totalMastered`, `totalCorrect`) in one O(N) pass.
