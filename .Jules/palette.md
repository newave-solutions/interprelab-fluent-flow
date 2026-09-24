## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2025-02-27 - Icon-Only Stats Button Accessibility

**Learning:** Buttons containing both an icon and a numeric counter (like Like/Comment/Share buttons) can be confusing for screen reader users if they only hear the number (e.g. "0"). Adding an `aria-label` will overwrite the visual number.
**Action:** Instead of `aria-label`, use a `<span className="sr-only">Descriptive Action (e.g., Likes)</span>` inside the button alongside the number to provide context without losing the numeric readout.
