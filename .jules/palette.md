## 2024-10-02 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons used for media controls (like in InterpreCoachLiveDemo) often lack accessible names and keyboard focus indicators.
**Action:** Always wrap icon-only buttons in `Tooltip` components to provide visual context, and ensure they have `aria-label` and `focus-visible` utility classes for screen readers and keyboard navigation.
