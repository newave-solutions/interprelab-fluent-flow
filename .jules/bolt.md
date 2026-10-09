## 2024-05-23 - Static Data Allocation in Render
**Learning:** React components often define large static data structures (like navigation arrays, feature lists) inside the component body. This causes unnecessary reallocation on every render.
**Action:** When reviewing components, check for `const` definitions of static data that don't depend on props or state. Move them outside the component or to a separate file.

## 2024-05-23 - InterpreLink Feed Optimization
**Learning:** Social feed pages often have complex render trees. Defining helper data structures inside the component body exacerbates re-render costs.
**Action:** Successfully moved `SIDEBAR_SECTIONS` and `REELS_DATA` outside `InterpreLink` component.
## 2024-05-18 - pnpm lockfile version hazard
**Learning:** Running `pnpm install` blindly with a newer version of pnpm (e.g., v9.0) on a project using an older `pnpm-lock.yaml` format (e.g., v6.0) will unintentionally rewrite the lockfile format and structure. This introduces massive, risky changes that can cause widespread dependency resolution regressions and fail code review.
**Action:** Do not run `pnpm install` blindly. If required to run commands that trigger installs, be vigilant about checking `git status` for unintended modifications to `pnpm-lock.yaml` and always restore it using `git restore --staged pnpm-lock.yaml && git checkout pnpm-lock.yaml` before committing.
