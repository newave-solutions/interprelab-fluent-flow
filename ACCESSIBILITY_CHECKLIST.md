# Accessibility Checklist

Use this checklist when creating or reviewing components for accessibility compliance.

## Before Submitting Code

### Keyboard Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps exist
- [ ] Arrow keys work for appropriate components (tabs, carousels, menus)
- [ ] Home/End keys jump to first/last items where appropriate
- [ ] Escape key closes popups, modals, and menus

### Screen Reader Support
- [ ] All images have appropriate `alt` text
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Form inputs have associated labels
- [ ] ARIA roles are used correctly
- [ ] ARIA landmarks define page structure (`main`, `nav`, `aside`, `footer`)
- [ ] Dynamic content changes are announced via live regions
- [ ] Complex widgets follow ARIA Authoring Practices
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping)

### Visual Design
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text, 3:1 for UI)
- [ ] Color is not the only means of conveying information
- [ ] Text is resizable up to 200% without loss of functionality
- [ ] Content works with zoom up to 400%
- [ ] No horizontal scrolling at 320px width
- [ ] Focus indicators have sufficient contrast

### Motion and Animation
- [ ] Respects `prefers-reduced-motion` media query
- [ ] Auto-playing carousels have pause controls
- [ ] Animations can be stopped or paused
- [ ] No flashing content (3Hz or more)
- [ ] Parallax effects are optional or disabled with reduced motion

### Forms and Input
- [ ] All form fields have labels
- [ ] Required fields are clearly marked
- [ ] Error messages are descriptive and actionable
- [ ] Errors are announced to screen readers
- [ ] Validation is accessible (inline feedback)
- [ ] Autocomplete attributes are used where appropriate
- [ ] Touch targets are at least 44x44 pixels

### Content Structure
- [ ] Semantic HTML is used (`nav`, `main`, `article`, `section`, etc.)
- [ ] Skip links are provided for keyboard users
- [ ] Page has a descriptive `<title>`
- [ ] Language is specified (`lang` attribute)
- [ ] Tables have proper headers (`<th>`, `scope`)
- [ ] Lists use proper markup (`<ul>`, `<ol>`, `<li>`)

### Interactive Components
- [ ] Buttons use `<button>` elements (not `<div>` with click handlers)
- [ ] Links use `<a>` elements with valid `href`
- [ ] Disabled elements are properly marked (`disabled`, `aria-disabled`)
- [ ] Loading states are announced
- [ ] Tooltips are accessible
- [ ] Modals trap focus appropriately
- [ ] Dropdowns can be operated with keyboard

### Progressive Enhancement
- [ ] Core functionality works without JavaScript
- [ ] Fallback content is provided for JS-dependent features
- [ ] NoScript warnings are appropriate
- [ ] Content is accessible with CSS disabled
- [ ] Forms can be submitted without JavaScript

### Testing Completed
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Tested at 200% zoom
- [ ] Tested with reduced motion enabled
- [ ] Ran automated accessibility scan (axe, Lighthouse, or WAVE)
- [ ] Verified color contrast ratios
- [ ] Tested with mobile screen readers (TalkBack, VoiceOver)

## Component-Specific Checks

### Carousels
- [ ] Has pause/play controls
- [ ] Pauses on hover and focus
- [ ] Respects `prefers-reduced-motion`
- [ ] Slide changes are announced
- [ ] Previous/next buttons have labels
- [ ] Indicators are keyboard accessible

### Infinite Scroll / Load More
- [ ] Has manual "Load More" button
- [ ] Loading states are announced
- [ ] Errors are displayed clearly
- [ ] Footer is reachable
- [ ] Maintains scroll position

### Dropdowns / Selects
- [ ] Has proper ARIA roles
- [ ] Opens with Enter/Space
- [ ] Navigates with arrow keys
- [ ] Closes with Escape
- [ ] Selected value is announced
- [ ] Search functionality is keyboard accessible

### Tabs
- [ ] Uses proper ARIA roles (`tablist`, `tab`, `tabpanel`)
- [ ] Arrow keys navigate between tabs
- [ ] Tab key moves to panel content
- [ ] Selected tab is announced
- [ ] Panel content is properly associated

### Modals / Dialogs
- [ ] Focus moves to modal on open
- [ ] Focus is trapped within modal
- [ ] Focus returns to trigger on close
- [ ] Closes with Escape key
- [ ] Has descriptive `aria-label` or `aria-labelledby`
- [ ] Background content is inert (`aria-hidden`)

### Forms
- [ ] Labels are associated with inputs
- [ ] Required fields are marked
- [ ] Error messages are linked to inputs
- [ ] Validation is triggered appropriately
- [ ] Success states are announced
- [ ] Multi-step forms show progress

## Quick Tests

### Keyboard Test (5 minutes)
1. Unplug your mouse
2. Navigate entire page with Tab
3. Try to use all interactive elements
4. Verify focus is always visible
5. Test escape/enter keys

### Screen Reader Test (10 minutes)
1. Enable screen reader (NVDA/VoiceOver)
2. Navigate page with screen reader commands
3. Listen to all announcements
4. Verify structure makes sense
5. Test form filling

### Zoom Test (3 minutes)
1. Zoom to 200%
2. Verify all content is readable
3. Check for horizontal scrolling
4. Test all interactions

### Motion Test (2 minutes)
1. Enable "Reduce Motion" in OS settings
2. Reload page
3. Verify animations are reduced/removed
4. Check carousels are static or paused

### Color Contrast Test (5 minutes)
1. Use browser color picker
2. Check text contrast ratios
3. Check UI element contrast
4. Test in light and dark modes

## Tools to Use

### Browser Extensions
- axe DevTools
- WAVE
- Lighthouse (Chrome DevTools)
- Accessibility Insights

### Screen Readers
- NVDA (Windows - Free)
- JAWS (Windows - Paid)
- VoiceOver (Mac - Built-in)
- TalkBack (Android - Built-in)

### Contrast Checkers
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Chrome DevTools Color Picker

### Validators
- W3C Markup Validator
- ARIA Validator
- HTML5 Validator

## Common Issues to Avoid

❌ **Don't:**
- Use `<div>` or `<span>` as buttons
- Rely on color alone to convey meaning
- Create keyboard traps
- Use placeholder as label
- Remove focus indicators
- Auto-play videos with sound
- Use `tabindex` greater than 0
- Skip heading levels
- Use generic link text ("click here", "read more")

✅ **Do:**
- Use semantic HTML elements
- Provide alternative text
- Maintain logical tab order
- Label all form inputs
- Make focus visible
- Provide pause controls
- Use descriptive link text
- Follow heading hierarchy
- Test with assistive technologies

## Need Help?

- Review [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md)
- Check [ACCESSIBLE_COMPONENTS_USAGE.md](./ACCESSIBLE_COMPONENTS_USAGE.md)
- See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- Try [AccessibilityDemo page](./src/pages/AccessibilityDemo.tsx)
- Consult [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Remember:** Accessibility is not optional. It's a requirement for inclusive design and often a legal obligation. When in doubt, test with actual assistive technologies and users.
