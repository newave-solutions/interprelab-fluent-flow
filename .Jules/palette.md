## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2026-09-28 - [InterpreBotAssessment UX Enhancements]
**Learning:** The InterpreBotAssessment component had interactive icon buttons (Mic/Square for recording, Lightbulb for context generation, RefreshCcw for restarting) that lacked accessibility context and context menus. This made it difficult for screen reader users and keyboard navigation.
**Action:** Always wrap icon-only buttons with Shadcn UI `Tooltip` components and add meaningful `aria-label`s. Ensure that interactive elements are keyboard focusable and provide visible focus rings, maintaining consistency with existing accessibility patterns in the platform.
