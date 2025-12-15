'use client'

import { useClearRefinements } from 'react-instantsearch'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMounted } from '@/lib/hooks/useIsMounted'

export const ClearRefinements = () => {
  const { canRefine, refine } = useClearRefinements()
  const isMounted  = useIsMounted()
  if (!canRefine || !isMounted) return;

  return (
    <Button variant="ghost" size="sm" onClick={refine} className="h-8 text-xs">
      <X className="mr-1 h-3 w-3" />
      Clear all filters
    </Button>
  )
}
