## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2025-12-18 - Tooltips and Accessible Buttons in InterpreBot

**Learning:** Buttons without explicit text labels (like the Mic and Context Gen buttons in InterpreBot) fail accessibility audits if they lack `aria-label` and `focus-visible` styling, hindering screen reader utility and keyboard navigation.
**Action:** Always provide `aria-label` for icon buttons, wrap them in a Tooltip for mouse hover context, and ensure standard `focus-visible` outline rings are used.
