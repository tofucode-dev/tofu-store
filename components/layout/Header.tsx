import Link from 'next/link'
import { MobileFiltersSheet } from './MobileFiltersSheet'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Logo - hidden when search is open on mobile */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          aria-label="TofuStore home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
            <span className="text-base font-bold text-primary-foreground sm:text-lg" aria-hidden="true">
              T
            </span>
          </div>
          <span className="text-lg font-semibold tracking-tight sm:text-xl">TofuStore</span>
        </Link>

        {/* Mobile Filters Button - only show when using InstantSearch */}
        <MobileFiltersSheet />

        {/* Mobile Search Toggle & Cart */}
        <div className="flex items-center gap-2">{/* Cart */}</div>
      </div>
    </header>
  )
}
