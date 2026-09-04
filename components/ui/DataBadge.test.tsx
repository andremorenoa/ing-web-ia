import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataBadge } from "@/components/ui/DataBadge";

describe("DataBadge", () => {
  it("renders the label and the mono-styled value", () => {
    render(<DataBadge label="Tolerancia" value="±0.001″" />);
    expect(screen.getByText("Tolerancia")).toBeInTheDocument();
    expect(screen.getByText("±0.001″")).toBeInTheDocument();
  });
});
