## 2024-10-11 - Dashboard Statistics Optimization
**Learning:** Consolidating multiple array methods (like `.reduce()` or `.filter()`) used sequentially over the same large dataset into a single imperative loop is a highly effective, targeted optimization in dashboard summary logic.
**Action:** Always scan statistic calculation functions inside dashboard or analytics components for consecutive O(N) array iterations. Refactor them into a single `for...of` loop to save N operations, prevent intermediate object allocation, and reduce overhead without compromising code clarity.
