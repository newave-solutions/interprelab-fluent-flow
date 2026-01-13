# Accessible Components - Usage Examples

This document provides practical examples for using the accessible components in the InterpreLab platform.

## Table of Contents

1. [AccessibleCarousel](#accessiblecarousel)
2. [AccessibleInfiniteScroll](#accessibleinfinitescroll)
3. [AccessibleSelect](#accessibleselect)
4. [AccessibleTabs](#accessibletabs)
5. [ProgressiveEnhancement](#progressiveenhancement)

---

## AccessibleCarousel

A WCAG 2.1 AA compliant carousel with pause/play controls, keyboard navigation, and motion preference support.

### Basic Usage

```tsx
import { AccessibleCarousel } from "@/components/ui/accessible-carousel";

const MyCarousel = () => {
  const slides = [
    <div>Slide 1 Content</div>,
    <div>Slide 2 Content</div>,
    <div>Slide 3 Content</div>,
  ];

  return (
    <AccessibleCarousel ariaLabel="Product features">
      {slides}
    </AccessibleCarousel>
  );
};
```

### With Auto-Play

```tsx
<AccessibleCarousel
  autoPlay={true}
  autoPlayInterval={5000}
  showControls={true}
  showIndicators={true}
  ariaLabel="Customer testimonials"
>
  {slides.map((slide, i) => (
    <div key={i}>{slide}</div>
  ))}
</AccessibleCarousel>
```

### Features

- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Pause/Play controls for auto-rotation
- ✅ Respects `prefers-reduced-motion`
- ✅ Screen reader announcements
- ✅ Manual slide access via indicators
- ✅ Pauses on hover

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode[]` | Required | Array of slide content |
| `autoPlay` | `boolean` | `false` | Enable auto-rotation |
| `autoPlayInterval` | `number` | `5000` | Time between slides (ms) |
| `showControls` | `boolean` | `true` | Show prev/next buttons |
| `showIndicators` | `boolean` | `true` | Show dot indicators |
| `ariaLabel` | `string` | `"Content carousel"` | Accessible label |

---

## AccessibleInfiniteScroll

Progressive loading with "Load More" button fallback and loading state announcements.

### Basic Usage

```tsx
import { AccessibleInfiniteScroll } from "@/components/ui/accessible-infinite-scroll";

const MyList = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const newItems = await fetchItems();
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccessibleInfiniteScroll
      items={items}
      renderItem={(item) => <ItemCard item={item} />}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    />
  );
};
```

### With Auto-Loading

```tsx
<AccessibleInfiniteScroll
  items={items}
  renderItem={(item) => <ItemCard item={item} />}
  loadMore={loadMore}
  hasMore={hasMore}
  isLoading={isLoading}
  autoLoad={true}
  threshold={200}
  loadMoreText="Load More Items"
  loadingText="Loading..."
  noMoreText="All items loaded"
/>
```

### Features

- ✅ Manual "Load More" button (default)
- ✅ Optional auto-loading on scroll
- ✅ Loading state announcements
- ✅ Error handling
- ✅ Keyboard accessible
- ✅ Preserves scroll position

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | Required | Array of items to display |
| `renderItem` | `(item: T, index: number) => ReactNode` | Required | Render function for each item |
| `loadMore` | `() => Promise<void>` | Required | Function to load more items |
| `hasMore` | `boolean` | Required | Whether more items are available |
| `isLoading` | `boolean` | Required | Loading state |
| `autoLoad` | `boolean` | `false` | Enable auto-loading on scroll |
| `threshold` | `number` | `200` | Distance from bottom to trigger load (px) |
| `loadMoreText` | `string` | `"Load More"` | Button text |
| `loadingText` | `string` | `"Loading more items..."` | Loading message |
| `noMoreText` | `string` | `"No more items to load"` | End message |

---

## AccessibleSelect

Fully accessible select/combobox with search, keyboard navigation, and clear functionality.

### Basic Usage

```tsx
import { AccessibleSelect } from "@/components/ui/accessible-select";

const MyForm = () => {
  const [value, setValue] = useState("");

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <AccessibleSelect
      label="Select an option"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
};
```

### With Search and Descriptions

```tsx
const options = [
  { 
    value: "en", 
    label: "English", 
    description: "English language" 
  },
  { 
    value: "es", 
    label: "Spanish", 
    description: "Español" 
  },
  { 
    value: "fr", 
    label: "French", 
    description: "Français",
    disabled: true 
  },
];

<AccessibleSelect
  label="Select Language"
  description="Choose your preferred language"
  options={options}
  value={language}
  onChange={setLanguage}
  required
  searchable
  allowClear
  error={errors.language}
/>
```

### Features

- ✅ Full keyboard navigation
- ✅ Search functionality
- ✅ Clear button
- ✅ Proper ARIA labels
- ✅ Screen reader friendly
- ✅ Error state handling
- ✅ Optional descriptions

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | Required | Array of options |
| `value` | `string` | - | Selected value |
| `onChange` | `(value: string) => void` | Required | Change handler |
| `label` | `string` | - | Label text |
| `description` | `string` | - | Helper text |
| `error` | `string` | - | Error message |
| `placeholder` | `string` | `"Select an option"` | Placeholder text |
| `searchable` | `boolean` | `true` | Enable search |
| `allowClear` | `boolean` | `true` | Show clear button |
| `required` | `boolean` | `false` | Mark as required |
| `disabled` | `boolean` | `false` | Disable select |

---

## AccessibleTabs

WCAG 2.1 AA compliant tabs with proper ARIA roles and keyboard navigation.

### Basic Usage

```tsx
import { AccessibleTabs } from "@/components/ui/accessible-tabs";

const MyTabs = () => {
  const tabs = [
    {
      id: "tab1",
      label: "Tab 1",
      content: <div>Content 1</div>
    },
    {
      id: "tab2",
      label: "Tab 2",
      content: <div>Content 2</div>
    },
    {
      id: "tab3",
      label: "Tab 3",
      content: <div>Content 3</div>,
      disabled: true
    },
  ];

  return (
    <AccessibleTabs
      tabs={tabs}
      defaultTab="tab1"
      ariaLabel="Feature tabs"
    />
  );
};
```

### With Icons and Callbacks

```tsx
import { User, Settings, Bell } from "lucide-react";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: <User />,
    content: <ProfileContent />
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings />,
    content: <SettingsContent />
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell />,
    content: <NotificationsContent />
  },
];

<AccessibleTabs
  tabs={tabs}
  defaultTab="profile"
  onChange={(tabId) => console.log("Active tab:", tabId)}
  orientation="vertical"
  ariaLabel="User dashboard"
/>
```

### Features

- ✅ Proper ARIA roles (tablist, tab, tabpanel)
- ✅ Full keyboard navigation
- ✅ Automatic activation on focus
- ✅ Support for disabled tabs
- ✅ Vertical and horizontal orientations
- ✅ Icon support

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Tab[]` | Required | Array of tab objects |
| `defaultTab` | `string` | - | Initially active tab |
| `onChange` | `(tabId: string) => void` | - | Tab change callback |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Tab orientation |
| `ariaLabel` | `string` | `"Content tabs"` | Accessible label |

---

## ProgressiveEnhancement

Wrapper components for progressive enhancement and feature detection.

### Basic Progressive Enhancement

```tsx
import { ProgressiveEnhancement } from "@/components/ui/progressive-enhancement";

<ProgressiveEnhancement
  fallback={
    <div>
      <p>JavaScript is required for this feature.</p>
      <a href="/alternative">Use basic version</a>
    </div>
  }
>
  <InteractiveComponent />
</ProgressiveEnhancement>
```

### Respect Motion Preferences

```tsx
import { ReducedMotion } from "@/components/ui/progressive-enhancement";

<ReducedMotion
  fallback={<StaticImage src="/image.jpg" />}
>
  <AnimatedCarousel />
</ReducedMotion>
```

### Feature Detection

```tsx
import { FeatureDetection } from "@/components/ui/progressive-enhancement";

<FeatureDetection
  feature="intersectionObserver"
  fallback={<ManualLoadButton />}
>
  <AutoLoadingList />
</FeatureDetection>
```

### NoScript Warning

```tsx
import { NoScript } from "@/components/ui/progressive-enhancement";

<NoScript>
  <div className="alert alert-warning">
    This site works best with JavaScript enabled.
  </div>
</NoScript>
```

### Supported Features

- `intersectionObserver` - For infinite scroll
- `customElements` - For web components
- `localStorage` - For client-side storage
- `webGL` - For 3D graphics

---

## Integration Tips

### 1. Combine Components

```tsx
// Carousel with progressive enhancement
<ReducedMotion fallback={<StaticTestimonials />}>
  <AccessibleCarousel autoPlay={true}>
    {testimonials}
  </AccessibleCarousel>
</ReducedMotion>
```

### 2. Form with Accessible Select

```tsx
<form onSubmit={handleSubmit}>
  <AccessibleSelect
    label="Country"
    options={countries}
    value={formData.country}
    onChange={(value) => setFormData({ ...formData, country: value })}
    required
    error={errors.country}
  />
  <button type="submit">Submit</button>
</form>
```

### 3. Tabs with Infinite Scroll

```tsx
<AccessibleTabs
  tabs={[
    {
      id: "recent",
      label: "Recent",
      content: (
        <AccessibleInfiniteScroll
          items={recentItems}
          renderItem={renderItem}
          loadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      )
    }
  ]}
/>
```

---

## Testing Accessibility

### Keyboard Testing

1. Tab through all interactive elements
2. Use Arrow keys for navigation
3. Test Home/End keys
4. Verify Escape closes modals
5. Check focus visibility

### Screen Reader Testing

1. Test with NVDA (Windows)
2. Test with VoiceOver (Mac)
3. Verify announcements
4. Check ARIA labels
5. Validate heading structure

### Visual Testing

1. Zoom to 200%
2. Check contrast ratios
3. Test dark mode
4. Verify focus indicators
5. Test with reduced motion

---

## Best Practices

1. **Always provide labels** - Use `aria-label` or visible labels
2. **Announce changes** - Use live regions for dynamic content
3. **Support keyboard** - Ensure all functionality is keyboard accessible
4. **Respect preferences** - Honor `prefers-reduced-motion` and color schemes
5. **Test thoroughly** - Use automated tools AND manual testing
6. **Progressive enhancement** - Ensure core functionality works without JS
7. **Clear focus indicators** - Make keyboard focus always visible
8. **Logical tab order** - Maintain intuitive navigation flow

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
