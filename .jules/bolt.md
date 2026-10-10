## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-18 - Optimized consecutive array traversals
**Learning:** Performing multiple consecutive `.reduce()` calls on the same array to calculate aggregate statistics results in O(M*N) traversal overhead (where M is the number of reductions and N is array size). This was a bottleneck in `Dashboard.tsx` for aggregate metric compilation.
**Action:** Consolidate multiple consecutive array iterations into a single `for...of` loop pass. This pattern transforms O(M*N) complexity back to O(N) and should be used anywhere multiple summary statistics need to be computed over the same dataset.
