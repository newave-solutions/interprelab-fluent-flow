import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface AccessibleCarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * AccessibleCarousel - A WCAG 2.1 AA compliant carousel component
 * 
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Pause/Play controls for auto-rotation (WCAG 2.2.2)
 * - Respects prefers-reduced-motion
 * - Proper ARIA roles and labels
 * - Direct slide access via indicators
 * - Screen reader announcements
 */
export const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className,
  ariaLabel = "Content carousel",
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [isPaused, setIsPaused] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const totalSlides = React.Children.count(children);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = React.useMemo(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Disable autoplay if user prefers reduced motion
  React.useEffect(() => {
    if (prefersReducedMotion) {
      setIsPlaying(false);
      setIsPaused(true);
    }
  }, [prefersReducedMotion]);

  // Auto-play logic
  React.useEffect(() => {
    if (isPlaying && !isPaused && !prefersReducedMotion) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, totalSlides, autoPlayInterval, prefersReducedMotion]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    announceSlideChange(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % totalSlides;
    goToSlide(newIndex);
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsPlaying(!isPaused);
  };

  const announceSlideChange = (index: number) => {
    const announcement = `Slide ${index + 1} of ${totalSlides}`;
    const liveRegion = document.getElementById("carousel-live-region");
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        goToPrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        goToNext();
        break;
      case "Home":
        event.preventDefault();
        goToSlide(0);
        break;
      case "End":
        event.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      default:
        break;
    }
  };

  // Pause on hover or focus
  const handleMouseEnter = () => {
    if (isPlaying) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setIsPaused(false);
    }
  };

  return (
    <div
      ref={carouselRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      {/* Screen reader announcements */}
      <div
        id="carousel-live-region"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Carousel content */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="min-w-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${totalSlides}`}
              aria-hidden={index !== currentIndex}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      {showControls && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={totalSlides <= 1}
            className="pointer-events-auto bg-background/90 hover:bg-background"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={totalSlides <= 1}
            className="pointer-events-auto bg-background/90 hover:bg-background"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Play/Pause control */}
      {autoPlay && !prefersReducedMotion && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlayPause}
            className="bg-background/90 hover:bg-background"
            aria-label={isPaused ? "Play carousel" : "Pause carousel"}
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Slide indicators */}
      {showIndicators && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Slide navigation">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              )}
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              aria-controls={`slide-${index}`}
            />
          ))}
        </div>
      )}

      {/* Instructions for keyboard users */}
      <div className="sr-only">
        Use left and right arrow keys to navigate between slides. Press Home to go to the first slide, or End to go to the last slide.
      </div>
    </div>
  );
};

export default AccessibleCarousel;
