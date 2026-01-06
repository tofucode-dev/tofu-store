# Unit Test Plan

## Overview

This document outlines the unit testing strategy for TofuStore, focusing on the most critical pure functions and business logic. Unit tests should be fast, isolated, and provide confidence in core functionality.

### Testing Philosophy

- **Test behavior, not implementation** - Focus on inputs and outputs
- **Prioritize business-critical logic** - Cart calculations, URL routing, validation
- **Keep tests simple and readable** - Each test should verify one thing
- **Use descriptive test names** - Names should explain what is being tested

### Recommended Framework

**Vitest** is recommended for this Next.js project:

- Fast execution with native ESM support
- Compatible with Jest API
- Built-in TypeScript support
- Works well with Zustand stores

```bash
pnpm add -D vitest @testing-library/react jsdom
```

---

## Priority 1: Cart Store Logic

**File:** `lib/stores/cart-store.ts`  
**Test File:** `lib/stores/__tests__/cart-store.test.ts`

The cart store handles money calculations and is critical for e-commerce functionality.

### Test Cases

#### `addItem(product, quantity?)`

| Test Case                         | Input                | Expected Output                 |
| --------------------------------- | -------------------- | ------------------------------- |
| Add new item to empty cart        | product A, qty 1     | Cart contains 1 item with qty 1 |
| Add new item with custom quantity | product A, qty 3     | Cart contains 1 item with qty 3 |
| Add same item twice               | product A x2         | Cart contains 1 item with qty 2 |
| Add different items               | product A, product B | Cart contains 2 items           |

```typescript
describe('addItem', () => {
  it('should add a new product to empty cart', () => {
    const product = { objectID: 'abc123', name: 'Test Product', price: 29.99 }
    useCartStore.getState().addItem(product)

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('should increment quantity when adding existing product', () => {
    const product = { objectID: 'abc123', name: 'Test Product', price: 29.99 }
    useCartStore.getState().addItem(product)
    useCartStore.getState().addItem(product)

    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })
})
```

#### `removeItem(productId)`

| Test Case                            | Input                 | Expected Output        |
| ------------------------------------ | --------------------- | ---------------------- |
| Remove existing item                 | valid productId       | Item removed from cart |
| Remove non-existent item             | invalid productId     | Cart unchanged         |
| Remove from cart with multiple items | productId of one item | Only that item removed |

#### `updateQuantity(productId, quantity)`

| Test Case                | Input             | Expected Output            |
| ------------------------ | ----------------- | -------------------------- |
| Update to valid quantity | productId, qty 5  | Item quantity updated to 5 |
| Update to zero           | productId, qty 0  | Item removed from cart     |
| Update to negative       | productId, qty -1 | Item removed from cart     |

```typescript
describe('updateQuantity', () => {
  it('should remove item when quantity is set to 0', () => {
    const product = { objectID: 'abc123', name: 'Test', price: 10 }
    useCartStore.getState().addItem(product, 3)
    useCartStore.getState().updateQuantity('abc123', 0)

    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
```

#### `getTotalItems()`

| Test Case         | Cart State               | Expected Output |
| ----------------- | ------------------------ | --------------- |
| Empty cart        | []                       | 0               |
| Single item qty 1 | [{ qty: 1 }]             | 1               |
| Single item qty 5 | [{ qty: 5 }]             | 5               |
| Multiple items    | [{ qty: 2 }, { qty: 3 }] | 5               |

#### `getTotalPrice()`

| Test Case                 | Cart State                                    | Expected Output |
| ------------------------- | --------------------------------------------- | --------------- |
| Empty cart                | []                                            | 0               |
| Single item               | [{ price: 29.99, qty: 1 }]                    | 29.99           |
| Multiple quantities       | [{ price: 10, qty: 3 }]                       | 30              |
| Multiple items            | [{ price: 10, qty: 2 }, { price: 5, qty: 1 }] | 25              |
| Item with undefined price | [{ price: undefined, qty: 1 }]                | 0               |

```typescript
describe('getTotalPrice', () => {
  it('should calculate total for multiple items', () => {
    useCartStore.getState().addItem({ objectID: '1', name: 'A', price: 10 }, 2)
    useCartStore.getState().addItem({ objectID: '2', name: 'B', price: 5 }, 1)

    expect(useCartStore.getState().getTotalPrice()).toBe(25)
  })

  it('should handle products with undefined price', () => {
    useCartStore.getState().addItem({ objectID: '1', name: 'A', price: undefined }, 1)

    expect(useCartStore.getState().getTotalPrice()).toBe(0)
  })
})
```

#### `clearCart()`

| Test Case             | Cart State     | Expected Output       |
| --------------------- | -------------- | --------------------- |
| Clear cart with items | multiple items | Empty cart            |
| Clear empty cart      | []             | Empty cart (no error) |

---

## Priority 2: Slug Utilities

**File:** `lib/slug-utils.ts`  
**Test File:** `lib/__tests__/slug-utils.test.ts`

