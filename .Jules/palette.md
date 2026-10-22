## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-10-22 - Adding Tooltips and ARIA Labels to InterpreCoachLiveDemo Call Controls
**Learning:** Icon-only buttons used in demo/preview components like `InterpreCoachLiveDemo` still require proper accessibility patterns (`aria-label`, `focus-visible`, and `Tooltip`), even if they are not fully functional production actions, because screen reader and keyboard users still encounter and interact with these elements when navigating the landing page. Shadcn UI's Tooltip component requires the `asChild` prop on `TooltipTrigger` when wrapping native `<button>` elements to properly forward refs and avoid invalid nesting.
**Action:** When implementing new demo or showcase components with interactive-looking UI elements, proactively wrap icon-only buttons with Shadcn UI `Tooltip` components and apply descriptive `aria-label`s and `focus-visible` styles to ensure complete accessibility compliance from the start.
