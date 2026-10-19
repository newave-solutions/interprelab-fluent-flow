## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-12-18 - Tooltip Wrapper Semantics

**Learning:** When using Radix/Shadcn Tooltips to wrap native `<button>` elements, you must use the `asChild` prop on `TooltipTrigger`. Forgetting this leads to invalid DOM nesting (button inside button) which breaks accessibility and can cause hydration errors.
**Action:** Always use `<TooltipTrigger asChild>` when wrapping interactive elements like buttons or links.
