## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-10-25 - Added sr-only spans for visual numbers
**Learning:** When making buttons accessible that contain visual numbers (like like/comment counts), using `aria-label` on the button completely overrides the visible text (the number) for screen reader users. This means they hear the label but miss the actual count.
**Action:** Instead of `aria-label`, use a visually hidden `sr-only` span before the visual number (e.g., `<span className="sr-only">Likes: </span><span>0</span>`). Do not add `aria-hidden="true"` to the visible number so screen readers read both.
