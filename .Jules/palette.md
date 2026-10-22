## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-10-22 - Password Visibility Toggle Tooltips
**Learning:** Icon-only buttons for toggling form states (like password visibility) require both an `aria-label` for screen readers and a visual `Tooltip` for sighted users to ensure full accessibility.
**Action:** Always wrap interactive icon-only buttons with Shadcn UI's `Tooltip`, use the `asChild` prop on the `TooltipTrigger` to avoid invalid HTML nesting, and include `focus-visible` utility classes for clear keyboard navigation indicators.
