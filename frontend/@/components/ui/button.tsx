import type { VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"

import { buttonVariants } from "./button-variants"

import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  active,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean,
    active: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={!active}
      className={cn(buttonVariants({ variant, size, className}), "transform hover:scale-110 transition duration-200 ease-in-out")}
      {...props}
    />
  )
}

export { Button }
