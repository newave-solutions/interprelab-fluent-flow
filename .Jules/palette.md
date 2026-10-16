## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-05-18 - Playwright Component Isolation Regression Risk
**Learning:** Isolating components by overwriting `src/main.tsx` temporarily (to render only the test component for Playwright screenshotting) poses a critical risk if those modifications are accidentally included in the final Git commit. It entirely breaks the application tree and routing.
**Action:** When overriding `src/main.tsx` for local playwright validation of deep/protected components, *always* run `git restore src/main.tsx` immediately after taking the screenshot, *before* running standard review checks or committing. Ensure `git status` validates the main entrypoints are unmodified.
