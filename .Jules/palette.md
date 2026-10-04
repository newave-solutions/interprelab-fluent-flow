## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.
## 2024-10-04 - Test Wrapper Destructive Risks
**Learning:** Overwriting core application entry points (like `index.html` or `main.tsx`) to render temporary test wrappers for Playwright component isolation poses a massive risk of accidental commitment. This can completely break production by deleting SEO meta tags, fonts, and the main React mount logic.
**Action:** Always strictly isolate test scaffolds to new, untracked files if possible. If core files must be temporarily overridden to inject a component directly into the DOM for isolated testing (e.g. bypassing auth), ensure they are forcefully restored via `git checkout -- index.html src/main.tsx` before staging and running code review.
