import { Product } from "./types/product"


/**
 * Parse product ID from URL slug (format: product-name-slug-PRODUCTID)
 */
export function parseProductIdFromSlug(slug: string): string | null {
  if (!slug || typeof slug !== "string") return null

  // The ID is the last segment after the last hyphen
  const parts = slug.split("-").filter(Boolean)
  if (parts.length < 2) return null

  const id = parts[parts.length - 1]
  return id || null
}

export function generateProductSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60)
  }

export function getProductUrl(product: Product): string {
    const slug = generateProductSlug(product.name)
    return `/product/${slug}-${product.objectID}`
  }