URL generation and parsing is critical for SEO and proper routing.

### Test Cases

#### `generateProductSlug(name)`

| Test Case               | Input               | Expected Output       |
| ----------------------- | ------------------- | --------------------- |
| Simple name             | "Test Product"      | "test-product"        |
| Special characters      | "Product #1 (New!)" | "product-1-new"       |
| Multiple spaces         | "Product Name"      | "product-name"        |
| Leading/trailing spaces | " Product "         | "product"             |
| Long name (>60 chars)   | 80 char string      | Truncated to 60 chars |
| Empty string            | ""                  | ""                    |

```typescript
describe('generateProductSlug', () => {
  it('should convert name to lowercase with hyphens', () => {
    expect(generateProductSlug('Test Product')).toBe('test-product')
  })

  it('should remove special characters', () => {
    expect(generateProductSlug('Product #1 (New!)')).toBe('product-1-new')
  })

  it('should truncate to 60 characters', () => {
    const longName = 'A'.repeat(80)
    expect(generateProductSlug(longName).length).toBeLessThanOrEqual(60)
  })
})
```

#### `parseProductIdFromSlug(slug)`

| Test Case                  | Input                     | Expected Output |
| -------------------------- | ------------------------- | --------------- |
| Valid slug                 | "product-name-ABC123"     | "ABC123"        |
| Single segment             | "ABC123"                  | null            |
| Empty string               | ""                        | null            |
| Null input                 | null                      | null            |
| Slug with multiple hyphens | "my-great-product-XYZ789" | "XYZ789"        |

```typescript
describe('parseProductIdFromSlug', () => {
  it('should extract ID from valid slug', () => {
    expect(parseProductIdFromSlug('samsung-galaxy-s24-ABC123')).toBe('ABC123')
  })

  it('should return null for invalid slug', () => {
    expect(parseProductIdFromSlug('ABC123')).toBe(null)
    expect(parseProductIdFromSlug('')).toBe(null)
  })
})
```

#### `getProductUrl(product)`

| Test Case                  | Input                                    | Expected Output          |
| -------------------------- | ---------------------------------------- | ------------------------ |
| Standard product           | { name: "Test", objectID: "123" }        | "/product/test-123"      |
| Product with special chars | { name: "Test & More", objectID: "456" } | "/product/test-more-456" |

```typescript
describe('getProductUrl', () => {
  it('should generate correct URL', () => {
    const product = { objectID: 'ABC123', name: 'Samsung Galaxy S24' }
    expect(getProductUrl(product)).toBe('/product/samsung-galaxy-s24-ABC123')
  })
})
```

---

## Priority 3: URL Routing Functions

**File:** `components/algolia/instantSearchRouting.ts`  
**Test File:** `components/algolia/__tests__/instantSearchRouting.test.ts`

Search state synchronization ensures shareable URLs work correctly.

### Test Cases

#### `slugify(text)`

| Test Case                | Input               | Expected Output       |
| ------------------------ | ------------------- | --------------------- |
| Simple text              | "Air Conditioners"  | "air-conditioners"    |
| Ampersand                | "TV & Home Theater" | "tv-and-home-theater" |
| Multiple spaces          | "Cell Phones"       | "cell-phones"         |
| Special characters       | "Electronics!"      | "electronics"         |
| Leading/trailing hyphens | "-test-"            | "test"                |

```typescript
describe('slugify', () => {
  it('should convert spaces to hyphens', () => {
    expect(slugify('Air Conditioners')).toBe('air-conditioners')
  })

  it('should replace & with and', () => {
    expect(slugify('TV & Home Theater')).toBe('tv-and-home-theater')
  })
})
```

#### `stateToRoute(uiState, indexName)` / `routeToState(routeState, indexName)`

| Test Case   | UI State                                   | Route State                    |
| ----------- | ------------------------------------------ | ------------------------------ |
| Query only  | { query: "test" }                          | { query: "test" }              |
| Page > 1    | { page: 2 }                                | { page: 2 }                    |
| Page 1      | { page: 1 }                                | {} (page 1 omitted)            |
| Categories  | { hierarchicalMenu: {...} }                | { categories: ["appliances"] } |
| Brands      | { refinementList: { brand: ["Samsung"] } } | { brands: ["Samsung"] }        |
| Price range | { range: { price: "0:100" } }              | { price: "0:100" }             |

```typescript
describe('stateToRoute', () => {
  const indexName = 'products'

  it('should convert query to route state', () => {
    const uiState = { [indexName]: { query: 'samsung' } }
    expect(stateToRoute(uiState, indexName)).toEqual({ query: 'samsung' })
  })

  it('should omit page 1', () => {
    const uiState = { [indexName]: { page: 1 } }
    expect(stateToRoute(uiState, indexName)).toEqual({})
  })
})

describe('routeToState', () => {
  const indexName = 'products'

  it('should convert route state back to UI state', () => {
    const routeState = { query: 'samsung', page: 2 }
    const result = routeToState(routeState, indexName)

    expect(result[indexName].query).toBe('samsung')
    expect(result[indexName].page).toBe(2)
  })
})
```

