"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {AnimatePresence, motion} from "framer-motion";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  layout: "horizontal" | "vertical";
}>({
  layout: "horizontal",
});

function Tabs({
  className,
  layout = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  layout?: "horizontal" | "vertical";
}) {
  return (
    <TabsContext.Provider value={{ layout }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={layout}
        className={cn(
          "flex w-full",
          layout === "horizontal"
            ? "flex-col gap-2 p-6"
            : "flex-row gap-0 border border-border rounded-xl",
          className,
        )}
        {...props}
      />
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const { layout } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-[3px]",
        layout === "horizontal"
          ? "bg-muted text-muted-foreground h-9 w-full min-w-fit"
          : "flex-col h-auto w-auto min-w-[200px] bg-muted justify-start space-y-1 p-6 rounded-tl-xl! rounded-bl-xl! rounded-none border-r border-border",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { layout } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        // Shared active state styles
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        layout === "horizontal" && "flex-1 h-[calc(100%-1px)]",
        layout === "vertical" &&
          "w-full justify-start data-[state=active]:text-primary-foreground data-[state=active]:bg-primary hover:bg-primary/10 data-[state=active]:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  value,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { layout } = React.useContext(TabsContext);

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      value={value}
      className={cn(
        `flex-1 outline-none mt-0 ${layout === "horizontal" ? "" : "p-6"}`,
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
        >
          {props.children}
        </motion.div>
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
