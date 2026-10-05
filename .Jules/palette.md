## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-10-05 - Accessible Tooltips for Icon-Only Buttons
**Learning:** Found multiple instances across the application where icon-only buttons lacked aria-labels and tooltips, making them inaccessible to screen readers and confusing for users. The project standard is to use the Shadcn UI Tooltip component combined with an aria-label and the `focus-visible:ring-2` utility class.
**Action:** When creating or reviewing components with icon-only actions (like edit, delete, copy, or more options), always wrap them in a Tooltip and ensure an aria-label is present. Also, be mindful of package manager versions to avoid unintended lockfile rewrites.
