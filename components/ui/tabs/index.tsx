"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within Tabs.");
  return ctx;
}

function slugForTabId(value: string) {
  return value.replace(/\s+/g, "-");
}

type TabsProps = React.ComponentProps<"div"> & {
  value: string;
  onValueChange: (value: string) => void;
};

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, className, children, ...props }, ref) => {
    const baseId = React.useId();
    return (
      <TabsContext.Provider value={{ value, onValueChange, baseId }}>
        <div ref={ref} className={cn(className)} data-slot="tabs" {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

function focusTabByIndex(
  tabs: HTMLButtonElement[],
  index: number,
  onValueChange: (value: string) => void
) {
  const tab = tabs[index];
  if (!tab) return;
  const nextValue = tab.dataset.value;
  if (nextValue) onValueChange(nextValue);
  tab.focus();
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, onKeyDown, ...props }, ref) => {
  const { value, onValueChange } = useTabs();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"] as const;
    if (!keys.includes(e.key as (typeof keys)[number])) return;

    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("button[role='tab']")
    );
    if (tabs.length === 0) return;

    const currentIdx = tabs.findIndex((t) => t.dataset.state === "active");
    if (currentIdx === -1) return;

    e.preventDefault();

    if (e.key === "Home") {
      focusTabByIndex(tabs, 0, onValueChange);
      return;
    }
    if (e.key === "End") {
      focusTabByIndex(tabs, tabs.length - 1, onValueChange);
      return;
    }

    const delta = e.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (currentIdx + delta + tabs.length) % tabs.length;
    focusTabByIndex(tabs, nextIdx, onValueChange);
  };

  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ComponentProps<"button"> & {
  value: string;
};

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selected, onValueChange, baseId } = useTabs();
    const isSelected = selected === value;
    const slug = slugForTabId(value);
    const tabId = `${baseId}-tab-${slug}`;
    const panelId = `${baseId}-panel-${slug}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        data-state={isSelected ? "active" : "inactive"}
        data-value={value}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
          className
        )}
        data-slot="tabs-trigger"
        onClick={() => onValueChange(value)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

type TabsContentProps = React.ComponentProps<"div"> & {
  value: string;
};

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, hidden: hiddenProp, ...props }, ref) => {
    const { value: selected, baseId } = useTabs();
    const isSelected = selected === value;
    const slug = slugForTabId(value);
    const tabId = `${baseId}-tab-${slug}`;
    const panelId = `${baseId}-panel-${slug}`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={hiddenProp ?? !isSelected}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        data-slot="tabs-content"
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
