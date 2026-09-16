## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2025-02-27 - Hoisting Static Arrays to Prevent Re-allocations
**Learning:** Found that multiple functional components (`FAQ.tsx`, `Features.tsx`, `HowItWorks.tsx`, `ProblemSolution.tsx`) defined static data arrays (e.g., `faqs`, `features`, `steps`, `transformations`) directly within the render body. In React, this means the array is re-allocated in memory on every render cycle, increasing garbage collection overhead.
**Action:** Always hoist static data (arrays, objects) outside of the React component definition when it does not depend on component state or props.
