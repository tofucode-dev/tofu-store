'use client'

import { useCurrentRefinements } from 'react-instantsearch'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const CurrentRefinements = () => {
  const { items, refine } = useCurrentRefinements()

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item =>
        item.refinements.map(refinement => (
          <Badge
            key={`${item.attribute}-${refinement.label}`}
            variant="secondary"
            className="cursor-pointer gap-1 pr-1"
            onClick={() => refine(refinement)}
          >
            {refinement.label}
            <X className="h-3 w-3" />
          </Badge>
        )),
      )}
    </div>
  )
}
