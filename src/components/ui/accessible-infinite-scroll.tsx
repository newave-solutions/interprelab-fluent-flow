import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AccessibleInfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  autoLoad?: boolean;
  threshold?: number;
  className?: string;
  loadMoreText?: string;
  loadingText?: string;
  noMoreText?: string;
}

/**
 * AccessibleInfiniteScroll - An accessible infinite scroll/load more component
 * 
 * Features:
 * - Progressive enhancement with "Load More" button
 * - Optional automatic loading on scroll
 * - Proper loading state announcements
 * - Keyboard accessible
 * - Preserves scroll position
 * - Clear indication of loading and end states
 */
export function AccessibleInfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  isLoading,
  autoLoad = false,
  threshold = 200,
  className,
  loadMoreText = "Load More",
  loadingText = "Loading more items...",
  noMoreText = "No more items to load",
}: AccessibleInfiniteScrollProps<T>) {
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const loadingRef = React.useRef(false);

  // Intersection Observer for auto-loading
  React.useEffect(() => {
    if (!autoLoad || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [autoLoad, hasMore, isLoading, threshold]);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || loadingRef.current) return;

    loadingRef.current = true;
    setError(null);

    try {
      await loadMore();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more items");
    } finally {
      loadingRef.current = false;
    }
  };

  // Announce loading state to screen readers
  const getAriaLiveMessage = () => {
    if (isLoading) return loadingText;
    if (error) return `Error: ${error}`;
    if (!hasMore) return noMoreText;
    return "";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Items list */}
      <div className="space-y-4" role="feed" aria-busy={isLoading}>
        {items.map((item, index) => (
          <article key={index} aria-posinset={index + 1} aria-setsize={-1}>
            {renderItem(item, index)}
          </article>
        ))}
      </div>

      {/* Loading state announcer for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {getAriaLiveMessage()}
      </div>

      {/* Load more section */}
      {hasMore && (
        <div className="flex flex-col items-center gap-4 py-8">
          {/* Intersection observer target for auto-loading */}
          {autoLoad && <div ref={observerTarget} className="h-px w-full" />}

          {/* Manual load more button */}
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
            aria-label={isLoading ? loadingText : loadMoreText}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              loadMoreText
            )}
          </Button>

          {/* Error message */}
          {error && (
            <div
              className="text-sm text-destructive"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Auto-load indicator */}
          {autoLoad && isLoading && (
            <p className="text-sm text-muted-foreground">
              Automatically loading more content...
            </p>
          )}
        </div>
      )}

      {/* End of content message */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-muted-foreground" role="status">
          <p>{noMoreText}</p>
        </div>
      )}

      {/* Empty state */}
      {!hasMore && items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground" role="status">
          <p>No items to display</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example usage:
 * 
 * ```tsx
 * const MyComponent = () => {
 *   const [items, setItems] = useState([]);
 *   const [hasMore, setHasMore] = useState(true);
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   const loadMore = async () => {
 *     setIsLoading(true);
 *     try {
 *       const newItems = await fetchItems();
 *       setItems(prev => [...prev, ...newItems]);
 *       setHasMore(newItems.length > 0);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 * 
 *   return (
 *     <AccessibleInfiniteScroll
 *       items={items}
 *       renderItem={(item) => <ItemCard item={item} />}
 *       loadMore={loadMore}
 *       hasMore={hasMore}
 *       isLoading={isLoading}
 *       autoLoad={false} // Start with manual loading
 *     />
 *   );
 * };
 * ```
 */

export default AccessibleInfiniteScroll;
