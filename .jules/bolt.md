## 2026-09-23 - Array Iteration Consolidation
**Learning:** The codebase contained multiple instances of repeated `O(N)` array iterations (`.reduce()` and `.filter()`) over call log data for aggregating statistics, which can be computationally expensive and trigger intermediate allocations.
**Action:** Replaced back-to-back `.reduce()` and `.filter()` calls with a single `for...of` loop traversing the array exactly once to calculate all needed aggregates (e.g., duration, earnings, call type counts).
