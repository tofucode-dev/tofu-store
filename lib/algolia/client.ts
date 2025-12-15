import { algoliasearch, SearchClient } from 'algoliasearch'

let client: SearchClient | null = null

export function getAlgoliaClient() {
  if (!client) {
    // Support both NEXT_PUBLIC_ and non-prefixed env vars
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID
    const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || process.env.ALGOLIA_SEARCH_API_KEY

    if (!appId || !apiKey) {
      throw new Error(
        'Missing Algolia credentials. Set NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY',
      )
    }

    client = algoliasearch(appId, apiKey)
  }
  return client
}

export function getProductsIndexName() {
  return process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || process.env.ALGOLIA_PRODUCTS_INDEX_NAME || 'instant_search'
}
