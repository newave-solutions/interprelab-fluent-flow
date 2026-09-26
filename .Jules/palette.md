## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-09-26 - Accessible Media Player Controls
**Learning:** Icon-only media controls (like Play, Pause, Skip) in interactive players (e.g., `MediaPlayer.tsx`) require dynamic `aria-label`s and tooltips that reflect the *next available action* (e.g., "Pause" when playing) rather than current state, along with explicit `focus-visible` styling (`focus-visible:ring-2 focus-visible:ring-amber-500`) since raw `<button>` elements lack default visual focus in this design system.
**Action:** When auditing custom interactive components, ensure all icon-only buttons are wrapped in Shadcn `Tooltip`s with dynamic `aria-label`s and `focus-visible` utility classes.
