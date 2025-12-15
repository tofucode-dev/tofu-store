import { Fragment } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Product } from '@/lib/types/product'
import categoryMappingsJson from '@/data/category-slugs.json'
import { generateProductSlug } from '@/lib/slug-utils'

const categoryMappings = categoryMappingsJson satisfies {
  slugToValue: Record<string, string>
  valueToSlug: Record<string, string>
}

const { valueToSlug } = categoryMappings

/**
 * Convert category value to URL slug
 */
function toSlug(categoryValue: string): string {
  const cached = valueToSlug[categoryValue as keyof typeof valueToSlug]
  if (cached) return cached

  // Fallback: slugify the category value
  return categoryValue
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

type BreadcrumbItemType = {
  label: string
  href?: string | null
}

type BreadcrumbsProps = {
  items?: BreadcrumbItemType[]
  product?: Product | null
}

export function Breadcrumbs({ items, product }: BreadcrumbsProps) {
  let breadcrumbItems: BreadcrumbItemType[]

  if (product) {
    // Product page breadcrumbs - build full hierarchical path
    breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
    ]

    // Add hierarchical categories (lvl0, lvl1, lvl2) if they exist
    // Each level contains the full path with " > " separator
    // e.g., lvl1: "Cameras & Camcorders > Camcorder Accessories"
    const hierarchical = product.hierarchicalCategories
    if (hierarchical) {
      let currentPath = '/products'

      // Process lvl0 - extract the category name (no separator, it's just the name)
      if (hierarchical.lvl0 && typeof hierarchical.lvl0 === 'string') {
        const lvl0Name = hierarchical.lvl0
        const lvl0Slug = toSlug(lvl0Name)
        currentPath += `/${encodeURIComponent(lvl0Slug)}`
        breadcrumbItems.push({
          label: lvl0Name,
          href: currentPath,
        })
      }

      // Process lvl1 - extract the last segment after " > "
      if (hierarchical.lvl1 && typeof hierarchical.lvl1 === 'string') {
        const lvl1Segments = hierarchical.lvl1.split(' > ')
        const lvl1Name = lvl1Segments[lvl1Segments.length - 1] // Get last segment
        const lvl1Slug = toSlug(lvl1Name)
        currentPath += `/${encodeURIComponent(lvl1Slug)}`
        breadcrumbItems.push({
          label: lvl1Name,
          href: currentPath,
        })
      }

      // Process lvl2 - extract the last segment after " > "
      if (hierarchical.lvl2 && typeof hierarchical.lvl2 === 'string') {
        const lvl2Segments = hierarchical.lvl2.split(' > ')
        const lvl2Name = lvl2Segments[lvl2Segments.length - 1] // Get last segment
        const lvl2Slug = toSlug(lvl2Name)
        currentPath += `/${encodeURIComponent(lvl2Slug)}`
        breadcrumbItems.push({
          label: lvl2Name,
          href: currentPath,
        })
      }
    }

    // Add product name as final breadcrumb
    breadcrumbItems.push({ label: product.name, href: null })
  } else if (items) {
    // Custom items provided
    breadcrumbItems = items
  } else {
    // Default for products listing page
    breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: 'All Products', href: null },
    ]
  }

  // Generate JSON-LD for breadcrumbs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'

  // Determine current page URL for items without href (current page)
  let currentPageUrl = baseUrl
  if (product) {
    // For product pages, construct URL from product slug
    const productSlug = `${generateProductSlug(product.name)}-${product.objectID}`
    currentPageUrl = `${baseUrl}/product/${productSlug}`
  } else if (breadcrumbItems.length > 0) {
    // For other pages, use the last item's inferred path
    const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
    if (lastItem.label === 'All Products' || lastItem.label === 'Products') {
      currentPageUrl = `${baseUrl}/products`
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => {
      const itemUrl = item.href ? (item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`) : currentPageUrl

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: itemUrl,
      }
    }),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 rounded text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {index === 0 && <Home className="h-4 w-4" aria-hidden="true" />}
                          <span className={index === 0 ? 'sr-only sm:not-sr-only' : ''}>{item.label}</span>
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>
    </>
  )
}
