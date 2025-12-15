import { Product } from "@/lib/types/product"

export const ProductJsonLd = ({ product }: { product: Product }) => {
    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || `${product.name} - Premium quality product`,
      image: product.image ? [product.image] : undefined,
      brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
      sku: product.objectID,
      offers:
        product.price != null
          ? {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              seller: { '@type': 'Organization', name: 'TofuStore' },
            }
          : undefined,
    }
  
    Object.keys(jsonLd).forEach(k => jsonLd[k] === undefined && delete jsonLd[k])
  
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  }