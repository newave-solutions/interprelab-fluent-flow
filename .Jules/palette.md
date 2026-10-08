## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-10-08 - [Accessibility anti-pattern: Hiding numeric counters]
**Learning:** Adding `aria-hidden="true"` to visual numeric counters on action buttons (like Like/Comment counts) is an accessibility anti-pattern because it hides the count from screen reader users while keeping it visible to sighted users.
**Action:** When making action buttons with counts accessible, do not hide the counter. Instead, prepend a visually hidden `.sr-only` span with context (e.g., `<span className="sr-only">Likes: </span><span>0</span>`) so the screen reader reads the full context clearly.
