# Accessible UI Components

This directory contains WCAG 2.1 AA compliant UI components designed for inclusive user experiences.

## Components

### 🎠 AccessibleCarousel
**File:** `accessible-carousel.tsx`

A fully accessible carousel with pause/play controls, keyboard navigation, and motion preference support.

**Use when:** You need to display rotating content (testimonials, image galleries, feature showcases).

**Key features:**
- Pause/play controls
- Keyboard navigation (Arrow keys, Home, End)
- Respects `prefers-reduced-motion`
- Screen reader announcements
- Pauses on hover/focus

### ♾️ AccessibleInfiniteScroll
**File:** `accessible-infinite-scroll.tsx`

Progressive loading component with manual "Load More" button as default.

**Use when:** You need to display long lists of items that load incrementally.

**Key features:**
- Manual "Load More" button (default)
- Optional auto-loading on scroll
- Loading state announcements
- Error handling
- Keyboard accessible

### 🔽 AccessibleSelect
**File:** `accessible-select.tsx`

Fully accessible select/combobox with search, keyboard navigation, and clear functionality.

**Use when:** You need a dropdown with many options or searchability.

**Key features:**
- Searchable options
- Full keyboard navigation
- Clear button
- Proper ARIA roles
- Error state handling
- Option descriptions

### 📑 AccessibleTabs
**File:** `accessible-tabs.tsx`

Tab component following ARIA Authoring Practices Guide.

**Use when:** You need to organize content into multiple views.

**Key features:**
- Proper ARIA roles
- Arrow key navigation
- Automatic activation on focus
- Vertical and horizontal layouts
- Support for disabled tabs

### 🚀 ProgressiveEnhancement
**File:** `progressive-enhancement.tsx`

Wrapper components for progressive enhancement and feature detection.

**Use when:** You need to ensure core functionality works without JavaScript or respect user preferences.

**Includes:**
- `ProgressiveEnhancement` - JS detection and fallback
- `NoScript` - Content for when JS is disabled
- `ReducedMotion` - Motion preference detection
- `FeatureDetection` - Browser feature detection

## Quick Start

### Installation

All components are already available. Simply import what you need:

```tsx
import { AccessibleCarousel } from '@/components/ui/accessible-carousel';
import { AccessibleInfiniteScroll } from '@/components/ui/accessible-infinite-scroll';
import { AccessibleSelect } from '@/components/ui/accessible-select';
import { AccessibleTabs } from '@/components/ui/accessible-tabs';
import {
  ProgressiveEnhancement,
  NoScript,
  ReducedMotion,
  FeatureDetection,
} from '@/components/ui/progressive-enhancement';
```

Or use the index file:

```tsx
import {
  AccessibleCarousel,
  AccessibleInfiniteScroll,
  AccessibleSelect,
  AccessibleTabs,
  ProgressiveEnhancement,
} from '@/components/ui/accessible-components';
```

### Basic Example

```tsx
import { AccessibleCarousel } from '@/components/ui/accessible-carousel';

function MyComponent() {
  return (
    <AccessibleCarousel
      autoPlay={true}
      autoPlayInterval={5000}
      ariaLabel="Product features"
    >
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </AccessibleCarousel>
  );
}
```

## Documentation

### Comprehensive Guides

- **[ACCESSIBILITY_GUIDE.md](../../ACCESSIBILITY_GUIDE.md)** - Principles, patterns, and best practices
- **[ACCESSIBLE_COMPONENTS_USAGE.md](../../ACCESSIBLE_COMPONENTS_USAGE.md)** - Detailed usage examples for each component
- **[MIGRATION_GUIDE.md](../../MIGRATION_GUIDE.md)** - How to migrate from problematic patterns
- **[ACCESSIBILITY_CHECKLIST.md](../../ACCESSIBILITY_CHECKLIST.md)** - Quick reference checklist
- **[ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md](../../ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md)** - Overview of all improvements

### Demo Page

See all components in action: [AccessibilityDemo.tsx](../../src/pages/AccessibilityDemo.tsx)

## Design Principles

### 1. Keyboard First
Every interactive element must be fully operable via keyboard. No mouse required.

### 2. Screen Reader Friendly
Proper semantic HTML, ARIA roles, and live regions ensure screen reader users get the full experience.

### 3. Progressive Enhancement
Core functionality works without JavaScript. Enhanced features load progressively.

