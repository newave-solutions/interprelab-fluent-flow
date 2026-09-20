## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2024-06-25 - Accessible Toggle Buttons with Dynamic Tooltips
**Learning:** For toggle buttons (like Play/Pause), it's important to provide `aria-label` and `TooltipContent` that reflect the *next available action* rather than the current state, so that screen readers correctly announce what happens when you interact with it.
**Action:** Always verify that toggle icon buttons describe the action they will perform when clicked, not what the current system status is, and wrap them in `<Tooltip>` components for accessible visible labels.
