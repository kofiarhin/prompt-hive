import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "../../src/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders default message", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<EmptyState message="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });
});
