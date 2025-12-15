'use client'

import { algoliasearch } from 'algoliasearch'
import {
  stateToRoute as stateToRouteUtil,
  routeToState as routeToStateUtil,
  createURL as createURLUtil,
  parseURL as parseURLUtil,
  type RouteState,
} from './instantSearchRouting'
import { UiState } from 'instantsearch.js'
import { InstantSearchNext } from 'react-instantsearch-nextjs'

type InstantSearchProviderProps = {
  children: React.ReactNode
}

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
)
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'instant_search'

export const InstantSearchProvider = ({ children }: InstantSearchProviderProps) => {
  return (
    <InstantSearchNext
      searchClient={searchClient}
      indexName={indexName}
      routing={{
        router: {
          cleanUrlOnDispose: false,
          createURL({ routeState, location }: { routeState: RouteState; location: Location }) {
            return createURLUtil(routeState, location)
          },
          parseURL({ location }: { location: Location }): RouteState {
            return parseURLUtil(location)
          },
        },
        stateMapping: {
          stateToRoute(uiState: UiState): RouteState {
            return stateToRouteUtil(uiState, indexName)
          },
          routeToState(routeState: RouteState): UiState {
            return routeToStateUtil(routeState, indexName)
          },
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      {children}
    </InstantSearchNext>
  )
}
