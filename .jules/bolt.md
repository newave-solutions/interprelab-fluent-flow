## 2024-05-23 - Eager Loading of Heavy Routes
**Learning:** The entire application, including heavy 3D pages like `Dilemma`, is bundled into the main entry point because all routes are imported eagerly in `App.tsx`.
**Action:** Use `React.lazy` and `Suspense` to code-split routes, especially those with heavy dependencies like `three.js` or complex logic.
