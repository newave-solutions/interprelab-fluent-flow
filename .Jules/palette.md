## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-05-18 - [Custom Divs as Interactive Elements Require Full Keyboard Support]
**Learning:** When using custom `div` elements for interactive items (like the `TranscriptSegment` in the media player) instead of semantic `<button>` tags, it is extremely common to miss proper keyboard support. While adding an `onClick` handler makes it work for mouse users, keyboard-only users and screen readers are completely blocked unless `role="button"`, `tabIndex={0}`, and `onKeyDown` (handling both 'Enter' and 'Space') are explicitly added. Additionally, a visible focus state (e.g., `focus-visible:ring-2`) is crucial for these custom interactive elements to be discoverable during tab navigation.
**Action:** When auditing or implementing custom interactive list items or segments, always verify they include `role="button"`, `tabIndex={0}`, an `onKeyDown` handler for activation, and `focus-visible` styling, or refactor them to use semantic `<button>` elements where appropriate.
