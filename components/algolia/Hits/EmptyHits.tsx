export const EmptyHits = () => {
    return (
      <div 
        className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        role="status"
        aria-label="Loading products"
        aria-live="polite"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="overflow-hidden rounded-xl bg-muted"
            role="presentation"
            aria-hidden="true"
          >
            <div className="aspect-square w-full animate-pulse bg-muted-foreground/10" />
            <div className="space-y-2 p-2 sm:p-3">
              <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted-foreground/10" />
              <div className="h-5 w-16 animate-pulse rounded bg-muted-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    )
}