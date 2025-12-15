'use client'

import { useState, useEffect, useRef } from 'react'
import { checkoutSchema, type CheckoutInput } from '@/lib/schemas/checkout-schema'
import { checkoutAction } from '@/app/actions/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type CartItem } from '@/lib/stores/cart-store'
import { Loader2 } from 'lucide-react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

type CheckoutFormProps = {
  items: CartItem[]
  total: number
  onComplete: (orderId: string, message: string) => void
  onError?: (error: string) => void
  onCancel: () => void
}

type FormData = {
  name: string
  email: string
  address: string
  city: string
  zipCode: string
  country: string
}

export const CheckoutForm = ({ items, total, onComplete, onError, onCancel }: CheckoutFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const { trackCheckoutStarted, trackCheckoutCompleted, trackCheckoutFailed } = useAnalytics()
  const hasTrackedStart = useRef(false)

  // Track checkout started when component mounts (only once)
  useEffect(() => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true
      trackCheckoutStarted(
        items.map(item => ({ product: item.product, quantity: item.quantity })),
        total,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const customerData = { ...formData }
    const result = checkoutSchema.shape.customer.safeParse(customerData)

    if (!result.success) {
      const newErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as keyof FormData] = issue.message
        }
      })
      setErrors(newErrors)
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const checkoutData: CheckoutInput = {
        items: items.map(item => ({
          productId: item.product.objectID,
          name: item.product.name,
          price: item.product.price ?? 0,
          quantity: item.quantity,
          brand: item.product.brand,
        })),
        customer: formData,
        total,
      }

      const result = await checkoutAction(checkoutData)

      if (result.success) {
        // Track successful checkout
        trackCheckoutCompleted(
          result.orderId,
          items.map(item => ({ product: item.product, quantity: item.quantity })),
          total,
        )
        onComplete(result.orderId, result.message)
      } else {
        const errorMessage = result.error || 'Checkout failed'
        // Track failed checkout
        trackCheckoutFailed(
          errorMessage,
          items.map(item => ({ product: item.product, quantity: item.quantity })),
          total,
        )
        setError(errorMessage)
        // Also notify parent component about the error
        if (onError) {
          onError(errorMessage)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      // Also notify parent component about the error
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 px-1"
      aria-label="Checkout form"
      noValidate
    >
      <div className="space-y-4 px-1" role="group" aria-labelledby="shipping-heading">
        <h3 id="shipping-heading" className="text-lg font-semibold">
          Shipping Information
        </h3>

        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name{' '}
            <span className="text-destructive" aria-label="required">
              *
            </span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            Email{' '}
            <span className="text-destructive" aria-label="required">
              *
            </span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="address" className="block text-sm font-medium">
            Address{' '}
            <span className="text-destructive" aria-label="required">
              *
            </span>
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            required
            aria-required="true"
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && (
            <p id="address-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
              {errors.address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="city" className="block text-sm font-medium">
              City{' '}
              <span className="text-destructive" aria-label="required">
                *
              </span>
            </label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              required
              aria-required="true"
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'city-error' : undefined}
            />
            {errors.city && (
              <p id="city-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
                {errors.city}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="zipCode" className="block text-sm font-medium">
              Zip Code{' '}
              <span className="text-destructive" aria-label="required">
                *
              </span>
            </label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="10001"
              required
              aria-required="true"
              aria-invalid={!!errors.zipCode}
              aria-describedby={errors.zipCode ? 'zipCode-error' : undefined}
            />
            {errors.zipCode && (
              <p id="zipCode-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
                {errors.zipCode}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="country" className="block text-sm font-medium">
            Country{' '}
            <span className="text-destructive" aria-label="required">
              *
            </span>
          </label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="United States"
            required
            aria-required="true"
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? 'country-error' : undefined}
          />
          {errors.country && (
            <p id="country-error" className="mt-1 text-sm text-destructive" role="alert" aria-live="polite">
              {errors.country}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 px-1" role="group" aria-label="Order summary">
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

        {error && (
          <div
            id="form-error"
            className="mb-4 text-sm text-destructive"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
            aria-label="Cancel checkout and return to cart"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
            aria-label={isSubmitting ? 'Processing your order' : `Place order for ${total.toFixed(2)} dollars`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span aria-live="polite" aria-atomic="true">
                  Processing...
                </span>
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
