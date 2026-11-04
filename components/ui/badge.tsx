import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-rose-600 text-white shadow-xs hover:bg-rose-700",
        secondary:
          "border-stone-200 bg-stone-100 text-stone-800 hover:bg-stone-200",
        destructive:
          "border-transparent bg-red-600 text-white shadow-xs hover:bg-red-700",
        outline:
          "border-stone-300 text-stone-800 bg-white",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        amber:
          "border-amber-200 bg-amber-50 text-amber-800",
        rose:
          "border-rose-200 bg-rose-50 text-rose-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
