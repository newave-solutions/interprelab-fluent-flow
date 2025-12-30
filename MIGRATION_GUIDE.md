# Migration Guide: Transitioning to Accessible Components

This guide helps you migrate existing components to use the new accessible alternatives.

## Quick Reference

| Old Pattern | New Component | Priority |
|-------------|---------------|----------|
| Auto-rotating carousel without controls | `AccessibleCarousel` | High |
| Infinite scroll without "Load More" button | `AccessibleInfiniteScroll` | High |
| Custom select/dropdown | `AccessibleSelect` | Medium |
| Tab components without proper ARIA | `AccessibleTabs` | Medium |
| JS-only features without fallbacks | `ProgressiveEnhancement` | High |

---

## 1. Migrating Carousels

### Before (Problematic)

```tsx
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel">
      <div style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
      <div className="dots">
        {items.map((_, i) => (
          <button onClick={() => setCurrentIndex(i)} />
        ))}
      </div>
    </div>
  );
};
```

### After (Accessible)

```tsx
import { AccessibleCarousel } from '@/components/ui/accessible-carousel';

const Testimonials = () => {
  return (
    <AccessibleCarousel
      autoPlay={true}
      autoPlayInterval={5000}
      showControls={true}
      showIndicators={true}
      ariaLabel="Customer testimonials"
    >
      {items.map((item, i) => (
        <div key={i}>{item}</div>
      ))}
    </AccessibleCarousel>
  );
};
```

### Benefits
- ✅ Pause/play controls (WCAG 2.2.2)
- ✅ Keyboard navigation
- ✅ Respects `prefers-reduced-motion`
- ✅ Screen reader announcements
- ✅ Pauses on hover/focus

---

## 2. Migrating Infinite Scroll

### Before (Problematic)

```tsx
const List = () => {
  const observerRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      loadMore(); // Automatically loads without user control
    });
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  }, []);

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      <div ref={observerRef} />
    </div>
  );
};
```

### After (Accessible)

```tsx
import { AccessibleInfiniteScroll } from '@/components/ui/accessible-infinite-scroll';

const List = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    const newItems = await fetchItems();
    setItems(prev => [...prev, ...newItems]);
    setHasMore(newItems.length > 0);
    setIsLoading(false);
  };

  return (
    <AccessibleInfiniteScroll
      items={items}
      renderItem={(item) => <Item {...item} />}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      autoLoad={false} // Manual by default
    />
  );
};
```

### Benefits
- ✅ Manual "Load More" button by default
- ✅ Loading state announcements
- ✅ Error handling
- ✅ Optional auto-loading
- ✅ Preserves scroll position

---

## 3. Migrating Select/Dropdowns

### Before (Problematic)

```tsx
const LanguageSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      <span>{selectedOption?.label}</span>
      {isOpen && (
        <div>
          {options.map(opt => (
            <div onClick={() => handleSelect(opt.value)}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### After (Accessible)

```tsx
import { AccessibleSelect } from '@/components/ui/accessible-select';

const LanguageSelect = () => {
  const [value, setValue] = useState("");

  return (
    <AccessibleSelect
      label="Select Language"
      description="Choose your preferred language"
      options={options}
      value={value}
      onChange={setValue}
      searchable
      allowClear
    />
  );
};
```

### Benefits
- ✅ Full keyboard navigation
- ✅ Search functionality
- ✅ Proper ARIA roles
- ✅ Screen reader support
- ✅ Clear button
- ✅ Error state handling

---

## 4. Migrating Tab Components

### Before (Problematic)

```tsx
const MyTabs = () => {
  const [active, setActive] = useState('tab1');
  
  return (
    <div>
      <div>
        <button onClick={() => setActive('tab1')}>Tab 1</button>
        <button onClick={() => setActive('tab2')}>Tab 2</button>
      </div>
      <div>
        {active === 'tab1' && <Content1 />}
        {active === 'tab2' && <Content2 />}
      </div>
    </div>
  );
};
```

### After (Accessible)

```tsx
import { AccessibleTabs } from '@/components/ui/accessible-tabs';

