'use client'

import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/lib/types/product'
import { useHits, useInstantSearch, usePagination } from 'react-instantsearch'
import { LoadingHits } from './LoadingHits'
import { EmptyHits } from './EmptyHits'
import { useEffect, useRef } from 'react'

export const Hits = () => {
  const { items } = useHits<Product>()
  const { status } = useInstantSearch()
  const { currentRefinement } = usePagination()
  const firstProductRef = useRef<HTMLAnchorElement>(null)
  const previousPageRef = useRef<number>(currentRefinement)

  // Focus on the first product card when page changes
  useEffect(() => {
    // Only focus if the page actually changed (not on initial load or other changes)
    const pageChanged = previousPageRef.current !== currentRefinement

    if (pageChanged && items.length > 0 && firstProductRef.current && status === 'idle') {
      // Small delay to ensure the DOM is fully updated
      const timeoutId = setTimeout(() => {
        firstProductRef.current?.focus()
        firstProductRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)

      previousPageRef.current = currentRefinement
      return () => clearTimeout(timeoutId)
    }

    // Update the previous page ref even if we don't focus
    if (!pageChanged) {
      previousPageRef.current = currentRefinement
    }
  }, [currentRefinement, items.length, status])

  if (status === 'loading' || status === 'stalled') {
    return <LoadingHits />
  }

  if (items.length === 0) {
    return <EmptyHits />
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      role="region"
      aria-label="Product search results"
      aria-live="polite"
      aria-atomic="false"
    >
      {items.map((hit, index) => (
        <ProductCard key={hit.objectID} product={hit} ref={index === 0 ? firstProductRef : undefined} />
      ))}
    </div>
  )
}
