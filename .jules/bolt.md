## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-18 - Hoisting static data not always useful
**Learning:** Hoisting static arrays out of React components (e.g., from `render` scope to module scope) is considered a useless micro-optimization with zero measurable impact unless the array is actually passed as a prop to a memoized child component (where referential equality matters).
**Action:** Do not hoist static arrays simply to "prevent re-creation on render" unless it's demonstrably causing unnecessary re-renders in memoized children.
