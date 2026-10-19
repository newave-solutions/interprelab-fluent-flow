## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-24 - Optimized O(N) Traversal Chains in Stats Aggregation
**Learning:** Chaining `.filter()` and `.reduce()` in rapid succession over the same data structures for calculating aggregate totals causes multiple array allocations and multiple O(N) traversals. While elegant, this is less performant on arrays dealing with numerous metrics simultaneously. This pattern was found broadly across hooks (`useCallLogs`), pages (`InterpreTrack`, `Dashboard`), and helper utilities (`lib/data`).
**Action:** Consolidate aggregate calculations (like total counts, durations, and earnings across different conditions) into single pass `for...of` loops, drastically reducing N-level overhead while maintaining identical functionality.
