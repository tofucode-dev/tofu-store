import { Header } from "@/components/layout/Header";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
              <Header/>
              <div className="min-h-0 flex-1">{children}</div>
        </div>
    )
  }