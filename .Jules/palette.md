## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-05-18 - [Dynamic ARIA labels for Toggle Buttons]
**Learning:** Toggle buttons (e.g., Play/Pause in media players) must use dynamic `aria-label` attributes and `Tooltip` content that reflect the *next available action*, rather than the current state, to provide clear instructions to screen reader users.
**Action:** When implementing play/pause, mute/unmute, or expand/collapse toggles, always bind the `aria-label` and `TooltipContent` to a dynamic string like `isPlaying ? "Pause" : "Play"`.
