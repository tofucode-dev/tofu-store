# Architecture Decision Record (ADR)

## TofuStore - E-commerce Storefront

**Date:** January 2026  
**Status:** Accepted  
**Authors:** Development Team

---

## 1. Overview

TofuStore is a modern e-commerce storefront featuring product listing pages (PLPs), product detail pages (PDPs), shopping cart functionality, and comprehensive analytics. This document captures the key architectural decisions made during development.

---

## 2. Technology Stack Decisions

### ADR-001: Next.js 16 with App Router

**Decision:** Use Next.js 16 (canary) with the App Router architecture.

**Context:** We needed a React framework that supports:

- Server-side rendering for SEO
- File-based routing
- Server Components for performance
- Easy deployment to Vercel

**Rationale:**

- App Router provides better performance through React Server Components
- Native support for layouts, loading states, and error boundaries
- Streaming SSR capabilities
- Built-in SEO support with metadata API

**Consequences:**

- ✅ Improved initial page load performance
- ✅ Simplified data fetching patterns
- ⚠️ Some third-party libraries require 'use client' directive
- ⚠️ Using canary version may have breaking changes

---

### ADR-002: Algolia for Search

**Decision:** Use Algolia InstantSearch with `react-instantsearch-nextjs` for product search and filtering.

**Context:** The application requires fast, faceted search with:

- Full-text search
- Hierarchical category navigation
- Multiple filter types (brand, price range, rating)
- URL synchronization

**Rationale:**

- Sub-50ms search responses
- Built-in faceting and filtering
- React InstantSearch provides ready-to-use widgets
- SSR support via `react-instantsearch-nextjs`

**Implementation:**

```typescript
// InstantSearchProvider wraps the products layout
<InstantSearchNext
  searchClient={searchClient}
  indexName={indexName}
  routing={{
    router: { /* custom URL handling */ },
    stateMapping: { /* state <-> URL conversion */ }
  }}
>
```

**Consequences:**

- ✅ Instant search experience
- ✅ Powerful faceting out of the box
- ⚠️ External dependency on Algolia service
- ⚠️ Requires pre-built index with specific structure

---

### ADR-003: Zustand for Client State Management

**Decision:** Use Zustand with persist middleware for shopping cart state.

**Context:** We need:

- Global cart state accessible across components
- Persistence across browser sessions
- Simple API without boilerplate

**Rationale:**

- Minimal bundle size (~1KB)
- No providers/context wrappers needed
- Built-in persist middleware for localStorage
- TypeScript-first design

**Implementation:**

```typescript
export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        /* ... */
      },
      // ...
    }),
    {
      name: 'tofu-store-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
```

**Consequences:**

- ✅ Simple, lightweight state management
- ✅ Cart persists across sessions automatically
- ✅ No hydration issues with SSR (store is client-only)
- ⚠️ Cart data stored in localStorage (size limits apply)

---

### ADR-004: Zod for Runtime Validation

**Decision:** Use Zod for schema validation across the application.

**Context:** We need type-safe validation for:

- Analytics events
- Checkout form data
- API request/response payloads

**Rationale:**

- TypeScript inference from schemas
- Composable schema definitions
- Discriminated unions for event types
- Clear error messages

**Implementation:**

```typescript
// Analytics uses discriminated unions
export const analyticsEventSchema = z.discriminatedUnion('eventType', [
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.PRODUCT_VIEW),
    data: productEventDataSchema,
  }),
  // ...
])

// Types are inferred
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
```

**Consequences:**

- ✅ Single source of truth for types and validation
- ✅ Runtime type safety at system boundaries
- ✅ Better developer experience with autocomplete

---

### ADR-005: Radix UI + Tailwind CSS for UI

**Decision:** Use Radix UI primitives with Tailwind CSS for styling.

**Context:** We need:

- Accessible, unstyled components
- Consistent design system
- Fast development iteration

**Rationale:**

- Radix provides accessibility out of the box
- Tailwind enables rapid styling without CSS files
- shadcn/ui pattern for component customization

**Consequences:**

