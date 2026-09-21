## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2024-05-22 - Global Tooltip Provider Discovery

**Learning:** When making icon-only buttons accessible using the Shadcn UI `Tooltip` component, there's no need to wrap every instance in a `TooltipProvider` if the application already has a global provider.
**Action:** Always check `App.tsx` or `main.tsx` for a global `<TooltipProvider>`. If present, components only need `Tooltip`, `TooltipTrigger`, and `TooltipContent` imports to add accessible tooltips.
