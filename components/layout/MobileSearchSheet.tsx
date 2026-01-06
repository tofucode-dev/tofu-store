'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AutocompleteSearch } from '@/components/algolia/AutocompleteSearch/AutocompleteSearch'

export function MobileSearchSheet() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full" aria-label="Open search">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-full w-full max-w-full overflow-y-auto p-0 sm:h-auto sm:max-h-[80vh] data-[state=open]:duration-200 data-[state=closed]:duration-200"
      >
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle>Search Products</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <div className="w-full">
            <AutocompleteSearch />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
