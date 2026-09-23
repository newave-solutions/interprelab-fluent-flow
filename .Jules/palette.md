## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-12-18 - Toggle Button Accessibility

**Learning:** When using icon-only toggle buttons (like show/hide password), a static `aria-label` is insufficient. The label and tooltip content must dynamically reflect the *next available action* rather than the current state, so users know what clicking the button will do.
**Action:** Always use dynamic ternary expressions for `aria-label` and `TooltipContent` on toggle buttons (e.g., `aria-label={showPassword ? "Hide password" : "Show password"}`).
