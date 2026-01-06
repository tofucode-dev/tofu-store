'use client'

import { useState, useEffect, useRef } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { RatingRefinementFilter } from '@/components/algolia/RatingRefinementFilter'
import { ClearRefinements } from '@/components/algolia/ClearRefinements'
import { HierarchicalMenu } from '@/components/algolia/HierarchicalMenu/HierarchicalMenu'
import { RefinementList } from '@/components/algolia/RefinementList'
import { RangeSlider } from '@/components/algolia/RangeSlider'

export function MobileFiltersSheet() {
  const [open, setOpen] = useState(false)
  const firstFilterRef = useRef<HTMLDivElement>(null)

  // Focus management when sheet opens
  useEffect(() => {
    if (open && firstFilterRef.current) {
      // Small delay to ensure sheet is fully rendered
      setTimeout(() => {
        const firstFocusable = firstFilterRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        firstFocusable?.focus()
      }, 100)
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full" aria-label="Open filters">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div ref={firstFilterRef} className="space-y-6 p-4">
          <ClearRefinements />

          <HierarchicalMenu
            attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']}
            title="Categories"
          />

          <RefinementList attribute="brand" title="Brand" />

          <RangeSlider attribute="price" title="Price" />

          <RatingRefinementFilter attribute="rating" title="Rating" limit={5} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
