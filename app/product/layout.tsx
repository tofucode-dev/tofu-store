import { Header } from '@/components/layout/Header'

type ProductLayoutProps = {
  children: React.ReactNode
}

const ProductLayout = ({ children }: ProductLayoutProps) => {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        {children}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <p className="text-sm text-muted-foreground">© 2025 TofuStore. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

export default ProductLayout
