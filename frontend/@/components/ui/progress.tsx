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
  from = "primary",
  via = "[var(--button-tournament)]/70",
  to = "transparent",
  bg = "primary-dark",
  border = "primary",
  glow = "[var(--button-tournament)]",
  ...props
}: ProgressProps) {
 
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-full h-3 w-full items-center overflow-x-hidden rounded-full",
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
        className="relative size-full flex-1 transition-transform bg-gradient-to-r from-primary via-[var(--button-tournament)]/70 to-transparent"
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
