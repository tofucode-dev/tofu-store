import type { Product } from '@/lib/types/product'
import { ProductCard } from '@/components/products/ProductCard'

type RelatedProductsProps = {
  products: Product[]
  title?: string
}

export function RelatedProducts({ products, title = 'You may also like' }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section aria-labelledby="related-products-heading" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12">
      <h2 id="related-products-heading" className="mb-6 text-2xl font-bold tracking-tight">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6" role="list" aria-label={`${products.length} related products`}>
        {products.map(product => (
          <div key={product.objectID} role="listitem">
            <ProductCard product={product} hideAddToCart />
          </div>
        ))}
      </div>
    </section>
  )
}
