import { Product } from "./types/product"

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