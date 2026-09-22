import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"
import "../../../src/styles/global.css"

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root>{
  from?: string,
  via?: string,
  to?: string,
  bg?: string,
  border?: string,
  glow?: string,
}

function Progress({
  className,
  value,
  from = "[var(--primary)]",
  via = "[var(--button-tournament)]",
  to = "white",
  bg = "var(--primary-dark)",
  border = "#631631",
  glow = "#FFFFFF",
  ...props
}: ProgressProps) {
 
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-full h-1.5 w-full items-center overflow-x-hidden rounded-full",
        border && "border",
        className
      )}
      style={{
        backgroundColor: bg,
        borderColor: border
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
        className={`relative size-full transition-transform bg-linear-to-r from-${from} via-${via} to-${to} rounded-full shadow-[20px_20px_15px_${from}]`}
      >
        <div
          className="absolute right-0 top-0 h-full rounded-full w-full"
          style={{
            boxShadow: `0 0 15px ${glow}`
          }}
        >

        </div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
