'use client'

import { useRefinementList } from 'react-instantsearch'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { StarRating } from '@/components/shared/StarRating'

type RatingRefinementFilterProps = {
  attribute: string
  title: string
  limit?: number
}

export const RatingRefinementFilter = ({ attribute, title, limit = 5 }: RatingRefinementFilterProps) => {
  const { items, refine, canToggleShowMore, isShowingMore, toggleShowMore } = useRefinementList({
    attribute,
    limit,
    showMore: true,
    showMoreLimit: 10,
  })

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="space-y-3" aria-label={title}>
      <Typography
        variant="h6"
        className="uppercase tracking-wider text-sidebar-foreground/60 text-sm font-semibold"
        id={`rating-refinement-${attribute}`}
      >
        {title}
      </Typography>
      <ul className="space-y-1" role="list">
        {items.map(item => {
          // Parse the rating value from the item (could be string like "4" or "4.0")
          const rating = parseFloat(item.value)

          return (
            <li key={item.value} role="listitem">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refine(item.value)}
                className={cn(
                  'w-full justify-between px-2 py-1.5 text-sm',
                  item.isRefined && 'bg-sidebar-accent font-medium',
                )}
                aria-pressed={item.isRefined}
                aria-label={`${rating.toFixed(1)} star rating, ${item.count} items${
                  item.isRefined ? ', selected' : ''
                }`}
              >
                <StarRating rating={rating} />
                <span className="ml-2 text-xs text-muted-foreground" aria-hidden="true">
                  ({item.count})
                </span>
              </Button>
            </li>
          )
        })}
      </ul>
      {canToggleShowMore && (
        <Button variant="link" size="sm" onClick={toggleShowMore} className="h-auto px-0 text-xs">
          {isShowingMore ? 'Show less' : 'Show more'}
        </Button>
      )}
    </nav>
  )
}
