import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { badgeVariants } from "./badge-variants";

import { cn } from "@/lib/utils";
export { Badge };

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), "font-badge font-semibold hover:scale-110 transition-transform duration-300 ease-in-out", className)}
      {...props}
    />
  );
}
