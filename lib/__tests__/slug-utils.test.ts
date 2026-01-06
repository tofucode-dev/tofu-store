import { describe, it, expect } from 'vitest'
import { generateProductSlug, parseProductIdFromSlug, getProductUrl } from '../slug-utils'
import type { Product } from '@/lib/types/product'

describe('Slug Utilities', () => {
  describe('generateProductSlug', () => {
    it('should convert name to lowercase with hyphens', () => {
      expect(generateProductSlug('Test Product')).toBe('test-product')
    })

    it('should handle single word', () => {
      expect(generateProductSlug('Product')).toBe('product')
    })

    it('should remove special characters', () => {
      expect(generateProductSlug('Product #1 (New!)')).toBe('product-1-new')
    })

    it('should collapse multiple spaces into single hyphen', () => {
      expect(generateProductSlug('Product    Name')).toBe('product-name')
    })

    it('should trim leading and trailing spaces', () => {
      expect(generateProductSlug(' Product ')).toBe('product')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(generateProductSlug('-Product-')).toBe('product')
    })

    it('should truncate to 60 characters', () => {
      const longName = 'A'.repeat(80)
      const result = generateProductSlug(longName)
      expect(result.length).toBeLessThanOrEqual(60)
      expect(result).toBe('a'.repeat(60))
    })

    it('should handle empty string', () => {
      expect(generateProductSlug('')).toBe('')
    })

    it('should handle string with only special characters', () => {
      expect(generateProductSlug('!@#$%')).toBe('')
    })

    it('should handle numbers in name', () => {
      expect(generateProductSlug('iPhone 15 Pro Max')).toBe('iphone-15-pro-max')
    })

    it('should handle ampersand', () => {
      expect(generateProductSlug('Tom & Jerry')).toBe('tom-jerry')
    })

    it('should handle mixed case', () => {
      expect(generateProductSlug('SAMSUNG Galaxy S24 Ultra')).toBe('samsung-galaxy-s24-ultra')
    })
  })

  describe('parseProductIdFromSlug', () => {
    it('should extract ID from valid slug', () => {
      expect(parseProductIdFromSlug('samsung-galaxy-s24-ABC123')).toBe('ABC123')
    })

    it('should extract ID from slug with multiple hyphens', () => {
      expect(parseProductIdFromSlug('my-great-product-name-XYZ789')).toBe('XYZ789')
    })

    it('should return null for single segment (no hyphens)', () => {
      expect(parseProductIdFromSlug('ABC123')).toBe(null)
    })

    it('should return null for empty string', () => {
      expect(parseProductIdFromSlug('')).toBe(null)
    })

    it('should return null for null input', () => {
      // @ts-expect-error - testing invalid input
      expect(parseProductIdFromSlug(null)).toBe(null)
    })

    it('should return null for undefined input', () => {
      // @ts-expect-error - testing invalid input
      expect(parseProductIdFromSlug(undefined)).toBe(null)
    })

    it('should handle slug with two segments', () => {
      expect(parseProductIdFromSlug('product-123')).toBe('123')
    })

    it('should handle ID with mixed characters', () => {
      expect(parseProductIdFromSlug('test-product-A1B2C3D4')).toBe('A1B2C3D4')
    })

    it('should handle slug ending with hyphen followed by ID', () => {
      expect(parseProductIdFromSlug('test--ABC')).toBe('ABC')
    })
  })

  describe('getProductUrl', () => {
    it('should generate correct URL for standard product', () => {
      const product: Product = {
        objectID: 'ABC123',
        name: 'Samsung Galaxy S24',
      }
      expect(getProductUrl(product)).toBe('/product/samsung-galaxy-s24-ABC123')
    })

    it('should handle product with special characters in name', () => {
      const product: Product = {
        objectID: '456',
        name: 'Test & More!',
      }
      expect(getProductUrl(product)).toBe('/product/test-more-456')
    })

    it('should handle product with numbers in name', () => {
      const product: Product = {
        objectID: 'XYZ',
        name: 'iPhone 15 Pro',
      }
      expect(getProductUrl(product)).toBe('/product/iphone-15-pro-XYZ')
    })

    it('should handle product with long name (truncated slug)', () => {
      const product: Product = {
        objectID: 'ID123',
        name: 'A'.repeat(80),
      }
      const url = getProductUrl(product)
      expect(url).toBe(`/product/${'a'.repeat(60)}-ID123`)
    })

    it('should handle product with minimal name', () => {
      const product: Product = {
        objectID: 'X',
        name: 'A',
      }
      expect(getProductUrl(product)).toBe('/product/a-X')
    })

    it('should generate unique URLs for products with same name but different IDs', () => {
      const product1: Product = { objectID: 'ID1', name: 'Test Product' }
      const product2: Product = { objectID: 'ID2', name: 'Test Product' }

      expect(getProductUrl(product1)).toBe('/product/test-product-ID1')
      expect(getProductUrl(product2)).toBe('/product/test-product-ID2')
      expect(getProductUrl(product1)).not.toBe(getProductUrl(product2))
    })
  })

  describe('URL roundtrip', () => {
    it('should allow ID extraction from generated URL', () => {
      const product: Product = {
        objectID: 'ABC123XYZ',
        name: 'Amazing Product Name',
      }

      const url = getProductUrl(product)
      const slug = url.replace('/product/', '')
      const extractedId = parseProductIdFromSlug(slug)

      expect(extractedId).toBe(product.objectID)
    })
  })
})
