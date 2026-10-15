## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2026-10-15 - [Consolidating Array Traversals]
**Learning:** Running commands like `pnpm install` in the sandbox with a newer `pnpm` version (v9.0/10.0) than the project's lockfile (v6.0) can inadvertently upgrade and massively modify `pnpm-lock.yaml`. This introduces out-of-scope noise to PRs and risks breaking CI pipelines that expect the older format.
**Action:** Always be mindful of lockfile changes when running package installations. Revert out-of-scope modifications to `pnpm-lock.yaml` using `git restore pnpm-lock.yaml` before completing tasks.
