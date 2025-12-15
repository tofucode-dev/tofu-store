'use client'

import { usePathname } from 'next/navigation'
import categoryMappingsJson from '@/data/category-slugs.json'

const categoryMappings = categoryMappingsJson satisfies {
  slugToValue: Record<string, string>
  valueToSlug: Record<string, string>
}

const { slugToValue } = categoryMappings

export const ProductsPageTitle = () => {
  const pathname = usePathname()

  // Parse categories from pathname
  const categorySlugs: string[] = []
  if (pathname.startsWith('/products/')) {
    const categoryPath = pathname.replace('/products/', '')
    if (categoryPath) {
      categorySlugs.push(...categoryPath.split('/').map(decodeURIComponent))
    }
  }

  // Get the title based on the current path
  let title: string
  if (categorySlugs.length === 0) {
    title = 'Products'
  } else {
    // Use the last (most specific) category name
    const lastSlug = categorySlugs[categorySlugs.length - 1]
    title =
      slugToValue[lastSlug as keyof typeof slugToValue] ??
      lastSlug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ?? ''    
  }

  return (
    <h1 className="px-3 py-2 text-lg font-semibold sm:px-6 sm:py-3 sm:text-xl">
      {title}
    </h1>
  )
}

