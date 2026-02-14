# Accessibility Guide - InterpreLab

## Overview

This guide documents accessible design patterns and components for the InterpreLab platform, ensuring WCAG 2.1 AA compliance and inclusive user experiences across diverse abilities.

## Principles

### 1. Perceivable
- All information and UI components must be presentable to users in ways they can perceive
- Provide text alternatives for non-text content
- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text)

### 2. Operable
- All functionality must be available from keyboard
- Users must have enough time to read and use content
- Content must not cause seizures or physical reactions
- Users must be able to navigate and find content

### 3. Understandable
- Information and UI operation must be understandable
- Text must be readable and understandable
- Content must appear and operate in predictable ways
- Help users avoid and correct mistakes

### 4. Robust
- Content must be compatible with current and future user tools
- Maximize compatibility with assistive technologies

## Problematic Patterns & Accessible Alternatives

### 1. Auto-Rotating Carousels

**Problems:**
- WCAG 2.2.2: Auto-updating content can't be paused
- Users may not have time to read content
- Causes motion sickness for some users
- Difficult for screen reader users
- Poor keyboard navigation

**Accessible Alternative:**
- Provide pause/play controls
- Allow manual navigation (buttons + keyboard arrows)
- Respect `prefers-reduced-motion`
- Display current slide indicator
- Allow direct slide access
- Default to paused state

### 2. Infinite Scroll

**Problems:**
- No clear end point for screen readers
- Difficult to navigate with keyboard
- Can't bookmark specific positions
- Footer becomes unreachable
- Automatic loading can be disorienting

**Accessible Alternative:**
- Provide "Load More" button as default
- Make auto-load optional with clear indication
- Announce loading state to screen readers
- Allow pagination as alternative
- Preserve scroll position on navigation

### 3. Complex Dropdown Menus

**Problems:**
- Nested menus difficult to navigate
- Hover-only triggers exclude keyboard users
- Poor screen reader announcements
- Timing issues (menus close too quickly)

**Accessible Alternative:**
- Use proper ARIA roles and properties
- Support both click and keyboard navigation
- Provide clear focus indicators
- Allow adequate time for interaction
- Announce state changes

### 4. Content Hidden Behind "Read More"

**Problems:**
- May not be discoverable
- Can break screen reader navigation
- Requires JS to function

**Accessible Alternative:**
- Use progressive enhancement
- Make content accessible without JS
- Use proper ARIA expanded/collapsed states
- Provide clear indication of expandable content

## Component Guidelines

### Buttons
- Always include visible focus states
- Use descriptive text or aria-label
- Ensure minimum touch target size (44x44px)
- Don't rely on color alone to convey meaning

### Forms
- Always associate labels with inputs
- Provide clear error messages
- Use autocomplete attributes
- Support keyboard navigation
- Show validation inline

### Images
- Always provide alt text
- Use empty alt="" for decorative images
- Consider context in alt text descriptions

### Navigation
- Use semantic HTML (nav, main, header, footer)
- Provide skip links
- Maintain logical tab order
- Indicate current page/section

### Colors
- Maintain 4.5:1 contrast ratio for text
- Don't rely solely on color for meaning
- Support dark mode
- Test with color blindness simulators

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Custom shortcuts documented

### Screen Reader
- [ ] All images have appropriate alt text
- [ ] Form inputs have labels
- [ ] ARIA landmarks used correctly
- [ ] Dynamic content changes announced
- [ ] Tables have proper headers

### Visual
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is resizable up to 200%
- [ ] Content works with zoom up to 400%
- [ ] No horizontal scrolling at 320px width

### Motion
- [ ] Respects prefers-reduced-motion
- [ ] Animations can be paused
- [ ] No auto-playing videos with sound
- [ ] Parallax effects are optional

## Tools for Testing

- **Automated**: Axe DevTools, Lighthouse, WAVE
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- **Keyboard**: Test with Tab, Shift+Tab, Arrow keys, Enter, Space, Escape
- **Browser Tools**: Chrome DevTools Accessibility pane
- **Color Contrast**: Contrast Checker, WebAIM Contrast Checker

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
