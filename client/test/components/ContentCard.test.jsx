import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ContentCard from "../../src/components/ContentCard";

const mockContent = {
  _id: "1",
  title: "Test Prompt",
  slug: "test-prompt",
  description: "A great test prompt for testing",
  type: "prompt",
  category: "coding",
  tags: ["beginner", "automation"],
  upvoteCount: 5,
  downvoteCount: 1,
  copyCount: 10,
  saveCount: 3,
  rating: 4.2,
  createdBy: { username: "testuser", name: "Test User" },
};

function renderCard(content = mockContent) {
  return render(
    <BrowserRouter>
      <ContentCard content={content} />
    </BrowserRouter>
  );
}

describe("ContentCard", () => {
  it("renders title and description", () => {
    renderCard();
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByText("A great test prompt for testing")).toBeInTheDocument();
  });

  it("renders type badge", () => {
    renderCard();
    expect(screen.getByText("prompt")).toBeInTheDocument();
  });

  it("renders tags", () => {
    renderCard();
    expect(screen.getByText("beginner")).toBeInTheDocument();
    expect(screen.getByText("automation")).toBeInTheDocument();
  });

  it("renders rating when > 0", () => {
    renderCard();
    expect(screen.getByText("4.2")).toBeInTheDocument();
  });

  it("hides rating when 0", () => {
    renderCard({ ...mockContent, rating: 0 });
    expect(screen.queryByText("0.0")).not.toBeInTheDocument();
  });

  it("renders stats", () => {
    renderCard();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders author", () => {
    renderCard();
    expect(screen.getByText("by testuser")).toBeInTheDocument();
  });

  it("links to detail page", () => {
    renderCard();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/content/test-prompt");
  });

  it("renders skill type correctly", () => {
    renderCard({ ...mockContent, type: "skill", skillProvider: "claude" });
    expect(screen.getByText("skill")).toBeInTheDocument();
    expect(screen.getByText("claude")).toBeInTheDocument();
  });
});
