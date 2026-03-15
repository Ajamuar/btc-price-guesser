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
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content A");
    expect(screen.queryByText("Content B")).not.toBeInTheDocument();
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
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content B");
    expect(screen.queryByText("Content A")).not.toBeInTheDocument();
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
});
