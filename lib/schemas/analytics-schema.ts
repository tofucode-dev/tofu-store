import { z } from 'zod'

/**
 * Analytics event types
 */
export enum AnalyticsEventType {
  // Product events
  PRODUCT_VIEW = 'product_view',
  PRODUCT_CLICK = 'product_click',

  // Cart events
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  UPDATE_CART_QUANTITY = 'update_cart_quantity',
  VIEW_CART = 'view_cart',

  // Checkout events
  CHECKOUT_STARTED = 'checkout_started',
  CHECKOUT_COMPLETED = 'checkout_completed',
  CHECKOUT_FAILED = 'checkout_failed',

  // Search & Filter events
  SEARCH = 'search',
  FILTER_APPLIED = 'filter_applied',

  // Navigation events
  PAGE_VIEW = 'page_view',
}

/**
 * Base analytics event schema
 */
const baseAnalyticsEventSchema = z.object({
  eventType: z.nativeEnum(AnalyticsEventType),
  timestamp: z.string().datetime().optional(),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  pageUrl: z.string().url().optional(),
  referrer: z.string().url().optional(),
  userAgent: z.string().optional(),
})

/**
 * Product-related event data
 */
const productEventDataSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number().optional(),
  productBrand: z.string().optional(),
  productCategory: z.string().optional(),
  productCategories: z.array(z.string()).optional(),
})

/**
 * Cart event data
 */
const cartEventDataSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number().optional(),
  quantity: z.number().int().positive(),
  totalValue: z.number().optional(),
  cartTotal: z.number().optional(),
  cartItemCount: z.number().int().nonnegative().optional(),
})

/**
 * Checkout event data
 */
const checkoutEventDataSchema = z.object({
  orderId: z.string().optional(),
  total: z.number(),
  itemCount: z.number().int().positive(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.number().int().positive(),
      price: z.number(),
    }),
  ),
  error: z.string().optional(),
})

/**
 * Search event data
 */
const searchEventDataSchema = z.object({
  query: z.string(),
  resultCount: z.number().int().nonnegative().optional(),
})

/**
 * Filter event data
 */
const filterEventDataSchema = z.object({
  filterType: z.string(),
  filterValue: z.union([z.string(), z.number(), z.array(z.string())]),
  resultCount: z.number().int().nonnegative().optional(),
})

/**
 * Page view event data
 */
const pageViewEventDataSchema = z.object({
  pagePath: z.string(),
  pageTitle: z.string().optional(),
})

/**
 * Union of all event data schemas
 */
const eventDataSchema = z.discriminatedUnion('eventType', [
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.PRODUCT_VIEW),
    data: productEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.PRODUCT_CLICK),
    data: productEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.ADD_TO_CART),
    data: cartEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.REMOVE_FROM_CART),
    data: cartEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.UPDATE_CART_QUANTITY),
    data: cartEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.VIEW_CART),
    data: z.object({
      cartItemCount: z.number().int().nonnegative(),
      cartTotal: z.number(),
    }),
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.CHECKOUT_STARTED),
    data: checkoutEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.CHECKOUT_COMPLETED),
    data: checkoutEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.CHECKOUT_FAILED),
    data: checkoutEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.SEARCH),
    data: searchEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.FILTER_APPLIED),
    data: filterEventDataSchema,
  }),
  baseAnalyticsEventSchema.extend({
    eventType: z.literal(AnalyticsEventType.PAGE_VIEW),
    data: pageViewEventDataSchema,
  }),
])

/**
 * Main analytics event schema
 */
export const analyticsEventSchema = eventDataSchema

/**
 * TypeScript types derived from schemas
 */
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>

export type ProductEventData = z.infer<typeof productEventDataSchema>
export type CartEventData = z.infer<typeof cartEventDataSchema>
export type CheckoutEventData = z.infer<typeof checkoutEventDataSchema>
export type SearchEventData = z.infer<typeof searchEventDataSchema>
export type FilterEventData = z.infer<typeof filterEventDataSchema>
export type PageViewEventData = z.infer<typeof pageViewEventDataSchema>
