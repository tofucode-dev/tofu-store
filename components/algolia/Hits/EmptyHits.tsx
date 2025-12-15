export const EmptyHits = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="text-lg font-medium text-muted-foreground">No products found</p>
      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  )
}
