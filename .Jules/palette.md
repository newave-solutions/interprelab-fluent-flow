## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-05-17 - Add ARIA Labels and Tooltips to Media Controls
**Learning:** Icon-only buttons without `aria-label`s or tooltips present significant accessibility barriers and lack clarity for visual users. Wrapping these buttons in Shadcn `Tooltip` components (and providing `aria-label`s) provides immediate and helpful context without altering the core UI design.
**Action:** When creating or modifying icon-only buttons (like player controls or toolbar actions), systematically apply `Tooltip` wrappers and descriptive `aria-label` attributes to ensure universal accessibility.
