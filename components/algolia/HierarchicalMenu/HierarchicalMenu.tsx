'use client'

import { useHierarchicalMenu } from 'react-instantsearch'
import { HierarchicalList } from './HierarchicalList'
import { Typography } from '@/components/ui/typography'

type HierarchicalMenuProps = {
  attributes: string[]
  title: string
}

export const HierarchicalMenu = ({ attributes, title }: HierarchicalMenuProps) => {
  const { items, refine } = useHierarchicalMenu({ attributes })

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="space-y-3" aria-label={title}>
      <Typography 
        variant="h6" 
        className="uppercase tracking-wider text-sidebar-foreground/60 text-sm font-bold"
        id={`hierarchical-menu-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {title}
      </Typography>
      <HierarchicalList items={items} refine={refine} level={0} />
    </nav>
  )
}
