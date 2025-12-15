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
    <section className="flex flex-col gap-4" aria-label="Product images">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-neutral-100 to-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        tabIndex={0}
        role="img"
        aria-label={`${productName} - Main product image ${selectedIndex + 1} of ${displayImages.length}`}
      >
        <AspectRatio ratio={1}>
          <Image
            id="main-product-image"
            src={displayImages[selectedIndex]}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4 mix-blend-multiply sm:p-8"
            aria-hidden="true"
          />
        </AspectRatio>
        {displayImages.length > 1 && (
          <div id="image-counter" className="sr-only">
            Image {selectedIndex + 1} of {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <nav className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Product image thumbnails">
          {displayImages.map((image, index) => (
            <button
              key={index}
              ref={el => {
                thumbnailRefs.current[index] = el
              }}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`View image ${index + 1} of ${displayImages.length}: ${productName}`}
              aria-controls="main-product-image"
              tabIndex={selectedIndex === index ? 0 : -1}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={e => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const newIndex = index > 0 ? index - 1 : displayImages.length - 1
                  setSelectedIndex(newIndex)
                  thumbnailRefs.current[newIndex]?.focus()
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  const newIndex = index < displayImages.length - 1 ? index + 1 : 0
                  setSelectedIndex(newIndex)
                  thumbnailRefs.current[newIndex]?.focus()
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  setSelectedIndex(0)
                  thumbnailRefs.current[0]?.focus()
                } else if (e.key === 'End') {
                  e.preventDefault()
                  const lastIndex = displayImages.length - 1
                  setSelectedIndex(lastIndex)
                  thumbnailRefs.current[lastIndex]?.focus()
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
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1 mix-blend-multiply"
                aria-hidden="true"
              />
              <span className="sr-only">Thumbnail {index + 1}</span>
            </button>
          ))}
        </nav>
      )}
    </section>
  )
}
