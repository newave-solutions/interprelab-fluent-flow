## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-05-19 - Screen Reader Accessibility for Number Counters

**Learning:** When buttons contain numeric counters along with icons (e.g., a "Like" button with a heart icon and the number '12'), screen readers will simply read the number aloud (e.g., "12 button"), which lacks context.
**Action:** Always add a visually hidden span (`<span className="sr-only">Likes: </span>`) before the numerical counter in buttons to ensure proper context for screen readers.
