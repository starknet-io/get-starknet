import type * as React from "react";

import { cn } from "~ui/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "gs:file:text-foreground gs:placeholder:text-muted-foreground gs:selection:bg-primary gs:selection:text-primary-foreground gs:dark:bg-input/30 gs:border-input gs:flex gs:h-9 gs:w-full gs:min-w-0 gs:rounded-md gs:border gs:bg-transparent gs:px-3 gs:py-1 gs:text-base gs:shadow-xs gs:transition-[color,box-shadow] gs:outline-none gs:file:inline-flex gs:file:h-7 gs:file:border-0 gs:file:bg-transparent gs:file:text-sm gs:file:font-medium gs:disabled:pointer-events-none gs:disabled:cursor-not-allowed gs:disabled:opacity-50 gs:md:text-sm",
        "gs:focus-visible:border-ring gs:focus-visible:ring-ring/50 gs:focus-visible:ring-[3px]",
        "gs:aria-invalid:ring-destructive/20 gs:dark:aria-invalid:ring-destructive/40 gs:aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
