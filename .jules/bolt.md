## 2024-06-25 - [Array Iteration Optimization in InterpreTrack]
**Learning:** Found multiple instances where an array (`monthData`) was iterated over 10 times consecutively using `.reduce()` and `.filter()` to calculate aggregate statistics.
**Action:** Replaced the 10 separate passes with a single `for...of` loop to compute all aggregates simultaneously, reducing CPU overhead and eliminating intermediate array allocations from `.filter()`. This pattern is broadly applicable across dashboard metrics calculation.
