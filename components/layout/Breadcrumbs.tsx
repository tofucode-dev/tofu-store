'use client'

import { Fragment, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

// Import category slug mappings
import categoryMappingsJson from '@/data/category-slugs.json'

const categoryMappings = categoryMappingsJson as {
  slugToValue: Record<string, string>
  valueToSlug: Record<string, string>
}

const { slugToValue } = categoryMappings

export const Breadcrumbs = () => {
  const pathname = usePathname()

  // Parse categories from pathname: /products/category1/category2 -> ['category1', 'category2']
  const categorySlugs: string[] = useMemo(() => {
    const slugs: string[] = []
    if (pathname.startsWith('/products/')) {
      const categoryPath = pathname.replace('/products/', '')
      if (categoryPath) {
        slugs.push(...categoryPath.split('/').map(decodeURIComponent))
      }
    }
    return slugs
  }, [pathname])

  // Build breadcrumb items
  const breadcrumbItems: Array<{ label: string; href: string | null }> = useMemo(() => {
    const items: Array<{ label: string; href: string | null }> = [{ label: 'Home', href: '/' }]

    // Add category breadcrumbs
    if (categorySlugs.length === 0) {
      items.push({ label: 'Products', href: null })
    } else {
      items.push({ label: 'Products', href: '/products' })

      // Build path incrementally for each category level
      let currentPath = '/products'
      categorySlugs.forEach((slug, index) => {
        const categoryName =
          slugToValue[slug] ||
          slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        currentPath += `/${encodeURIComponent(slug)}`
        const isLast = index === categorySlugs.length - 1
        items.push({
          label: categoryName,
          href: isLast ? null : currentPath,
        })
      })
    }

    return items
  }, [categorySlugs])

  // Generate JSON-LD for breadcrumbs
  const jsonLd = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => {
        const itemUrl = item.href
          ? item.href.startsWith('http')
            ? item.href
            : `${baseUrl}${item.href}`
          : `${baseUrl}${pathname}`

        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: itemUrl,
        }
      }),
    }
  }, [breadcrumbItems, pathname])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label={index === 0 ? 'Home' : item.label}
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
      </div>
    </>
  )
}
