import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

interface CollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, className }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const open = controlledOpen ?? internalOpen
    const setOpen = React.useCallback(
      (value: boolean) => {
        if (controlledOpen === undefined) {
          setInternalOpen(value)
        }
        onOpenChange?.(value)
      },
      [controlledOpen, onOpenChange]
    )

    return (
      <CollapsibleContext.Provider value={{ open, onOpenChange: setOpen }}>
        <div ref={ref} className={className}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleTrigger must be used within Collapsible")
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      context.onOpenChange(!context.open)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        className={className}
        onClick={handleClick}
        aria-expanded={context.open}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, forceMount, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleContent must be used within Collapsible")
    }

    if (!context.open && !forceMount) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all",
          context.open ? "animate-in slide-in-from-top-1" : "animate-out slide-out-to-top-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

