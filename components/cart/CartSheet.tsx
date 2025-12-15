'use client'

import { useCartStore, type CartStoreState } from '@/lib/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, Plus, Minus, X, CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSyncExternalStore, useState, useRef, useEffect } from 'react'
import { CheckoutForm } from './CheckoutForm'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

const emptyCartState: CartStoreState = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
}

function useCartHydrated() {
  const store = useCartStore
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => emptyCartState,
  )
}

type OrderStatus = { type: 'success'; orderId: string; message: string } | { type: 'error'; error: string }

export const CartSheet = () => {
  const [open, setOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorHeadingRef = useRef<HTMLHeadingElement>(null)
  const cart = useCartHydrated()
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const { trackRemoveFromCart, trackUpdateCartQuantity, trackViewCart } = useAnalytics()

  // Focus on heading when status changes for better screen reader experience
  useEffect(() => {
    if (!open || !orderStatus) return

    // Use multiple delays to ensure Sheet's focus management completes first
    // Radix Sheet may auto-focus the first button, so we need to override that
    const focusHeading = () => {
      // First delay to let Sheet render
      setTimeout(() => {
        requestAnimationFrame(() => {
          // Second delay to ensure Sheet's focus management is done
          setTimeout(() => {
            if (orderStatus.type === 'success' && confirmationHeadingRef.current) {
              // Force focus on heading
              confirmationHeadingRef.current.focus()
              // Check once more after a short delay to override any button focus
              setTimeout(() => {
                if (confirmationHeadingRef.current && document.activeElement?.tagName === 'BUTTON') {
                  confirmationHeadingRef.current.focus()
                }
              }, 100)
            } else if (orderStatus.type === 'error' && errorHeadingRef.current) {
              errorHeadingRef.current.focus()
              setTimeout(() => {
                if (errorHeadingRef.current && document.activeElement?.tagName === 'BUTTON') {
                  errorHeadingRef.current.focus()
                }
              }, 100)
            }
          }, 250)
        })
      }, 100)
    }

    focusHeading()
  }, [orderStatus, open])

  const items = cart.items
  const total = cart.getTotalPrice()
  const itemCount = cart.getTotalItems()

  const handleCheckout = () => {
    setShowCheckout(true)
    setOrderStatus(null)
  }

  const handleCheckoutComplete = (orderId: string, message: string) => {
    clearCart()
    setShowCheckout(false)
    setOrderStatus({ type: 'success', orderId, message })
  }

  const handleCheckoutError = (error: string) => {
    setShowCheckout(false)
    setOrderStatus({ type: 'error', error })
  }

  const handleCloseStatus = () => {
    setOrderStatus(null)
    setOpen(false)
  }

  const handleRetryCheckout = () => {
    setOrderStatus(null)
    setShowCheckout(true)
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset states when sheet closes
      setShowCheckout(false)
      setOrderStatus(null)
    } else {
      // Track cart view when sheet opens
      trackViewCart(cart.getTotalItems(), cart.getTotalPrice())
    }
  }

  const handleRemoveItem = (productId: string) => {
    const item = cart.items.find(item => item.product.objectID === productId)
    if (item) {
      trackRemoveFromCart(
        item.product,
        item.quantity,
        cart.getTotalPrice() - (item.product.price ?? 0) * item.quantity,
        cart.getTotalItems() - item.quantity,
      )
    }
    removeItem(productId)
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.items.find(item => item.product.objectID === productId)
    if (item) {
      const oldQuantity = item.quantity
      const quantityDiff = newQuantity - oldQuantity
      updateQuantity(productId, newQuantity)

      // Track quantity update - calculate new totals based on the change
      const newTotal = cart.getTotalPrice() + (item.product.price ?? 0) * quantityDiff
      const newItemCount = cart.getTotalItems() + quantityDiff
      trackUpdateCartQuantity(item.product, newQuantity, newTotal, newItemCount)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {itemCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-background"
              aria-hidden="true"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-lg" aria-label="Shopping cart">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>
            {orderStatus?.type === 'success'
              ? 'Order Confirmed'
              : orderStatus?.type === 'error'
              ? 'Order Failed'
              : 'Shopping Cart'}
          </SheetTitle>
        </SheetHeader>

        {orderStatus?.type === 'success' ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-labelledby="confirmation-heading"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10" aria-hidden="true">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2
                className="text-2xl font-bold outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                id="confirmation-heading"
                ref={confirmationHeadingRef}
                tabIndex={0}
              >
                Order Placed Successfully!
              </h2>
              <p
                className="text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                aria-live="polite"
                tabIndex={0}
                role="text"
                aria-label={`Order confirmation message: ${orderStatus.message}`}
              >
                {orderStatus.message}
              </p>
              <div
                className="text-sm text-muted-foreground mt-4 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                tabIndex={0}
                role="text"
                aria-label={`Order ID: ${orderStatus.orderId}`}
              >
                <span className="sr-only">Order ID: </span>
                <span>
                  Order ID: <span className="font-mono font-semibold text-foreground">{orderStatus.orderId}</span>
                </span>
              </div>
            </div>
            <div className="w-full space-y-3 pt-4">
              <Button className="w-full" onClick={handleCloseStatus} aria-label="Continue shopping and close cart">
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseStatus}
                aria-label="Close order confirmation"
              >
                Close
              </Button>
            </div>
          </div>
        ) : orderStatus?.type === 'error' ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            aria-labelledby="error-heading"
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
              aria-hidden="true"
            >
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <h2
                className="text-2xl font-bold text-destructive outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                id="error-heading"
                ref={errorHeadingRef}
                tabIndex={0}
              >
                Order Failed
              </h2>
              <p
                className="text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                aria-live="assertive"
                tabIndex={0}
                role="text"
                aria-label={`Error message: ${orderStatus.error}`}
              >
                {orderStatus.error}
              </p>
              <p
                className="text-sm text-muted-foreground mt-4 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                tabIndex={0}
                role="text"
                aria-label="Help information: Please try again or contact support if the problem persists"
              >
                Please try again or contact support if the problem persists.
              </p>
            </div>
            <div className="w-full space-y-3 pt-4">
              <Button
                className="w-full"
                onClick={handleRetryCheckout}
                aria-label="Retry checkout and return to checkout form"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCloseStatus}
                aria-label="Close error message and return to cart"
              >
                Return to Cart
              </Button>
            </div>
          </div>
        ) : showCheckout ? (
          <div className="flex-1 overflow-hidden px-6" role="region" aria-label="Checkout form">
            <CheckoutForm
              items={items}
              total={total}
              onComplete={handleCheckoutComplete}
              onError={handleCheckoutError}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6"
                role="status"
                aria-live="polite"
              >
                <ShoppingCart className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4" role="region" aria-label="Cart items">
                  <ul className="space-y-4" role="list">
                    {items.map(item => {
                      const unitPrice = item.product.price ?? 0
                      const itemTotal = unitPrice * item.quantity
                      return (
                        <li
                          key={item.product.objectID}
                          className="flex gap-4 border-b border-border pb-4 last:border-b-0"
                          role="listitem"
                        >
                          <Link
                            href={`/product/${item.product.objectID}`}
                            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border"
                            onClick={() => setOpen(false)}
                            aria-label={`View ${item.product.name} product details`}
                          >
                            {item.product.image && (
                              <Image
                                src={item.product.image}
                                alt=""
                                fill
                                className="object-contain p-2"
                                sizes="80px"
                                aria-hidden="true"
                              />
                            )}
                          </Link>
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <Link
                                  href={`/product/${item.product.objectID}`}
                                  className="font-medium hover:underline"
                                  onClick={() => setOpen(false)}
                                >
                                  {item.product.name}
                                </Link>
                                {item.product.brand && (
                                  <p
                                    className="text-sm text-muted-foreground"
                                    aria-label={`Brand: ${item.product.brand}`}
                                  >
                                    {item.product.brand}
                                  </p>
                                )}
                                <div className="sr-only">
                                  <span>Price per item: ${unitPrice.toFixed(2)}</span>
                                  <span>Quantity: {item.quantity}</span>
                                  <span>Item total: ${itemTotal.toFixed(2)}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveItem(item.product.objectID)}
                                aria-label={`Remove ${item.product.name} from cart`}
                              >
                                <X className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className="flex items-center gap-2"
                                role="group"
                                aria-label={`Quantity controls for ${item.product.name}`}
                              >
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.product.objectID, item.quantity - 1)}
                                  aria-label={`Decrease quantity of ${item.product.name}. Current quantity: ${item.quantity}`}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" aria-hidden="true" />
                                </Button>
                                <span
                                  className="w-8 text-center text-sm font-medium"
                                  aria-label={`Quantity: ${item.quantity}`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(item.product.objectID, item.quantity + 1)}
                                  aria-label={`Increase quantity of ${item.product.name}. Current quantity: ${item.quantity}`}
                                >
                                  <Plus className="h-4 w-4" aria-hidden="true" />
                                </Button>
                              </div>
                              <div
                                className="text-right focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                                tabIndex={0}
                                role="text"
                                aria-label={`Price for ${item.product.name}: ${unitPrice.toFixed(
                                  2,
                                )} dollars per item, quantity ${item.quantity}, total ${itemTotal.toFixed(2)} dollars`}
                              >
                                <span className="font-semibold">${itemTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="border-t border-border px-6 pb-6 pt-4" role="region" aria-label="Cart summary">
                  <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span
                      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                      tabIndex={0}
                      role="text"
                      aria-label={`Total amount: ${total.toFixed(2)} dollars`}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleCheckout}
                    aria-label={`Proceed to checkout. Total: ${total.toFixed(2)} dollars`}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
