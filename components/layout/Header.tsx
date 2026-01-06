import Link from 'next/link'
import { MobileFiltersSheet } from './MobileFiltersSheet'
import { MobileSearchSheet } from './MobileSearchSheet'
import { CartSheet } from '@/components/cart/CartSheet'
import { AutocompleteSearch } from '@/components/algolia/AutocompleteSearch/AutocompleteSearch'

type HeaderProps = {
  hideFilters?: boolean
}

export const Header = ({ hideFilters = false }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4">
        {/* Logo */}
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
          <span className="hidden sm:inline text-lg font-semibold tracking-tight sm:text-xl">TofuStore</span>
        </Link>

        {/* Search Bar - desktop only, takes remaining space */}
        <div className="hidden md:flex flex-1 justify-center">
          <AutocompleteSearch />
        </div>

        {/* Mobile Search and Filters Buttons - full width on mobile */}
        <div className="flex-1 flex gap-2 md:hidden min-w-0">
          <div className="flex-1 min-w-0">
            <MobileSearchSheet />
          </div>
          {!hideFilters && (
            <div className="flex-1 min-w-0">
              <MobileFiltersSheet />
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex items-center gap-2 shrink-0">
          <CartSheet />
        </div>
      </div>
    </header>
  )
}
