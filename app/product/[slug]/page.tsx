import { generateProductSlug, parseProductIdFromSlug } from '@/lib/slug-utils'
import { getProductById, getRelatedProducts } from '@/lib/algolia/product'
import { Breadcrumbs } from '@/components/layout/ProductBreadcrumbs'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductTabs } from '@/components/product/ProductTabs'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { ProductJsonLd } from '@/components/product/ProductJsonLd'
import { ProductViewTracker } from '@/components/analytics/ProductViewTracker'
import { Metadata } from 'next'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  const fallback = {
    title: 'TofuStore',
    description: 'Browse premium products at TofuStore. Fast shipping and great prices.',
  }

  const productId = parseProductIdFromSlug(slug)
  if (!productId) return { title: 'Product Not Found | TofuStore', description: fallback.description }

  const product = await getProductById(productId)
  if (!product) return { title: 'Product Not Found | TofuStore', description: fallback.description }

  const title = `${product.name}${product.brand ? ` by ${product.brand}` : ''} | TofuStore`
  const description =
    (product.description && product.description.trim()) ||
    `Shop ${product.name}${product.brand ? ` from ${product.brand}` : ''}. ${
      product.price != null ? `Starting at $${product.price.toFixed(2)}.` : ''
    } Free shipping on orders over $50.`

  const expectedSlug = `${generateProductSlug(product.name)}-${product.objectID}`
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'

  return {
    title,
    description,
    alternates: { canonical: `${baseUrl}/product/${expectedSlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const productId = parseProductIdFromSlug(slug)
  if (!productId) notFound()

  const product = await getProductById(productId)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product, 4)
  const productImages = product.image ? [product.image] : []

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductViewTracker product={product} />
{/*       <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a> */}
      <Breadcrumbs product={product} />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <article
          className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12"
          itemScope
          itemType="https://schema.org/Product"
          aria-label={`Product details for ${product.name}`}
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery images={productImages} productName={product.name} />
            </div>
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <ProductTabs product={product} />
          </div>
        </article>

        <RelatedProducts products={relatedProducts} />
      </main>
    </>
  )
}
