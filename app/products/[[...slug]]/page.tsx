import { Sidebar } from "@/components/layout/Sidebar";

export default function ProductsPage() {
    return (
        <>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex min-h-0 flex-1">
          {/* Sidebar with Filters - hidden on mobile, shown via sheet */}
          <Sidebar />
          {/* Product Area */}
          <main className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 space-y-2 border-b border-border bg-background px-3 py-2 sm:px-6 sm:py-3">

              
            </div>

            {/* Scrollable Product Grid */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6">
           
            </div>

            {/* Fixed Pagination */}
            <div className="shrink-0 border-t border-border bg-background px-2 sm:px-4">
            
            </div>
          </main>
        </div>
      </div>
    </>
    )
}