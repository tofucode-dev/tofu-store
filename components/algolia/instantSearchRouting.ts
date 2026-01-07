import type { UiState } from 'instantsearch.js'
import categoryMappingsJson from '@/data/category-slugs.json'

const categoryMappings = categoryMappingsJson satisfies {
  slugToValue: Record<string, string>
  valueToSlug: Record<string, string>
}

const { slugToValue, valueToSlug } = categoryMappings

export type RouteState = {
  query?: string
  page?: number
  categories?: string[]
  brands?: string[]
  rating?: string[]
  price?: string
}

/**
 * Slugify function - converts category names to URL-safe slugs
 * "Air Conditioners" → "air-conditioners"
 * "TV & Home Theater" → "tv-and-home-theater"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Convert category value to URL slug
 */
function toSlug(categoryValue: string): string {
  const cached = valueToSlug[categoryValue as keyof typeof valueToSlug]
  if (cached) return cached
  return slugify(categoryValue)
}

/**
 * Convert URL slug back to exact Algolia category value
 */
function fromSlug(slug: string): string {
  const cached = slugToValue[slug as keyof typeof slugToValue]
  if (cached) return cached

  // Fallback: best-effort title case reconstruction
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Convert InstantSearch UI state to clean route state
 */
export function stateToRoute(uiState: UiState, indexName: string): RouteState {
  const indexState = uiState[indexName] || {}
  const routeState: RouteState = {}

  if (indexState.query) {
    routeState.query = indexState.query
  }

  if (indexState.page && indexState.page > 1) {
    routeState.page = indexState.page
  }

  // Hierarchical categories are stored as an array in lvl0:
  // ["Appliances", "Air Conditioners", "In-Wall Air Conditioners"]
  const hierarchicalMenu = indexState.hierarchicalMenu
  const categoryArray = hierarchicalMenu?.['hierarchicalCategories.lvl0']
  if (categoryArray && categoryArray.length > 0) {
    routeState.categories = categoryArray.map(toSlug)
  }

  // Brands - preserve original brand names (don't slugify)
  const brands = indexState.refinementList?.brand
  if (brands && brands.length > 0) {
    routeState.brands = brands
  }

  // Rating
  const rating = indexState.refinementList?.rating
  if (rating && rating.length > 0) {
    routeState.rating = rating
  }

  // Price range
  const priceRange = indexState.range?.price
  if (priceRange) {
    routeState.price = priceRange
  }

  return routeState
}

/**
 * Convert clean route state back to InstantSearch UI state
 */
export function routeToState(routeState: RouteState, indexName: string): UiState {
  const uiState: UiState[string] = {}

  if (routeState.query) {
    uiState.query = routeState.query
  }

  if (routeState.page) {
    uiState.page = routeState.page
  }

  // Categories path -> hierarchical menu
  // Convert URL slugs back to exact Algolia category names
  if (routeState.categories && routeState.categories.length > 0) {
    uiState.hierarchicalMenu = {
      'hierarchicalCategories.lvl0': routeState.categories.map(fromSlug),
    }
  }

  // Brands - use brand names as-is (no deslugify needed)
  if (routeState.brands && routeState.brands.length > 0) {
    uiState.refinementList = {
      ...uiState.refinementList,
      brand: routeState.brands,
    }
  }

  // Rating
  if (routeState.rating && routeState.rating.length > 0) {
    uiState.refinementList = {
      ...uiState.refinementList,
      rating: routeState.rating,
    }
  }

  // Price
  if (routeState.price) {
    uiState.range = {
      price: routeState.price,
    }
  }

  return { [indexName]: uiState }
}

/**
 * Create URL from route state
 */
export function createURL(routeState: RouteState, location: Location): string {
  const { categories, query, page, brands, rating, price } = routeState
  const baseUrl = location.origin

  // Build path from categories
  let path = '/products'
  if (categories && categories.length > 0) {
    path = `/products/${categories.join('/')}`
  }

  // Build query string for other params
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page && page > 1) params.set('page', String(page))
  if (brands && brands.length > 0) params.set('brands', brands.join(','))
  if (rating && rating.length > 0) params.set('rating', rating.join(','))
  if (price) params.set('price', price)

  const queryString = params.toString()
  return `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`
}

/**
 * Parse URL to route state
 */
export function parseURL(location: Location): RouteState {
  const pathname = location.pathname
  const params = new URLSearchParams(location.search)

  const routeState: RouteState = {}

  // Ignore product detail pages - they're not part of the search routing
  if (pathname.startsWith('/product/')) {
    return routeState
  }

  // Parse categories from path
  if (pathname.startsWith('/products/')) {
    const categoryPath = pathname.replace('/products/', '')
    if (categoryPath) {
      routeState.categories = categoryPath.split('/').map(decodeURIComponent)
    }
  }

  // Parse query params
  const query = params.get('q')
  if (query) routeState.query = query

  const page = params.get('page')
  if (page) routeState.page = parseInt(page, 10)

  const brands = params.get('brands')
  if (brands) routeState.brands = brands.split(',')

  const rating = params.get('rating')
  if (rating) routeState.rating = rating.split(',')

  const price = params.get('price')
  if (price) routeState.price = price

  return routeState
}