const MyTabs = () => {
  const tabs = [
    {
      id: 'tab1',
      label: 'Tab 1',
      content: <Content1 />
    },
    {
      id: 'tab2',
      label: 'Tab 2',
      content: <Content2 />
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

### Benefits
- ✅ Proper ARIA roles (tablist, tab, tabpanel)
- ✅ Arrow key navigation
- ✅ Home/End keys
- ✅ Automatic activation
- ✅ Support for disabled tabs

---

## 5. Adding Progressive Enhancement

### Before (JS-dependent)

```tsx
const InteractiveFeature = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return <ComplexComponent data={data} />;
};
```

### After (Progressive Enhancement)

```tsx
import { ProgressiveEnhancement } from '@/components/ui/progressive-enhancement';

const InteractiveFeature = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <ProgressiveEnhancement
      fallback={
        <div>
          <h3>JavaScript Required</h3>
          <p>This feature requires JavaScript.</p>
          <a href="/basic-version">Use basic version</a>
        </div>
      }
    >
      <ComplexComponent data={data} />
    </ProgressiveEnhancement>
  );
};
```

### Benefits
- ✅ Content accessible without JS
- ✅ Clear messaging
- ✅ Alternative options
- ✅ Better SEO

---

## 6. Respecting Motion Preferences

### Before (Always animated)

```tsx
const AnimatedBanner = () => {
  return (
    <div className="animate-slide-in">
      <h1>Welcome!</h1>
    </div>
  );
};
```

### After (Respects preferences)

```tsx
import { ReducedMotion } from '@/components/ui/progressive-enhancement';

const AnimatedBanner = () => {
  return (
    <ReducedMotion
      fallback={
        <div>
          <h1>Welcome!</h1>
        </div>
      }
    >
      <div className="animate-slide-in">
        <h1>Welcome!</h1>
      </div>
    </ReducedMotion>
  );
};
```

### Benefits
- ✅ Respects user preferences
- ✅ Prevents motion sickness
- ✅ Better UX for all users

---

## Common Accessibility Fixes

### 1. Add ARIA Labels

**Before:**
```tsx
<button onClick={handleClick}>
  <Icon />
</button>
```

**After:**
```tsx
<button onClick={handleClick} aria-label="Close dialog">
  <Icon aria-hidden="true" />
</button>
```

### 2. Improve Focus Indicators

**Before:**
```css
button:focus {
  outline: none;
}
```

**After:**
```css
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 3. Add Keyboard Support

**Before:**
```tsx
<div onClick={handleClick}>Click me</div>
```

**After:**
```tsx
<button 
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Click me
</button>
```

### 4. Announce Dynamic Changes

**Before:**
```tsx
const [message, setMessage] = useState('');

return <div>{message}</div>;
```

**After:**
```tsx
const [message, setMessage] = useState('');

return (
  <div role="status" aria-live="polite" aria-atomic="true">
    {message}
  </div>
);
```

### 5. Proper Heading Hierarchy

**Before:**
```tsx
<div>
  <h1>Main Title</h1>
  <h3>Subsection</h3>
  <h2>Section</h2>
</div>
```

**After:**
```tsx
<div>
  <h1>Main Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>
</div>
```

---

## Testing Your Changes

### 1. Keyboard Testing
```bash
# Test all interactive elements with:
- Tab / Shift+Tab (navigation)
- Enter / Space (activation)
- Arrow keys (directional navigation)
- Escape (close/cancel)
- Home / End (first/last)
```

### 2. Screen Reader Testing

**Windows:**
```bash
# Install NVDA (free)
https://www.nvaccess.org/download/

# Test your pages and verify:
- All content is announced
- ARIA labels are read correctly
- Dynamic changes are announced
- Navigation is logical
```

**Mac:**
```bash
# Enable VoiceOver
Cmd + F5

# Test your pages and verify same as above
```

### 3. Automated Testing

```bash
# Install axe DevTools
https://www.deque.com/axe/devtools/

# Or use Lighthouse in Chrome DevTools
# Check the Accessibility score
```

---

## Checklist for Each Component

Before marking a component as accessible, verify:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA roles and labels are correct
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Works without JavaScript (or has fallback)
- [ ] Respects `prefers-reduced-motion`
- [ ] Screen reader announces all content
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Alt text for images
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Works at 200% zoom
- [ ] Tested with actual assistive technologies

---

## Getting Help

### Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Automated testing
- [WAVE](https://wave.webaim.org/) - Visual feedback
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools

### Testing
- [NVDA](https://www.nvaccess.org/) - Free screen reader (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) - Built-in screen reader (Mac)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Commercial screen reader (Windows)

---

## Need Help?

If you have questions about migrating a specific component or pattern, please:

1. Check the [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)
2. Review [ACCESSIBLE_COMPONENTS_USAGE.md](./ACCESSIBLE_COMPONENTS_USAGE.md)
3. See examples in [AccessibilityDemo.tsx](./src/pages/AccessibilityDemo.tsx)
4. Consult the WCAG guidelines for specific issues
