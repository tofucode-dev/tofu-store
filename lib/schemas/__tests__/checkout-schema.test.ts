import { describe, it, expect } from 'vitest'
import { checkoutItemSchema, checkoutSchema, type CheckoutInput } from '../checkout-schema'

describe('Checkout Validation Schemas', () => {
  describe('checkoutItemSchema', () => {
    it('should validate a correct item', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).not.toThrow()
    })

    it('should validate item with optional brand', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
        brand: 'Test Brand',
      }
      expect(() => checkoutItemSchema.parse(item)).not.toThrow()
    })

    it('should reject missing productId', () => {
      const item = {
        name: 'Test Product',
        price: 29.99,
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject missing name', () => {
      const item = {
        productId: '123',
        price: 29.99,
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject missing price', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject missing quantity', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 29.99,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject negative price', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: -10,
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject zero price', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 0,
        quantity: 1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject zero quantity', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 10,
        quantity: 0,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject negative quantity', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 10,
        quantity: -1,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should reject decimal quantity', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 10,
        quantity: 1.5,
      }
      expect(() => checkoutItemSchema.parse(item)).toThrow()
    })

    it('should accept decimal price', () => {
      const item = {
        productId: '123',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
      }
      const result = checkoutItemSchema.parse(item)
      expect(result.price).toBe(19.99)
    })
  })

  describe('checkoutSchema', () => {
    const validCheckout: CheckoutInput = {
      items: [
        {
          productId: '123',
          name: 'Test Product',
          price: 29.99,
          quantity: 1,
        },
      ],
      customer: {
        email: 'test@example.com',
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA',
      },
      total: 29.99,
    }

    it('should validate correct checkout data', () => {
      expect(() => checkoutSchema.parse(validCheckout)).not.toThrow()
    })

    it('should validate checkout with multiple items', () => {
      const checkout = {
        ...validCheckout,
        items: [
          { productId: '1', name: 'Product 1', price: 10, quantity: 2 },
          { productId: '2', name: 'Product 2', price: 15, quantity: 1 },
        ],
        total: 35,
      }
      expect(() => checkoutSchema.parse(checkout)).not.toThrow()
    })

    it('should reject empty items array', () => {
      const checkout = {
        ...validCheckout,
        items: [],
      }
      expect(() => checkoutSchema.parse(checkout)).toThrow(/at least one item/i)
    })

    it('should reject missing items', () => {
      const { items: _items, ...checkoutWithoutItems } = validCheckout
      expect(() => checkoutSchema.parse(checkoutWithoutItems)).toThrow()
    })

    describe('customer validation', () => {
      it('should reject invalid email', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            email: 'not-an-email',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow()
      })

      it('should reject empty email', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            email: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow()
      })

      it('should reject missing name', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            name: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/name is required/i)
      })

      it('should reject missing address', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            address: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/address is required/i)
      })

      it('should reject missing city', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            city: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/city is required/i)
      })

      it('should reject missing zipCode', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            zipCode: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/zip code is required/i)
      })

      it('should reject missing country', () => {
        const checkout = {
          ...validCheckout,
          customer: {
            ...validCheckout.customer,
            country: '',
          },
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/country is required/i)
      })

      it('should accept valid email formats', () => {
        const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org']

        validEmails.forEach(email => {
          const checkout = {
            ...validCheckout,
            customer: {
              ...validCheckout.customer,
              email,
            },
          }
          expect(() => checkoutSchema.parse(checkout)).not.toThrow()
        })
      })
    })

    describe('total validation', () => {
      it('should reject negative total', () => {
        const checkout = {
          ...validCheckout,
          total: -10,
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/total must be positive/i)
      })

      it('should reject zero total', () => {
        const checkout = {
          ...validCheckout,
          total: 0,
        }
        expect(() => checkoutSchema.parse(checkout)).toThrow(/total must be positive/i)
      })

      it('should accept decimal total', () => {
        const checkout = {
          ...validCheckout,
          total: 99.99,
        }
        const result = checkoutSchema.parse(checkout)
        expect(result.total).toBe(99.99)
      })

      it('should reject missing total', () => {
        const { total: _total, ...checkoutWithoutTotal } = validCheckout
        expect(() => checkoutSchema.parse(checkoutWithoutTotal)).toThrow()
      })
    })

    describe('type inference', () => {
      it('should return correctly typed data on successful parse', () => {
        const result = checkoutSchema.parse(validCheckout)

        // Verify structure
        expect(result.items).toHaveLength(1)
        expect(result.items[0].productId).toBe('123')
        expect(result.customer.email).toBe('test@example.com')
        expect(result.total).toBe(29.99)
      })
    })
  })
})
