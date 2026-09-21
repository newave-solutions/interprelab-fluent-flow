## 2024-03-24 - Accessible Call Controls
**Learning:** Icon-only call control buttons (like Mic, Video, Settings) in interactive demos like `InterpreCoachLiveDemo` require tooltips and ARIA labels for accessibility, along with `focus-visible` styles to ensure they can be used with a keyboard. Wrapping these in a `TooltipProvider` and `Tooltip` component is a standard pattern in this design system.
**Action:** When creating new components with icon-only buttons, prioritize wrapping them in `Tooltip` elements immediately and verify keyboard navigation styling (`focus-visible`).
