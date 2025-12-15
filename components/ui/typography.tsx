import * as React from "react"
import { cn } from "@/lib/utils"

type TypographyVariant = 
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "blockquote"
  | "list"
  | "inlineCode"
  | "code"

type TypographyElement = 
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "blockquote"
  | "ul"
  | "code"
  | "pre"

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  as?: TypographyElement
  children: React.ReactNode
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  list: "my-6 ml-6 list-disc [&>li]:mt-2",
  inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
}

const defaultElements: Record<TypographyVariant, TypographyElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "div",
  small: "span",
  muted: "p",
  blockquote: "blockquote",
  list: "ul",
  inlineCode: "code",
  code: "code",
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "p", as, className, children, ...props }, ref) => {
    const Component = as || defaultElements[variant] || "p"
    const variantStyle = variantStyles[variant] || ""

    return React.createElement(
      Component,
      {
        ...props,
        ref,
        className: cn(variantStyle, className),
      },
      children
    )
  }
)
Typography.displayName = "Typography"

export { Typography }

