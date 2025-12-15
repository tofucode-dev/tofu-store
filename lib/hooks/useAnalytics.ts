'use client'

import { useCallback, useEffect, useRef } from 'react'
import { trackAnalyticsEvent } from '@/app/actions/analytics'
import {
  AnalyticsEventType,
  type AnalyticsEvent,
  type ProductEventData,
  type CartEventData,
  type CheckoutEventData,
  type SearchEventData,
  type FilterEventData,
  type PageViewEventData,
} from '@/lib/schemas/analytics-schema'
import type { Product } from '@/lib/types/product'

/**
 * Generate a session ID (persists for the browser session)
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  const key = 'analytics_session_id'
  let sessionId = sessionStorage.getItem(key)

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem(key, sessionId)
  }

  return sessionId
}

/**
 * Get current page URL
 */
function getPageUrl(): string {
  if (typeof window === 'undefined') return ''
  return window.location.href
}

/**
 * Get referrer
 */
function getReferrer(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return document.referrer || undefined
}

/**
 * Get user agent
 */
function getUserAgent(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return navigator.userAgent || undefined
}

/**
 * Create base event with common metadata
 */
function createBaseEvent(eventType: AnalyticsEventType): Partial<AnalyticsEvent> {
  return {
    eventType,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    pageUrl: getPageUrl(),
    referrer: getReferrer(),
    userAgent: getUserAgent(),
  }
}

/**
 * Convert Product to ProductEventData
 */
function productToEventData(product: Product): ProductEventData {
  return {
    productId: product.objectID,
    productName: product.name,
    productPrice: product.price,
    productBrand: product.brand,
    productCategory: product.categories?.[0],
    productCategories: product.categories,
  }
}

/**
 * Hook for tracking analytics events
 */
export function useAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      await trackAnalyticsEvent(event)
    } catch (error) {
      // Silently fail analytics tracking to not disrupt user experience
      console.error('Failed to track analytics event:', error)
    }
  }, [])

  // Product events
  const trackProductView = useCallback(
    async (product: Product) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.PRODUCT_VIEW),
        data: productToEventData(product),
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackProductClick = useCallback(
    async (product: Product) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.PRODUCT_CLICK),
        data: productToEventData(product),
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  // Cart events
  const trackAddToCart = useCallback(
    async (product: Product, quantity: number, cartTotal?: number, cartItemCount?: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.ADD_TO_CART),
        data: {
          productId: product.objectID,
          productName: product.name,
          productPrice: product.price,
          quantity,
          totalValue: product.price ? product.price * quantity : undefined,
          cartTotal,
          cartItemCount,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackRemoveFromCart = useCallback(
    async (product: Product, quantity: number, cartTotal?: number, cartItemCount?: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.REMOVE_FROM_CART),
        data: {
          productId: product.objectID,
          productName: product.name,
          productPrice: product.price,
          quantity,
          totalValue: product.price ? product.price * quantity : undefined,
          cartTotal,
          cartItemCount,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackUpdateCartQuantity = useCallback(
    async (product: Product, quantity: number, cartTotal?: number, cartItemCount?: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.UPDATE_CART_QUANTITY),
        data: {
          productId: product.objectID,
          productName: product.name,
          productPrice: product.price,
          quantity,
          totalValue: product.price ? product.price * quantity : undefined,
          cartTotal,
          cartItemCount,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackViewCart = useCallback(
    async (cartItemCount: number, cartTotal: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.VIEW_CART),
        data: {
          cartItemCount,
          cartTotal,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  // Checkout events
  const trackCheckoutStarted = useCallback(
    async (items: Array<{ product: Product; quantity: number }>, total: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.CHECKOUT_STARTED),
        data: {
          total,
          itemCount: items.length,
          items: items.map(item => ({
            productId: item.product.objectID,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price ?? 0,
          })),
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackCheckoutCompleted = useCallback(
    async (orderId: string, items: Array<{ product: Product; quantity: number }>, total: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.CHECKOUT_COMPLETED),
        data: {
          orderId,
          total,
          itemCount: items.length,
          items: items.map(item => ({
            productId: item.product.objectID,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price ?? 0,
          })),
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  const trackCheckoutFailed = useCallback(
    async (error: string, items: Array<{ product: Product; quantity: number }>, total: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.CHECKOUT_FAILED),
        data: {
          error,
          total,
          itemCount: items.length,
          items: items.map(item => ({
            productId: item.product.objectID,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price ?? 0,
          })),
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  // Search events
  const trackSearch = useCallback(
    async (query: string, resultCount?: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.SEARCH),
        data: {
          query,
          resultCount,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  // Filter events
  const trackFilterApplied = useCallback(
    async (filterType: string, filterValue: string | number | string[], resultCount?: number) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.FILTER_APPLIED),
        data: {
          filterType,
          filterValue,
          resultCount,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  // Page view events
  const trackPageView = useCallback(
    async (pagePath: string, pageTitle?: string) => {
      await trackEvent({
        ...createBaseEvent(AnalyticsEventType.PAGE_VIEW),
        data: {
          pagePath,
          pageTitle,
        },
      } as AnalyticsEvent)
    },
    [trackEvent],
  )

  return {
    trackEvent,
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackRemoveFromCart,
    trackUpdateCartQuantity,
    trackViewCart,
    trackCheckoutStarted,
    trackCheckoutCompleted,
    trackCheckoutFailed,
    trackSearch,
    trackFilterApplied,
    trackPageView,
  }
}
