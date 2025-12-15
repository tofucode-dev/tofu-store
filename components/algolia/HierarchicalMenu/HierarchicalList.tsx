import { ChevronRight } from 'lucide-react'
import { useHierarchicalMenu } from 'react-instantsearch'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type HierarchicalListProps = {
  items: ReturnType<typeof useHierarchicalMenu>['items']
  refine: ReturnType<typeof useHierarchicalMenu>['refine']
  level: number
}

export const HierarchicalList = ({ items, refine, level }: HierarchicalListProps) => {
  const hasChildren = (item: (typeof items)[0]) => item.data && item.data.length > 0

  return (
    <ul className={cn('space-y-1', level > 0 && 'ml-4 mt-1')} role="list">
      {items.map(item => {
        const expandable = hasChildren(item)
        return (
          <li key={item.value} role="listitem">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refine(item.value)}
              className={cn(
                'w-full justify-start gap-1 px-2 py-1.5 text-sm',
                item.isRefined && 'bg-sidebar-accent font-medium',
              )}
              aria-expanded={expandable ? item.isRefined : undefined}
              aria-label={
                expandable
                  ? `${item.label}, ${item.count} items${item.isRefined ? ', expanded' : ', collapsed'}`
                  : `${item.label}, ${item.count} items`
              }
            >
              {expandable && (
                <ChevronRight
                  className={cn('h-3 w-3 transition-transform', item.isRefined && 'rotate-90')}
                  aria-hidden="true"
                />
              )}
              <span className="truncate">{item.label}</span>
              <span className="ml-auto text-xs text-muted-foreground" aria-hidden="true">
                ({item.count})
              </span>
            </Button>
            {expandable && item.isRefined && item.data && (
              <HierarchicalList items={item.data} refine={refine} level={level + 1} />
            )}
          </li>
        )
      })}
    </ul>
  )
}
