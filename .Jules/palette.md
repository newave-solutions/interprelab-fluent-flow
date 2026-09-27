## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-09-27 - Accessible Call Controls in Live Demo
**Learning:** The InterpreCoachLiveDemo component had several icon-only buttons (Mic, Video, Phone, Settings) that lacked s and visible focus states, making them inaccessible to screen readers and keyboard users.
**Action:** Always wrap icon-only action buttons in  components (importing , , and  from ), add descriptive  attributes to the trigger buttons, and include  utility classes (e.g., ) to ensure keyboard navigability.
## $(date +%Y-%m-%d) - Accessible Call Controls in Live Demo
**Learning:** The InterpreCoachLiveDemo component had several icon-only buttons (Mic, Video, Phone, Settings) that lacked `aria-label`s and visible focus states, making them inaccessible to screen readers and keyboard users.
**Action:** Always wrap icon-only action buttons in `Tooltip` components (importing `Tooltip`, `TooltipContent`, and `TooltipTrigger` from `@/components/ui/tooltip`), add descriptive `aria-label` attributes to the trigger buttons, and include `focus-visible` utility classes (e.g., `focus-visible:ring-2 focus-visible:outline-none`) to ensure keyboard navigability.
