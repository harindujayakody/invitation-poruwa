import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 shadow-xs transition-colors outline-none placeholder:text-stone-400 focus-visible:border-rose-500 focus-visible:ring-3 focus-visible:ring-rose-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
