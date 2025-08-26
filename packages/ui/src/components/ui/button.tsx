import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~ui/lib/utils";

const buttonVariants = cva(
  "gs:inline-flex gs:items-center gs:justify-center gs:gap-2 gs:whitespace-nowrap gs:rounded-md gs:text-sm gs:font-medium gs:transition-all gs:disabled:pointer-events-none gs:disabled:opacity-50 gs:[&_svg]:pointer-events-none gs:[&_svg:not([class*=size-])]:size-4 gs:shrink-0 gs:[&_svg]:shrink-0 gs:outline-none gs:focus-visible:border-ring gs:focus-visible:ring-ring/50 gs:focus-visible:ring-[3px] gs:aria-invalid:ring-destructive/20 gs:dark:aria-invalid:ring-destructive/40 gs:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "gs:bg-primary gs:text-primary-foreground gs:shadow-xs gs:hover:bg-primary/90",
        destructive:
          "gs:bg-destructive gs:text-white gs:shadow-xs gs:hover:bg-destructive/90 gs:focus-visible:ring-destructive/20 gs:dark:focus-visible:ring-destructive/40 gs:dark:bg-destructive/60",
        outline:
          "gs:border gs:bg-background gs:shadow-xs gs:hover:bg-accent gs:hover:text-accent-foreground gs:dark:bg-input/30 gs:dark:border-input gs:dark:hover:bg-input/50",
        secondary:
          "gs:bg-secondary gs:text-secondary-foreground gs:shadow-xs gs:hover:bg-secondary/80",
        ghost:
          "gs:hover:bg-accent gs:hover:text-accent-foreground gs:dark:hover:bg-accent/50",
        link: "gs:text-primary gs:underline-offset-4 gs:hover:underline",
      },
      size: {
        default: "gs:h-9 gs:px-4 gs:py-2 gs:has-[>svg]:px-3",
        sm: "gs:h-8 gs:rounded-md gs:gap-1.5 gs:px-3 gs:has-[>svg]:px-2.5",
        lg: "gs:h-10 gs:rounded-md gs:px-6 gs:has-[>svg]:px-4",
        icon: "gs:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
