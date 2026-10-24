## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-05-18 - Added Screen Reader Context to Numeric Counters
**Learning:** When making buttons accessible with visual numbers (e.g., `<button><Icon/><span>0</span></button>`), adding an `aria-label` on the button completely overrides the inner text, meaning the count is not read.
**Action:** Use a visually hidden `sr-only` span for the descriptive context (e.g., `<span className="sr-only">Likes: </span>`) alongside the visual numeric counter, without setting `aria-hidden="true"` on the counter so screen readers can still read the count.
