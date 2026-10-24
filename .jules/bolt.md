## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
\n## 2026-10-24 - Array Reductions Optimization\n**Learning:** Consolidating sequential  and  operations over identical arrays into a single O(N)  loop significantly reduces CPU time and intermediate object allocations in performance-sensitive metric aggregation.\n**Action:** Replaced 10 operations with 1 loop in `InterpreTrack.tsx`.

## 2024-05-23 - Array Iteration and Concurrent Data Fetching
**Learning:** Sequential Supabase `.select()` requests and multiple back-to-back `.reduce()` / `.filter()` calls cause noticeable frontend CPU and network overhead during dashboard hydration.
**Action:** When working on data-heavy dashboards, immediately wrap independent API calls in `Promise.all` and merge separate array iterations into a single `for...of` loop to prevent memory thrashing.
