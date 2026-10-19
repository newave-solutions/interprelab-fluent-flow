## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-10-19 - PostCard Action Button Accessibility

**Learning:** Buttons with both icons and text counters (e.g. "0" for likes) aren't sufficiently descriptive for screen readers since they only read the number. Also, these interactive actions need visual keyboard focus indicators.
**Action:** When creating icon+counter buttons, use a visually hidden span (`sr-only`) before the number to provide context (e.g., `<span className="sr-only">Likes: </span>`). Wrap action buttons in Tooltips and add `focus-visible:ring-2` to improve keyboard navigation feedback.
