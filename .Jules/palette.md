## 2024-05-22 - Enhanced Audio Feedback
**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-12-19 - Live Region for Dynamic Content
**Learning:** Real-time AI feedback (like sign detection) is visual-only by default. Screen reader users miss out on this "magic".
**Action:** Use `aria-live="polite"` for elements that update frequently but shouldn't interrupt the user immediately, giving non-visual access to AI outputs.

## 2025-05-24 - Draggable Interface Accessibility
**Learning:** Floating, draggable windows (like the InterpreCoach extension) are convenient for mouse users but can be a trap for keyboard users if they cannot be moved or if their content is not easily navigable.
**Action:** Ensure all interactive elements within floating windows are keyboard accessible, and consider providing an alternative way to position or dock the window for keyboard users.
