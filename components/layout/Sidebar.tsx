export const Sidebar = ({ children }: { children: React.ReactNode }) => {
    return (
      <aside 
        className="hidden w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar shadow-sm md:block"
        aria-label="Product filters"
      >
        <div className="space-y-6 p-4">
          {children}
        </div>
      </aside>
    )
  }