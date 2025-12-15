import { Sidebar } from '@/components/layout/Sidebar'
import { HierarchicalMenu } from '@/components/algolia/HierarchicalMenu/HierarchicalMenu'
import { RefinementList } from '@/components/algolia/RefinementList'
import { RatingRefinementFilter } from '@/components/algolia/RatingRefinementFilter'
import { RangeSlider } from '@/components/algolia/RangeSlider'
import { Hits } from '@/components/algolia/Hits/Hits'
import { Pagination } from '@/components/algolia/Pagination'
import { Metadata } from 'next'
import categoryMappingsJson from '@/data/category-slugs.json'
import { ProductListJsonLd } from '@/components/products/ProductListJsonLd'
import { ProductsPageTitle } from '@/components/products/ProductsPageTitle'
import { Stats } from '@/components/algolia/Stats'
import { CurrentRefinements } from '@/components/algolia/CurrentRefinements'
import { ClearRefinements } from '@/components/algolia/ClearRefinements'

const categoryMappings = categoryMappingsJson satisfies {
  slugToValue: Record<string, string>
  valueToSlug: Record<string, string>
}

const { slugToValue } = categoryMappings

type ProductsPageProps = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ q?: string; page?: string; brands?: string; rating?: string; price?: string }>
}

export async function generateMetadata({ params, searchParams }: ProductsPageProps): Promise<Metadata> {
  const { slug } = await params
  const searchParamsResolved = await searchParams

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'

  // Build canonical URL
  let canonicalPath = '/products'
  if (slug && slug.length > 0) {
    canonicalPath = `/products/${slug.map(s => encodeURIComponent(s)).join('/')}`
  }

  // Build query string for canonical (exclude filters, only keep query and page)
  const queryParams = new URLSearchParams()
  if (searchParamsResolved.q) queryParams.set('q', searchParamsResolved.q)
  if (searchParamsResolved.page && parseInt(searchParamsResolved.page) > 1) {
    queryParams.set('page', searchParamsResolved.page)
  }
  // Note: brands, rating, and price are excluded from canonical URLs

  const queryString = queryParams.toString()
  const canonicalUrl = `${baseUrl}${canonicalPath}${queryString ? `?${queryString}` : ''}`

  // Generate title and description based on category
  let title = 'Products | TofuStore'
  let description =
    'Browse our wide selection of premium products. Filter by category, brand, price, and more. Free shipping on orders over $50.'

  if (slug && slug.length > 0) {
    const lastCategorySlug = slug[slug.length - 1]
    const categoryName =
      slugToValue[lastCategorySlug as keyof typeof slugToValue] ??
      lastCategorySlug
        ?.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') ??
      ''

    title = `${categoryName} | Products | TofuStore`
    description = `Browse ${categoryName} products. Filter by brand, price, rating, and more. Free shipping on orders over $50.`
  } else if (searchParamsResolved.q) {
    title = `Search Results for "${searchParamsResolved.q}" | TofuStore`
    description = `Search results for "${searchParamsResolved.q}". Find the perfect product with our advanced filters.`
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

const ProductsPage = () => {
  return (
    <>
      <ProductListJsonLd />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar with Filters - hidden on mobile, shown via sheet */}
          <Sidebar>
            <ClearRefinements />
            <HierarchicalMenu
              attributes={['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2']}
              title="Categories"
            />
            <RefinementList attribute="brand" title="Brands" />
            <RangeSlider attribute="price" title="Price" />
            <RatingRefinementFilter attribute="rating" title="Rating" limit={5} />
          </Sidebar>
          {/* Product Area */}
          <main id="main-content" className="flex min-h-0 flex-1 flex-col" tabIndex={-1}>
            <div className="shrink-0 space-y-2 border-b border-border bg-background px-3 py-2 sm:px-6 sm:py-3">
              <ProductsPageTitle />
              <Stats />
              <CurrentRefinements />
            </div>

            {/* Scrollable Product Grid */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
              <Hits />
            </div>

            {/* Fixed Pagination */}
            <div className="shrink-0 border-t border-border bg-background px-2 sm:px-4">
              <Pagination />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default ProductsPage
