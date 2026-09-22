## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-09-22 - Expensive Intl Instantiations\n**Learning:** Instantiating `Intl.*Format` objects is a known JS performance bottleneck. Doing this inline within React renders causes unnecessary recalculations and overhead.\n**Action:** Always cache `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.RelativeTimeFormat` instances using Maps keyed by their configuration options. Use the optimized utilities in `src/utils/currency.ts`, `src/utils/numbers.ts`, and `src/utils/date.ts` instead of instantiating them inline in components.
