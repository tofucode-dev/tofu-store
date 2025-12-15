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
      <div className="flex flex-wrap items-center gap-2">
        {product.brand && (
          <Badge variant="secondary" className="text-sm font-medium">
            {product.brand}
          </Badge>
        )}
        {product.categories?.slice(0, 2).map(category => (
          <Badge key={category} variant="outline" className="text-sm">
            {category}
          </Badge>
        ))}
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{product.name}</h1>
        {product.rating !== undefined && (
          <div className="mt-3">
            <StarRating rating={product.rating} />
          </div>
        )}
      </div>

      {/* Price */}
      {product.price !== undefined && (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground sm:text-4xl">${product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">Tax included</span>
        </div>
      )}

      <Separator />

      {/* Description Preview */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed line-clamp-3">{product.description}</p>
      )}

      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-input">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </Button>
            <input
              id="quantity"
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="h-10 w-14 border-x border-input bg-transparent text-center text-sm font-medium focus:outline-none"
              aria-label="Quantity"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={incrementQuantity}
              disabled={quantity >= 99}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">In stock</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="default" className="flex-1 gap-2 text-base" onClick={handleAddToCart} aria-live="polite">
          {addedToCart ? (
            <>
              <Check className="h-5 w-5" aria-hidden="true" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn('h-5 w-5 transition-colors', isWishlisted ? 'fill-destructive stroke-destructive' : '')}
            aria-hidden="true"
          />
          <span className="sr-only sm:not-sr-only">{isWishlisted ? 'Saved' : 'Save'}</span>
        </Button>
        <Button size="lg" variant="outline" className="gap-2" aria-label="Share product">
          <Share2 className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Share</span>
        </Button>
      </div>

      <Separator />

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Truck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-muted-foreground">Orders over $50</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Shield className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">2 Year Warranty</p>
            <p className="text-xs text-muted-foreground">Full coverage</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <RotateCcw className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium">30-Day Returns</p>
            <p className="text-xs text-muted-foreground">Hassle-free</p>
          </div>
        </div>
      </div>
    </div>
  )
}
