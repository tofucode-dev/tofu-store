'use client'

import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/lib/types/product'
import { useHits, useInstantSearch } from 'react-instantsearch'
import { LoadingHits } from './LoadingHits'
import { EmptyHits } from './EmptyHits'

export const Hits = () => {
  const { items } = useHits<Product>()
  const { status } = useInstantSearch()

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
      {items.map(hit => (
        <ProductCard key={hit.objectID} product={hit} />
      ))}
    </div>
  )
}
