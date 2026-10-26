## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-23 - InterpreTrack Dashboard Loop Consolidation
**Learning:** React component data-loading functions sometimes perform multiple `.reduce()` and `.filter()` operations over the same dataset sequentially, leading to excessive iteration and intermediate array allocations.
**Action:** When calculating multiple aggregate statistics from a single dataset, consolidate the logic into a single `for...of` loop to optimize CPU usage and avoid unnecessary intermediate arrays. Additionally, when making multiple independent Supabase queries in a component, use `Promise.all` to fetch them concurrently and prevent network waterfalls.
