import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutHistory } from "@/components/sections/AboutHistory";

describe("AboutHistory", () => {
  it("renders the page's single h1", () => {
    render(<AboutHistory />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Un taller que creció con el corredor automotriz de Saltillo",
      }),
    ).toBeInTheDocument();
  });
});
