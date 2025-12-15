'use client'

import { useRefinementList } from 'react-instantsearch'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

type RefinementListProps = {
  attribute: string
  title: string
  limit?: number
}

export const RefinementList = ({ attribute, title, limit = 10 }: RefinementListProps) => {
  const { items, refine, canToggleShowMore, isShowingMore, toggleShowMore } = useRefinementList({
    attribute,
    limit,
    showMore: true,
    showMoreLimit: 20,
  })

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="space-y-3" aria-label={title}>
      <Typography
        variant="h6"
        className="uppercase tracking-wider text-sidebar-foreground/60 text-sm font-semibold"
        id={`refinement-list-${attribute}`}
      >
        {title}
      </Typography>
      <ul className="space-y-1" role="list">
        {items.map(item => (
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
              aria-label={`${item.label}, ${item.count} items${item.isRefined ? ', selected' : ''}`}
            >
              <span className="truncate">{item.label}</span>
              <span className="ml-2 text-xs text-muted-foreground" aria-hidden="true">
                ({item.count})
              </span>
            </Button>
          </li>
        ))}
      </ul>
      {canToggleShowMore && (
        <Button variant="link" size="sm" onClick={toggleShowMore} className="h-auto px-0 text-xs">
          {isShowingMore ? 'Show less' : 'Show more'}
        </Button>
      )}
    </nav>
  )
}
