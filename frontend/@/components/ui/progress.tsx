import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"
import "../../../src/styles/global.css"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
 
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `relative flex h-full h-3 w-full items-center overflow-x-hidden rounded-full bg-white`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
        className="relative size-full flex-1 transition-transform bg-gradient-to-r from-primary via-[var(--button-tournament)]/70 to-transparent"
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
