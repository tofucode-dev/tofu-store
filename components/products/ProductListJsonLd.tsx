'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useHits, usePagination, useStats } from 'react-instantsearch'
import type { Product } from '@/lib/types/product'

// Generate URL-safe slug from product name (client-safe version)
function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

function getProductUrl(product: Product): string {
  const slug = generateProductSlug(product.name)
  return `/product/${slug}-${product.objectID}`
}

export function ProductListJsonLd() {
  const { items } = useHits<Product>()
  const { currentRefinement: currentPage } = usePagination()
  const { nbHits } = useStats()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'
  const hitsPerPage = 20 // Should match your InstantSearch configuration
  const startPosition = currentPage * hitsPerPage + 1

  // Build canonical URL (without filters)
  const canonicalUrl = useMemo(() => {
    // Build query string for canonical (exclude filters, only keep query and page)
    const queryParams = new URLSearchParams()
    const query = searchParams.get('q')
    if (query) queryParams.set('q', query)
    if (currentPage > 0) queryParams.set('page', String(currentPage + 1))
    // Note: brands, rating, and price are excluded from canonical URLs

    const queryString = queryParams.toString()
    return `${baseUrl}${pathname}${queryString ? `?${queryString}` : ''}`
  }, [baseUrl, pathname, searchParams, currentPage])

  const jsonLd = useMemo(() => {
    const itemListElement = items.map((product, index) => {
      const productUrl = `${baseUrl}${getProductUrl(product)}`
      const item: Record<string, unknown> = {
        '@type': 'Product',
        '@id': productUrl,
        name: product.name,
      }

      if (product.image) {
        item.image = product.image
      }

      if (product.brand) {
        item.brand = {
          '@type': 'Brand',
          name: product.brand,
        }
      }

      if (product.price != null) {
        item.offers = {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: productUrl,
        }
      }

      return {
        '@type': 'ListItem',
        position: startPosition + index,
        item,
      }
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      url: canonicalUrl,
      numberOfItems: nbHits,
      itemListElement,
    }
  }, [items, startPosition, nbHits, baseUrl, canonicalUrl])

  // Don't render if no items
  if (items.length === 0) return null

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
