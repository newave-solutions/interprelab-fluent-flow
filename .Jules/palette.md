## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2026-10-02 - Button Accessibility with Visual Numbers
**Learning:** When making buttons accessible, avoid adding `aria-label` to buttons that already contain visual text or numbers (e.g., `<button><Icon/><span>0</span></button>`), as the `aria-label` will override the inner text for screen readers. Setting `aria-hidden="true"` on visual numeric counters ensures they aren't read out of context.
**Action:** Use a visually hidden `sr-only` span for descriptive text and set `aria-hidden="true"` on the visual number counter instead of using `aria-label` directly on the button when it contains visual text.
