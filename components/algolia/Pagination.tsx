'use client'

import { usePagination } from 'react-instantsearch'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Pagination = () => {
  const { pages, currentRefinement, refine, isFirstPage, isLastPage, nbPages } = usePagination()

  if (nbPages <= 1) return null

  // On mobile, show fewer page numbers
  const visiblePages = pages.slice(0, 5)

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-center gap-1 py-2 sm:gap-1.5"
    >
      {/* Screen reader announcement */}
      <span 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        Page {currentRefinement + 1} of {nbPages}
      </span>

      {/* First page - hidden on mobile */}
      <Button
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9"
        disabled={isFirstPage}
        onClick={() => refine(0)}
        aria-label="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* Previous page */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9"
        disabled={isFirstPage}
        onClick={() => refine(currentRefinement - 1)}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* Page numbers */}
      {visiblePages.map(page => (
        <Button
          key={page}
          variant={page === currentRefinement ? 'default' : 'outline'}
          size="icon"
          className="h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm"
          onClick={() => refine(page)}
          aria-label={`Go to page ${page + 1}`}
          aria-current={page === currentRefinement ? 'page' : undefined}
        >
          {page + 1}
        </Button>
      ))}

      {/* Show ellipsis if more pages */}
      {pages.length > 5 && (
        <span className="px-1 text-sm text-muted-foreground" aria-hidden="true">
          ...
        </span>
      )}

      {/* Next page */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 sm:h-9 sm:w-9"
        disabled={isLastPage}
        onClick={() => refine(currentRefinement + 1)}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>

      {/* Last page - hidden on mobile */}
      <Button
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 sm:flex sm:h-9 sm:w-9"
        disabled={isLastPage}
        onClick={() => refine(nbPages - 1)}
        aria-label={`Go to last page, page ${nbPages}`}
      >
        <ChevronsRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </nav>
  )
}
