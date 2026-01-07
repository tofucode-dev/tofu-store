'use client'

import { algoliasearch } from 'algoliasearch'
import { InstantSearchNext } from 'react-instantsearch-nextjs'

type InstantSearchProviderNoRoutingProps = {
  children: React.ReactNode
}

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
)
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'instant_search'

/**
 * InstantSearch provider without routing - used for product detail pages
 * where we need the search context (for AutocompleteSearch) but don't want
 * URL routing to interfere with product URLs
 */
export const InstantSearchProviderNoRouting = ({ children }: InstantSearchProviderNoRoutingProps) => {
  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={indexName}
      ignoreMultipleHooksWarning={true}
      // No routing prop - this prevents URL interference on product pages
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      {children}
    </InstantSearchNext>
  )
}
