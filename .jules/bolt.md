## 2024-05-24 - Memoizing Intl.NumberFormat
**Learning:** Instantiating `Intl.NumberFormat` repeatedly in a render loop or inside utility functions called frequently (like formatting lists of numbers) is a known performance bottleneck in JavaScript. React components in dashboards are especially susceptible to this overhead.
**Action:** Always cache/memoize `Intl.NumberFormat` instances in a shared utility (using a `Map` keyed by locale and options) rather than instantiating them inline.
