## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2025-02-28 - Dynamic ARIA Labels in Interactive Controls

**Learning:** When a control toggles state (e.g., Play/Pause), its `aria-label` and visual tooltip should dynamically update to reflect the *next* available action, not just its current state.
**Action:** Use ternary operators or state checks to conditionally render `aria-label` and TooltipContent text based on component state.