- ✅ WCAG-compliant components
- ✅ Consistent styling across the app
- ✅ Easy theming with CSS variables
- ⚠️ Larger HTML due to utility classes (mitigated by Tailwind's purging)

---

## 3. URL Architecture Decisions

### ADR-006: SEO-Friendly URL Structure

**Decision:** Implement clean, hierarchical URLs with category paths and query parameters.

**Context:** URLs should be:

- Human-readable
- SEO-optimized
- Shareable with filter state preserved

**URL Structure:**

| Route             | Example                                            |
| ----------------- | -------------------------------------------------- |
| Category browsing | `/products/appliances/air-conditioners`            |
| Search            | `/products?q=samsung+tv`                           |
| Filters           | `/products?brands=Samsung,LG&rating=4&price=0:500` |
| Product detail    | `/product/samsung-galaxy-s24-ABC123`               |

**Implementation:**

```typescript
// Category slugs are pre-generated at build time
// data/category-slugs.json maps slugs ↔ Algolia values

// URL creation
function createURL(routeState: RouteState): string {
  let path = '/products'
  if (routeState.categories?.length) {
    path = `/products/${routeState.categories.join('/')}`
  }
  // Query params for filters
  const params = new URLSearchParams()
  if (routeState.brands) params.set('brands', routeState.brands.join(','))
  // ...
}
```

**Consequences:**

- ✅ Crawlable category hierarchies
- ✅ Shareable filtered views
- ✅ Browser back/forward navigation works
- ⚠️ Requires slug pre-generation script

---

### ADR-007: Product URL with ID Suffix

**Decision:** Product URLs include a slug for SEO plus the product ID for reliable lookups.

**Format:** `/product/{slugified-name}-{productID}`

**Example:** `/product/samsung-galaxy-s24-ultra-ABC123XYZ`

**Rationale:**

- Slug provides SEO value and human readability
- ID suffix ensures reliable product lookup
- Handles product name changes gracefully

**Implementation:**

```typescript
export function getProductUrl(product: Product): string {
  const slug = generateProductSlug(product.name)
  return `/product/${slug}-${product.objectID}`
}

export function parseProductIdFromSlug(slug: string): string | null {
  const parts = slug.split('-').filter(Boolean)
  return parts[parts.length - 1] || null // ID is always last
}
```

**Consequences:**

- ✅ SEO-friendly URLs
- ✅ Reliable product resolution
- ✅ Product name changes don't break existing links

---

## 4. Component Architecture

### ADR-008: Component Organization

**Decision:** Organize components by feature domain with shared UI components.

**Structure:**

```
components/
├── algolia/          # Search-specific components
│   ├── Hits/         # Product grid with loading/empty states
│   ├── Pagination.tsx
│   └── RefinementList.tsx
├── cart/             # Shopping cart components
├── layout/           # Header, Sidebar, Breadcrumbs
├── product/          # PDP components
├── products/         # PLP components
├── shared/           # Cross-feature components
└── ui/               # Base UI primitives (shadcn)
```

**Rationale:**

- Feature-based organization scales better
- Clear ownership of components
- Shared UI components prevent duplication

---

### ADR-009: forwardRef for Focusable Components

**Decision:** Use `forwardRef` for components that may need external focus management.

**Context:** Accessibility features require programmatic focus control, especially:

- Focus management when pagination changes
- Focus restoration after modal closes
- Keyboard navigation through product grids

**Implementation:**

```typescript
// ProductCard accepts a ref for focus management
export const ProductCard = forwardRef<HTMLAnchorElement, ProductCardProps>(({ product }, ref) => (
  <Link ref={ref} href={productUrl}>
    {/* ... */}
  </Link>
))

// Hits component focuses first product on page change
useEffect(() => {
  if (pageChanged && firstProductRef.current) {
    firstProductRef.current?.focus()
    firstProductRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
}, [currentRefinement])
```

**Consequences:**

- ✅ Proper keyboard navigation
- ✅ Screen reader users can follow page changes
- ⚠️ Requires careful ref management

---

## 5. Data Flow Architecture

### ADR-010: Server Actions for Analytics

**Decision:** Use Next.js Server Actions for analytics event processing.

**Context:** Analytics events need to be:

- Processed server-side for security
- Non-blocking for user experience
- Validated before processing

**Flow:**

```
Client Event → useAnalytics hook → Server Action → Processing
     ↓              ↓                   ↓
  trigger     add metadata         validate & log
```

**Implementation:**

```typescript
// Client hook
export function useAnalytics() {
  const trackProductView = useCallback(async (product: Product) => {
    await trackAnalyticsEvent({
      ...createBaseEvent(AnalyticsEventType.PRODUCT_VIEW),
      data: productToEventData(product),
    })
  }, [])
}

// Server action (app/actions/analytics.ts)
export async function trackAnalyticsEvent(event: AnalyticsEvent) {
  // Validate, log, or forward to analytics service
}
```

**Consequences:**

- ✅ Type-safe event tracking
- ✅ Server-side validation
- ✅ Easy to extend for different analytics providers
- ⚠️ Network latency for each event (can be batched)

---

### ADR-011: API Routes for Checkout

**Decision:** Use Next.js API routes for checkout processing.

**Context:** Checkout requires:

- Validation of cart items
- (Future) Payment processing
- Order creation

**Implementation:**

```typescript
// app/api/checkout/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validatedData = checkoutSchema.parse(body)

  // Process order...
  return NextResponse.json({ success: true, orderId })
}
```

**Consequences:**

- ✅ Clear separation of checkout logic
- ✅ Easy to add payment provider integration
- ✅ Standard REST endpoint for flexibility

---

## 6. Accessibility Decisions

### ADR-012: WCAG 2.1 AA Compliance

**Decision:** Target WCAG 2.1 Level AA compliance throughout the application.

**Implementation:**

| Feature          | Implementation                             |
| ---------------- | ------------------------------------------ |
| Skip links       | "Skip to main content" on every page       |
| ARIA labels      | All interactive elements labeled           |
| Focus management | Focus moves to first product on pagination |
| Live regions     | `aria-live="polite"` for search results    |
| Keyboard nav     | Full keyboard support for all features     |

**Example:**

```tsx
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only ...">
  Skip to main content
</a>

// Live region for search results
<div role="region" aria-label="Product search results" aria-live="polite">
  {items.map(product => <ProductCard ... />)}
</div>
```

**Consequences:**

- ✅ Inclusive for all users
- ✅ Screen reader compatible
- ✅ Keyboard-only users can navigate fully
- ⚠️ Requires ongoing testing with assistive technologies

---

## 7. SEO Decisions

### ADR-013: Structured Data with JSON-LD

**Decision:** Include JSON-LD structured data for products and breadcrumbs.

**Implementation:**

```tsx
// ProductJsonLd component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image,
      brand: { '@type': 'Brand', name: product.brand },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
      },
    }),
  }}
/>
```

**Consequences:**

- ✅ Rich snippets in search results
- ✅ Better click-through rates
- ✅ Product information in knowledge panels

---

### ADR-014: Dynamic Sitemap Generation

**Decision:** Generate sitemap dynamically from Algolia data.

**Implementation:**

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products from Algolia
  // Generate sitemap entries
}
```

**Consequences:**

- ✅ Always up-to-date with product catalog
- ✅ Includes all category pages
- ⚠️ May hit Algolia rate limits for large catalogs

---

## 8. Build-Time Decisions

### ADR-015: Pre-generated Category Slug Mappings

**Decision:** Generate category-to-slug mappings at build time.

**Context:** Algolia category values (e.g., "TV & Home Theater") need to be converted to URL slugs (e.g., "tv-and-home-theater") and back.

**Implementation:**

```bash
# scripts/generate-category-slugs.ts
# Fetches all categories from Algolia
# Generates data/category-slugs.json
```

```json
{
  "slugToValue": {
    "tv-and-home-theater": "TV & Home Theater"
  },
  "valueToSlug": {
    "TV & Home Theater": "tv-and-home-theater"
  }
}
```

**Rationale:**

- Exact bidirectional mapping
- No runtime API calls for slug resolution
- Fast lookups

**Consequences:**

- ✅ Reliable slug ↔ value conversion
- ✅ No runtime overhead
- ⚠️ Requires rebuild when categories change
- ⚠️ Prebuild hook ensures fresh data

---

## 9. Trade-offs Summary

| Decision            | Trade-off                                 |
| ------------------- | ----------------------------------------- |
| Next.js Canary      | Latest features vs. potential instability |
| Algolia             | Performance vs. external dependency       |
| Zustand             | Simplicity vs. less built-in tooling      |
| localStorage cart   | Persistence vs. cross-device sync         |
| Pre-generated slugs | Performance vs. rebuild requirement       |
| Server Actions      | Type safety vs. network latency           |

---

## 10. Future Considerations

1. **Authentication**: Add user accounts for order history, wishlists
2. **Payment Integration**: Stripe or similar for actual checkout
3. **Real-time Inventory**: WebSocket updates for stock levels
4. **Analytics Backend**: Send events to a proper analytics service
5. **CDN Caching**: Cache product data at edge for performance
6. **A/B Testing**: Framework for testing UI variations

---

## Appendix: Key Files Reference

| Purpose          | File                                         |
| ---------------- | -------------------------------------------- |
| Algolia client   | `lib/algolia/client.ts`                      |
| Search routing   | `components/algolia/instantSearchRouting.ts` |
| Cart store       | `lib/stores/cart-store.ts`                   |
| Analytics hook   | `lib/hooks/useAnalytics.ts`                  |
| Checkout API     | `app/api/checkout/route.ts`                  |
| Product types    | `lib/types/product.ts`                       |
| Analytics schema | `lib/schemas/analytics-schema.ts`            |
