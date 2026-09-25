## 2024-05-22 - Enhanced Audio Feedback

**Learning:** Users often click audio buttons repeatedly because they lack immediate visual feedback that the system is "working" or "playing", especially if the audio takes a split second to start or is quiet.
**Action:** When triggering `speechSynthesis`, always pair it with a visual state (like a pulsing icon) that persists until the `onend` event fires. This confirms the action and prevents rage-clicking.

## 2025-12-17 - Icon-Only Button Accessibility

**Learning:** Icon-only buttons (like volume or social links) are often missed by screen readers if they lack aria-labels. Adding Tooltips provides dual benefit: accessible names for screen readers and visual labels for mouse users.
**Action:** Always wrap icon-only buttons in a Tooltip component and ensure aria-label is present.

## 2026-09-25 - Tooltip Verifications with Playwright
**Learning:** Verifying Shadcn UI `Tooltip` components with Playwright requires hovering the trigger element (`TooltipTrigger`) and waiting for the content (often identified by `role='tooltip'`) to appear. The tooltip must be visible in the DOM, meaning `hover()` combined with a short wait is essential before taking screenshots to capture the tooltip state. In components with complex layouts like `InterpreCoachLiveDemo`, using locators like `get_by_role("button", name="...")` is highly reliable when testing `aria-label` additions.
**Action:** Always include a `hover()` action and a `wait_for_timeout` (e.g., 1000ms) when verifying the visual rendering of tooltips and accessible labels using Playwright scripts.
