'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

type ProductGalleryProps = {
  images: string[]
  productName: string
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages = images.length > 0 ? images : ['/placeholder-product.png']
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Keyboard navigation for thumbnails
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (displayImages.length <= 1) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : displayImages.length - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < displayImages.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setSelectedIndex(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setSelectedIndex(displayImages.length - 1)
      }
    }

    const currentThumbnail = thumbnailRefs.current[selectedIndex]
    if (currentThumbnail) {
      currentThumbnail.addEventListener('keydown', handleKeyDown)
      return () => {
        currentThumbnail.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [selectedIndex, displayImages.length])

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-neutral-100 to-neutral-200"
        role="img"
        aria-label={`${productName} - Image ${selectedIndex + 1} of ${displayImages.length}`}
      >
        <AspectRatio ratio={1}>
          <Image
            src={displayImages[selectedIndex]}
            alt={`${productName} - Main product image ${selectedIndex + 1} of ${displayImages.length}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 mix-blend-multiply sm:p-8"
          />
        </AspectRatio>
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Product image thumbnails">
          {displayImages.map((image, index) => (
            <button
              key={index}
              ref={el => {
                thumbnailRefs.current[index] = el
              }}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`View image ${index + 1} of ${displayImages.length}`}
              aria-controls={`product-image-${index}`}
              tabIndex={selectedIndex === index ? 0 : -1}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={e => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  setSelectedIndex(index > 0 ? index - 1 : displayImages.length - 1)
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  setSelectedIndex(index < displayImages.length - 1 ? index + 1 : 0)
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  setSelectedIndex(0)
                } else if (e.key === 'End') {
                  e.preventDefault()
                  setSelectedIndex(displayImages.length - 1)
                }
              }}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-20 sm:w-20',
                selectedIndex === index
                  ? 'border-primary ring-2 ring-primary ring-offset-2'
                  : 'border-border hover:border-muted-foreground/50',
              )}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1 mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
