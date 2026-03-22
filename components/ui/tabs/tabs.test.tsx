import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from ".";

describe("Tabs", () => {
  it("renders tablist and triggers", () => {
    render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tab A/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Tab B/i })).toBeInTheDocument();
  });

  it("shows content for selected value only", () => {
    render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    const tabA = screen.getByRole("tab", { name: /Tab A/i });
    const tabB = screen.getByRole("tab", { name: /Tab B/i });
    expect(tabA).toHaveAttribute("aria-selected", "true");
    expect(tabB).toHaveAttribute("aria-selected", "false");
    expect(tabA).toHaveAttribute("tabIndex", "0");
    expect(tabB).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByText("Content A")).toBeVisible();
    expect(screen.getByText("Content B")).not.toBeVisible();
  });

  it("marks selected trigger with aria-selected and data-state", () => {
    render(
      <Tabs value="b" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    const tabA = screen.getByRole("tab", { name: /Tab A/i });
    const tabB = screen.getByRole("tab", { name: /Tab B/i });
    expect(tabA).toHaveAttribute("aria-selected", "false");
    expect(tabA).toHaveAttribute("data-state", "inactive");
    expect(tabB).toHaveAttribute("aria-selected", "true");
    expect(tabB).toHaveAttribute("data-state", "active");
  });

  it("calls onValueChange when a trigger is clicked", async () => {
    const onValueChange = jest.fn();
    const user = userEvent.setup();
    render(
      <Tabs value="a" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    await user.click(screen.getByRole("tab", { name: /Tab B/i }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("switches visible content when value changes", () => {
    const { rerender } = render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content A");

    rerender(
      <Tabs value="b" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    expect(screen.getByText("Content B")).toBeVisible();
    expect(screen.getByText("Content A")).not.toBeVisible();
  });

  it("TabsList has role tablist and data-slot", () => {
    render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList data-testid="list">
          <TabsTrigger value="a">Tab A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
      </Tabs>
    );
    const list = screen.getByTestId("list");
    expect(list).toHaveAttribute("role", "tablist");
    expect(list).toHaveAttribute("data-slot", "tabs-list");
  });

  it("TabsContent has role tabpanel and data-slot when visible", () => {
    render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
        </TabsList>
        <TabsContent value="a" data-testid="content">
          Content A
        </TabsContent>
      </Tabs>
    );
    const panel = screen.getByTestId("content");
    expect(panel).toHaveAttribute("role", "tabpanel");
    expect(panel).toHaveAttribute("data-slot", "tabs-content");
  });

  it("links tab triggers to tab panels with aria-controls and aria-labelledby", () => {
    render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    );
    const tabA = screen.getByRole("tab", { name: /Tab A/i });
    const panelA = screen.getByText("Content A").closest('[role="tabpanel"]');
    expect(panelA).not.toBeNull();
    expect(tabA).toHaveAttribute("aria-controls", panelA!.id);
    expect(panelA).toHaveAttribute("aria-labelledby", tabA.id);
  });

  it("moves selection with ArrowRight when controlled", async () => {
    function Controlled() {
      const [value, setValue] = useState("a");
      return (
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
        </Tabs>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    screen.getByRole("tab", { name: /Tab A/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Tab B/i })).toHaveAttribute(
      "data-state",
      "active"
    );
    expect(screen.getByText("Content B")).toBeVisible();
  });
});
