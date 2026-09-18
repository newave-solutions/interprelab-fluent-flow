## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-09-18 - Adding Tooltips and ARIA labels to InterpreCoachLiveDemo call controls
**Learning:** For icon-only buttons (like the call controls), the project convention is to wrap them in `Tooltip` components from `@/components/ui/tooltip` while also adding an `aria-label` for screen readers and `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none` for keyboard navigation visibility.
**Action:** Always check icon-only buttons and wrap them in tooltips and add focus states if missing, particularly in complex UI components.
