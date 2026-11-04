import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow",
        primary: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow",
        outline:
          "border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 shadow-xs",
        secondary:
          "border-stone-200 bg-stone-100 text-stone-800 hover:bg-stone-200 shadow-xs",
        ghost:
          "hover:bg-stone-100 hover:text-stone-900 text-stone-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        link: "text-rose-600 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 py-2 text-sm rounded-xl min-h-[40px]",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs min-h-[28px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs min-h-[32px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 rounded-2xl px-6 py-3 text-base font-bold min-h-[48px]",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
