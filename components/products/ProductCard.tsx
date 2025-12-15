'use client'

import { useState, MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types/product'
import { StarRating } from '../shared/StarRating'
import { getProductUrl } from '@/lib/slug-utils'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

type ProductCardProps = {
  product: Product
  hideAddToCart?: boolean
}

export const ProductCard = ({ product, hideAddToCart = false }: ProductCardProps) => {
  const [liked, setLiked] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const productUrl = getProductUrl(product)

  const handleLikeClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
  }

  return (
    <Link
      href={productUrl}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-linear-to-br from-neutral-100 to-neutral-200 shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:rounded-xl"
      aria-label={`${product.name}${product.brand ? ` by ${product.brand}` : ''}${
        product.price ? `, $${product.price.toFixed(2)}` : ''
      }`}
    >
      {/* Image */}
      <div className="relative flex h-28 shrink-0 items-center justify-center p-2 sm:h-40 sm:p-4">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-2 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Like Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={handleLikeClick}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={liked}
        className="absolute right-1 top-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white focus:ring-2 focus:ring-primary sm:right-2 sm:top-2 sm:h-8 sm:w-8"
      >
        <HeartIcon
          aria-hidden="true"
          className={cn(
            'h-3.5 w-3.5 sm:h-4 sm:w-4',
            liked ? 'fill-destructive stroke-destructive' : 'stroke-muted-foreground',
          )}
        />
      </Button>

      {/* Card Content */}
      <Card className="flex min-h-0 flex-1 flex-col gap-1.5 border-none rounded-none rounded-b-lg py-2 sm:gap-2 sm:rounded-b-xl sm:py-3">
        <CardHeader className="gap-0.5 px-2 py-0 sm:gap-1 sm:px-3">
          <CardTitle className="text-xs line-clamp-1 group-hover:text-primary transition-colors sm:text-sm">
            {product.name}
          </CardTitle>
          <CardDescription className="hidden flex-wrap items-center gap-1 sm:flex">
            {product.brand && (
              <Badge variant="outline" className="rounded-sm text-xs">
                {product.brand}
              </Badge>
            )}
            {product.categories?.[0] && (
              <Badge variant="outline" className="rounded-sm text-xs">
                {product.categories[0]}
              </Badge>
            )}
          </CardDescription>
          {product.rating !== undefined && <StarRating rating={product.rating} />}
        </CardHeader>

        <CardFooter className="mt-auto flex-col items-stretch gap-1.5 px-2 py-0 sm:gap-2 sm:px-3">
          <div className="flex items-center justify-between">
            {product.price !== undefined && (
              <div className="flex flex-col">
                <span className="hidden text-xs text-muted-foreground sm:block">Price</span>
                <span className="text-sm font-semibold sm:text-base">${product.price.toFixed(2)}</span>
              </div>
            )}
          </div>
          {!hideAddToCart && (
            <Button
              size="sm"
              className="h-7 w-full text-xs sm:h-8 sm:text-sm"
              onClick={handleAddToCart}
              aria-live="polite"
            >
              {addedToCart ? 'Added!' : 'Add to cart'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
