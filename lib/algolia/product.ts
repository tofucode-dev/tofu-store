import { Product } from "../types/product"
import { getAlgoliaClient, getProductsIndexName } from "./client"
import { unstable_cache } from "next/cache"

/**
 * Fetches a single product by its Algolia objectID
 * Cached for ISR with 1 hour revalidation
 */
export const getProductById = unstable_cache(
    async (objectID: string): Promise<Product | null> => {
      try {
        const client = getAlgoliaClient()
        const indexName = getProductsIndexName()
  
        const result = await client.getObject({
          indexName,
          objectID,
        })
  
        return result as Product
      } catch (error) {
        console.error('Failed to fetch product:', error)
        return null
      } 
    },
    ['product'],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ['product'],
    }
  )


  /**
 * Fetches related products based on category and brand
 */
export const getRelatedProducts = unstable_cache(
    async (product: Product, limit: number = 4): Promise<Product[]> => {
      try {
        const client = getAlgoliaClient()
        const indexName = getProductsIndexName()
  
        const facetFilters: string[][] = []
  
        // Filter by same category if available
        if (product.hierarchicalCategories?.lvl0) {
          facetFilters.push([`hierarchicalCategories.lvl0:${product.hierarchicalCategories.lvl0}`])
        }
  
        // Exclude current product
        const filters = `NOT objectID:${product.objectID}`
  
        const result = await client.searchSingleIndex<Product>({
          indexName,
          searchParams: {
            query: '',
            hitsPerPage: limit,
            facetFilters,
            filters,
          },
        })
  
        return result.hits
      } catch (error) {
        console.error('Failed to fetch related products:', error)
        return []
      }
    },
    ['related-products'],
    {
      revalidate: 3600,
      tags: ['products'],
    }
  )