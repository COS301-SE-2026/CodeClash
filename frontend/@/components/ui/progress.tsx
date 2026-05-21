import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  progress_colour,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { progress_colour?: string }) {
 
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-full h-3 w-full items-center overflow-x-hidden rounded-full bg-white",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("size-full flex-1 transition-all")}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: progress_colour ?? 'var(--primary)'
        }}
        
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
