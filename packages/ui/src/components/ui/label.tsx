import * as LabelPrimitive from "@radix-ui/react-label";
import type * as React from "react";

import { cn } from "~ui/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "gs:flex gs:items-center gs:gap-2 gs:text-sm gs:leading-none gs:font-medium gs:select-none gs:group-data-[disabled=true]:pointer-events-none gs:group-data-[disabled=true]:opacity-50 gs:peer-disabled:cursor-not-allowed gs:peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
