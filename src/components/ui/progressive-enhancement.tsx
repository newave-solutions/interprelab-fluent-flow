import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresJS?: boolean;
  className?: string;
}

/**
 * ProgressiveEnhancement - A wrapper component for progressive enhancement
 * 
 * This component helps implement progressive enhancement by:
 * - Detecting JavaScript availability
 * - Providing fallback content when JS is disabled
 * - Supporting feature detection
 * - Ensuring content is accessible without JavaScript
 * 
 * Progressive enhancement ensures that basic content and functionality
 * is available to all users, with enhanced features available when supported.
 */
export const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  requiresJS = true,
  className,
}) => {
  const [isJSEnabled, setIsJSEnabled] = React.useState(false);

  React.useEffect(() => {
    // This will only run if JavaScript is enabled
    setIsJSEnabled(true);
  }, []);

  if (requiresJS && !isJSEnabled && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{children}</div>;
};

/**
 * NoScript - Component for content that should only show when JS is disabled
 */
export const NoScript: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <noscript>
      <div className={className}>{children}</div>
    </noscript>
  );
};

/**
 * ReducedMotion - Wrapper that respects user's motion preferences
 */
export const ReducedMotion: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}> = ({ children, fallback, className }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={cn(prefersReducedMotion && "motion-reduce", className)}>{children}</div>;
};

/**
 * FeatureDetection - Detect and conditionally render based on feature support
 */
interface FeatureDetectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  feature: "intersectionObserver" | "customElements" | "localStorage" | "webGL";
  className?: string;
}

export const FeatureDetection: React.FC<FeatureDetectionProps> = ({
  children,
  fallback,
  feature,
  className,
}) => {
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    const checkFeature = () => {
      switch (feature) {
        case "intersectionObserver":
          return "IntersectionObserver" in window;
        case "customElements":
          return "customElements" in window;
        case "localStorage":
          try {
            const test = "__test__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
          } catch {
            return false;
          }
        case "webGL":
          try {
            const canvas = document.createElement("canvas");
            return !!(
              canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
            );
          } catch {
            return false;
          }
        default:
          return false;
      }
    };

    setIsSupported(checkFeature());
  }, [feature]);

  if (!isSupported && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{children}</div>;
};

/**
 * Example usage:
 * 
 * ```tsx
 * // Progressive enhancement with fallback
 * <ProgressiveEnhancement
 *   fallback={
 *     <div>
 *       <h3>JavaScript Required</h3>
 *       <p>Please enable JavaScript to use this feature.</p>
 *       <a href="/alternative">Use alternative version</a>
 *     </div>
 *   }
 * >
 *   <InteractiveComponent />
 * </ProgressiveEnhancement>
 * 
 * // Respect motion preferences
 * <ReducedMotion
 *   fallback={<StaticImage src="/image.jpg" />}
 * >
 *   <AnimatedCarousel />
 * </ReducedMotion>
 * 
 * // Feature detection
 * <FeatureDetection
 *   feature="intersectionObserver"
 *   fallback={<ManualLoadButton />}
 * >
 *   <InfiniteScroll />
 * </FeatureDetection>
 * 
 * // NoScript message
 * <NoScript>
 *   <div className="bg-yellow-100 p-4">
 *     This site works best with JavaScript enabled.
 *   </div>
 * </NoScript>
 * ```
 */

export default ProgressiveEnhancement;
