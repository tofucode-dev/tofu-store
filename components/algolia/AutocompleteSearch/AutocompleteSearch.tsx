'use client'

import { useRouter } from 'next/navigation'
import { EXPERIMENTAL_Autocomplete } from 'react-instantsearch'
import { useIsMounted } from '@/lib/hooks/useIsMounted'
import { getProductUrl } from '@/lib/slug-utils'
import type { Product } from '@/lib/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { StarRating } from '@/components/shared/StarRating'
import 'instantsearch.css/themes/satellite.css'
import './autocomplete.css'

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'instant_search'

export function AutocompleteSearch() {
  const router = useRouter()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative max-w-[600px] w-full" role="search" aria-label="Product search">
      <EXPERIMENTAL_Autocomplete
        indices={[
          {
            indexName,
            getQuery: (item: Product) => item.name,
            getURL: (item: Product) => getProductUrl(item),
            itemComponent: ({ item, onSelect }: { item: Product; onSelect: () => void }) => (
              <AutocompleteItem item={item} onSelect={onSelect} />
            ),
            searchParameters: {
              hitsPerPage: 10,
            },
          },
        ]}
        onSelect={({ url }: { url?: string }) => {
          if (url) {
            router.push(url)
          }
        }}
        placeholder="Search products..."
      />
    </div>
  )
}

function AutocompleteItem({ item, onSelect }: { item: Product; onSelect: () => void }) {
  const productUrl = getProductUrl(item)

  // Build comprehensive aria-label for screen readers (Narrator support)
  // Format: "Product name, by Brand, $Price, X.X out of 5 stars, Description"
  const ariaLabelParts: string[] = [item.name]
  if (item.brand) ariaLabelParts.push(`by ${item.brand}`)
  if (item.price !== undefined) ariaLabelParts.push(`$${item.price.toFixed(2)}`)
  if (item.rating !== undefined) ariaLabelParts.push(`${item.rating.toFixed(1)} out of 5 stars`)
  if (item.description) ariaLabelParts.push(item.description)

  const ariaLabel = ariaLabelParts.join(', ')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onSelect() // This will close the autocomplete and trigger the onSelect handler
  }

  return (
    <Link
      href={productUrl}
      role="option"
      aria-label={ariaLabel}
      tabIndex={-1}
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 focus:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors border-b border-border last:border-b-0"
    >
      {item.image && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted" aria-hidden="true">
          <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-foreground line-clamp-1" aria-hidden="true">
          {item.name}
        </div>
        {item.brand && (
          <div className="text-xs text-muted-foreground line-clamp-1" aria-hidden="true">
            {item.brand}
          </div>
        )}
        {item.description && (
          <div className="text-xs text-muted-foreground line-clamp-1 mt-1" aria-hidden="true">
            {item.description}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1" aria-hidden="true">
          {item.rating !== undefined && <StarRating rating={item.rating} />}
          {item.price !== undefined && (
            <span className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
