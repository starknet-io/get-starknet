import type * as React from "react";
import { cn } from "src/lib/utils";
import { Drawer as DrawerPrimitive } from "vaul";

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "gs:data-[state=open]:animate-in gs:data-[state=closed]:animate-out gs:data-[state=closed]:fade-out-0 gs:data-[state=open]:fade-in-0 gs:fixed gs:inset-0 gs:z-50 gs:bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "gs:group/drawer-content gs:bg-background gs:fixed gs:z-50 gs:flex gs:h-auto gs:flex-col",
          "gs:data-[vaul-drawer-direction=top]:inset-x-0 gs:data-[vaul-drawer-direction=top]:top-0 gs:data-[vaul-drawer-direction=top]:mb-24 gs:data-[vaul-drawer-direction=top]:max-h-[80vh] gs:data-[vaul-drawer-direction=top]:rounded-b-lg gs:data-[vaul-drawer-direction=top]:border-b",
          "gs:data-[vaul-drawer-direction=bottom]:inset-x-0 gs:data-[vaul-drawer-direction=bottom]:bottom-0 gs:data-[vaul-drawer-direction=bottom]:mt-24 gs:data-[vaul-drawer-direction=bottom]:max-h-[80vh] gs:data-[vaul-drawer-direction=bottom]:rounded-t-lg gs:data-[vaul-drawer-direction=bottom]:border-t",
          "gs:data-[vaul-drawer-direction=right]:inset-y-0 gs:data-[vaul-drawer-direction=right]:right-0 gs:data-[vaul-drawer-direction=right]:w-3/4 gs:data-[vaul-drawer-direction=right]:border-l gs:data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "gs:data-[vaul-drawer-direction=left]:inset-y-0 gs:data-[vaul-drawer-direction=left]:left-0 gs:data-[vaul-drawer-direction=left]:w-3/4 gs:data-[vaul-drawer-direction=left]:border-r gs:data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className,
        )}
        {...props}>
        <div className="gs:bg-muted gs:mx-auto gs:mt-4 gs:hidden gs:h-2 gs:w-[100px] gs:shrink-0 gs:rounded-full gs:group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "gs:flex gs:flex-col gs:gap-0.5 gs:p-4 gs:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center gs:group-data-[vaul-drawer-direction=top]/drawer-content:text-center gs:md:gap-1.5 gs:md:text-left",
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "gs:mt-auto gs:flex gs:flex-col gs:gap-2 gs:p-4",
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("gs:text-foreground gs:font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("gs:text-muted-foreground gs:text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
