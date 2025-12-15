export type Product = {
  objectID: string
  name: string
  description?: string
  brand?: string
  categories?: string[]
  hierarchicalCategories?: {
    lvl0?: string
    lvl1?: string
    lvl2?: string
  }
  image?: string
  price?: number
  rating?: number
  popularity?: number
}

