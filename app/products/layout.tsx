import { InstantSearchProvider } from '@/components/algolia/InstantSearchProvider'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Header } from '@/components/layout/Header'

export const dynamic = 'force-dynamic'

const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <InstantSearchProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <Breadcrumbs />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </InstantSearchProvider>
  )
}

export default ProductsLayout
