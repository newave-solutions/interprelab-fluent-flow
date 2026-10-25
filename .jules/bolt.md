## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-15 - InterpreTrack Data Processing Bottleneck
**Learning:** Found an anti-pattern in `src/pages/InterpreTrack.tsx` where 6 separate `.reduce()` and 2 `.filter()` passes were used on the `monthData` array to calculate statistics, resulting in 8 total array iterations. Additionally, the month data and recent calls were fetched sequentially, causing a network waterfall.
**Action:** Replaced sequential queries with `Promise.all` for concurrent fetching, and consolidated all array iterations into a single `for...of` loop to calculate `totalDuration`, `totalEarnings`, and breakdowns simultaneously, significantly reducing CPU overhead on render.
