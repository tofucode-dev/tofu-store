import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cart-store'
import type { Product } from '@/lib/types/product'

// Helper to create a mock product
const createProduct = (overrides: Partial<Product> = {}): Product => ({
  objectID: 'test-123',
  name: 'Test Product',
  price: 29.99,
  ...overrides,
})

describe('Cart Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  describe('addItem', () => {
    it('should add a new product to empty cart', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product)

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].product.objectID).toBe('abc123')
      expect(items[0].quantity).toBe(1)
    })

    it('should add a new product with custom quantity', () => {
      const product = createProduct()
      useCartStore.getState().addItem(product, 3)

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(3)
    })

    it('should increment quantity when adding existing product', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product)
      useCartStore.getState().addItem(product)

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it('should increment by custom quantity when adding existing product', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product, 2)
      useCartStore.getState().addItem(product, 3)

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(5)
    })

    it('should add different products as separate items', () => {
      const productA = createProduct({ objectID: 'product-a', name: 'Product A' })
      const productB = createProduct({ objectID: 'product-b', name: 'Product B' })

      useCartStore.getState().addItem(productA)
      useCartStore.getState().addItem(productB)

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(2)
      expect(items[0].product.objectID).toBe('product-a')
      expect(items[1].product.objectID).toBe('product-b')
    })
  })

  describe('removeItem', () => {
    it('should remove an existing item from cart', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product)

      expect(useCartStore.getState().items).toHaveLength(1)

      useCartStore.getState().removeItem('abc123')

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should not affect cart when removing non-existent item', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product)

      useCartStore.getState().removeItem('non-existent')

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].product.objectID).toBe('abc123')
    })

    it('should only remove the specified item from cart with multiple items', () => {
      const productA = createProduct({ objectID: 'product-a' })
      const productB = createProduct({ objectID: 'product-b' })
      const productC = createProduct({ objectID: 'product-c' })

      useCartStore.getState().addItem(productA)
      useCartStore.getState().addItem(productB)
      useCartStore.getState().addItem(productC)

      useCartStore.getState().removeItem('product-b')

      const { items } = useCartStore.getState()
      expect(items).toHaveLength(2)
      expect(items.map(i => i.product.objectID)).toEqual(['product-a', 'product-c'])
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity to a valid value', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product, 1)

      useCartStore.getState().updateQuantity('abc123', 5)

      const { items } = useCartStore.getState()
      expect(items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is set to 0', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product, 3)

      useCartStore.getState().updateQuantity('abc123', 0)

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should remove item when quantity is set to negative', () => {
      const product = createProduct({ objectID: 'abc123' })
      useCartStore.getState().addItem(product, 3)

      useCartStore.getState().updateQuantity('abc123', -1)

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should not affect other items when updating quantity', () => {
      const productA = createProduct({ objectID: 'product-a' })
      const productB = createProduct({ objectID: 'product-b' })

      useCartStore.getState().addItem(productA, 2)
      useCartStore.getState().addItem(productB, 3)

      useCartStore.getState().updateQuantity('product-a', 10)

      const { items } = useCartStore.getState()
      expect(items[0].quantity).toBe(10)
      expect(items[1].quantity).toBe(3)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const productA = createProduct({ objectID: 'product-a' })
      const productB = createProduct({ objectID: 'product-b' })

      useCartStore.getState().addItem(productA, 2)
      useCartStore.getState().addItem(productB, 3)

      expect(useCartStore.getState().items).toHaveLength(2)

      useCartStore.getState().clearCart()

      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('should not throw error when clearing empty cart', () => {
      expect(useCartStore.getState().items).toHaveLength(0)

      expect(() => useCartStore.getState().clearCart()).not.toThrow()

      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  describe('getTotalItems', () => {
    it('should return 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalItems()).toBe(0)
    })

    it('should return correct count for single item with quantity 1', () => {
      const product = createProduct()
      useCartStore.getState().addItem(product, 1)

      expect(useCartStore.getState().getTotalItems()).toBe(1)
    })

    it('should return correct count for single item with quantity > 1', () => {
      const product = createProduct()
      useCartStore.getState().addItem(product, 5)

      expect(useCartStore.getState().getTotalItems()).toBe(5)
    })

    it('should return sum of quantities for multiple items', () => {
      const productA = createProduct({ objectID: 'product-a' })
      const productB = createProduct({ objectID: 'product-b' })
      const productC = createProduct({ objectID: 'product-c' })

      useCartStore.getState().addItem(productA, 2)
      useCartStore.getState().addItem(productB, 3)
      useCartStore.getState().addItem(productC, 1)

      expect(useCartStore.getState().getTotalItems()).toBe(6)
    })
  })

  describe('getTotalPrice', () => {
    it('should return 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalPrice()).toBe(0)
    })

    it('should return correct price for single item', () => {
      const product = createProduct({ price: 29.99 })
      useCartStore.getState().addItem(product, 1)

      expect(useCartStore.getState().getTotalPrice()).toBe(29.99)
    })

    it('should return correct price for multiple quantities', () => {
      const product = createProduct({ price: 10 })
      useCartStore.getState().addItem(product, 3)

      expect(useCartStore.getState().getTotalPrice()).toBe(30)
    })

    it('should calculate total for multiple items', () => {
      const productA = createProduct({ objectID: 'product-a', price: 10 })
      const productB = createProduct({ objectID: 'product-b', price: 5 })

      useCartStore.getState().addItem(productA, 2) // 10 * 2 = 20
      useCartStore.getState().addItem(productB, 1) // 5 * 1 = 5

      expect(useCartStore.getState().getTotalPrice()).toBe(25)
    })

    it('should handle products with undefined price as 0', () => {
      const product = createProduct({ price: undefined })
      useCartStore.getState().addItem(product, 1)

      expect(useCartStore.getState().getTotalPrice()).toBe(0)
    })

    it('should handle mixed products with and without prices', () => {
      const productA = createProduct({ objectID: 'product-a', price: 10 })
      const productB = createProduct({ objectID: 'product-b', price: undefined })

      useCartStore.getState().addItem(productA, 2) // 10 * 2 = 20
      useCartStore.getState().addItem(productB, 3) // undefined * 3 = 0

      expect(useCartStore.getState().getTotalPrice()).toBe(20)
    })

    it('should handle decimal prices correctly', () => {
      const productA = createProduct({ objectID: 'product-a', price: 19.99 })
      const productB = createProduct({ objectID: 'product-b', price: 5.01 })

      useCartStore.getState().addItem(productA, 1) // 19.99
      useCartStore.getState().addItem(productB, 1) // 5.01

      expect(useCartStore.getState().getTotalPrice()).toBeCloseTo(25.0, 2)
    })
  })
})
