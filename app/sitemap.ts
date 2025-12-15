import { MetadataRoute } from 'next'
import { getAlgoliaClient, getProductsIndexName } from '@/lib/algolia/client'
import { generateProductSlug } from '@/lib/slug-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tofustore.com'
  const indexName = getProductsIndexName()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  try {
    // Fetch all products from Algolia
    // Note: In production, you might want to paginate or use a different approach
    // for very large indices. This fetches up to 1000 products.
    const client = getAlgoliaClient()
    const result = await client.searchSingleIndex<{ objectID: string; name: string }>({
      indexName,
      searchParams: {
        query: '',
        hitsPerPage: 1000,
        attributesToRetrieve: ['objectID', 'name'],
      },
    })

    // Generate product pages
    const productPages: MetadataRoute.Sitemap = result.hits.map(product => ({
      url: `${baseUrl}/product/${generateProductSlug(product.name)}-${product.objectID}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least static pages if product fetch fails
    return staticPages
  }
}
