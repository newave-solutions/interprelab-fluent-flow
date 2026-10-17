## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2024-05-23 - Interactive Button Accessibility with Numbers

**Learning:** When making interactive buttons accessible that contain an icon and a visual number (like a like/comment/share count), simply adding an `aria-label` is detrimental because it completely overwrites the visual text (the number), meaning screen reader users miss the count entirely.
**Action:** Instead of `aria-label`, inject a visually hidden span with the `.sr-only` class (e.g. `<span className="sr-only">Likes: </span>`) immediately preceding the visible number span. This provides rich context while preserving the visible data.
