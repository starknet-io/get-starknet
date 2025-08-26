import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~ui/lib/utils";

const badgeVariants = cva(
  "gs:inline-flex gs:items-center gs:justify-center gs:rounded-md gs:border gs:px-2 gs:py-0.5 gs:text-xs gs:font-medium gs:w-fit gs:whitespace-nowrap gs:shrink-0 gs:[&>svg]:size-3 gs:gap-1 gs:[&>svg]:pointer-events-none gs:focus-visible:border-ring gs:focus-visible:ring-ring/50 gs:focus-visible:ring-[3px] gs:aria-invalid:ring-destructive/20 gs:dark:aria-invalid:ring-destructive/40 gs:aria-invalid:border-destructive gs:transition-[color,box-shadow] gs:overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "gs:border-transparent gs:bg-primary gs:text-primary-foreground gs:[a&]:hover:bg-primary/90",
        secondary:
          "gs:border-transparent gs:bg-secondary gs:text-secondary-foreground gs:[a&]:hover:bg-secondary/90",
        destructive:
          "gs:border-transparent gs:bg-destructive gs:text-white gs:[a&]:hover:bg-destructive/90 gs:focus-visible:ring-destructive/20 gs:dark:focus-visible:ring-destructive/40 gs:dark:bg-destructive/60",
        outline:
          "gs:text-foreground gs:[a&]:hover:bg-accent gs:[a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
