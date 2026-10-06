## 2024-05-24 - [Intl Formatters Caching]
**Learning:** Instantiating `Intl` objects (e.g., `Intl.NumberFormat`, `Intl.DateTimeFormat`) is notoriously slow in JS engines. Using them repeatedly in large lists, loops, or frequent renders can cause significant performance bottlenecks.
**Action:** Cache and reuse `Intl` formatter instances based on their configuration parameters (locale and options) using a `Map`, instead of creating new instances for every format call.
