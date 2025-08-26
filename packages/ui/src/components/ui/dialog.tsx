import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "~ui/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "gs:data-[state=open]:animate-in gs:data-[state=closed]:animate-out gs:data-[state=closed]:fade-out-0 gs:data-[state=open]:fade-in-0 gs:fixed gs:inset-0 gs:z-50 gs:bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "gs:bg-background gs:data-[state=open]:animate-in gs:data-[state=closed]:animate-out gs:data-[state=closed]:fade-out-0 gs:data-[state=open]:fade-in-0 gs:data-[state=closed]:zoom-out-95 gs:data-[state=open]:zoom-in-95 gs:fixed gs:top-[50%] gs:left-[50%] gs:z-50 gs:grid gs:w-full gs:max-w-[calc(100%-2rem)] gs:translate-x-[-50%] gs:translate-y-[-50%] gs:gap-4 gs:rounded-lg gs:border gs:p-6 gs:shadow-lg gs:duration-200 gs:sm:max-w-lg",
          className,
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="gs:ring-offset-background gs:focus:ring-ring gs:data-[state=open]:bg-accent gs:data-[state=open]:text-muted-foreground gs:absolute gs:top-4 gs:right-4 gs:rounded-xs gs:opacity-70 gs:transition-opacity gs:hover:opacity-100 gs:focus:ring-2 gs:focus:ring-offset-2 gs:focus:outline-hidden gs:disabled:pointer-events-none gs:[&_svg]:pointer-events-none gs:[&_svg]:shrink-0 gs:[&_svg:not([class*=size-])]:size-4">
            <XIcon />
            <span className="gs:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "gs:flex gs:flex-col gs:gap-2 gs:text-center gs:sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "gs:flex gs:flex-col-reverse gs:gap-2 gs:sm:flex-row gs:sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("gs:text-lg gs:leading-none gs:font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("gs:text-muted-foreground gs:text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
