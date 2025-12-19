## 2024-05-22 - Enhanced Audio Feedback
**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-12-19 - Live Region for Dynamic Content
**Learning:** Real-time AI feedback (like sign detection) is visual-only by default. Screen reader users miss out on this "magic".
**Action:** Use `aria-live="polite"` for elements that update frequently but shouldn't interrupt the user immediately, giving non-visual access to AI outputs.
