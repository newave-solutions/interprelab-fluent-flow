## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.

## 2024-05-23 - Array Method Chaining vs for...of
**Learning:** Chaining array methods like `.filter().reduce()` or calling `.reduce()` multiple times on the same array to calculate different metrics creates intermediate arrays and forces multiple O(N) traversals.
**Action:** Consolidate these operations into a single O(N) `for...of` loop to calculate all necessary metrics simultaneously.
