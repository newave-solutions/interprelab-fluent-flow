/**
 * Accessible Components Index
 * 
 * This file exports all accessible components for easy importing throughout the application.
 * These components follow WCAG 2.1 AA guidelines and provide inclusive user experiences.
 */

export { AccessibleCarousel } from './accessible-carousel';
export { AccessibleInfiniteScroll } from './accessible-infinite-scroll';
export { AccessibleSelect } from './accessible-select';
export { AccessibleTabs } from './accessible-tabs';
export {
  ProgressiveEnhancement,
  NoScript,
  ReducedMotion,
  FeatureDetection,
} from './progressive-enhancement';

// Re-export types
export type { SelectOption } from './accessible-select';
