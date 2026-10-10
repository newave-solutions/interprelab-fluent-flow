## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2024-05-24 - Buttons With Numbers Context
**Learning:** When making buttons accessible with visual numbers (e.g., `<button><Icon/><span>0</span></button>`), adding an `aria-label` to the button overrides the inner text entirely for screen readers, hiding the actual count. Furthermore, if you use a visually hidden `sr-only` span to provide the context (e.g., `<span className="sr-only">Likes: </span>`), you should *not* add `aria-hidden="true"` to the visual counter, otherwise screen readers still won't read the count.
**Action:** For buttons mixing icons and numbers, use an `sr-only` span before the number for descriptive context and rely on standard element reading rather than `aria-label`.
