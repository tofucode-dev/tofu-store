'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import type { Product } from '@/lib/types/product'

type ProductViewTrackerProps = {
  product: Product
}

/**
 * Client component to track product view events
 * Should be used on product detail pages
 */
export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  const { trackProductView } = useAnalytics()
  const trackedProductId = useRef<string | null>(null)

  useEffect(() => {
    // Only track if this is a different product (by ID)
    if (trackedProductId.current !== product.objectID) {
      trackedProductId.current = product.objectID
      trackProductView(product)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.objectID]) // Only depend on product ID, not the whole product object

  return null
}
