import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Search className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Product Not Found
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the product you&apos;re looking for. 
            It may have been removed or the link might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/products">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse Products
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

