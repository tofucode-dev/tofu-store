import { InstantSearchProvider } from '@/components/algolia/InstantSearchProvider'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Header } from '@/components/layout/Header'

export const dynamic = 'force-dynamic'

const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <InstantSearchProvider>
      <div className="fixed inset-0 flex flex-col overflow-hidden">
        <Header />
        <Breadcrumbs />
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </InstantSearchProvider>
  )
}

export default ProductsLayout