### 4. Respect Preferences
Honor user preferences like `prefers-reduced-motion` and `prefers-color-scheme`.

### 5. Clear Communication
Visual and non-visual users receive the same information through appropriate channels.

## WCAG 2.1 AA Compliance

All components meet or exceed WCAG 2.1 AA standards:

- ✅ **Perceivable**: All information is available through multiple senses
- ✅ **Operable**: All functionality is keyboard accessible
- ✅ **Understandable**: Information and operation are clear
- ✅ **Robust**: Compatible with assistive technologies

## Browser Support

Tested and working in:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Assistive Technology Support

Tested with:

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

## Common Patterns

### Carousel with Reduced Motion

```tsx
import { ReducedMotion } from '@/components/ui/progressive-enhancement';
import { AccessibleCarousel } from '@/components/ui/accessible-carousel';

<ReducedMotion
  fallback={<StaticTestimonials />}
>
  <AccessibleCarousel autoPlay={true}>
    {slides}
  </AccessibleCarousel>
</ReducedMotion>
```

### Form with Accessible Select

```tsx
import { AccessibleSelect } from '@/components/ui/accessible-select';

<form onSubmit={handleSubmit}>
  <AccessibleSelect
    label="Country"
    description="Select your country of residence"
    options={countries}
    value={formData.country}
    onChange={(value) => setFormData({ ...formData, country: value })}
    required
    error={errors.country}
    searchable
  />
  <button type="submit">Submit</button>
</form>
```

### Tabs with Infinite Scroll

```tsx
import { AccessibleTabs } from '@/components/ui/accessible-tabs';
import { AccessibleInfiniteScroll } from '@/components/ui/accessible-infinite-scroll';

const tabs = [
  {
    id: "recent",
    label: "Recent Items",
    content: (
      <AccessibleInfiniteScroll
        items={recentItems}
        renderItem={(item) => <ItemCard item={item} />}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
    )
  }
];

<AccessibleTabs tabs={tabs} defaultTab="recent" />
```

## Testing

### Automated Testing

Run automated accessibility checks:

```bash
# Lighthouse
npm run lighthouse

# axe DevTools (via browser extension)
# Install from Chrome Web Store or Firefox Add-ons
```

### Manual Testing

1. **Keyboard Test**: Navigate using only keyboard (Tab, Arrow keys, Enter, Escape)
2. **Screen Reader Test**: Use NVDA (Windows) or VoiceOver (Mac)
3. **Zoom Test**: Test at 200% zoom level
4. **Contrast Test**: Verify color contrast ratios meet standards
5. **Motion Test**: Enable "Reduce Motion" in OS settings

## Contributing

When adding new accessible components:

1. Follow ARIA Authoring Practices Guide
2. Include keyboard navigation
3. Add screen reader support
4. Test with assistive technologies
5. Document usage with examples
6. Update this README

## Best Practices

### DO ✅

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Provide text alternatives for images
- Maintain logical tab order
- Use proper ARIA roles and labels
- Test with keyboard and screen readers
- Respect user preferences
- Provide clear focus indicators
- Handle errors gracefully

### DON'T ❌

- Use `<div>` as a button
- Rely on color alone
- Create keyboard traps
- Use generic labels ("click here")
- Remove focus outlines
- Auto-play without controls
- Skip heading levels
- Use `tabindex` > 0

## Performance

All components are optimized for performance:

- Tree-shakeable exports
- Lazy loading where appropriate
- Debounced event handlers
- Memoized calculations
- Minimal re-renders

### Bundle Sizes

| Component | Size (gzipped) |
|-----------|----------------|
| AccessibleCarousel | ~7.4 KB |
| AccessibleInfiniteScroll | ~5.7 KB |
| AccessibleSelect | ~8.0 KB |
| AccessibleTabs | ~6.8 KB |
| ProgressiveEnhancement | ~4.9 KB |

## Support

Need help? Check these resources:

1. [Usage Examples](../../ACCESSIBLE_COMPONENTS_USAGE.md)
2. [Migration Guide](../../MIGRATION_GUIDE.md)
3. [Accessibility Checklist](../../ACCESSIBILITY_CHECKLIST.md)
4. [Demo Page](../../src/pages/AccessibilityDemo.tsx)
5. [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

## License

Part of the InterpreLab platform. See main [LICENSE](../../LICENSE) file.

---

**Remember:** Accessibility is not a feature, it's a requirement. These components help ensure everyone can use our platform, regardless of ability.
