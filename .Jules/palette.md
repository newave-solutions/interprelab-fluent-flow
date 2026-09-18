## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2026-09-18 - Dynamic ARIA Labels in Media Players

**Learning:** Media player buttons that change state (e.g., Play to Pause) need dynamic `aria-label` attributes that update alongside the visual icon change, so screen reader users know the current action available.
**Action:** When implementing toggle buttons (Play/Pause, Mute/Unmute), use ternary operators or state to dynamically update both the `aria-label` and Tooltip content to reflect the *action* that will happen next, not the current state.
