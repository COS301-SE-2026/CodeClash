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
  height?: number,
  orientation?: "vertical" | "horizontal"
}

function Progress({
  className,
  value,
  from = "var(--primary)",
  via = "var(--button-tournament)",
  to = "#FFFFFF",
  bg = "var(--primary-dark)",
  border = "#631631",
  glow = "#FFFFFF",
  height = 1.5,
  orientation = "horizontal",
  ...props
}: ProgressProps) {

  const place = value || 0;
  const isVertical = orientation === "vertical"
 
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `relative flex h-full h-${height} w-full items-center overflow-x-hidden rounded-full`,
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
          transform: isVertical ? `translateY(${100 - place}%)` : `translateX(-${100 - (value || 0)}%)`,
          backgroundImage: isVertical ? `linear-gradient(to top, ${from}, ${via}, ${to})` : `linear-gradient(to right, ${from}, ${via}, ${to})`
        }}
        className={`relative size-full transition-transform rounded-full`}
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
