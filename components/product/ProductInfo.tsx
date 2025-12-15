'use client'

import { Product } from '@/lib/types/product'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { StarRating } from '../shared/StarRating'
import { Button } from '../ui/button'
import { Check, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/stores/cart-store'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

type ProductInfoProps = {
  product: Product
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  const { trackAddToCart } = useAnalytics()
  const cart = useCartStore(state => state)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)

    // Track analytics
    trackAddToCart(product, quantity, cart.getTotalPrice(), cart.getTotalItems())
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const incrementQuantity = () => {
    if (quantity < 99) setQuantity(q => q + 1)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Brand & Categories */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Product information">
        {product.brand && (
          <Badge
            variant="secondary"
            className="text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            aria-label={`Brand: ${product.brand}`}
            tabIndex={0}
          >
            {product.brand}
          </Badge>
        )}
        {product.categories?.slice(0, 2).map(category => (
          <Badge
            key={category}
            variant="outline"
            className="text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            aria-label={`Category: ${category}`}
            tabIndex={0}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Product Name */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          tabIndex={0}
        >
          {product.name}
        </h1>
        {product.rating !== undefined && (
          <div
            className="mt-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            role="group"
            aria-label={`Product rating: ${product.rating.toFixed(1)} out of 5 stars`}
            tabIndex={0}
          >
            <StarRating rating={product.rating} />
          </div>
        )}
      </div>

      {/* Price */}
      {product.price !== undefined && (
        <div
          className="flex items-baseline gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          role="group"
          aria-label="Pricing information"
          tabIndex={0}
        >
          <span
            className="text-3xl font-bold text-foreground sm:text-4xl"
            aria-label={`Price: $${product.price.toFixed(2)}`}
          >
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground" aria-hidden="true">
            Tax included
          </span>
          <span className="sr-only">Tax included in price</span>
        </div>
      )}

      <Separator aria-hidden="true" />

      {/* Description Preview */}
      {product.description && (
        <div>
          <h2 className="sr-only">Product Description</h2>
          <p
            className="text-muted-foreground leading-relaxed line-clamp-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            aria-label={`Product description: ${product.description}`}
            tabIndex={0}
          >
            {product.description}
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </label>
        <div className="flex items-center gap-3" role="group" aria-label="Quantity selector">
          <div className="flex items-center rounded-lg border border-input" role="group" aria-label="Quantity controls">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity. Current quantity is ${quantity}`}
            >
              <span aria-hidden="true">−</span>
            </Button>
            <input
              id="quantity"
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="h-10 w-14 border-x border-input bg-transparent text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Quantity: ${quantity}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={incrementQuantity}
              disabled={quantity >= 99}
              aria-label={`Increase quantity. Current quantity is ${quantity}`}
            >
              <span aria-hidden="true">+</span>
            </Button>
          </div>
          <div
            className="text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
            role="status"
            aria-live="polite"
            tabIndex={0}
            aria-label="Product is in stock"
          >
            <span aria-hidden="true">In stock</span>
            <span className="sr-only">Product is in stock</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row" role="group" aria-label="Product actions">
        <Button
          size="default"
          className="flex-1 gap-2 text-base"
          onClick={handleAddToCart}
          aria-label={addedToCart ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          aria-live="polite"
          aria-atomic="true"
        >
          {addedToCart ? (
            <>
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            className={cn('h-5 w-5 transition-colors', isWishlisted ? 'fill-destructive stroke-destructive' : '')}
            aria-hidden="true"
          />
          <span className="sr-only sm:not-sr-only">{isWishlisted ? 'Saved' : 'Save'}</span>
        </Button>
        <Button size="lg" variant="outline" className="gap-2" aria-label={`Share ${product.name}`}>
          <Share2 className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Share</span>
        </Button>
      </div>

      <Separator aria-hidden="true" />

      {/* Trust Badges */}
      <section aria-labelledby="trust-badges-heading">
        <h2 id="trust-badges-heading" className="sr-only">
          Shipping and warranty information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="list">
          <div
            className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            role="listitem"
            tabIndex={0}
            aria-label="Free shipping on orders over $50"
          >
            <Truck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground" aria-hidden="true">
                Orders over $50
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            role="listitem"
            tabIndex={0}
            aria-label="2 year warranty with full coverage"
          >
            <Shield className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">2 Year Warranty</p>
              <p className="text-xs text-muted-foreground" aria-hidden="true">
                Full coverage
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            role="listitem"
            tabIndex={0}
            aria-label="30 day returns, hassle-free"
          >
            <RotateCcw className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">30-Day Returns</p>
              <p className="text-xs text-muted-foreground" aria-hidden="true">
                Hassle-free
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