#### `createURL(routeState, location)` / `parseURL(location)`

| Test Case       | Route State                           | URL                           |
| --------------- | ------------------------------------- | ----------------------------- |
| No filters      | {}                                    | "/products"                   |
| With category   | { categories: ["appliances"] }        | "/products/appliances"        |
| Nested category | { categories: ["appliances", "tvs"] } | "/products/appliances/tvs"    |
| With query      | { query: "test" }                     | "/products?q=test"            |
| With page       | { page: 2 }                           | "/products?page=2"            |
| With brands     | { brands: ["Samsung", "LG"] }         | "/products?brands=Samsung,LG" |
| Combined        | { categories: ["tvs"], query: "4k" }  | "/products/tvs?q=4k"          |

```typescript
describe('createURL / parseURL roundtrip', () => {
  it('should create and parse URL with categories', () => {
    const routeState = { categories: ['appliances', 'tvs'], query: 'samsung' }
    const location = { origin: 'https://example.com' } as Location

    const url = createURL(routeState, location)
    expect(url).toBe('https://example.com/products/appliances/tvs?q=samsung')
  })
})
```

---

## Priority 4: Validation Schemas

**File:** `lib/schemas/checkout-schema.ts`  
**Test File:** `lib/schemas/__tests__/checkout-schema.test.ts`

Checkout validation ensures data integrity before processing orders.

### Test Cases

#### `checkoutItemSchema`

| Test Case         | Input                                                         | Expected Result |
| ----------------- | ------------------------------------------------------------- | --------------- |
| Valid item        | { productId: "123", name: "Test", price: 29.99, quantity: 1 } | Success         |
| Missing productId | { name: "Test", price: 29.99, quantity: 1 }                   | Fail            |
| Negative price    | { productId: "123", name: "Test", price: -10, quantity: 1 }   | Fail            |
| Zero quantity     | { productId: "123", name: "Test", price: 10, quantity: 0 }    | Fail            |
| Decimal quantity  | { productId: "123", name: "Test", price: 10, quantity: 1.5 }  | Fail            |

```typescript
describe('checkoutItemSchema', () => {
  it('should validate a correct item', () => {
    const item = { productId: '123', name: 'Test', price: 29.99, quantity: 1 }
    expect(() => checkoutItemSchema.parse(item)).not.toThrow()
  })

  it('should reject negative price', () => {
    const item = { productId: '123', name: 'Test', price: -10, quantity: 1 }
    expect(() => checkoutItemSchema.parse(item)).toThrow()
  })
})
```

#### `checkoutSchema`

| Test Case             | Input                                   | Expected Result                              |
| --------------------- | --------------------------------------- | -------------------------------------------- |
| Valid checkout        | Complete valid data                     | Success                                      |
| Empty items array     | { items: [], ... }                      | Fail - "Cart must contain at least one item" |
| Invalid email         | { customer: { email: "invalid" }, ... } | Fail - "Invalid email address"               |
| Missing customer name | { customer: { name: "" }, ... }         | Fail - "Name is required"                    |
| Negative total        | { total: -10, ... }                     | Fail - "Total must be positive"              |

```typescript
describe('checkoutSchema', () => {
  const validCheckout = {
    items: [{ productId: '123', name: 'Test', price: 29.99, quantity: 1 }],
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

  it('should reject empty cart', () => {
    const invalid = { ...validCheckout, items: [] }
    expect(() => checkoutSchema.parse(invalid)).toThrow(/at least one item/)
  })

  it('should reject invalid email', () => {
    const invalid = {
      ...validCheckout,
      customer: { ...validCheckout.customer, email: 'not-an-email' },
    }
    expect(() => checkoutSchema.parse(invalid)).toThrow()
  })
})
```

---

## Test Setup

### Vitest Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### Setup File

Create `vitest.setup.ts`:

```typescript
import { beforeEach } from 'vitest'
import { useCartStore } from '@/lib/stores/cart-store'

// Reset cart store before each test
beforeEach(() => {
  useCartStore.setState({ items: [] })
})
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Implementation Priority

| Priority | Module             | Reason                                         |
| -------- | ------------------ | ---------------------------------------------- |
| 1        | Cart Store         | Handles money - errors directly impact revenue |
| 2        | Slug Utilities     | Affects SEO and product page routing           |
| 3        | URL Routing        | Ensures shareable links work correctly         |
| 4        | Validation Schemas | Guards checkout data integrity                 |

---

## Coverage Goals

- **Cart Store:** 100% coverage
- **Slug Utilities:** 100% coverage
- **URL Routing:** 90%+ coverage (some functions depend on external mappings)
- **Validation Schemas:** 100% coverage for happy path + key error cases
