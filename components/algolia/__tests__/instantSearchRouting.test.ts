import { describe, it, expect } from 'vitest'
import { slugify, stateToRoute, routeToState, createURL, parseURL, type RouteState } from '../instantSearchRouting'
import type { UiState } from 'instantsearch.js'

describe('URL Routing Functions', () => {
  const indexName = 'instant_search'

  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(slugify('Air Conditioners')).toBe('air-conditioners')
    })

    it('should replace & with and', () => {
      expect(slugify('TV & Home Theater')).toBe('tv-and-home-theater')
    })

    it('should collapse multiple spaces into single hyphen', () => {
      expect(slugify('Cell  Phones')).toBe('cell-phones')
    })

    it('should remove special characters', () => {
      expect(slugify('Electronics!')).toBe('electronics')
    })

    it('should remove leading hyphens', () => {
      expect(slugify('-test')).toBe('test')
    })

    it('should remove trailing hyphens', () => {
      expect(slugify('test-')).toBe('test')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(slugify('-test-')).toBe('test')
    })

    it('should handle empty string', () => {
      expect(slugify('')).toBe('')
    })

    it('should handle complex category names', () => {
      expect(slugify('Health, Fitness & Beauty')).toBe('health-fitness-and-beauty')
    })

    it('should lowercase all characters', () => {
      expect(slugify('UPPERCASE')).toBe('uppercase')
    })

    it('should handle numbers', () => {
      expect(slugify('Category 123')).toBe('category-123')
    })
  })

  describe('stateToRoute', () => {
    it('should return empty object for empty UI state', () => {
      const uiState: UiState = { [indexName]: {} }
      expect(stateToRoute(uiState, indexName)).toEqual({})
    })

    it('should convert query to route state', () => {
      const uiState: UiState = { [indexName]: { query: 'samsung' } }
      expect(stateToRoute(uiState, indexName)).toEqual({ query: 'samsung' })
    })

    it('should include page when greater than 1', () => {
      const uiState: UiState = { [indexName]: { page: 2 } }
      expect(stateToRoute(uiState, indexName)).toEqual({ page: 2 })
    })

    it('should omit page when equal to 1', () => {
      const uiState: UiState = { [indexName]: { page: 1 } }
      expect(stateToRoute(uiState, indexName)).toEqual({})
    })

    it('should convert hierarchical menu to categories', () => {
      const uiState: UiState = {
        [indexName]: {
          hierarchicalMenu: {
            'hierarchicalCategories.lvl0': ['Appliances'],
          },
        },
      }
      const result = stateToRoute(uiState, indexName)
      expect(result.categories).toEqual(['appliances'])
    })

    it('should convert brand refinement list', () => {
      const uiState: UiState = {
        [indexName]: {
          refinementList: {
            brand: ['Samsung', 'LG'],
          },
        },
      }
      const result = stateToRoute(uiState, indexName)
      expect(result.brands).toEqual(['Samsung', 'LG'])
    })

    it('should convert rating refinement list', () => {
      const uiState: UiState = {
        [indexName]: {
          refinementList: {
            rating: ['4', '5'],
          },
        },
      }
      const result = stateToRoute(uiState, indexName)
      expect(result.rating).toEqual(['4', '5'])
    })

    it('should convert price range', () => {
      const uiState: UiState = {
        [indexName]: {
          range: {
            price: '0:100',
          },
        },
      }
      const result = stateToRoute(uiState, indexName)
      expect(result.price).toBe('0:100')
    })

    it('should handle multiple state properties', () => {
      const uiState: UiState = {
        [indexName]: {
          query: 'tv',
          page: 3,
          refinementList: {
            brand: ['Samsung'],
          },
        },
      }
      const result = stateToRoute(uiState, indexName)
      expect(result).toEqual({
        query: 'tv',
        page: 3,
        brands: ['Samsung'],
      })
    })

    it('should handle missing index in UI state', () => {
      const uiState: UiState = {}
      expect(stateToRoute(uiState, indexName)).toEqual({})
    })
  })

  describe('routeToState', () => {
    it('should return empty UI state for empty route state', () => {
      const routeState: RouteState = {}
      const result = routeToState(routeState, indexName)
      expect(result[indexName]).toEqual({})
    })

    it('should convert query to UI state', () => {
      const routeState: RouteState = { query: 'samsung' }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].query).toBe('samsung')
    })

    it('should convert page to UI state', () => {
      const routeState: RouteState = { page: 2 }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].page).toBe(2)
    })

    it('should convert categories to hierarchical menu', () => {
      const routeState: RouteState = { categories: ['appliances'] }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].hierarchicalMenu).toEqual({
        'hierarchicalCategories.lvl0': ['Appliances'],
      })
    })

    it('should convert brands to refinement list', () => {
      const routeState: RouteState = { brands: ['Samsung', 'LG'] }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].refinementList?.brand).toEqual(['Samsung', 'LG'])
    })

    it('should convert rating to refinement list', () => {
      const routeState: RouteState = { rating: ['4', '5'] }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].refinementList?.rating).toEqual(['4', '5'])
    })

    it('should convert price to range', () => {
      const routeState: RouteState = { price: '0:100' }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].range?.price).toBe('0:100')
    })

    it('should handle multiple route properties', () => {
      const routeState: RouteState = {
        query: 'tv',
        page: 3,
        brands: ['Samsung'],
      }
      const result = routeToState(routeState, indexName)
      expect(result[indexName].query).toBe('tv')
      expect(result[indexName].page).toBe(3)
      expect(result[indexName].refinementList?.brand).toEqual(['Samsung'])
    })
  })

  describe('createURL', () => {
    const mockLocation = { origin: 'https://example.com' } as Location

    it('should create base products URL for empty state', () => {
      const routeState: RouteState = {}
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products')
    })

    it('should create URL with category path', () => {
      const routeState: RouteState = { categories: ['appliances'] }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products/appliances')
    })

    it('should create URL with nested category path', () => {
      const routeState: RouteState = { categories: ['appliances', 'tvs'] }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products/appliances/tvs')
    })

    it('should create URL with query parameter', () => {
      const routeState: RouteState = { query: 'test' }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products?q=test')
    })

    it('should create URL with page parameter', () => {
      const routeState: RouteState = { page: 2 }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products?page=2')
    })

    it('should not include page 1 in URL', () => {
      const routeState: RouteState = { page: 1 }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products')
    })

    it('should create URL with brands parameter', () => {
      const routeState: RouteState = { brands: ['Samsung', 'LG'] }
      const url = createURL(routeState, mockLocation)
      // URL encoding may convert comma to %2C
      expect(decodeURIComponent(url)).toBe('https://example.com/products?brands=Samsung,LG')
    })

    it('should create URL with rating parameter', () => {
      const routeState: RouteState = { rating: ['4', '5'] }
      const url = createURL(routeState, mockLocation)
      // URL encoding may convert comma to %2C
      expect(decodeURIComponent(url)).toBe('https://example.com/products?rating=4,5')
    })

    it('should create URL with price parameter', () => {
      const routeState: RouteState = { price: '0:100' }
      const url = createURL(routeState, mockLocation)
      // URL encoding may convert colon to %3A
      expect(decodeURIComponent(url)).toBe('https://example.com/products?price=0:100')
    })

    it('should create URL with category and query', () => {
      const routeState: RouteState = { categories: ['tvs'], query: '4k' }
      expect(createURL(routeState, mockLocation)).toBe('https://example.com/products/tvs?q=4k')
    })

    it('should create URL with all parameters', () => {
      const routeState: RouteState = {
        categories: ['appliances'],
        query: 'test',
        page: 2,
        brands: ['Samsung'],
        rating: ['4'],
        price: '0:500',
      }
      const url = createURL(routeState, mockLocation)
      const decodedUrl = decodeURIComponent(url)
      expect(decodedUrl).toContain('https://example.com/products/appliances')
      expect(decodedUrl).toContain('q=test')
      expect(decodedUrl).toContain('page=2')
      expect(decodedUrl).toContain('brands=Samsung')
      expect(decodedUrl).toContain('rating=4')
      expect(decodedUrl).toContain('price=0:500')
    })
  })

  describe('parseURL', () => {
    const createMockLocation = (pathname: string, search: string = ''): Location => ({ pathname, search } as Location)

    it('should return empty state for base products URL', () => {
      const location = createMockLocation('/products')
      expect(parseURL(location)).toEqual({})
    })

    it('should parse category from path', () => {
      const location = createMockLocation('/products/appliances')
      expect(parseURL(location).categories).toEqual(['appliances'])
    })

    it('should parse nested categories from path', () => {
      const location = createMockLocation('/products/appliances/tvs')
      expect(parseURL(location).categories).toEqual(['appliances', 'tvs'])
    })

    it('should parse query parameter', () => {
      const location = createMockLocation('/products', '?q=test')
      expect(parseURL(location).query).toBe('test')
    })

    it('should parse page parameter', () => {
      const location = createMockLocation('/products', '?page=2')
      expect(parseURL(location).page).toBe(2)
    })

    it('should parse brands parameter', () => {
      const location = createMockLocation('/products', '?brands=Samsung,LG')
      expect(parseURL(location).brands).toEqual(['Samsung', 'LG'])
    })

    it('should parse rating parameter', () => {
      const location = createMockLocation('/products', '?rating=4,5')
      expect(parseURL(location).rating).toEqual(['4', '5'])
    })

    it('should parse price parameter', () => {
      const location = createMockLocation('/products', '?price=0:100')
      expect(parseURL(location).price).toBe('0:100')
    })

    it('should parse category with query parameters', () => {
      const location = createMockLocation('/products/tvs', '?q=4k')
      const result = parseURL(location)
      expect(result.categories).toEqual(['tvs'])
      expect(result.query).toBe('4k')
    })

    it('should handle URL-encoded categories', () => {
      const location = createMockLocation('/products/computers%20%26%20tablets')
      expect(parseURL(location).categories).toEqual(['computers & tablets'])
    })
  })

  describe('roundtrip: stateToRoute -> routeToState', () => {
    it('should preserve query through roundtrip', () => {
      const original: UiState = { [indexName]: { query: 'samsung tv' } }
      const routeState = stateToRoute(original, indexName)
      const result = routeToState(routeState, indexName)
      expect(result[indexName].query).toBe('samsung tv')
    })

    it('should preserve page through roundtrip', () => {
      const original: UiState = { [indexName]: { page: 5 } }
      const routeState = stateToRoute(original, indexName)
      const result = routeToState(routeState, indexName)
      expect(result[indexName].page).toBe(5)
    })

    it('should preserve brands through roundtrip', () => {
      const original: UiState = {
        [indexName]: { refinementList: { brand: ['Samsung', 'Apple'] } },
      }
      const routeState = stateToRoute(original, indexName)
      const result = routeToState(routeState, indexName)
      expect(result[indexName].refinementList?.brand).toEqual(['Samsung', 'Apple'])
    })
  })

  describe('roundtrip: createURL -> parseURL', () => {
    const mockLocation = { origin: 'https://example.com' } as Location

    it('should preserve categories through URL roundtrip', () => {
      const routeState: RouteState = { categories: ['appliances', 'tvs'] }
      const url = createURL(routeState, mockLocation)
      const parsedLocation = {
        pathname: new URL(url).pathname,
        search: new URL(url).search,
      } as Location
      const result = parseURL(parsedLocation)
      expect(result.categories).toEqual(['appliances', 'tvs'])
    })

    it('should preserve query through URL roundtrip', () => {
      const routeState: RouteState = { query: 'test search' }
      const url = createURL(routeState, mockLocation)
      const parsedLocation = {
        pathname: new URL(url).pathname,
        search: new URL(url).search,
      } as Location
      const result = parseURL(parsedLocation)
      expect(result.query).toBe('test search')
    })

    it('should preserve multiple params through URL roundtrip', () => {
      const routeState: RouteState = {
        query: 'test',
        page: 3,
        brands: ['Samsung'],
        price: '100:500',
      }
      const url = createURL(routeState, mockLocation)
      const parsedLocation = {
        pathname: new URL(url).pathname,
        search: new URL(url).search,
      } as Location
      const result = parseURL(parsedLocation)
      expect(result.query).toBe('test')
      expect(result.page).toBe(3)
      expect(result.brands).toEqual(['Samsung'])
      expect(result.price).toBe('100:500')
    })
  })
})
